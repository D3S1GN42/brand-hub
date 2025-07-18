import JSZip from 'jszip';
import { convertToFormat, extractInnerSvg } from '../utils/assetProcessor';
import convert from 'color-convert';
import { encode } from 'ase-utils';

function determineAssetsToDownload({
  selectedAssets,
  allAssets,
  customAssets,
  customPatterns,
}) {
  if (selectedAssets.length > 0) {
    return selectedAssets;
  }

  const defaultList = [];
  allAssets.logos.forEach((logo) => {
    defaultList.push({
      id: logo.id,
      formats: [logo.extension, 'png'],
      assetType: 'logo',
    });
  });
  customAssets.forEach((logo) => {
    defaultList.push({
      id: logo.id,
      formats: [logo.extension],
      assetType: 'logo',
    });
  });
  customPatterns.forEach((pattern) => {
    defaultList.push({
      id: pattern.id,
      formats: ['svg', 'png'],
      assetType: 'pattern',
    });
  });
  allAssets.videos.forEach((video) => {
    defaultList.push({
      id: video.id,
      formats: video.formats.map((f) => f.ratio),
      assetType: 'video',
    });
  });
  return defaultList;
}

async function processLogo(assetItem, { allAssets, customAssets, zipFolders }) {
  const { id, formats } = assetItem;
  const asset =
    allAssets.logos.find((a) => a.id === id) ||
    customAssets.find((a) => a.id === id);
  if (!asset) return;

  let sourceImage = null;
  let sourceSvgString = null;

  if (asset.extension === 'svg') {
    if (asset.type === 'custom') {
      const baseLogo = allAssets.logos.find((l) => l.id === asset.originalId);
      const response = await fetch(baseLogo.url);
      const originalInnerSvgText = extractInnerSvg(await response.text());
      const transform = `translate(${asset.logoX}, ${asset.logoY}) rotate(${asset.logoRotate || 0}) scale(${asset.logoScale}) translate(-${asset.originalSvgDimensions.width / 2}, -${asset.originalSvgDimensions.height / 2})`;
      sourceSvgString = `<svg width="${asset.canvasWidth}" height="${asset.canvasHeight}" viewBox="0 0 ${asset.canvasWidth} ${asset.canvasHeight}" xmlns="http://www.w3.org/2000/svg"><g transform="${transform}">${originalInnerSvgText}</g></svg>`;
    } else {
      const response = await fetch(asset.url);
      sourceSvgString = await response.text();
    }
  } else if (['png', 'jpg'].includes(asset.extension)) {
    sourceImage = new Image();
    sourceImage.src = asset.type === 'custom' ? asset.dataUrl : asset.url;
  }

  for (const format of formats) {
    try {
      let fileBlob = null;
      let filename = `${asset.id}.${format}`;
      const width = asset.canvasWidth || asset.width;
      const height = asset.canvasHeight || asset.height;

      switch (format) {
        case 'svg':
          if (sourceSvgString) {
            fileBlob = new Blob([sourceSvgString], { type: 'image/svg+xml' });
          }
          break;
        case 'png':
          if (sourceSvgString) {
            fileBlob = await convertToFormat(
              sourceSvgString,
              'png',
              width,
              height,
            );
          } else if (sourceImage) {
            fileBlob = await convertToFormat(sourceImage, 'png', width, height);
          }
          break;
        case 'jpg':
          if (sourceSvgString) {
            fileBlob = await convertToFormat(
              sourceSvgString,
              'jpeg',
              width,
              height,
            );
          } else if (sourceImage) {
            fileBlob = await convertToFormat(
              sourceImage,
              'jpeg',
              width,
              height,
            );
          }
          break;
        case 'webp':
          if (sourceSvgString) {
            fileBlob = await convertToFormat(
              sourceSvgString,
              'webp',
              width,
              height,
            );
          } else if (sourceImage) {
            fileBlob = await convertToFormat(
              sourceImage,
              'webp',
              width,
              height,
            );
          }
          break;
      }

      if (fileBlob) {
        zipFolders.logos.file(filename, fileBlob);
      } else {
        if (sourceImage && format === asset.extension) {
          const response = await fetch(sourceImage.src);
          fileBlob = await response.blob();
          zipFolders.logos.file(filename, fileBlob);
        }
      }
    } catch (error) {
      console.error(
        `Ошибка при обработке логотипа ${id} в формате ${format}:`,
        error,
      );
    }
  }
}

async function processPattern(assetItem, { customPatterns, zipFolders }) {
  const { id, formats } = assetItem;
  const pattern = customPatterns.find((p) => p.id === id);
  if (!pattern) return;

  try {
    const response = await fetch(pattern.basePatternUrl);
    const svgTemplateText = await response.text();

    const innerSvgContent = extractInnerSvg(svgTemplateText);
    const coloredInnerSvg = innerSvgContent.replace(
      /currentColor/g,
      pattern.patternColor,
    );

    const viewBoxMatch = svgTemplateText.match(
      /viewBox="0 0 ([\d.]+) ([\d.]+)"/,
    );
    const baseWidth = viewBoxMatch ? parseFloat(viewBoxMatch[1]) : 50;
    const baseHeight = viewBoxMatch ? parseFloat(viewBoxMatch[2]) : 50;

    const backgroundRect =
      pattern.backgroundColor !== 'transparent'
        ? `<rect width="100%" height="100%" fill="${pattern.backgroundColor}" />`
        : '';

    const tileSvg = `
      <svg 
          width="${baseWidth}" 
          height="${baseHeight}" 
          viewBox="0 0 ${baseWidth} ${baseHeight}" 
          xmlns="http://www.w3.org/2000/svg"
      >
          ${backgroundRect}
          ${coloredInnerSvg}
      </svg>`;

    for (const format of formats) {
      let fileBlob = null;
      let filename = `${pattern.id}.${format}`;

      switch (format) {
        case 'svg':
          fileBlob = new Blob([tileSvg.trim()], { type: 'image/svg+xml' });
          break;
        case 'png':
          fileBlob = await convertToFormat(tileSvg, 'png', 1024, 1024);
          break;
        case 'jpg':
          fileBlob = await convertToFormat(tileSvg, 'jpeg', 1024, 1024);
          break;
        case 'webp':
          fileBlob = await convertToFormat(tileSvg, 'webp', 1024, 1024);
          break;
      }

      if (fileBlob && filename) {
        zipFolders.patterns.file(filename, fileBlob);
      }
    }
  } catch (error) {
    console.error(`Ошибка при обработке паттерна ${pattern.id}:`, error);
  }
}

async function processVideo(assetItem, { allAssets, zipFolders }) {
  const { id, formats } = assetItem;

  const videoAsset = allAssets.videos.find((v) => v.id === id);
  if (!videoAsset) {
    console.warn(`Видео с ID ${id} не найдено.`);
    return;
  }

  for (const formatToDownload of formats) {
    const { ratio, type } = formatToDownload;

    const formatInfo = videoAsset.formats.find((f) => f.ratio === ratio);
    if (!formatInfo) {
      console.warn(
        `Информация о формате с ratio ${ratio} для видео ${id} не найдена.`,
      );
      continue;
    }

    const url = formatInfo.urls[type];
    if (!url) {
      console.warn(
        `URL для видео ${id} с форматом ${type} и ratio ${ratio} не найден.`,
      );
      continue;
    }

    try {
      const response = await fetch(url);
      if (!response.ok)
        throw new Error(`Ошибка сети при скачивании видео: ${url}`);
      const blob = await response.blob();
      const filename = `${videoAsset.id}-${ratio}.${type}`;
      zipFolders.videos.file(filename, blob);
    } catch (error) {
      console.error(`Ошибка при обработке видео ${id} с URL ${url}:`, error);
    }
  }
}

async function addPaletteFiles({ allAssets, zipFolders }) {
  try {
    const allColors = allAssets.colors.flatMap((group) => group.items);
    if (allColors.length === 0) return;

    const colorsArray = allColors.map((color) => ({
      name: color.name || color.hex,
      model: 'RGB',
      color: convert.hex.rgb(color.hex.replace('#', '')).map((c) => c / 255),
      type: 'global',
    }));

    const aseDataObject = {
      version: '1.0',
      groups: [],
      colors: colorsArray,
    };

    const aseBuffer = encode(aseDataObject);
    zipFolders.palettes.file('palette.ase', aseBuffer);

    let cssContent = ':root {\n';
    allColors.forEach((color) => {
      const varName = `--color${color.hex
        .toLowerCase()
        .replace(/[^a-z0-9]/g, '-')
        .replace(/-+/g, '-')}`;
      cssContent += `  ${varName}: ${color.hex};\n`;
    });
    cssContent += '}';
    zipFolders.palettes.file('palette.css', cssContent);

    const jsonContent = JSON.stringify(allAssets.colors, null, 2);
    zipFolders.palettes.file('palette.json', jsonContent);

    let txtContent = 'Фирменные цвета AdsCompass\n\n';
    allAssets.colors.forEach((group) => {
      txtContent += `--- ${group.groupName} ---\n`;
      group.items.forEach((color) => {
        const hex = color.hex.toUpperCase();
        const rgb = convert.hex.rgb(hex.replace('#', '')).join(', ');
        const cmyk = convert.hex.cmyk(hex.replace('#', '')).join('%, ') + '%';
        const hsl = convert.hex.hsl(hex.replace('#', ''));
        txtContent += `${color.name || hex}:\n`;
        txtContent += `  HEX:  ${hex}\n`;
        txtContent += `  RGB:  rgb(${rgb})\n`;
        txtContent += `  CMYK: cmyk(${cmyk})\n`;
        txtContent += `  HSL:  hsl(${hsl[0]}, ${hsl[1]}%, ${hsl[2]}%)\n\n`;
      });
    });
    zipFolders.palettes.file('palette.txt', txtContent);
  } catch (error) {
    console.error('Ошибка при генерации файлов палитры:', error);
  }
}

export async function createAndDownloadZip({
  selectedAssets,
  allAssets,
  customAssets,
  customPatterns,
}) {
  const zip = new JSZip();
  const zipFolders = {
    logos: zip.folder('logos'),
    patterns: zip.folder('patterns'),
    videos: zip.folder('videos'),
    palettes: zip.folder('palettes'),
  };

  const assetsToDownload = determineAssetsToDownload({
    selectedAssets,
    allAssets,
    customAssets,
    customPatterns,
  });

  if (assetsToDownload.length === 0) return;

  const processingPromises = [];

  processingPromises.push(addPaletteFiles({ allAssets, zipFolders }));

  assetsToDownload.forEach((assetItem) => {
    if (assetItem.assetType === 'logo') {
      processingPromises.push(
        processLogo(assetItem, { allAssets, customAssets, zipFolders }),
      );
    } else if (assetItem.assetType === 'pattern') {
      processingPromises.push(
        processPattern(assetItem, { customPatterns, zipFolders }),
      );
    } else if (assetItem.assetType === 'video') {
      processingPromises.push(
        processVideo(assetItem, { allAssets, zipFolders }),
      );
    }
  });

  await Promise.all(processingPromises);

  const archive = await zip.generateAsync({ type: 'blob' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(archive);
  link.download = `AdsCompass_Brand_Assets.zip`;
  document.body.append(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(link.href);
}

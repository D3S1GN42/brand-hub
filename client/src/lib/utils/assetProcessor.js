export async function getDimensions(logo) {
  const extension = logo.extension || logo.url.split('.').pop() || 'svg';

  if (extension === 'svg') {
    try {
      let response = await fetch(logo.url);
      if (!response.ok)
        throw new Error(`HTTP error! status: ${response.status}`);
      const svgText = await response.text();
      const viewBoxMatch = svgText.match(/viewBox="0 0 ([\d.]+) ([\d.]+)"/);
      if (viewBoxMatch) {
        const width = parseFloat(viewBoxMatch[1]);
        const height = parseFloat(viewBoxMatch[2]);
        return { width, height };
      } else {
        console.warn(
          `SVG ${logo.url} не имеет viewBox. Возвращаются стандартные размеры.`,
        );
        return { width: 400, height: 300 };
      }
    } catch (error) {
      console.error('Ошибка загрузки размеров SVG или viewBox:', error);
      return { width: 400, height: 300 };
    }
  } else if (['png', 'jpg'].includes(extension)) {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        resolve({ width: img.width, height: img.height });
      };
      img.onerror = (e) => {
        console.error(`Ошибка загрузки растрового изображения: ${logo.url}`, e);
        resolve({ width: 400, height: 300 });
      };
      img.src = logo.url;
    });
  } else {
    console.warn(
      `Неподдерживаемое расширение логотипа: ${extension}. Возвращаем размеры по умолчанию.`,
    );
    return { width: 400, height: 300 };
  }
}

export function extractInnerSvg(svgText) {
  const svgTagRegex = /<svg[^>]*>([\s\S]*)<\/svg>/;
  const match = svgText.match(svgTagRegex);
  return match ? match[1].trim() : '';
}

function convertToFormat(source, format, width, height) {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;

    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.scale(dpr, dpr);

    const image = new Image();
    image.onload = () => {
      ctx.clearRect(0, 0, width, height);

      if (format === 'jpeg') {
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, width, height);
      }

      ctx.drawImage(image, 0, 0, width, height);
      canvas.toBlob(
        (blob) => {
          resolve(blob);
        },
        `image/${format}`,
        format === 'jpeg' ? 0.9 : 1.0,
      );
    };
    image.onerror = (e) => {
      console.error('Не удалось загрузить изображение в конвертер:', e);
      reject(new Error('Image conversion failed'));
    };

    if (typeof source === 'string') {
      image.src =
        'data:image/svg+xml;base64,' +
        btoa(unescape(encodeURIComponent(source)));
    } else if (source instanceof HTMLImageElement) {
      image.crossOrigin = 'anonymous';
      image.src = source.src;
    }
  });
}

export function svgToPng(svgString, width, height) {
  return convertToFormat(svgString, 'png', width, height);
}

export function svgToJpg(svgString, width, height) {
  return convertToFormat(svgString, 'jpeg', width, height);
}

export function svgToWebp(svgString, width, height) {
  return convertToFormat(svgString, 'webp', width, height);
}

export { convertToFormat };

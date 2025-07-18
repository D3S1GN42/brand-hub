<script>
  let { asset, type = 'original', baseLogo = null } = $props();

  const customPreviewStyle = $derived(
    type === 'custom'
      ? `aspect-ratio: ${asset.canvasWidth} / ${asset.canvasHeight};`
      : '',
  );
</script>

<figure
  class="object-contain"
  class:w-full={type === 'original'}
  class:h-full={type === 'original'}
  class:grid={type === 'original' && asset.extension === 'svg'}
  class:place-items-center={type === 'original'}
  class:max-w-full={type === 'custom'}
  class:max-h-full={type === 'custom'}
  class:border={type === 'custom'}
  class:border-dashed={type === 'custom'}
  class:border-white={type === 'custom'}
  class:ring-1={type === 'custom'}
  class:ring-black={type === 'custom'}
  style={customPreviewStyle}
>
  {#if type === 'original'}
    <img
      src={asset.url}
      alt={asset.name}
      class="pointer-events-none h-full w-full select-none object-contain"
    />
  {:else if asset.extension === 'svg'}
    <svg
      class="h-full w-full"
      viewBox="0 0 {asset.canvasWidth} {asset.canvasHeight}"
    >
      <g
        transform="translate({asset.logoX}, {asset.logoY}) rotate({asset.logoRotate ||
          0}) scale({asset.logoScale}) translate(-{asset.originalSvgDimensions
          .width / 2}, -{asset.originalSvgDimensions.height / 2})"
      >
        <image
          href={baseLogo?.url}
          x="0"
          y="0"
          width={asset.originalSvgDimensions.width}
          height={asset.originalSvgDimensions.height}
        />
      </g>
    </svg>
  {:else if ['png', 'jpg'].includes(asset.extension)}
    <img
      src={asset.dataUrl}
      alt={asset.name || 'Кастомный логотип'}
      class="pointer-events-none h-full w-full select-none object-contain"
    />
  {:else}
    <div class="text-white/60">
      Неподдерживаемый формат логотипа: {asset.extension}
    </div>
  {/if}
</figure>

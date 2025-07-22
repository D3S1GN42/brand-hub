<script>
  let { patterns, brandColors, onSave } = $props();
  let selectedPattern = $state(patterns[0]);
  let patternColor = $state(brandColors[0].items[0].hex);
  let backgroundColor = $state(brandColors[0].items[1].hex);

  const previewSrc = $derived.by(() => {
    if (!selectedPattern.svgContent) return '';

    const innerSvgContent =
      selectedPattern.svgContent.match(/<svg[^>]*>([\s\S]*)<\/svg>/)?.[1] || '';
    const coloredInnerSvg = innerSvgContent.replace(
      /currentColor/g,
      patternColor,
    );
    const viewBoxMatch = selectedPattern.svgContent.match(
      /viewBox="0 0 ([\d.]+) ([\d.]+)"/,
    );
    const baseWidth = viewBoxMatch ? parseFloat(viewBoxMatch[1]) : 50;
    const baseHeight = viewBoxMatch ? parseFloat(viewBoxMatch[2]) : 50;

    const tileSvg = `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${baseWidth} ${baseHeight}">
        <rect width="100%" height="100%" fill="${backgroundColor}" />
        ${coloredInnerSvg}
      </svg>`;

    return (
      'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(tileSvg)))
    );
  });

  $effect(() => {
    const currentPattern = selectedPattern;

    fetch(currentPattern.url)
      .then((res) => res.text())
      .then((svgText) => {
        if (currentPattern.id === selectedPattern.id) {
          currentPattern.svgContent = svgText;
        }
      });
  });

  function handleSave() {
    onSave({
      baseId: selectedPattern.id,
      basePatternUrl: selectedPattern.url,
      patternColor: patternColor,
      backgroundColor: backgroundColor,
    });
  }
</script>

<div class="flex flex-col items-start gap-8 md:flex-row">
  <div class="flex w-full shrink-0 flex-col gap-6 md:w-72">
    <div>
      <h4 class="mb-2 font-semibold">Шаблон</h4>
      <div class="flex flex-wrap gap-2">
        {#each patterns as p (p.id)}
          <button
            onclick={() => (selectedPattern = p)}
            class="outline-accent text-font-dark/80 h-10 max-w-sm grow rounded-md border-2 bg-white/10 px-3 outline-offset-2 transition-all hover:bg-white/20 focus-visible:outline-2 active:scale-95 {selectedPattern ===
            p
              ? 'border-accent'
              : ''}"
          >
            {p.name}
          </button>
        {/each}
      </div>
    </div>

    <div>
      <h4 class="mb-2 font-semibold">Цвет элементов</h4>
      <div class="flex flex-wrap items-center gap-2">
        {#each brandColors.flatMap((g) => g.items) as color (color.hex)}
          <button
            onclick={() => (patternColor = color.hex)}
            class="outline-accent h-8 w-8 rounded-full border-2 outline-offset-2 transition-all duration-300 hover:scale-110 focus-visible:outline-2 active:scale-95 {patternColor ===
            color.hex
              ? 'border-accent'
              : ''}"
            style="background-color: {color.hex};"
            aria-label="Выбрать цвет {color.name || color.hex}"
          ></button>
        {/each}
        <input
          type="color"
          bind:value={patternColor}
          class="outline-accent h-9 w-10 cursor-pointer appearance-none rounded-md border-none bg-transparent p-0 outline-offset-2 transition-all duration-300 focus-visible:outline-2"
          aria-label="Выбрать свой цвет для элементов"
        />
      </div>
    </div>

    <div>
      <h4 class="mb-2 font-semibold">Цвет фона</h4>
      <div class="flex flex-wrap items-center gap-2">
        <button
          onclick={() => (backgroundColor = 'transparent')}
          class="outline-accent relative h-8 w-8 overflow-hidden rounded-full border-2 outline-offset-2 transition-all duration-300 hover:scale-110 focus-visible:outline-2 active:scale-95 {backgroundColor ===
          'transparent'
            ? 'border-accent'
            : ''}"
          style="background: repeating-conic-gradient(#808080 0% 25%, transparent 0% 50%) 50% / 10px 10px;"
          aria-label="Выбрать прозрачный фон"
          title="Прозрачный фон"
        >
          <div class="absolute -inset-px bg-white/20"></div>
        </button>
        {#each brandColors.flatMap((g) => g.items) as color (color.hex)}
          <button
            onclick={() => (backgroundColor = color.hex)}
            class="outline-accent h-8 w-8 rounded-full border-2 outline-offset-2 transition-all duration-300 hover:scale-110 focus-visible:outline-2 active:scale-95 {backgroundColor ===
            color.hex
              ? 'border-accent'
              : ''}"
            style="background-color: {color.hex};"
            aria-label="Выбрать цвет фона {color.name || color.hex}"
          ></button>
        {/each}
        <input
          type="color"
          bind:value={backgroundColor}
          class="outline-accent h-9 w-10 cursor-pointer appearance-none rounded-md border-none bg-transparent p-0 outline-offset-2 transition-all duration-300 focus-visible:outline-2"
          aria-label="Выбрать свой цвет для фона"
        />
      </div>
    </div>

    <button
      onclick={handleSave}
      class="outline-accent mt-2 w-full rounded-md bg-white/10 py-2 text-center font-semibold outline-offset-2 ring-1 ring-black/50 transition-all duration-300 hover:bg-white/20 focus-visible:outline-2 active:scale-95 active:duration-75"
    >
      Добавить в загрузку
    </button>
  </div>

  <div
    class="flex aspect-video w-full justify-center rounded-lg bg-black/15 p-4 shadow-inner"
    aria-label="Превью сгенерированного паттерна"
  >
    <img
      src={previewSrc}
      alt="Превью одиночного тайла"
      class="max-h-full max-w-full object-contain"
    />
  </div>
</div>

<script>
  import { gestures } from '../lib/actions/gestures.js';
  import convert from 'color-convert';
  import Icon from './shared/ui/Icon.svelte';
  import { copyToClipboard } from '../lib/utils/copy.js';
  import { getLumaClass } from '../lib/utils/color.js';

  let { color } = $props();
  let copied = $state(false);
  let currentFormatIndex = $state(0);
  let copyTimeout = null;

  let clickCount = $state(0);
  let lastClickTime = 0;
  const CLICK_THRESHOLD = 10;
  const TIME_THRESHOLD = 1000;
  let exploded = $state(false);
  let explodeTimeout = null;

  const FORMATS = [
    { key: 'hex', label: 'HEX' },
    { key: 'rgb', label: 'RGB' },
    { key: 'hsl', label: 'HSL' },
    { key: 'cmyk', label: 'CMYK' },
  ];

  const allColorFormats = $derived.by(() => {
    const hexValue = color.hex.replace('#', '');
    const rgbValue = convert.hex.rgb(hexValue);
    const hslValue = convert.hex.hsl(hexValue);
    const cmykValue = convert.hex.cmyk(hexValue);
    return {
      hex: `#${hexValue.toUpperCase()}`,
      rgb: `rgb(${rgbValue.join(', ')})`,
      hsl: `hsl(${hslValue[0]}, ${hslValue[1]}%, ${hslValue[2]}%)`,
      cmyk: `cmyk(${cmykValue[0]}%, ${cmykValue[1]}%, ${cmykValue[2]}%, ${cmykValue[3]}%)`,
    };
  });

  const currentValue = $derived(
    allColorFormats[FORMATS[currentFormatIndex].key],
  );

  async function handleCopy() {
    if (exploded || copied) return;
    try {
      await copyToClipboard(currentValue);
      showCopiedMessage();
    } catch (err) {
      console.error('Не удалось скопировать текст цвета:', err);
      alert('Не удалось скопировать. Пожалуйста, попробуйте вручную.');
    }
  }

  function showCopiedMessage() {
    if (copied) return;
    copied = true;
    clearTimeout(copyTimeout);
    copyTimeout = setTimeout(() => {
      copied = false;
    }, 2000);
  }

  function cycleFormat(direction) {
    if (exploded || copied) return;
    const step = direction === 'next' ? 1 : -1;
    const newIndex =
      (currentFormatIndex + step + FORMATS.length) % FORMATS.length;
    currentFormatIndex = newIndex;
  }

  function handleTap(event) {
    if (exploded) return;
    const currentTime = Date.now();
    if (currentTime - lastClickTime < TIME_THRESHOLD) {
      clickCount++;
    } else {
      clickCount = 1;
    }
    lastClickTime = currentTime;

    if (clickCount >= CLICK_THRESHOLD) {
      exploded = true;
      clearTimeout(explodeTimeout);
      explodeTimeout = setTimeout(() => {
        exploded = false;
        clickCount = 0;
      }, 500);
      return;
    }

    if (copied) return;

    const trueTarget = event.detail.trueTarget;
    const arrowButton = trueTarget?.closest('[data-arrow]');

    if (arrowButton) {
      cycleFormat(arrowButton.dataset.arrow);
    } else {
      handleCopy();
    }
  }

  function handleKeyDown(event) {
    if (exploded || copied) return;
    if (['Enter', ' '].includes(event.key)) {
      event.preventDefault();
      handleCopy();
    } else if (event.key === 'ArrowLeft') {
      event.preventDefault();
      cycleFormat('prev');
    } else if (event.key === 'ArrowRight') {
      event.preventDefault();
      cycleFormat('next');
    }
  }
</script>

<div
  use:gestures={{ preventWheel: false, recognizeDoubleTap: false }}
  ontap={handleTap}
  onswipeleft={() => cycleFormat('next')}
  onswiperight={() => cycleFormat('prev')}
  onkeydown={handleKeyDown}
  class="{getLumaClass(
    color.hex,
    'text-black',
    'text-white',
  )} group relative flex aspect-square w-full cursor-pointer touch-pan-y select-none flex-col justify-between rounded-lg border border-white/10 p-4 text-left outline-offset-2 transition-all
  duration-300 hover:-translate-y-1 focus-visible:outline-2 focus-visible:outline-[#FFA676] active:scale-95 active:duration-75"
  class:exploded
  style:background-color={color.hex}
  title="Нажмите, чтобы скопировать. Свайпните, чтобы изменить формат."
  role="button"
  tabindex="0"
>
  <div class="pointer-events-none">
    <header class="text-lg font-semibold">{color.name}</header>
    <footer class="absolute bottom-4 left-4 max-w-[calc(100%-4rem)]">
      <div class="text-xs opacity-70">{FORMATS[currentFormatIndex].label}</div>
      <div class="truncate font-mono font-semibold">{currentValue}</div>
    </footer>
  </div>

  <div
    class="pointer-fine:group-hover:visible invisible absolute inset-0 flex items-center justify-between px-2 group-focus-within:visible group-focus:visible"
  >
    <button
      type="button"
      class="{getLumaClass(
        color.hex,
        'outline-black',
        'outline-white',
      )} cursor-pointer rounded-full bg-black/20 p-2 transition-colors hover:bg-black/40 focus-visible:outline-2"
      aria-label="Предыдущий формат"
      data-arrow="prev"
      onkeydown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          e.stopPropagation();
          cycleFormat('prev');
        }
      }}
      tabindex="-1"
    >
      <Icon name="arrow-left" />
    </button>
    <button
      type="button"
      class="{getLumaClass(
        color.hex,
        'outline-black',
        'outline-white',
      )} cursor-pointer rounded-full bg-black/20 p-2 transition-colors hover:bg-black/40 focus-visible:outline-2"
      aria-label="Следующий формат"
      data-arrow="next"
      onkeydown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          e.stopPropagation();
          cycleFormat('next');
        }
      }}
      tabindex="-1"
    >
      <Icon name="arrow-right" />
    </button>
  </div>

  <div class="pointer-events-none absolute bottom-4 right-4 flex gap-1.5">
    {#each FORMATS as _, index (index)}
      <div
        class="h-1.5 w-1.5 rounded-full transition-all {currentFormatIndex ===
        index
          ? 'bg-current'
          : 'bg-current/30'}"
      ></div>
    {/each}
  </div>

  {#if copied}
    <div
      class="absolute inset-0 z-10 grid place-items-center rounded-lg bg-black/70 backdrop-blur-sm"
      aria-live="polite"
    >
      <span class="font-bold text-white">Скопировано!</span>
    </div>
  {/if}

  {#if exploded}
    <div
      class="animation-explode absolute inset-0 z-30 grid place-items-center rounded-lg bg-red-800/70 backdrop-blur-sm"
    >
      <span class="animate-pulse text-2xl font-bold text-white">BOOM!</span>
    </div>
  {/if}
</div>

<style>
  @keyframes explode-fade-out {
    0% {
      transform: scale(1);
      opacity: 1;
    }
    50% {
      transform: scale(1.2) rotate(10deg);
      opacity: 0.8;
    }
    100% {
      transform: scale(0) rotate(30deg);
      opacity: 0;
    }
  }

  .exploded {
    animation: explode-fade-out 0.5s forwards;
    pointer-events: none;
  }
</style>

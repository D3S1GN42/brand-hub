<script>
  import { gestures } from '../../lib/actions/gestures';

  let { imageDo, imageDont, title, description } = $props();

  let sliderPosition = $state(50);
  let containerElement;

  function handlePan(event) {
    if (!containerElement) return;

    const rect = containerElement.getBoundingClientRect();
    const x = event.detail.x - rect.left;
    const newPosition = (x / rect.width) * 100;
    sliderPosition = Math.max(0, Math.min(100, newPosition));
  }

  function handleKeyDown(event) {
    let newPosition = sliderPosition;
    if (event.key === 'ArrowLeft') {
      event.preventDefault();
      newPosition -= 1;
    } else if (event.key === 'ArrowRight') {
      event.preventDefault();
      newPosition += 1;
    }
    sliderPosition = Math.max(0, Math.min(100, newPosition));
  }
</script>

<div class="flex flex-col gap-3">
  <div>
    <h3 class="text-xl font-semibold">{title}</h3>
    {#if description}
      <p class="mt-1 max-w-2xl text-sm text-white/60">{description}</p>
    {/if}
  </div>
  <div
    bind:this={containerElement}
    class="relative aspect-video w-full touch-pan-y select-none overflow-hidden rounded-lg"
    use:gestures={{
      preventWheel: false,
    }}
    onpan={handlePan}
  >
    <img
      src={imageDont}
      alt="Неправильное использование"
      class="pointer-events-none absolute inset-0 h-full w-full object-cover"
    />

    <div
      class="absolute inset-0 h-full w-full overflow-hidden"
      style="clip-path: inset(0 {100 - sliderPosition}% 0 0);"
    >
      <img
        src={imageDo}
        alt="Правильное использование"
        class="pointer-events-none absolute inset-0 h-full w-full object-cover"
      />
    </div>

    <div
      class="focus-visible:outline-offset-14 absolute bottom-0 top-0 flex w-1
           cursor-ew-resize items-center justify-center
           bg-white focus-visible:outline-2 focus-visible:outline-[#FFA676]"
      style="left: {sliderPosition}%;"
      role="slider"
      aria-valuemin="0"
      aria-valuemax="100"
      aria-valuenow={Math.round(sliderPosition)}
      aria-label="Сравнение до и после"
      tabindex="0"
      onkeydown={handleKeyDown}
    >
      <div
        class="flex min-h-8 min-w-8 items-center justify-center rounded-full border-2 border-black/50 bg-white"
      >
        <svg
          class="h-4 w-4 text-black"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M8 9l4-4 4 4m0 6l-4 4-4-4"
          />
        </svg>
      </div>
    </div>
  </div>
</div>

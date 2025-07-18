<script>
  import Icon from '../shared/ui/Icon.svelte';

  let { video, selectedFormats = [], onToggle } = $props();

  let isPlaying = $state(false);
  let videoElement = $state(null);

  function playVideo() {
    isPlaying = true;
  }

  $effect(() => {
    if (isPlaying && videoElement) {
      videoElement.play().catch((error) => {
        console.error('Ошибка автовоспроизведения видео:', error);
      });
    }
  });

  function handleFormatToggle(ratio, format, isChecked) {
    onToggle({
      id: video.id,
      format: { ratio: ratio, type: format },
      checked: isChecked,
      assetType: 'video',
    });
  }
</script>

<div class="flex flex-col gap-4 rounded-lg bg-white/5 p-4 shadow-inner">
  <h3 class="text-lg font-semibold text-white/80">{video.title}</h3>

  <div class="relative aspect-video w-full overflow-hidden rounded-md bg-black">
    {#if !isPlaying}
      <div class="h-full w-full">
        <img
          src={video.thumbnailUrl}
          alt="Превью для {video.title}"
          class="h-full w-full object-cover"
        />
        <button
          onclick={playVideo}
          class="absolute inset-0 flex items-center justify-center bg-black/70 transition-colors duration-300 hover:bg-black/50"
          aria-label="Воспроизвести видео"
        >
          <div
            class="flex h-16 w-16 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm transition-all duration-300 hover:scale-[1.02] hover:bg-white/30
            active:scale-[1.05]"
          >
            <Icon name="play" />
          </div>
        </button>
      </div>
    {:else}
      <video
        bind:this={videoElement}
        class="h-full w-full object-contain"
        controls
        autoplay
        muted
        loop
      >
        <source src={video.formats[0].urls.webp} type="video/webp" />
        <source src={video.formats[0].urls.mp4} type="video/mp4" />
        Ваш браузер не поддерживает это видео.
      </video>
    {/if}
  </div>

  <div class="flex flex-col gap-2">
    <h4 class="text-sm font-medium text-white/70">
      Выбрать форматы для скачивания:
    </h4>
    <div class="grid grid-cols-2 gap-2 text-xs sm:grid-cols-4">
      {#each video.formats as format (format.ratio)}
        <div
          class="flex flex-col justify-between gap-1 rounded-md bg-white/10 p-2"
        >
          <div class="text-center font-semibold">{format.name}</div>
          <div class="text-center text-white/50">{format.resolution}</div>
          <div class="mt-1 grid grid-cols-2 gap-1">
            {#each Object.keys(format.urls) as type (type)}
              {@const inputId = `${video.id}-${format.ratio}-${type}`}
              {@const isSelected = selectedFormats.some(
                (f) => f.ratio === format.ratio && f.type === type,
              )}
              <div class="group">
                <input
                  type="checkbox"
                  id={inputId}
                  class="sr-only"
                  checked={isSelected}
                  onchange={(e) =>
                    handleFormatToggle(
                      format.ratio,
                      type,
                      e.currentTarget.checked,
                    )}
                />
                <label
                  for={inputId}
                  class="flex h-full cursor-pointer items-center justify-center rounded-sm p-1 text-center transition-colors {isSelected
                    ? 'bg-blue-500'
                    : 'bg-white/10 hover:bg-white/20'}"
                >
                  {type.toUpperCase()}
                </label>
              </div>
            {/each}
          </div>
        </div>
      {/each}
    </div>
  </div>
</div>

<script>
  import { copyToClipboard } from '../../lib/utils/copy';

  let { styles } = $props();

  let inputText = $state('Каждая буква имеет смысл.');
  let copiedState = $state({});

  function generateCssString(style) {
    const propertiesString = Object.entries(style.properties)
      .map(([prop, valueObj]) => `  ${prop}: ${valueObj.css};`)
      .join('\n');

    return `.${style.id} {\n${propertiesString}\n}`;
  }

  async function handleCopyClick(style) {
    const cssText = generateCssString(style);

    try {
      await copyToClipboard(cssText);
      copiedState[style.id] = true;
      setTimeout(() => {
        copiedState[style.id] = false;
      }, 2000);
    } catch (err) {
      console.error('Не удалось скопировать CSS:', err);
      alert('Не удалось скопировать CSS. Пожалуйста, попробуйте вручную.');
    }
  }
</script>

<div class="flex flex-col gap-8">
  <textarea
    bind:value={inputText}
    class="min-h-32 w-full resize-y rounded-lg bg-white/10 p-4 text-base text-white focus:outline-none focus:ring-2 focus:ring-[#5e6ad2]"
    placeholder="Введите текст для предпросмотра типографики..."
    aria-label="Текст для предпросмотра типографики"
    id="typography-input"
  ></textarea>

  {#each styles as style (style.id)}
    <div class="flex flex-col gap-4 rounded-lg bg-white/5 p-6 shadow-inner">
      <h3 class="text-lg font-semibold text-white/80">{style.name}</h3>
      <div
        class="max-w-full overflow-hidden rounded-md bg-black/20 py-4 sm:px-4"
      >
        <p
          class={style.className}
          style="font-family: {style.properties['font-family'].css}"
        >
          {inputText || 'Пустой текст для предпросмотра.'}
        </p>
      </div>

      <details class="text-xs">
        <summary
          class="cursor-pointer font-medium text-white/80 hover:text-white"
        >
          Показать CSS Свойства
        </summary>
        <div
          class="mt-4 flex flex-col gap-4 rounded-md border border-white/10 p-4"
        >
          <div class="space-y-1.5">
            <div class="flex flex-col gap-1.5">
              {#each Object.entries(style.properties) as [prop, valueObj] (prop)}
                <div class="flex items-start">
                  <span class="w-28 shrink-0 font-mono text-white/50"
                    >{prop}:</span
                  >
                  <span class="flex-grow break-words font-mono text-white/90"
                    >{valueObj.display};</span
                  >
                </div>
              {/each}
            </div>
          </div>
          <button
            onclick={() => handleCopyClick(style)}
            class="mt-2 flex w-full max-w-xs items-center justify-center gap-2 rounded-md bg-white/10 px-3 py-2 text-center text-white/80 transition-colors hover:bg-white/20"
          >
            {copiedState[style.id] ? 'Скопировано!' : 'Копировать CSS'}
          </button>
        </div>
      </details>
    </div>
  {/each}
</div>

<style>
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;700&family=Montserrat:wght@600;700&display=swap');
</style>

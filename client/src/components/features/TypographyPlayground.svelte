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
    class="focus:ring-accent text-font-dark min-h-32 w-full resize-y rounded-lg p-4 text-base ring-1 ring-black/50 focus:outline-none focus:ring-2"
    placeholder="Введите текст для предпросмотра типографики..."
    aria-label="Текст для предпросмотра типографики"
    id="typography-input"
  ></textarea>

  {#each styles as style (style.id)}
    <div class="flex flex-col gap-4 rounded-lg p-6 ring-1 ring-black/50">
      <h3 class="text-font-dark/80 text-lg font-semibold">{style.name}</h3>
      <div class="max-w-full overflow-hidden rounded-md py-4 sm:px-4">
        <p
          class={style.className}
          style="font-family: {style.properties['font-family'].css}"
        >
          {inputText || 'Пустой текст для предпросмотра.'}
        </p>
      </div>

      <details class="text-xs">
        <summary
          class="text-font-dark/80 hover:text-font-dark cursor-pointer font-medium"
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
                  <span class="text-font-dark/50 w-28 shrink-0 font-mono"
                    >{prop}:</span
                  >
                  <span
                    class="text-font-dark/90 flex-grow break-words font-mono"
                    >{valueObj.display};</span
                  >
                </div>
              {/each}
            </div>
          </div>
          <button
            onclick={() => handleCopyClick(style)}
            class="text-font-dark/80 mt-2 flex w-full max-w-xs items-center justify-center gap-2 rounded-md bg-black/10 px-3 py-2 text-center transition-all duration-300 hover:bg-black/20 active:scale-95 active:duration-75"
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

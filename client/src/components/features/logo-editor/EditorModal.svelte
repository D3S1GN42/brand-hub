<script>
  import Icon from '../../shared/ui/Icon.svelte';
  import RasterEditorPanel from './panels/RasterEditorPanel.svelte';
  import VectorEditorPanel from './panels/VectorEditorPanel.svelte';
  let { logo, onSave, onClose } = $props();

  let dialogElement;
  let activeEditorPanel = $state(null);

  let editor = $state({
    canvasWidth: 512,
    canvasHeight: 384,
    logoX: 0,
    logoY: 0,
    logoScale: 1,
    logoRotate: 0,
    keepAspectRatio: false,
  });

  $effect(() => {
    if (logo && dialogElement) {
      document.body.classList.add('modal-open');
      if (!dialogElement.open) {
        (async () => {
          editor.canvasWidth = logo.width;
          editor.canvasHeight = logo.height;
          editor.logoX = editor.canvasWidth / 2;
          editor.logoY = editor.canvasHeight / 2;
          editor.logoScale = 1;
          editor.logoRotate = 0;
          editor.keepAspectRatio = false;
          dialogElement.showModal();
        })();
      }
    }
    return () => {
      document.body.classList.remove('modal-open');
    };
  });

  async function handleSave() {
    if (
      !activeEditorPanel ||
      typeof activeEditorPanel.getExportData !== 'function'
    ) {
      console.error('Активный редактор не предоставляет метод getExportData()');
      return;
    }

    const exportData = await activeEditorPanel.getExportData();

    if (!exportData) {
      console.error('Не удалось получить данные для экспорта из редактора.');
      return;
    }

    const customAsset = {
      originalId: logo.id,
      canvasWidth: editor.canvasWidth,
      canvasHeight: editor.canvasHeight,
      logoX: editor.logoX,
      logoY: editor.logoY,
      logoScale: editor.logoScale,
      logoRotate: editor.logoRotate,
      ...exportData,
    };
    onSave(customAsset);
    dialogElement.close();
  }

  function handleClose() {
    onClose();
    dialogElement.close();
  }
</script>

<dialog
  bind:this={dialogElement}
  onclose={onClose}
  class="mx-auto my-auto w-full max-w-5xl bg-transparent p-0 text-white"
>
  <div class="flex h-[90vh] flex-col rounded-lg bg-[#181a1b] shadow-2xl">
    <header
      class="flex shrink-0 items-center justify-between border-b border-white/10 p-4"
    >
      <h3 class="text-lg font-semibold">Настройка: {logo?.name}</h3>
      <button
        onclick={handleClose}
        class="rounded-full p-2 outline-offset-2 outline-[#5e6ad2] transition-all duration-300 hover:bg-white/10
focus-visible:outline-2"><Icon name="close" /></button
      >
    </header>

    <main
      class="grid flex-1 grid-cols-1 gap-4 overflow-hidden p-4 md:grid-cols-[1fr_300px]"
    >
      <div
        class="grid select-none place-items-center overflow-auto rounded-md bg-[#08090a]"
      >
        {#if logo.extension === 'svg'}
          <VectorEditorPanel bind:editor {logo} bind:this={activeEditorPanel} />
        {:else if logo.extension === 'png' || logo.extension === 'jpg'}
          <RasterEditorPanel
            bind:editor
            {logo}
            bind:this={activeEditorPanel}
          />{:else}
          <div
            class="flex h-full w-full items-center justify-center text-white/60"
          >
            Логотип в формате {logo.extension} не поддерживается для редактирования.
          </div>
        {/if}
      </div>

      <aside class="flex flex-col gap-5 pr-2 text-sm">
        <div>
          <h4 class="mb-2 font-bold">Холст</h4>
          <div class="space-y-1.5 text-xs">
            <div
              class="mb-2 grid grid-cols-[1fr_80px] place-content-center items-center"
            >
              <span class="text-white/60">Ширина:</span>
              <div class="grid grid-cols-[1fr_14px] items-center gap-1">
                <input
                  type="number"
                  name="canvas-width"
                  id="canvas-width"
                  bind:value={editor.canvasWidth}
                  class="w-full rounded border border-white/20 bg-transparent px-2 py-1 text-white outline-offset-2 outline-[#5e6ad2] transition-all duration-300
focus-visible:outline-2"
                />
                <span class="text-white/60">px</span>
              </div>
            </div>
            <div
              class="mb-2 grid grid-cols-[1fr_80px] place-content-center items-center"
            >
              <span class="text-white/60">Высота:</span>
              <div class="grid grid-cols-[1fr_14px] items-center gap-1">
                <input
                  type="number"
                  name="canvas-height"
                  id="canvas-height"
                  bind:value={editor.canvasHeight}
                  class="w-full rounded border border-white/20 bg-transparent px-2 py-1 text-white outline-offset-2 outline-[#5e6ad2] transition-all duration-300
focus-visible:outline-2"
                />
                <span class="text-white/60">px</span>
              </div>
            </div>
            <div class="mt-2 flex items-center justify-between">
              <label for="aspect-ratio-lock" class="text-white/60"
                >Сохранять пропорции</label
              >
              <input
                id="aspect-ratio-lock"
                type="checkbox"
                bind:checked={editor.keepAspectRatio}
                class="h-4 w-4 outline-offset-2 outline-[#5e6ad2] transition-all duration-300
focus-visible:outline-2"
              />
            </div>
          </div>
        </div>

        <hr class="border-white/10" />

        <div>
          <h4 class="mb-2 font-bold">Логотип</h4>
          <div class="flex flex-col gap-4">
            <div>
              <div
                class="mb-2 grid grid-cols-[1fr_80px] place-content-center items-center"
              >
                <label for="scale-slider" class="text-xs">Масштаб</label>
                <div class="flex items-center justify-between">
                  <input
                    id="scale-slider"
                    type="number"
                    min="0.1"
                    max="5"
                    step="0.1"
                    bind:value={editor.logoScale}
                    class="w-full rounded border border-white/20 bg-transparent px-2 py-0.5 text-right text-white outline-offset-2 outline-[#5e6ad2] transition-all duration-300
focus-visible:outline-2"
                  />
                </div>
              </div>
              <input
                id="scale-slider"
                type="range"
                min="0.1"
                max="5"
                step="0.1"
                bind:value={editor.logoScale}
                class="w-full outline-offset-2 outline-[#5e6ad2] transition-all duration-300
focus-visible:outline-2"
              />
            </div>
            <div>
              <div
                class="mb-2 grid grid-cols-[1fr_80px] place-content-center items-center"
              >
                <label for="rotate-slider" class="text-xs">Поворот</label>
                <div class="flex items-center justify-between">
                  <input
                    type="number"
                    bind:value={editor.logoRotate}
                    min="-180"
                    max="180"
                    class="w-full rounded border border-white/20 bg-transparent px-2 py-1 text-right text-white outline-offset-2 outline-[#5e6ad2] transition-all duration-300
focus-visible:outline-2"
                  />
                </div>
              </div>
              <input
                id="rotate-slider"
                type="range"
                min="-180"
                max="180"
                step="1"
                bind:value={editor.logoRotate}
                class="w-full outline-offset-2 outline-[#5e6ad2] transition-all duration-300
focus-visible:outline-2"
              />
            </div>
            <div class="space-y-1.5 text-xs">
              <div
                class="mb-2 grid grid-cols-[1fr_80px] place-content-center items-center"
              >
                <label for="logo-x" class="text-white/60">X:</label>
                <input
                  step="1"
                  name="logo-x"
                  id="logo-x"
                  type="number"
                  bind:value={editor.logoX}
                  class="w-full rounded border border-white/20 bg-transparent px-2 py-1 text-right text-white outline-offset-2 outline-[#5e6ad2] transition-all duration-300
focus-visible:outline-2"
                />
              </div>
              <div
                class="mb-2 grid grid-cols-[1fr_80px] place-content-center items-center"
              >
                <label for="logo-y" class="text-white/60">Y:</label>
                <input
                  step="1"
                  name="logo-y"
                  id="logo-y"
                  type="number"
                  bind:value={editor.logoY}
                  class="w-full rounded border border-white/20 bg-transparent px-2 py-1 text-right text-white outline-offset-2 outline-[#5e6ad2] transition-all duration-300
focus-visible:outline-2"
                />
              </div>
            </div>
            <button
              onclick={() => {
                editor.logoX = editor.canvasWidth / 2;
                editor.logoY = editor.canvasHeight / 2;
                editor.logoScale = 1;
                editor.logoRotate = 0;
              }}
              class="w-full rounded-md bg-white/10 py-2 text-center text-xs outline-offset-2 outline-[#5e6ad2] transition-all duration-300 hover:bg-white/20
focus-visible:outline-2">Сбросить трансформации</button
            >
          </div>
        </div>
      </aside>
    </main>

    <footer
      class="flex shrink-0 justify-end gap-4 border-t border-white/10 p-4"
    >
      <button
        onclick={handleClose}
        class="rounded-lg bg-white/10 px-4 py-2 outline-offset-2 outline-[#5e6ad2] transition-all duration-300 hover:bg-white/20
focus-visible:outline-2">Отмена</button
      >
      <button
        onclick={handleSave}
        class="rounded-lg bg-[#5e6ad2] px-4 py-2 outline-offset-2 outline-[#5e6ad2] transition-all duration-300 hover:bg-[#5058b8]
focus-visible:outline-2">Сохранить и добавить</button
      >
    </footer>
  </div>
</dialog>

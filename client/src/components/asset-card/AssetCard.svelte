<script>
  import { getLumaClass } from '../../lib/utils/color.js';
  import Icon from '../shared/ui/Icon.svelte';

  let {
    asset,
    checked = false,
    onToggle = () => {},
    preview,
    meta = null,
    controls = null,
  } = $props();

  let checkboxElement;

  function handleChange(event) {
    onToggle({
      id: asset.id,
      checked: event.currentTarget.checked,
      assetType: asset.assetType,
    });
  }

  function handleLastFormatDeselected() {
    if (checkboxElement) {
      checkboxElement.focus();
    }
  }
</script>

<li
  class="group relative aspect-[4/3] select-none overflow-hidden outline-offset-2 outline-[#FFA676] transition-all
  duration-300 ease-in-out hover:scale-[1.02]
  active:scale-[0.98] active:duration-75 has-[:focus-visible]:outline-2"
  style="background-color: {asset.background};"
  role="option"
  aria-selected={checked}
>
  <input
    id={asset.id}
    bind:checked
    onchange={handleChange}
    value={asset.id}
    type="checkbox"
    class="sr-only"
    data-selected={checked}
    bind:this={checkboxElement}
  />
  <label
    for={asset.id}
    class="flex h-full w-full cursor-pointer items-center justify-center p-4"
  >
    {@render preview()}

    {#if meta}
      {@render meta()}
    {/if}

    <span
      class="absolute right-4 top-4 h-7 w-7 cursor-pointer rounded-md border-2 {getLumaClass(
        asset.background,
        'border-black/50',
        'border-white/80',
      )} bg-black/20 opacity-0
      outline-offset-2 backdrop-blur-sm transition-all duration-300 hover:bg-black/30
      active:bg-black/40 group-hover:opacity-100 group-has-[:focus-visible]:opacity-100
      group-has-[input:checked]:opacity-100 group-has-[input[data-selected]:focus-visible]:outline-2 {getLumaClass(
        asset.background,
        'outline-black/50',
        'outline-white/80',
      )}"
    >
      <Icon name="check" />
    </span>
  </label>

  {#if controls}
    {@render controls({ onLastFormatDeselected: handleLastFormatDeselected })}
  {/if}
</li>

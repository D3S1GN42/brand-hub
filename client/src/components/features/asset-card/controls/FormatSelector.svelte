<script>
  import { getLumaClass } from '../../../../lib/utils/color';

  let {
    asset,
    availableFormats = [],
    selectedFormats = [],
    onFormatChange,
    onLastFormatDeselected,
  } = $props();

  function handleFormatCheckboxChange(event, format) {
    if (!event.currentTarget.checked && selectedFormats.length === 1) {
      onLastFormatDeselected();
    }

    if (onFormatChange) {
      onFormatChange({
        id: asset.id,
        format: format,
        checked: event.currentTarget.checked,
      });
    }
  }

  const formatButtonClasses = $derived((format, index) => {
    const isChecked = selectedFormats.includes(format);
    const totalFormats = availableFormats.length;
    let classes = `flex-1 text-center py-1.5 px-3 text-xs font-semibold whitespace-nowrap cursor-pointer transition-all duration-300 ${isChecked ? 'bg-white/90 text-black' : 'bg-black/40 text-white/70 hover:bg-black/60'}`;
    if (totalFormats === 1) classes += ' rounded-full';
    else {
      if (index === 0) classes += ' rounded-l-full';
      if (index === totalFormats - 1) classes += ' rounded-r-full';
    }
    return classes;
  });
</script>

{#if availableFormats.length > 0}
  <div
    class="group-has-[input:checked]:starting:opacity-0 starting:opacity-0 starting:hidden
    transition-discrete absolute bottom-4 left-4 z-10 hidden h-8 gap-0 rounded-full border-2 {getLumaClass(
      asset.background,
      'border-black/50',
      'border-white/80',
    )} opacity-0 transition-all duration-300
    group-has-[input:checked]:flex group-has-[input:checked]:opacity-100"
  >
    {#each availableFormats as format, index (format)}
      <div class="group/format flex flex-1">
        <input
          type="checkbox"
          name={`${asset.id}-format-${format}`}
          id={`${asset.id}-format-${format}`}
          value={format}
          checked={selectedFormats.includes(format)}
          onchange={(e) => handleFormatCheckboxChange(e, format)}
          class="sr-only"
        />
        <label
          for={`${asset.id}-format-${format}`}
          class="{formatButtonClasses(
            format,
            index,
          )} outline-offset-4 {getLumaClass(
            asset.background,
            'outline-black/50',
            'outline-white/80',
          )} group-has-[input:focus-visible]/format:outline-2"
        >
          {format.toUpperCase()}
        </label>
      </div>
    {/each}
  </div>
{/if}

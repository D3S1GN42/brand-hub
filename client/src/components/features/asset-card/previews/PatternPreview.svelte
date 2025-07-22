<script>
  let { pattern } = $props();

  const previewStyle = $derived(
    `background-image: url('${pattern.dataUrl}'); background-size: contain; background-position: center; background-repeat: no-repeat;`,
  );
</script>

<div
  class="h-full w-full border border-dashed border-black/20 ring-1 ring-black/10"
  style={previewStyle}
></div>

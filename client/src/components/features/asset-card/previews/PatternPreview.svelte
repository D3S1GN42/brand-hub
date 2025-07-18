<script>
  let { pattern } = $props();

  const previewStyle = $derived(
    `background-image: url('${pattern.dataUrl}'); background-size: contain;`,
  );
</script>

<div
  class="h-full w-full border border-dashed border-white/20 ring-1 ring-black/10"
  style={previewStyle}
></div>

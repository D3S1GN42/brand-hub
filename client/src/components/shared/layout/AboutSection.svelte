<script>
  let { content } = $props();
</script>

<div class="mx-auto flex max-w-4xl flex-col items-center gap-12 text-center">
  <h2 class="text-4xl font-bold md:text-5xl">
    {content.heading}
  </h2>

  <div class="text-font-dark/80 space-y-4 text-lg leading-relaxed">
    {#each content.paragraphs as paragraph, index (index)}
      <p>{paragraph}</p>
    {/each}
  </div>

  <div class="grid w-full grid-cols-2 gap-8 text-center md:grid-cols-4">
    {#each content.stats as stat, index (index)}
      <div class="flex flex-col">
        <span class="text-accent text-4xl font-bold md:text-5xl"
          >{stat.value}</span
        >
        <span class="text-font-dark/60 mt-1 text-sm">{stat.label}</span>
      </div>
    {/each}
  </div>
</div>

<script>
  let { info } = $props();
</script>

<footer class="text-font-dark/60 bg-white py-8 text-sm shadow-2xl">
  <div class="container">
    <div
      class="flex flex-col items-center gap-6 md:justify-between lg:flex-row"
    >
      <div
        class="flex flex-col items-center gap-2 text-center md:flex-row md:items-start md:gap-x-8 md:text-left"
      >
        <p>
          © {info.copyrightYear}
          <a
            href={info.companyUrl}
            target="_blank"
            rel="noopener noreferrer"
            class="outline-accent hover:text-font-dark outline-offset-2 transition-all duration-300 focus-visible:outline-2"
            >{info.companyName}</a
          >. Все права защищены.
        </p>
        <p>
          Разработано с ❤️ <a
            href={info.developer.url}
            target="_blank"
            rel="noopener noreferrer"
            class="outline-accent text-font-dark/80 hover:text-font-dark font-semibold outline-offset-2 transition-all duration-300 focus-visible:outline-2"
            >{info.developer.name}</a
          >
        </p>
      </div>

      {#if info.socials?.length > 0}
        <div class="flex flex-wrap items-center gap-4">
          {#each info.socials as social (social.name)}
            <a
              href={social.url}
              target="_blank"
              rel="noopener noreferrer"
              class="outline-accent outline-offset-2 transition-all duration-300 hover:scale-110 focus-visible:outline-2"
              aria-label="Профиль в {social.name}"
            >
              <span class="capitalize">{social.name}</span>
            </a>
          {/each}
        </div>
      {/if}
    </div>
  </div>
</footer>

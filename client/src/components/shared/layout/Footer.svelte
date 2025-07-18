<script>
  let { info } = $props();
</script>

<footer
  class="border-t border-white/10 bg-[#08090a] py-8 text-sm text-white/60"
>
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
            class="hover:text-white">{info.companyName}</a
          >. Все права защищены.
        </p>
        <p>
          Разработано с ❤️ <a
            href={info.developer.url}
            target="_blank"
            rel="noopener noreferrer"
            class="font-semibold text-white/80 hover:text-white"
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
              class="transition-transform hover:scale-110"
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

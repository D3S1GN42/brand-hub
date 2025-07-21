<script>
  import Icon from '../ui/Icon.svelte';
  let { contact } = $props();
</script>

<div
  class="flex flex-col items-center rounded-lg bg-white/5 p-6 text-center transition-all duration-300 hover:-translate-y-1 hover:bg-white/10"
>
  <img
    src={contact.photoUrl}
    alt="Фотография {contact.name}"
    class="mb-4 h-32 w-32 rounded-full border-4 border-white/10 object-cover"
  />
  <h4 class="text-lg font-bold">{contact.name}</h4>
  <p class="mb-4 text-sm text-white/60">{contact.role}</p>

  <div class="mt-auto flex flex-col gap-2 text-xs">
    <a
      href="mailto:{contact.email}"
      class="flex items-center gap-2 text-white/80 outline-offset-2 outline-[#5e6ad2] transition-all duration-300 hover:text-white focus-visible:outline-2"
    >
      <Icon name="email" />
      <span>{contact.email}</span>
    </a>
    {#if contact.telegram}
      <a
        href="https://t.me/{contact.telegram}"
        target="_blank"
        rel="noopener noreferrer"
        class="flex items-center gap-2 text-white/80 outline-offset-2 outline-[#5e6ad2] transition-all duration-300 hover:text-white focus-visible:outline-2"
      >
        <Icon name="telegram" />
        <span>@{contact.telegram}</span>
      </a>
    {/if}
  </div>
</div>

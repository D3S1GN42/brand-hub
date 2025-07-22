<script>
  import Icon from '../ui/Icon.svelte';
  let { contact } = $props();
</script>

<div
  class="flex flex-col items-center rounded-lg p-6 text-center shadow-xl transition-all duration-300 hover:-translate-y-1"
>
  <img
    src={contact.photoUrl}
    alt="Фотография {contact.name}"
    class="mb-4 h-32 w-32 rounded-full border-4 border-black/10 object-cover"
  />
  <h4 class="text-lg font-bold">{contact.name}</h4>
  <p class="text-font-dark/60 mb-4 text-sm">{contact.role}</p>

  <div class="mt-auto flex flex-col gap-2 text-xs">
    <a
      href="mailto:{contact.email}"
      class="outline-accent text-font-dark/80 hover:text-font-dark flex items-center gap-2 outline-offset-2 transition-all duration-300 focus-visible:outline-2"
    >
      <Icon name="email" />
      <span>{contact.email}</span>
    </a>
    {#if contact.telegram}
      <a
        href="https://t.me/{contact.telegram}"
        target="_blank"
        rel="noopener noreferrer"
        class="outline-accent text-font-dark/80 hover:text-font-dark flex items-center gap-2 outline-offset-2 transition-all duration-300 focus-visible:outline-2"
      >
        <Icon name="telegram" />
        <span>@{contact.telegram}</span>
      </a>
    {/if}
  </div>
</div>

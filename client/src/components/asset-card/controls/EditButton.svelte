<script>
  import { getLumaClass } from '../../../lib/utils/color.js';
  import Icon from '../../shared/ui/Icon.svelte';

  let { asset, onEdit } = $props();
</script>

<button
  type="button"
  onclick={onEdit}
  class="pointer-coarse:opacity-100 pointer-fine:group-hover:opacity-100 pointer-fine:group-has-[:focus-visible]:opacity-100
  absolute bottom-4 right-4 z-10 cursor-pointer rounded-full bg-black/30 p-2 opacity-0 outline-offset-2 {getLumaClass(
    asset.background,
    'outline-black/50',
    'outline-white/80',
  )}
  backdrop-blur-sm transition-all duration-300 hover:bg-black/40 focus-visible:outline-2 active:bg-black/50"
  title="Настроить логотип"
  aria-label="Настроить логотип"
>
  <Icon name="edit" />
</button>

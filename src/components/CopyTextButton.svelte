<script lang="ts">
  import { createEventDispatcher, onMount } from "svelte";
  import Copy16 from "carbon-icons-svelte/lib/Copy16";

  const dispatch = createEventDispatcher();

  export let value: string;
  export let feedback: string = "Copied to clipboard";
  export let tooltip = "Copy";
  export let disabled = false;
  export let align = "center";
  export let direction = "bottom";

  export let copy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch (e) {
      console.log(e);
    }
  };

  let hidden = false;
  let open = false;
  let timeout: number;

  onMount(() => {
    return clearTimeout(timeout);
  });

  $: tooltipText = open ? feedback : tooltip;
</script>

<svelte:window
  on:keydown={({ key }) => {
    if (key === "Escape") {
      hidden = true;
      open = false;
    }
  }}
/>

<button
  {disabled}
  class="text-copy-button"
  class:bx--tooltip__trigger={true}
  class:bx--tooltip--a11y={true}
  class:bx--tooltip--hidden={hidden || disabled}
  class:bx--tooltip--top={direction === "top"}
  class:bx--tooltip--right={direction === "right"}
  class:bx--tooltip--bottom={direction === "bottom"}
  class:bx--tooltip--left={direction === "left"}
  class:bx--tooltip--align-start={align === "start"}
  class:bx--tooltip--align-center={align === "center"}
  class:bx--tooltip--align-end={align === "end"}
  {...$$restProps}
  style="cursor: {disabled ? 'not-allowed' : 'pointer'}; {$$restProps.style}"
  on:mouseover
  on:mouseenter
  on:mouseenter={() => {
    if (disabled) return;
    hidden = false;
  }}
  on:mouseleave
  on:focus
  on:focus={() => {
    if (disabled) return;
    hidden = false;
  }}
  on:click={() => {
    if (disabled) return;
    open = true;
    timeout = setTimeout(() => {
      open = false;
      hidden = true;
    }, 1500);

    if (value !== undefined) {
      copy(value);
      dispatch("copy");
    }
  }}
>
  <span class:bx--assistive-text={true}>
    {tooltipText}
  </span>
  <slot />
  <Copy16 />
</button>

<style>
  .text-copy-button {
    margin-right: 10px;

    font-size: inherit;
    font-weight: inherit;
    line-height: inherit;
    letter-spacing: inherit;
    color: inherit;
    display: inline-flex;
    flex-direction: row;
    align-items: center;
  }

  .text-copy-button:hover {
    background-color: var(--gray-20);
  }

  .text-copy-button:last-child {
    margin-right: 0;
  }

  .text-copy-button :global(svg) {
    margin-left: 4px;
  }
</style>

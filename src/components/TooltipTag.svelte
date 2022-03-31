<script lang="ts">
  import { Tag, Tooltip } from "carbon-components-svelte";

  interface TooltipProps {
    /**
     * Set the alignment of the tooltip relative to the icon
     * @default "center"
     */
    align?: "start" | "center" | "end";

    /**
     * Set the direction of the tooltip relative to the button
     * @default "bottom"
     */
    direction?: "top" | "right" | "bottom" | "left";
  }
  type TagType =
    | "red"
    | "magenta"
    | "purple"
    | "blue"
    | "cyan"
    | "teal"
    | "green"
    | "gray"
    | "cool-gray"
    | "warm-gray"
    | "high-contrast";

  export let align: TooltipProps["align"] = "start";
  export let direction: TooltipProps["direction"] = "bottom";
  export let type: TagType;
  export let label: string;

  let open: boolean = false;
</script>

<div class="tooltip-tag">
  <Tooltip {align} {direction} {open}>
    <svelte:fragment slot="icon">
      <Tag
        size="sm"
        {type}
        interactive
        on:mouseenter={() => (open = true)}
        on:mouseleave={() => (open = false)}
      >
        {label}
      </Tag>
    </svelte:fragment>
    <slot />
  </Tooltip>
</div>

<style>
  .tooltip-tag {
    display: inline-block;
  }

  .tooltip-tag :global(.bx--tooltip__label .bx--tooltip__trigger) {
    margin-left: 0;
  }
</style>

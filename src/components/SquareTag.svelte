<script lang="ts">
  import { Tag } from "carbon-components-svelte";
  export let type:
    | "high-contrast"
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
    | undefined;

  export let onClick: () => void | undefined;
  export let fullWidth: boolean | undefined;

  const style = "margin: 0px; border-radius: 0; padding: 10px;";
</script>

<Tag
  style={(onClick !== undefined ? style + "cursor: pointer;" : style) +
    (fullWidth ? "width: 100%;" : "")}
  on:click={onClick}
  {type}
>
  <slot />
</Tag>

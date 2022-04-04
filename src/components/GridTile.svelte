<script lang="ts">
  import { Column, Grid, Row } from "carbon-components-svelte";
  import AspectRatioSkeleton from "./AspectRatioSkeleton.svelte";

  export let loading: boolean = false;
</script>

<Grid fullWidth condensed noGutter>
  <slot name="header" />
  <Row>
    {#if loading}
      <Column sm={1}>
        <AspectRatioSkeleton ratio="3x4" />
      </Column>
      <Column sm={1}>
        <AspectRatioSkeleton ratio="3x4" />
      </Column>
      <Column sm={1}>
        <AspectRatioSkeleton ratio="3x4" />
      </Column>
      <Column sm={1}>
        <AspectRatioSkeleton ratio="3x4" />
      </Column>
    {:else}
      <slot />
    {/if}
  </Row>
  <slot name="footer" />
</Grid>

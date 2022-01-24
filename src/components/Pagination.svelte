<script lang="ts">
  import { Pagination } from "carbon-components-svelte";

  export let page = 1;
  export let totalItems = 0;

  let pageSize = 50;
  const pageSizes = [50, 100, 200];
</script>

<Pagination {...{ totalItems, pageSizes }} bind:page bind:pageSize />

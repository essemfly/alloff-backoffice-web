<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import { Pagination } from "carbon-components-svelte";

  export let offset = 0;
  export let limit = 50;
  export let totalItems = 0;

  let page = 1;
  const pageSizes = [50, 100, 200];

  const dispatch = createEventDispatcher();

  const handlePageChange = (
    event: CustomEvent<{ page: number; pageSize: number }>,
  ) => {
    const { page, pageSize } = event.detail;
    dispatch("change", { offset: (page - 1) * pageSize, limit: pageSize });
  };
</script>

<Pagination
  {...{ totalItems, pageSizes }}
  bind:page
  bind:pageSize={limit}
  on:update={handlePageChange}
/>

<script lang="ts">
  import { Pagination } from "carbon-components-svelte";
  import { createEventDispatcher } from "svelte";

  export let offset = 0;
  export let limit = 50;
  export let totalItems = 0;

  const pageSizes = [50, 100, 200];

  const dispatch = createEventDispatcher();

  const handlePageChange = (
    event: CustomEvent<{ page: number; pageSize: number }>,
  ) => {
    const { page, pageSize } = event.detail;
    offset = (page - 1) * pageSize;
    limit = pageSize;
    dispatch("change", { offset, limit });
  };
</script>

<Pagination
  pageSize={limit}
  {...{ pageSizes, totalItems }}
  on:update={handlePageChange}
/>

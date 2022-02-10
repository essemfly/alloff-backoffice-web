<script lang="ts">
  import Nav from "@app/components/Nav.svelte";

  export let type: string;
</script>

<Nav title="큐레이션 목록">
  <h1>큐레이션 {type} 목록</h1>
</Nav>

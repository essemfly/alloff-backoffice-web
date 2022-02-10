<script lang="ts">
  import Nav from "@app/components/Nav.svelte";

  export let type: string;
</script>

<Nav title="기획전 목록">
  <h1>기획전 {type} 목록</h1>
</Nav>

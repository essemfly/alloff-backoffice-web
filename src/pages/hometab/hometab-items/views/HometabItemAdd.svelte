<script lang="ts">
  import { Button } from "carbon-components-svelte";

  import Nav from "@app/components/Nav.svelte";

  const handleAddClick = (event: MouseEvent) => {
    // todo
  };
</script>

<Nav title="홈탭 아이템 추가">
  <h1>홈탭 아이템 추가</h1>
  <div class="button-right-wrapper mb10">
    <Button on:click={handleAddClick}>홈탭 아이템 등록</Button>
  </div>
  <div class="button-right-wrapper mt10">
    <Button on:click={handleAddClick}>홈탭 아이템 등록</Button>
  </div>
</Nav>

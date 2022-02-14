<script lang="ts">
  import { navigate } from "svelte-navigator";
  import { Button } from "carbon-components-svelte";

  import Nav from "@app/components/Nav.svelte";

  const handleAddClick = (event: MouseEvent) => {
    event.preventDefault();
    navigate("/hometab/banners/add");
  };
</script>

<Nav title="배너 목록">
  <h1>배너 목록</h1>

  <div class="button-wrapper mb10">
    <Button on:click={handleAddClick}>추가</Button>
  </div>
</Nav>

<style>
  .button-wrapper {
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
  }

  .mb10 {
    margin-bottom: 10px;
  }

  .mt10 {
    margin-top: 10px;
  }
</style>

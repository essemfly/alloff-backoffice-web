<script lang="ts">
  export let title: string = "";
</script>

{#if title}
  <h3 class="box-title">{title}</h3>
{/if}
<div class="box">
  <slot />
</div>

<style>
  h3.box-title {
    padding: 10px 20px;
    background-color: #303030;
    color: white;
    border-top-left-radius: 2px;
    border-top-right-radius: 2px;
    box-sizing: border-box;
  }

  h3.box-title + .box {
    border-top-left-radius: 0;
    border-top-right-radius: 0;
  }

  .box {
    width: 100%;
    border: 1px solid #303030;
    background-color: white;
    border-radius: 2px;
    padding: 20px;
    margin: 0 0 1em 0;
    box-sizing: border-box;
  }
</style>

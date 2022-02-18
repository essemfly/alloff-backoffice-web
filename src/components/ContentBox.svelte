<script lang="ts">
  export let title: string = "";
  export let subtitle: string = "";
</script>

{#if title}
  <h3 class="box-title">{title}</h3>
{/if}
<div class="box">
  {#if subtitle}
    <h4 class="box-subtitle">{subtitle}</h4>
  {/if}
  <div class="inner-box">
    <slot />
  </div>
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

    margin: 0 0 1em 0;
    box-sizing: border-box;
  }

  .inner-box {
    padding: 20px;
  }

  .box > h4.box-subtitle {
    padding: 10px 20px;
    margin-bottom: 15px;
    font-weight: bold;
    border-bottom: 1px solid #303030;
  }

  :global(.box .inner-box > h4) {
    margin-top: 15px;
    margin-bottom: 15px;
  }

  :global(.box .inner-box > h4:first-child) {
    margin-top: 0;
  }
</style>

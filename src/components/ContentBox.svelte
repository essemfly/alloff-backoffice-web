<script lang="ts">
  export let title: string = "";
  export let subtitle: string = "";
</script>

<div class="box">
  <div class={`box-title-section ${title ? "header-bg" : ""}`}>
    {#if title}
      <h3 class="box-title">{title}</h3>
    {/if}
    {#if subtitle}
      <h4 class="box-subtitle">{subtitle}</h4>
    {/if}
    <div class="box-actions">
      <slot name="actions" />
    </div>
  </div>
  <div class="inner-box">
    <div class="button-right-wrapper">
      <slot name="legend" />
    </div>
    <slot />
  </div>
</div>

<style>
  .box-title-section {
    padding: 10px 20px;
    border-top-left-radius: 2px;
    border-top-right-radius: 2px;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid #303030;
  }

  .box-title-section.header-bg {
    background-color: #303030;
    color: white;
    border-top-left-radius: 2px;
    border-top-right-radius: 2px;
    box-sizing: border-box;
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

  h4.box-subtitle {
    font-weight: bold;
  }

  :global(.box .inner-box > h4) {
    margin-top: 15px;
    margin-bottom: 15px;
  }

  :global(.box .inner-box > h4:first-child) {
    margin-top: 0;
  }

  .box :global(.bx--toggle-input__label .bx--toggle__switch) {
    margin-top: 5px;
  }

  .box-actions {
    display: flex;
    flex-direction: row;
  }
</style>

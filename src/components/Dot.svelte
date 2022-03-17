<script lang="ts">
  export let kind: "primary" | "secondary" | "warn" | "danger" = "danger";
  export let label: string | undefined = undefined;
</script>

<div class="dot-wrapper">
  <span class={`dot dot-${kind}`} />
  {#if label}
    <span class="dot-label">{label}</span>
  {/if}
</div>

<style>
  .dot-wrapper {
    display: inline-block;
  }

  .dot-label {
    font-size: smaller;
  }

  .dot {
    width: 6px;
    height: 6px;
    background-color: var(--danger-01);
    border-radius: 10px;
    display: inline-block;
    vertical-align: top;
    margin-left: 0px;
    margin-top: 0px;
  }

  .dot-primary {
    background-color: var(--interactive-01);
  }

  .dot-secondary {
    background-color: var(--interactive-02);
  }

  .dot-warn {
    background-color: var(--support-03);
  }

  .dot-danger {
    background-color: var(--danger-01);
  }
</style>

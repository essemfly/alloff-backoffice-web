<script lang="ts">
  export let kind: "primary" | "secondary" | "warn" | "danger" = "danger";
</script>

<span class={`dot dot-${kind}`} />

<style>
  .dot {
    width: 6px;
    height: 6px;
    background-color: var(--danger-01);
    border-radius: 10px;
    display: inline-block;
    vertical-align: top;
    margin-left: 0px;
    margin-top: 4px;
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

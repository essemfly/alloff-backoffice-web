<script lang="ts">
  import { generate } from "shortid";
  import { Toggle } from "carbon-components-svelte";
  import Dot from "../Dot.svelte";

  export let name: string = "";
  export let size: "sm" | undefined = undefined;
  export let errorText: string = "";
  export let label: string | undefined = undefined;
  export let value: boolean = false;
  export let disabled: boolean = false;
  export let hideLabel: boolean = false;
  export let labelA: string = "Off";
  export let labelB: string = "On";

  export let schema: any;

  const htmlId: string = `toggle-field-${generate()}`;
  const { label: schemaLabel, presence, meta } = schema.spec;
  let { helperText } = meta ?? {};
  const fieldLabel = label ?? schemaLabel;

  const required = presence === "required";
</script>

{#if fieldLabel && !hideLabel}
  <label for={htmlId} class="bx--toggle-input__label">
    {fieldLabel}
    {#if required}
      <Dot kind="danger" />
    {/if}
  </label>
{/if}
<Toggle
  id={htmlId}
  {size}
  {name}
  {disabled}
  {labelA}
  {labelB}
  bind:toggled={value}
/>
{#if !!helperText && !errorText}
  <div class="bx--form__helper-text">{helperText}</div>
{/if}
{#if !!errorText}
  <div class="bx--form-requirement">{errorText}</div>
{/if}

<style>
  .bx--toggle-input__label {
    flex-direction: row;
  }

  .bx--toggle-input__label :global(.dot) {
    margin-left: 4px;
  }

  .bx--form-requirement {
    display: block;
    max-height: none;
    color: var(--danger-01);
  }
</style>

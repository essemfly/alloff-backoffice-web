<script lang="ts">
  import { AnySchema } from "yup";
  import { generate } from "shortid";
  import { Checkbox } from "carbon-components-svelte";

  import Dot from "../Dot.svelte";
  import { Option } from "./types";

  export let options: Option[];
  export let name: string = "";
  export let errorText: string = "";
  export let value: string[] = [];
  export let disabled: boolean = false;
  export let hideLabel: boolean = false;
  export let schema: AnySchema;

  const htmlId: string = `radio-field-${generate()}`;
  const { label, presence, meta } = schema.spec;
  let { placeholder, helperText } = meta ?? {};
  if (!placeholder) {
    placeholder = label;
  }
  const required = presence === "required";
</script>

{#if label && !hideLabel}
  <legend class="bx--label">
    {label}
    {#if required}
      <Dot kind="danger" />
    {/if}
  </legend>
{/if}
<div id={htmlId}>
  {#each options as option}
    <Checkbox
      {name}
      bind:group={value}
      labelText={option.label}
      value={option.value}
      checked={!!option.value && value.includes(option.value)}
      disabled={option.disabled || disabled}
      {hideLabel}
    />
  {/each}
</div>
{#if !!helperText && !errorText}
  <div class="bx--form__helper-text">{helperText}</div>
{/if}
{#if !!errorText}
  <div class="bx--form-requirement">{errorText}</div>
{/if}

<style>
  .bx--form-requirement {
    display: block;
    max-height: none;
    color: var(--danger-01);
  }
</style>

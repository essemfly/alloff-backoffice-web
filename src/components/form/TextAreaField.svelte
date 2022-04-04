<script lang="ts">
  import { generate } from "shortid";
  import { TextArea } from "carbon-components-svelte";
  import Dot from "../Dot.svelte";

  export let name: string = "";
  export let cols: number | undefined = undefined;
  export let rows: number | undefined = undefined;
  export let errorText: string = "";
  export let label: string | undefined = undefined;
  export let value: string = "";
  export let readonly: boolean = false;
  export let disabled: boolean = false;
  export let hideLabel: boolean = false;
  export let schema: any;

  const htmlId: string = `text-field-${generate()}`;
  const { label: schemaLabel, presence, meta } = schema.spec;
  let { placeholder, helperText } = meta ?? {};
  const fieldLabel = label ?? schemaLabel;
  if (!placeholder) {
    placeholder = fieldLabel;
  }

  const required = presence === "required";
</script>

{#if fieldLabel && !hideLabel}
  <label for={htmlId} class="bx--label">
    {fieldLabel}
    {#if required}
      <Dot kind="danger" />
    {/if}
  </label>
{/if}
<TextArea
  id={htmlId}
  {cols}
  {rows}
  {placeholder}
  {helperText}
  {name}
  bind:value
  invalid={!!errorText}
  invalidText={errorText}
  {required}
  {readonly}
  {disabled}
  {hideLabel}
/>

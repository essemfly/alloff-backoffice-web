<script lang="ts">
  import { generate } from "shortid";
  import { TextInput } from "carbon-components-svelte";
  import Dot from "../Dot.svelte";

  export let name: string = "";
  export let size: "sm" | "xl" | undefined = undefined;
  export let errorText: string = "";
  export let label: string | undefined = undefined;
  export let value: string | number | null = "";
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
  const type = getInputType(schema.type);

  function getInputType(schemaType: string) {
    switch (schemaType) {
      case "number":
      case "tel":
        return "number";
      case "string":
      case "text":
      default:
        return "text";
    }
  }
</script>

{#if fieldLabel && !hideLabel}
  <label for={htmlId} class="bx--label">
    {fieldLabel}
    {#if required}
      <Dot kind="danger" />
    {/if}
  </label>
{/if}
<TextInput
  id={htmlId}
  {type}
  {size}
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

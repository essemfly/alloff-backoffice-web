<script lang="ts">
  import { generate } from "shortid";
  import BrandSelect from "../BrandSelect.svelte";
  import Dot from "../Dot.svelte";

  export let selectedBrandName: string | undefined = undefined;
  export let size: "sm" | "lg" | undefined = undefined;
  export let errorText: string = "";
  export let label: string | undefined = undefined;
  export let value: string = "";
  export let disabled: boolean = false;
  export let schema: any;

  const htmlId: string = `brand-select-field-${generate()}`;
  const { label: schemaLabel, presence, meta } = schema.spec;
  let { placeholder, helperText } = meta ?? {};
  const fieldLabel = label ?? schemaLabel;

  const required = presence === "required";
</script>

{#if fieldLabel}
  <label for={htmlId} class="bx--label">
    {fieldLabel}
    {#if required}
      <Dot kind="danger" />
    {/if}
  </label>
{/if}
<BrandSelect
  {size}
  bind:value
  {placeholder}
  {selectedBrandName}
  {helperText}
  {errorText}
  {disabled}
/>

<script lang="ts">
  import { generate } from "shortid";
  import { createEventDispatcher } from "svelte";
  import { AutocompleteItem } from "../autocomplete";
  import BrandSelect from "../BrandSelect.svelte";
  import Dot from "../Dot.svelte";

  export let selectedBrandName: string | undefined = undefined;
  export let size: "sm" | "lg" | undefined = undefined;
  export let errorText: string = "";
  export let label: string | undefined = undefined;
  export let value: string = "";
  export let excludes: string[] = [];
  export let disabled: boolean = false;
  export let keepValueOnSubmit: boolean = true;
  export let schema: any;

  const htmlId: string = `brand-select-field-${generate()}`;
  const { label: schemaLabel, presence, meta } = schema.spec;
  let { placeholder, helperText } = meta ?? {};
  const fieldLabel = label ?? schemaLabel;

  const required = presence === "required";
  const dispatch = createEventDispatcher();

  const handleSelect = (event: CustomEvent<AutocompleteItem>) => {
    dispatch("change", event.detail);
    value = event.detail?.value ?? "";
  };
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
  bind:excludes
  {placeholder}
  {selectedBrandName}
  {helperText}
  {errorText}
  {disabled}
  {keepValueOnSubmit}
  on:change={handleSelect}
/>

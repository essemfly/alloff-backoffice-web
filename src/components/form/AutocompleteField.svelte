<script lang="ts">
  import { generate } from "shortid";
  import { createEventDispatcher } from "svelte";

  import Dot from "../Dot.svelte";
  import { Autocomplete, AutocompleteItem } from "../autocomplete";

  export let size: "sm" | "lg" | undefined = undefined;
  export let errorText: string = "";
  export let value: string = "";
  export let options: AutocompleteItem[];
  export let disabled: boolean = false;
  export let hideLabel: boolean = false;
  export let schema: any;

  const htmlId: string = `autocomplete-field-${generate()}`;
  const { label, presence, meta } = schema.spec;
  let { placeholder, helperText } = meta ?? {};
  if (!placeholder) {
    placeholder = label;
  }

  const required = presence === "required";
  const dispatch = createEventDispatcher();

  const handleSelect = (event: CustomEvent<AutocompleteItem>) => {
    dispatch("select", event.detail);
    value = event.detail?.value ?? "";
  };
</script>

{#if label && !hideLabel}
  <label for={htmlId} class="bx--label">
    {label}
    {#if required}
      <Dot kind="danger" />
    {/if}
  </label>
{/if}
<Autocomplete
  id={htmlId}
  {size}
  {options}
  {placeholder}
  bind:value
  {disabled}
  {helperText}
  {errorText}
  on:select={handleSelect}
/>

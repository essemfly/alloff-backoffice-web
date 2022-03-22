<script lang="ts">
  import { generate } from "shortid";
  import Dot from "../Dot.svelte";
  import Autocomplete from "../autocomplete/Autocomplete.svelte";
  import { AutocompleteItem } from "../autocomplete";

  export let size: "sm" | "xl" | undefined = undefined;
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
/>
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

<script lang="ts">
  import { generate } from "shortid";
  import { createEventDispatcher } from "svelte";
  import { RadioButtonGroup, RadioButton } from "carbon-components-svelte";

  import Dot from "../Dot.svelte";
  import { Option } from "./types";

  export let options: Option[];
  export let labelPosition: "right" | "left" = "right";
  export let orientation: "horizontal" | "vertical" = "horizontal";
  export let name: string = "";
  export let errorText: string = "";
  export let value: string | undefined = "";
  export let disabled: boolean = false;
  export let hideLabel: boolean = false;
  export let schema: any;

  const dispatch = createEventDispatcher();

  const htmlId: string = `radio-field-${generate()}`;
  const { label, presence, meta } = schema.spec;
  let { placeholder, helperText } = meta ?? {};
  if (!placeholder) {
    placeholder = label;
  }
  const required = presence === "required";

  const handleChange = (event: CustomEvent<typeof value>) => {
    dispatch("change", event.detail);
  };
</script>

{#if label && !hideLabel}
  <legend class="bx--label">
    {label}
    {#if required}
      <Dot kind="danger" />
    {/if}
  </legend>
{/if}
<RadioButtonGroup
  id={htmlId}
  bind:selected={value}
  {disabled}
  {labelPosition}
  {orientation}
  hideLegend={hideLabel}
  on:change={handleChange}
>
  {#each options as option}
    <RadioButton
      {name}
      labelText={option.label}
      value={option.value}
      checked={option.value === value}
      disabled={option.disabled}
    />
  {/each}
</RadioButtonGroup>
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

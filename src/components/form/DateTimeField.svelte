<script lang="ts">
  import { generate } from "shortid";

  import Dot from "../Dot.svelte";
  import DateTimePicker from "../DateTimePicker.svelte";

  export let size: "sm" | "xl" | undefined = undefined;
  export let errorText: string = "";
  export let label: string | undefined = undefined;
  export let value: string | undefined = undefined;
  export let disabled: boolean = false;
  export let hideLabel: boolean = false;
  export let schema: any;

  const htmlId: string = `date-time-field-${generate()}`;
  const { label: schemaLabel, presence, meta } = schema.spec;
  let { placeholder, helperText } = meta ?? {};
  const fieldLabel = label ?? schemaLabel;
  if (!placeholder) {
    placeholder = fieldLabel;
  }

  const required = presence === "required";
</script>

<div id={htmlId} class="date-time-field">
  {#if fieldLabel && !hideLabel}
    <label for={htmlId} class="bx--label">
      {fieldLabel}
      {#if required}
        <Dot kind="danger" />
      {/if}
    </label>
  {/if}
  <DateTimePicker {size} bind:value {disabled} />
  {#if !!helperText && !errorText}
    <div class="bx--form__helper-text">{helperText}</div>
  {/if}
  {#if !!errorText}
    <div class="bx--form-requirement">{errorText}</div>
  {/if}
</div>

<style>
  .bx--form-requirement {
    display: block;
    max-height: none;
    color: var(--danger-01);
  }
</style>

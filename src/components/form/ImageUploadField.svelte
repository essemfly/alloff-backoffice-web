<script lang="ts">
  import { generate } from "shortid";
  import Dot from "../Dot.svelte";
  import ImageUploadInput from "../ImageUploadInput.svelte";

  export let errorText: string = "";
  export let label: string | undefined = undefined;
  export let value: string | string[] | undefined = undefined;
  export let disabled: boolean = false;
  export let hideLabel: boolean = false;
  export let schema: any;

  const htmlId: string = `image-upload-field-${generate()}`;
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

<div id={htmlId}>
  <ImageUploadInput bind:value {errorText} {helperText} {disabled} />
</div>

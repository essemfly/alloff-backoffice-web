<script context="module" lang="ts">
  export interface Option {
    label: string;
    value: string;
  }
</script>

<script lang="ts">
  import { uniq } from "lodash";
  import { createEventDispatcher } from "svelte";
  import { Checkbox, FormGroup } from "carbon-components-svelte";

  export let options: Option[] = [];
  export let values: string[] = [];
  export let label = "";
  export let allLabelText = "전체";
  export let alignment: "horizontal" | "vertical" = "vertical";
  let allChecked = false;

  const dispatch = createEventDispatcher();

  const handleAllCheck = (event: CustomEvent<boolean>) => {
    event.preventDefault();
    event.stopPropagation();
    const checked = event.detail;
    if (checked) {
      values = options.map(({ value }) => value);
    } else {
      values = [];
    }
    values = uniq(values);
  };

  const handleCheck = () => {
    dispatch("change", values);
  };

  $: allChecked = values.length === options.length;
</script>

<div class={`checkbox-group-wrapper checkbox-group-${alignment}`}>
  <FormGroup legendText={label}>
    <Checkbox
      labelText={allLabelText}
      on:check={handleAllCheck}
      checked={allChecked}
    />
    {#each options as { label, value } (value)}
      <Checkbox
        bind:group={values}
        labelText={label}
        {value}
        on:check={handleCheck}
      />
    {/each}
  </FormGroup>
</div>

<style>
  .checkbox-group-wrapper :global(.bx--fieldset) {
    display: flex;
    flex-direction: column;
    align-items: baseline;
    margin-bottom: 0;
    flex-wrap: wrap;
  }

  .checkbox-group-wrapper.checkbox-group-horizontal :global(.bx--fieldset) {
    flex-direction: row;
    align-items: baseline;
  }
</style>

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

  const handleCheck = (value: string) => (event: CustomEvent<boolean>) => {
    event.preventDefault();
    event.stopPropagation();
    const checked = event.detail;
    if (checked) {
      values = [...values, value];
    } else {
      const newValues = values.slice();
      const index = values.indexOf(value);
      values = newValues.splice(index, 1);
      values = newValues;
    }
    values = uniq(values);
  };

  $: allChecked = values.length === options.length;

  $: dispatch("change", values);
</script>

<FormGroup legendText={label}>
  <Checkbox
    labelText={allLabelText}
    on:check={handleAllCheck}
    checked={allChecked}
  />
  {#each options as { label, value } (value)}
    <Checkbox
      on:check={handleCheck(value)}
      checked={values.includes(value)}
      labelText={label}
    />
  {/each}
</FormGroup>

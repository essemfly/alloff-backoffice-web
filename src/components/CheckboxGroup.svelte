<script context="module" lang="ts">
  export interface Option {
    label: string;
    value: string;
  }
</script>

<script lang="ts">
  import { Checkbox, FormGroup } from "carbon-components-svelte";
  import { isEqual } from "lodash";
  import { createEventDispatcher, onMount } from "svelte";
  export let allowEmpty = false;
  export let options: Option[] = [];
  export let values: string[] = [];
  export let label = "";
  export let allLabelText = "전체";
  export let alignment: "horizontal" | "vertical" = "vertical";

  let allCheckboxChecked = false;
  let checkboxMap: Record<string, boolean> = {};

  class EventStream {
    private _dispatch = createEventDispatcher();
    private _values: string[] = [];
    constructor(private _lastMap: Record<string, boolean>) {}

    react(_map: Record<string, boolean>, _allCheckboxChecked: boolean) {
      const changeIsMap = !isEqual(_map, this._lastMap);
      const result = { map: _map, allChecked: _allCheckboxChecked };

      const currentIsAllChecked = EventStream.calculateAllChecked(
        EventStream.makeCandidate(_map),
      );

      if (changeIsMap) {
        result.allChecked = currentIsAllChecked;
        if (currentIsAllChecked) {
          result.map = EventStream.getCheckAllMap();
        }
      } else {
        if (allowEmpty) {
          result.map = (
            currentIsAllChecked
              ? EventStream.getUncheckAllMap
              : EventStream.getCheckAllMap
          )();
        } else {
          result.allChecked = true;
          result.map = EventStream.getCheckAllMap();
        }
      }

      this._lastMap = { ...result.map };
      this._updateValues(EventStream.makeCandidate(result.map));
      return result;
    }

    static makeCandidate = (_map: Record<string, boolean>) =>
      Object.entries(_map)
        .filter(([_, value]) => value)
        .map(([key, _]) => key);

    static calculateAllChecked = (candidate: string[]) => {
      const lengthEquals = candidate.length === options.length;
      if (allowEmpty) {
        return lengthEquals;
      }
      return lengthEquals || candidate.length === 0;
    };

    static getCheckAllMap = () =>
      Object.fromEntries(options.map(({ value }) => [value, true]));

    static getUncheckAllMap = () =>
      Object.fromEntries(options.map(({ value }) => [value, false]));

    private _updateValues(values: string[]) {
      if (isEqual(values, this._values)) return;
      this._values = values;
      this._dispatch("change", this._values);
    }
  }

  const eventStream = new EventStream(checkboxMap);
  onMount(() => {
    eventStream.react(checkboxMap, true); // Select all when mounted
  });

  $: {
    const result = eventStream.react(checkboxMap, allCheckboxChecked);
    checkboxMap = { ...result.map };
    allCheckboxChecked = result.allChecked;
  }
</script>

<div class={`checkbox-group-wrapper checkbox-group-${alignment}`}>
  <FormGroup legendText={label}>
    <Checkbox labelText={allLabelText} bind:checked={allCheckboxChecked} />
    {#each options as { label, value } (value)}
      <Checkbox labelText={label} {value} bind:checked={checkboxMap[value]} />
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

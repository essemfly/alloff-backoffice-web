<script context="module" lang="ts">
  export type AutocompleteItem = {
    key: string;
    label: string;
    value: string;
    subvalue?: string;
  };
</script>

<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import { Search } from "carbon-components-svelte";

  import { boldSearchTerm, findMatches } from "./utils";

  export let id: string | undefined = undefined;
  export let size: "sm" | "lg" | undefined = "lg";
  export let value: string | number = "";
  export let options: AutocompleteItem[];
  export let keepValueOnSubmit = false;
  export let placeholder: string | undefined = undefined;
  export let labelText: string | undefined = undefined;
  export let disabled: boolean = false;
  export let helperText: string = "";
  export let errorText: string = "";

  let inputRef: HTMLInputElement | null | undefined;
  let showAutocompleteResults = false;
  let highlightIndex = 0;
  let searchQuery = "";

  const dispatch = createEventDispatcher();

  const showResults = () => {
    highlightIndex = 0;
    showAutocompleteResults = true;
  };

  const hideResults = () => (showAutocompleteResults = false);

  const handleKeyDown = (e: KeyboardEvent) => {
    switch (e.key) {
      case "Escape":
        hideResults();
        break;
      case "ArrowUp":
        if (showAutocompleteResults && highlightIndex === 0) {
          highlightIndex = matches.length - 1;
        } else {
          highlightIndex -= 1;
        }
        break;
      case "ArrowDown":
        if (!searchQuery && !showAutocompleteResults) {
          showResults();
          break;
        }
        if (showAutocompleteResults && highlightIndex === matches.length - 1) {
          highlightIndex = 0;
        } else {
          highlightIndex += 1;
        }
        break;
      case "Tab":
        hideResults();
        break;
      case "Enter":
        const highlightedOption = matches[highlightIndex];
        handleSelect(highlightedOption);
        break;
      default:
        return;
    }
  };

  const handleClear = () => {
    dispatch("select", undefined);
    value = "";
  };

  const handleSelect = (selectedItem: AutocompleteItem) => {
    if (!selectedItem) return;

    dispatch("select", selectedItem);
    hideResults();

    if (keepValueOnSubmit) {
      searchQuery = selectedItem.label;
      value = selectedItem.value;
    } else {
      searchQuery = "";
      value = "";
    }
  };

  $: matches = findMatches(options, searchQuery);

  $: if (value) {
    const selectedItem = options.find((x) => x.value === value);
    searchQuery = selectedItem?.label ?? "";
  }
</script>

<div {id} class="svelte-autocomplete">
  <div class="input">
    <Search
      {size}
      bind:value={searchQuery}
      bind:ref={inputRef}
      on:keydown={handleKeyDown}
      on:input={showResults}
      on:focus={showResults}
      on:clear={handleClear}
      {placeholder}
      {disabled}
      {labelText}
      {...!!errorText ? { "data-invalid": true } : {}}
    />
  </div>

  <div
    class:showAutocompleteResults
    class="svelte-autocomplete-results-container"
    aria-hidden={showAutocompleteResults}
    autocapitalize="none"
    autocomplete="off"
    aria-autocomplete="list"
    role="combobox"
    aria-expanded={showAutocompleteResults}
  >
    <div class="click-catcher" on:click={hideResults} />
    <ul class="results-list" class:border-none={!matches.length}>
      {#each matches as match, index (match)}
        <li
          on:click={() => handleSelect(match)}
          class:highlight={index === highlightIndex}
          aria-selected={index === highlightIndex}
          aria-label={match.value}
          role="option"
        >
          <div>
            {@html boldSearchTerm(match.label, searchQuery)}
          </div>
          {#if match.subvalue}
            <div class="match-subvalue">
              {@html boldSearchTerm(match.subvalue, searchQuery)}
            </div>
          {/if}
        </li>
      {/each}
    </ul>
  </div>
</div>

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

  .match-subvalue {
    font-size: 11px;
    font-weight: 300;
    margin-top: 2px;
  }

  .svelte-autocomplete {
    position: relative;
  }

  .svelte-autocomplete-results-container {
    display: none;
  }

  .svelte-autocomplete-results-container.showAutocompleteResults {
    display: block;
  }

  .click-catcher {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }

  .results-list {
    max-height: 500px;
    overflow-y: scroll;
    border: 1px solid black;
    width: 100%;
    position: absolute;
    list-style-type: none;
    background-color: #fff;
    color: #595959;
    border-radius: 0 0 2px 2px;
    padding-left: 0;
    margin: 0;
    z-index: 10;
    text-align: left;
  }

  .results-list.border-none {
    border: none;
  }

  .results-list li {
    font-size: 14px;
    padding: 0.5rem;
    user-select: none;
  }

  :global(.results-list li span) {
    font-weight: bold;
    color: #111;
  }

  .highlight,
  .results-list li:hover,
  :global(.results-list li:hover span),
  :global(.results-list .highlight span) {
    background: var(--interactive-01);
    color: var(--text-04);
    font-weight: normal;
  }
</style>

<script lang="ts">
  import { Search } from "carbon-components-svelte";

  import { AutocompleteItem, boldSearchTerm, findMatches } from "./utils";

  export let onSubmit = (result: AutocompleteItem) => {};
  export let options: AutocompleteItem[];
  export let keepValueOnSubmit = false;
  export let selectedValue = "";
  export let themeColor = "#2462FE";
  export let highlightTextColor = "#fff";
  export let placeholder: string | undefined = undefined;
  export let labelText: string | undefined = undefined;

  let inputRef: HTMLInputElement | null | undefined;
  let showAutocompleteResults = false;
  let highlightIndex = 0;

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
        if (!selectedValue && !showAutocompleteResults) {
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
        if (e.keyCode === 13) {
          const highlightedOption = matches[highlightIndex];
          const value = highlightedOption || selectedValue;
          handleSubmit(value);
        }
        break;
      default:
        return;
    }
  };

  const handleSubmit = (value: AutocompleteItem) => {
    if (!value) return;

    onSubmit(value);
    selectedValue = value.value
    hideResults();
  };

  $: matches = findMatches(options, selectedValue);
</script>

<div
  class="svelte-autocomplete"
  style="--theme: {themeColor}; --highlightTextColor: {highlightTextColor};"
>
  <div class="input">
    <Search
      bind:value={selectedValue}
      bind:ref={inputRef}
      on:keydown={handleKeyDown}
      on:input={showResults}
      on:focus={showResults}
      {labelText}
      {placeholder}
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
          on:click={() => handleSubmit(match)}
          class:highlight={index === highlightIndex}
          aria-selected={index === highlightIndex}
          aria-label={match.value}
          role="option"
        >
          <div>
            {@html boldSearchTerm(match.value, selectedValue)}
          </div>
          {#if match.subvalue}
            <div class="match-subvalue">
              {@html boldSearchTerm(match.subvalue, selectedValue)}
            </div>
          {/if}
        </li>
      {/each}
    </ul>
  </div>
</div>

<style>
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
    background: var(--theme);
    color: var(--highlightTextColor);
    font-weight: normal;
  }
</style>

<script lang="ts">
  import debounce from "lodash/debounce";
  import { createEventDispatcher } from "svelte";
  import { TextInput, Button } from "carbon-components-svelte";

  type ButtonKind =
    | "primary"
    | "secondary"
    | "tertiary"
    | "ghost"
    | "danger"
    | "danger-tertiary"
    | "danger-ghost";

  const dispatch = createEventDispatcher();

  export let label: string;
  export let value: string = "";
  export let buttonText: string = "";
  export let placeholder: string = "";
  export let kind: ButtonKind = "secondary";
  export let disabled: boolean = false;

  const handleKeydown = debounce((event: KeyboardEvent) => {
    if (event.key === "Enter") {
      update(value);
    }
  }, 100);

  const handleButtonClick = (event: MouseEvent) => {
    event.preventDefault();
    update(value);
  };

  const update = (newValue: string) => {
    value = newValue;
    dispatch("click", newValue);
  };
</script>

<div class="button-text-input">
  <TextInput
    labelText={label}
    {placeholder}
    bind:value
    on:keydown={handleKeydown}
    {disabled}
  />
  <Button {kind} on:click={handleButtonClick} {disabled}>{buttonText}</Button>
</div>

<style>
  .button-text-input {
    display: flex;
    flex-direction: row;
    align-items: flex-end;
  }

  .button-text-input :global(.bx--btn) {
    height: 2.5rem;
    min-height: auto;
    padding: 10px;
  }
</style>

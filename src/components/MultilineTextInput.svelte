<script lang="ts">
  import {
    UnorderedList,
    ListItem,
    TextInput,
    Button,
    Tile,
  } from "carbon-components-svelte";
  import TrashCan16 from "carbon-icons-svelte/lib/TrashCan16";

  export let label: string;
  export let value: string[] = [];

  let inputValue = "";

  const handleAdd = () => {
    const newValue = inputValue;
    if (newValue !== "") {
      value.push(newValue);
      value = value;
      inputValue = "";
    }
  };

  const handleRemove = (index: number) => () => {
    value.splice(index, 1);
    value = value;
  };

  const handleKeydown = (event: KeyboardEvent) => {
    if (event.key === "Enter") {
      handleAdd();
    }
  };
</script>

<div class="multiline-textfield-box">
  <TextInput
    labelText={label}
    placeholder="작성 후 추가 버튼을 누르세요"
    bind:value={inputValue}
    on:keydown={handleKeydown}
  />
  <Button kind="secondary" on:click={handleAdd}>추가</Button>

  <UnorderedList>
    {#each value as item, idx}
      <Tile class={"list-tile"}>
        <ListItem class={"list-item"}>{item}</ListItem>
        <Button
          size="small"
          icon={TrashCan16}
          kind="danger"
          class="memo-delete"
          iconDescription="Delete"
          on:click={handleRemove(idx)}
        />
      </Tile>
    {/each}
  </UnorderedList>
</div>

<style>
  :global(.list-tile) {
    min-height: 0;
    padding: 0.3rem;
    box-shadow: 0.1px rgba(0, 0, 0, 0.1);
  }
  :global(.list-item) {
    background-color: rgb(198, 246, 213);
    padding: 0.8rem;
    border-radius: 0.1rem;
  }

  :global(.bx--label) {
    margin-top: 1rem;
    font-size: 1rem;
    font-weight: 700;
    line-height: 1.25rem;
  }

  :global(.multiline-textfield-box) {
    margin: 1rem 0.2rem;
  }
</style>

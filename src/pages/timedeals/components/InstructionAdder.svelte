<script lang="ts">
  import {
    UnorderedList,
    ListItem,
    TextInput,
    Button,
    Tile,
  } from "carbon-components-svelte";
  export let instructionTitle: string;
  export let instructions: string[];
  let newInstruction = "";

  function addInstruction(newString: string) {
    instructions = [...instructions, newString];
    newInstruction = "";
  }
</script>

<div>
  <TextInput
    labelText={instructionTitle}
    placeholder="작성 후 추가 버튼을 누르세요"
    bind:value={newInstruction}
  />
  <Button kind="secondary" on:click={() => addInstruction(newInstruction)}
    >추가</Button
  >

  <UnorderedList>
    {#each instructions as item}
      <Tile class={"list-tile"}>
        <ListItem class={"list-item"}>{item}</ListItem>
      </Tile>
    {/each}
  </UnorderedList>
</div>

<style>
/* :global(.list-tile) {
    min-height: 0;
    padding: 0.3rem;
    box-shadow: 0.1px rgba(0, 0, 0, 0.1)
    ;
}
  :global(.list-item) {
    background-color: rgb(198, 246, 213);
    padding: 0.8rem;
    border-radius: 0.1rem;
  } */
</style>

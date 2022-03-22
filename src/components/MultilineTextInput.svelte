<script lang="ts">
  import {
    Button,
    StructuredList,
    StructuredListRow,
    StructuredListBody,
    StructuredListCell,
  } from "carbon-components-svelte";

  import TrashCan16 from "carbon-icons-svelte/lib/TrashCan16";
  import ChevronUp16 from "carbon-icons-svelte/lib/ChevronUp16";
  import ChevronDown16 from "carbon-icons-svelte/lib/ChevronDown16";
  import UpToTop16 from "carbon-icons-svelte/lib/UpToTop16";
  import DownToBottom16 from "carbon-icons-svelte/lib/DownToBottom16";

  import ButtonTextInput from "./ButtonTextInput.svelte";

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

  const handleSort = (index: number, to: number) => () => {
    const [current] = value.splice(index, 1);
    switch (to) {
      case 0:
        // to first
        value = [current, ...value];
        break;
      case 100:
        // to last
        value = [...value, current];
        break;
      default:
        const toIndex = index + to;
        value.splice(toIndex, 0, current);
        value = value;
    }
  };

  const handleRemove = (index: number) => () => {
    value.splice(index, 1);
    value = value;
  };
</script>

<div class="multiline-textfield-box">
  <ButtonTextInput
    {label}
    placeholder="작성 후 추가 버튼을 누르세요"
    bind:value={inputValue}
    on:click={handleAdd}
    buttonText="추가"
  />
  <StructuredList condensed flush>
    <StructuredListBody>
      {#each value as item, index}
        <StructuredListRow class="multiline-textfield-box-list-item">
          <StructuredListCell class="multiline-textfield-box-list-item-text">
            {item}
          </StructuredListCell>
          <StructuredListCell noWrap>
            <Button
              tooltipPosition="bottom"
              tooltipAlignment="end"
              iconDescription="첫번째로"
              icon={UpToTop16}
              kind="ghost"
              size="small"
              on:click={handleSort(index, 0)}
            />
            <Button
              tooltipPosition="bottom"
              tooltipAlignment="end"
              iconDescription="위로"
              icon={ChevronUp16}
              kind="ghost"
              size="small"
              on:click={handleSort(index, -1)}
            />
            <Button
              tooltipPosition="bottom"
              tooltipAlignment="end"
              iconDescription="아래로"
              icon={ChevronDown16}
              kind="ghost"
              size="small"
              on:click={handleSort(index, +1)}
            />
            <Button
              tooltipPosition="bottom"
              tooltipAlignment="end"
              iconDescription="마지막으로"
              icon={DownToBottom16}
              kind="ghost"
              size="small"
              on:click={handleSort(index, +100)}
            />
            <Button
              size="small"
              icon={TrashCan16}
              kind="danger"
              class="memo-delete"
              iconDescription="Delete"
              on:click={handleRemove(index)}
            />
          </StructuredListCell>
        </StructuredListRow>
      {/each}
    </StructuredListBody>
  </StructuredList>
</div>

<style>
  .multiline-textfield-box {
    margin: 1rem 0.2rem;
  }

  .multiline-textfield-box :global(.bx--structured-list) {
    margin-bottom: 0;
  }

  .multiline-textfield-box :global(.multiline-textfield-box-list-item) {
    display: flex;
    flex-direction: row;
    align-items: stretch;
    background-color: rgb(198, 246, 213);
    border: none;
    margin-bottom: 5px;
    padding: 0 5px;
  }

  .multiline-textfield-box :global(.multiline-textfield-box-list-item:hover) {
    background-color: rgb(174, 214, 187);
  }

  .multiline-textfield-box
    :global(.multiline-textfield-box-list-item
      .multiline-textfield-box-list-item-text) {
    flex: 1;
  }
</style>

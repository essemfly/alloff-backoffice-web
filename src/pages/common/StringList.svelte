<script lang="ts">
  import { Button, TextInput } from "carbon-components-svelte";
  import AddComment16 from "carbon-icons-svelte/lib/AddComment16";
  import {
    RemovableStringList,
    StringListItem,
  } from "../../helpers/removeable-string-list";

  export let initialValues: string[] | undefined;
  export let onChange: (values: StringListItem[]) => void;
  export let color: "pink" | "blue" | "yellow" | "green" | "grey" = "yellow";

  const colorCode = (() => {
    switch (color) {
      case "blue":
        return "#a1c8e9";
      case "yellow":
        return "#fff69b";
      case "pink":
        return "#f6c2d9";
      case "green":
        return "#bcdfc9";
      case "grey":
        return "#e4dae2";
    }
  })();

  let newValue = "";
  let newValueRef: HTMLInputElement | null | undefined;

  const { map: _instructions, ...instructionManager } =
    RemovableStringList.from({
      initialValues,
      onChange,
      onAdd: () => {
        newValue = "";
        if (newValueRef) {
          newValueRef.value = "";
        }
      },
    });
</script>

<div class="memo-form">
  <TextInput
    placeholder="새 설명 입력"
    bind:value={newValue}
    on:keydown={(e) => {
      if (e.key !== "Enter") return;
      instructionManager.add(newValue);
    }}
  />
  <Button
    size="field"
    icon={AddComment16}
    iconDescription="추가"
    on:click={() => instructionManager.add(newValue)}
  />
</div>

<div class="memo-items" style={`--bgColor: ${colorCode};`}>
  {#each $_instructions as instruction}
    <div class="memo-item">
      <div class="memo-body">• {instruction.body}</div>
      <div class="memo-user noselect">
        <div
          class="memo-delete"
          on:click={() => instructionManager.remove(instruction.key)}
        >
          ❌
        </div>
      </div>
    </div>
  {/each}
</div>

<style>
  .memo-item {
    background-color: var(--bgColor);
    padding: 15px;
    margin-top: 10px;
    margin-bottom: 10px;
    display: flex;
    flex-direction: row;
    align-items: flex-start;
    line-height: 20px;
    word-break: break-all;
    border-radius: 5px;
    box-shadow: 5px 5px 13px -5px rgba(0, 0, 0, 0.2);
    -webkit-box-shadow: 5px 5px 13px -5px rgba(0, 0, 0, 0.2);
    -moz-box-shadow: 5px 5px 13px -5px rgba(0, 0, 0, 0.2);
  }
  .memo-body {
    flex-grow: 1;
  }
  .memo-user {
    display: flex;
    flex-direction: row;
    align-items: center;
  }

  .memo-delete {
    margin-left: 5px;
    font-size: 10px;
    cursor: pointer;
  }

  .memo-form {
    margin-top: 10px;
    display: flex;
    flex-direction: row;
  }
</style>

<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import { Button } from "carbon-components-svelte";
  import ChevronUp16 from "carbon-icons-svelte/lib/ChevronUp16";
  import ChevronDown16 from "carbon-icons-svelte/lib/ChevronDown16";
  import UpToTop16 from "carbon-icons-svelte/lib/UpToTop16";
  import DownToBottom16 from "carbon-icons-svelte/lib/DownToBottom16";

  export let value: string[] = [];
  export let index: number = -1;

  const dispatch = createEventDispatcher();

  const handleSort = (to: number) => () => {
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
    dispatch("change", value);
  };
</script>

<Button
  tooltipPosition="bottom"
  tooltipAlignment="end"
  iconDescription="첫번째로"
  icon={UpToTop16}
  kind="ghost"
  size="small"
  on:click={handleSort(0)}
/>
<Button
  tooltipPosition="bottom"
  tooltipAlignment="end"
  iconDescription="위로"
  icon={ChevronUp16}
  kind="ghost"
  size="small"
  on:click={handleSort(-1)}
/>
<Button
  tooltipPosition="bottom"
  tooltipAlignment="end"
  iconDescription="아래로"
  icon={ChevronDown16}
  kind="ghost"
  size="small"
  on:click={handleSort(+1)}
/>
<Button
  tooltipPosition="bottom"
  tooltipAlignment="end"
  iconDescription="마지막으로"
  icon={DownToBottom16}
  kind="ghost"
  size="small"
  on:click={handleSort(+100)}
/>

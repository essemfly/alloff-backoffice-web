<script lang="ts">
  import {
    OverflowMenu,
    OverflowMenuItem,
    Tag,
  } from "carbon-components-svelte";
  import { Timedeal } from "../../../api";
  import {
    getTimedealStatus,
    getTimedealStatusColor,
  } from "../../../helpers/timedeal";
  import { newStatus } from "../store";
  export let timedeal: Timedeal | undefined = undefined;
  const status = timedeal ? getTimedealStatus(timedeal) : undefined;
</script>

<div class="title">
  {#if status}
    <Tag type={getTimedealStatusColor(status)} style="margin-left: 0px;">
      {status}
    </Tag>
  {/if}
  {#if $newStatus}
    <Tag type={getTimedealStatusColor($newStatus)} style="margin-left: 0px;">
      WILL BE {$newStatus}
    </Tag>
  {/if}
  {#if timedeal}
    <OverflowMenu>
      <OverflowMenuItem
        on:click={() => navigator.clipboard.writeText(timedeal?.id ?? "")}
        text="ID 복사"
      />
    </OverflowMenu>
  {/if}
</div>
<p style="font-size: 10px">{timedeal?.id}</p>
<h5 style="margin-bottom: 10px;">{timedeal?.title ?? "새로운 타임딜"}</h5>

<style>
  .title {
    display: flex;
    flex-direction: row;
    align-items: center;
  }
</style>

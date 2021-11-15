<script lang="ts">
  import {
    OverflowMenu,
    OverflowMenuItem,
    Tag,
  } from "carbon-components-svelte";
  import { TimedealProduct } from "../../../api";
  export let product: TimedealProduct | undefined = undefined;
</script>

<div class="title">
  {#if product?.soldout}
    <Tag type="red" style="margin-left: 0px;">⚠️ 재고없음</Tag>
  {/if}
  {#if product}
    <OverflowMenu>
      <OverflowMenuItem
        on:click={() => {
          navigator.clipboard.writeText(product.id);
        }}
        text="ID 복사"
      />
    </OverflowMenu>
  {/if}
</div>
<p style="font-size: 10px">{product?.id ?? ""}</p>
<h5 style="margin-bottom: 10px;">{product?.name ?? "새로운 상품"}</h5>

<style>
  .title {
    display: flex;
    flex-direction: row;
    align-items: center;
  }
</style>

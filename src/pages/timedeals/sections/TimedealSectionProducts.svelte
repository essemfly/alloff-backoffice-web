<script lang="ts">
  import { Button, TabContent, Tag } from "carbon-components-svelte";
  import DocumentAdd16 from "carbon-icons-svelte/lib/DocumentAdd16";
  import TrashCan16 from "carbon-icons-svelte/lib/TrashCan16";
  import { onMount } from "svelte";
  import {
    Timedeal,
    TimedealProduct,
    TimedealProductsApi,
    TimedealsApi,
  } from "../../../api";
  export let timedeal: Timedeal;
  export let mobile: boolean;
  export let api: TimedealsApi;
  export let load: () => {};
  export let submitting: boolean;

  let products: TimedealProduct[] = [];

  const productApi = new TimedealProductsApi();

  onMount(async () => {
    products = (await api.timedealsProductsList({ id: timedeal.id })).data;
  });

  const deleteProduct = async (product: TimedealProduct) => {
    if (!confirm("다음의 상품을 삭제합니다. : " + product.name)) return;
    submitting = true;
    try {
      await productApi.timedealProductsDestroy({ id: product.id });
    } catch (e: any) {
      alert("상품 삭제 중 오류가 발생했습니다!");
    } finally {
      submitting = false;
      load();
    }
  };
</script>

<TabContent style="padding: 0;">
  <div style="height: 10px" />
  <div class="button-wrapper">
    <Button
      on:click={() => (window.location.href = "/timedeals/" + timedeal.id + "/products")}
      icon={DocumentAdd16}>상품 추가</Button
    >
  </div>
  <div class="products">
    {#each products as product}
      <div class="product" class:mobile>
        <div class="delete-button">
          <Button
            tooltipPosition="bottom"
            tooltipAlignment="end"
            iconDescription="상품 삭제"
            icon={TrashCan16}
            kind="danger"
            on:click={() => deleteProduct(product)}
          />
        </div>
        <div class="image">
          <img src={product.images[0]} alt="img" />
        </div>
        <div
          class="info"
          on:click={() =>
            (window.location.href = "/timedeals/" + timedeal.id + "/products/" + product.id)}
        >
          <Tag>{product.brand.keyname}</Tag>
          <p>{product.brand.korname}</p>
          <h6>{product.name}</h6>
          {#if product.inventory.reduce((prev, curr) => prev + curr.quantity, 0) === 0}
            <Tag type="red">⚠️ 재고없음</Tag>
          {/if}
          {#each product.inventory as inventory}
            <Tag type="blue">{inventory.size} - {inventory.quantity} EA</Tag>
          {/each}
          {#if product.templateId}
            <Tag type="green">📋 템플릿연동</Tag>
          {/if}
        </div>
      </div>
    {/each}
  </div>
</TabContent>

<style>
  .products {
    display: flex;
    flex-wrap: wrap;
    flex-direction: row;
  }

  .product {
    position: relative;
    margin: 10px;
    width: 240px;
    background-color: white;
    -webkit-box-shadow: 3px 3px 10px -5px rgba(0, 0, 0, 0.4);
    -moz-box-shadow: 3px 3px 10px -5px rgba(0, 0, 0, 0.4);
    box-shadow: 3px 3px 10px -5px rgba(0, 0, 0, 0.4);
    border-radius: 10px;
    overflow: hidden;
  }

  .product:first-of-type {
    margin-left: 0;
  }

  .product.mobile {
    margin-left: 0;
    margin-right: 0;
    width: 100%;
  }

  .product > .delete-button {
    position: absolute;
    top: 10px;
    right: 10px;
  }

  .product > .image {
    height: 200px;
  }

  .product > .image > img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .product > .info {
    padding: 10px;
  }

  .product > .info > p {
    font-size: 10px;
  }

  .button-wrapper {
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
  }
</style>

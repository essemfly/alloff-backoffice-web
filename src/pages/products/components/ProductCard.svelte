<script lang="ts">
  import { Button, Tag } from "carbon-components-svelte";
  import TrashCan16 from "carbon-icons-svelte/lib/TrashCan16";
  import { navigate } from "svelte-navigator";

  // dummys
  import { Product } from "../samples/response";

  export let product: Product;

  const handleDeleteClick = async () => {};

  const handleCardClick = (event: MouseEvent) => {
    event.preventDefault();
    navigate(`/products/${product.productId}`);
  };

  // const deleteProduct = async (product: TimedealProduct) => {
  //   if (!confirm("다음의 상품을 삭제합니다. : " + product.name)) return;
  //   submitting = true;
  //   try {
  //     await productApi.timedealProductsDestroy({ id: product.id });
  //   } catch (e: any) {
  //     alert("상품 삭제 중 오류가 발생했습니다!");
  //   } finally {
  //     submitting = false;
  //     load();
  //   }
  // };
</script>

<div class="product" on:click={handleCardClick}>
  <div class="delete-button">
    <Button
      tooltipPosition="bottom"
      tooltipAlignment="end"
      iconDescription="상품 삭제"
      icon={TrashCan16}
      kind="danger"
      on:click={handleDeleteClick}
    />
  </div>
  <div class="image">
    <!-- todo: replace this to served data -->
    <!-- <img src={product.images[0]} alt="img" /> -->
    <img
      src={`https://picsum.photos/300/200?random=${product.productId}`}
      alt={[product.brandKeyName, product.alloffName].join("-")}
    />
  </div>
  <div class="info">
    <Tag>{product.brandKeyName}</Tag>
    <p>{product.brandKorName}</p>
    <h6>{product.alloffName}</h6>
    {#if product.inventory?.reduce((prev, curr) => prev + curr.quantity, 0) === 0}
      <Tag type="red">⚠️ 재고없음</Tag>
    {/if}
    {#each product.inventory as inventory}
      <Tag type="blue">{inventory.size} - {inventory.quantity} EA</Tag>
    {/each}
  </div>
</div>

<style>
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
    transition: box-shadow 0.3s ease-in-out;
  }

  .product:hover {
    cursor: pointer;
    -webkit-box-shadow: 3px 3px 10px -5px rgba(0, 0, 0, 0.8);
    -moz-box-shadow: 3px 3px 10px -5px rgba(0, 0, 0, 0.8);
    box-shadow: 3px 3px 10px -5px rgba(0, 0, 0, 0.8);
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
</style>

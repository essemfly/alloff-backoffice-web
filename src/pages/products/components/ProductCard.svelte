<script lang="ts">
  import { Button, Tag } from "carbon-components-svelte";
  import TrashCan16 from "carbon-icons-svelte/lib/TrashCan16";
  import { navigate } from "svelte-navigator";
  import { Product, ProductsApi } from "../../../api";

  export let product: Product;
  const productApi = new ProductsApi();

  const handleCardClick = (event: MouseEvent) => {
    event.preventDefault();
    navigate(`/products/${product.product_id}`);
  };

  const handleDeleteClick = async () => {
    // todo: remove api
    // productApi.productsUpdate
  };

  console.log(product);
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
    <img
      src={product.images[0]}
      alt={[product.brand_kor_name, product.alloff_name].join("-")}
    />
  </div>
  <div class="info">
    <p>{product.brand_kor_name}</p>
    <h6>{product.alloff_name}</h6>
    {#if product.inventory.reduce((prev, curr) => prev + curr.quantity, 0) === 0}
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

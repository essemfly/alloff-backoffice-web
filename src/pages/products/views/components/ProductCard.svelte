<script lang="ts">
  import { toast } from "@zerodevx/svelte-toast";
  import { navigate } from "svelte-navigator";
  import {
    Button,
    Tag,
    StructuredList,
    StructuredListRow,
    StructuredListCell,
    StructuredListBody,
    Modal,
  } from "carbon-components-svelte";
  import TrashCan16 from "carbon-icons-svelte/lib/TrashCan16";

  import { Product, ProductsApi, EditProductRequestRequest } from "@api";

  export let product: Product;

  const productApi = new ProductsApi();

  let open = false;

  const handleCardClick = (event: MouseEvent) => {
    event.preventDefault();
    navigate(`/products/${product.alloff_product_id}`);
  };

  const handleDeleteClick = async (event: MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    handleModalToggle(true);
  };

  const handleDeleteSubmit = async () => {
    // todo: integrate remove api
    try {
      const res = await productApi.productsUpdate({
        id: product.alloff_product_id,
        editProductRequestApiRequest: {
          ...product,
          is_removed: true,
        } as unknown as EditProductRequestRequest,
      });
      toast.push("상품이 삭제되었습니다.");
      handleModalToggle(false);
      window.location.reload();
    } catch (e) {
      toast.push(`상품 삭제에 오류가 발생했습니다.`);
    }
  };

  const handleModalToggle = (value: boolean) => {
    open = value;
  };

  const handleModalClose = () => handleModalToggle(false);
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
  </div>
  <StructuredList condensed>
    <StructuredListBody>
      {#each product.inventory as inventory}
        <StructuredListRow>
          <StructuredListCell noWrap>{inventory.size}</StructuredListCell>
          <StructuredListCell>{inventory.quantity} EA</StructuredListCell>
        </StructuredListRow>
      {/each}
    </StructuredListBody>
  </StructuredList>
</div>

<Modal
  danger
  bind:open
  modalHeading={"상품 삭제"}
  primaryButtonText="삭제"
  secondaryButtonText="삭제 취소"
  on:click:button--secondary={handleModalClose}
  on:close={handleModalClose}
  on:submit={handleDeleteSubmit}
>
  <p>{product.alloff_name} 상품을 삭제합니다</p>
</Modal>

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
    height: 70px;
  }

  .product > .info > p {
    font-size: 10px;
  }

  .product :global(.bx--structured-list) {
    margin-bottom: 0px;
  }
</style>

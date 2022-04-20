<script lang="ts">
  import { Product } from "@lessbutter/alloff-backoffice-api";
  import { toast } from "@zerodevx/svelte-toast";
  import { navigate } from "svelte-navigator";
  import {
    Button,
    Modal,
    StructuredList,
    StructuredListBody,
    StructuredListCell,
    StructuredListRow,
    Tag,
    ClickableTile,
  } from "carbon-components-svelte";
  import Share16 from "carbon-icons-svelte/lib/Share16";
  import TrashCan16 from "carbon-icons-svelte/lib/TrashCan16";

  import ProductCategoryClassifiedTag from "./ProductCategoryClassifiedTag.svelte";
  import { useProductService } from "../../ProductService";

  const productService = useProductService();

  export let product: Product;

  let open = false;

  const handleCardClick = (event: MouseEvent) => {
    event.preventDefault();
    navigate(`/products/${product.alloff_product_id}`);
  };

  const handleDeeplinkClick = async (event: MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    const shortLink = await productService.getDeeplink(
      product.alloff_product_id,
    );
    navigator.clipboard.writeText(shortLink);
    toast.push(`딥링크를 복사했습니다! (${product.alloff_name})`);
  };

  const handleDeleteClick = async (event: MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    handleModalToggle(true);
  };

  const handleDeleteSubmit = async () => {
    try {
      await productService.patch(product.alloff_product_id, {
        is_removed: true,
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

<ClickableTile on:click={handleCardClick}>
  <div class="product">
    <div class="button-wrapper">
      <Button
        tooltipPosition="bottom"
        tooltipAlignment="end"
        iconDescription="딥링크 복사"
        icon={Share16}
        kind="tertiary"
        size="small"
        on:click={handleDeeplinkClick}
      />
      <Button
        tooltipPosition="bottom"
        tooltipAlignment="end"
        iconDescription="상품 삭제"
        icon={TrashCan16}
        kind="danger"
        size="small"
        on:click={handleDeleteClick}
      />
    </div>
    <div class="image">
      <img
        src={product.thumbnail_image !== ""
          ? product.thumbnail_image
          : product.images[0]}
        alt={[product.brand_kor_name, product.alloff_name].join("-")}
      />
    </div>
    <div class="info">
      <p style="font-weight: bold;">{product.brand_kor_name}</p>
      <p>
        {product.alloff_category_name}
        <ProductCategoryClassifiedTag
          isClassifiedTouched={product.is_classified_touched}
          isClassifiedDone={product.is_classified_done}
        />
      </p>
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
</ClickableTile>

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
    overflow: hidden;
  }

  .product > .button-wrapper {
    position: absolute;
    top: 10px;
    right: 10px;
    display: flex;
    flex-direction: column;
  }

  .product > .button-wrapper :global(button) {
    margin-bottom: 4px;
  }

  .product > .image {
    height: 200px;
    padding-bottom: 10px;
  }

  .product > .image > img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .product > .info > p {
    font-size: 12px;
  }

  .product :global(.bx--structured-list) {
    margin-bottom: 0px;
  }

  :global(.bx--tile) {
    padding: 10px;
    height: 100%;
  }
</style>

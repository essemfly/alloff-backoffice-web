<script lang="ts">
  import { onMount } from "svelte";
  import {
    Row,
    Button,
    StructuredList,
    StructuredListRow,
    StructuredListCell,
    StructuredListBody,
    StructuredListHead,
    NumberInput,
    StructuredListInput,
    FormGroup,
  } from "carbon-components-svelte";
  import TrashCan16 from "carbon-icons-svelte/lib/TrashCan16";
  import Launch16 from "carbon-icons-svelte/lib/Launch16";

  import { Product, ProductInGroup } from "@api";
  import { TextField } from "@app/components/form";
  import ProductSearchSection from "@app/components/ProductSearchSection.svelte";

  import { sectionSchema, sectionFormStore } from "../../models/schema";

  export let productInGroups: ProductInGroup[] = [];
  export let isAdding: boolean = false;

  let selectedProductInGroup: ProductInGroup[] = [];

  onMount(() => {
    sectionFormStore.initialize();
  });

  const handleProductSelect = (event: CustomEvent<Product>) => {
    const newProduct = {
      product: event.detail,
      priority: 0,
    };
    selectedProductInGroup = [...selectedProductInGroup, newProduct];
    if (isAdding) {
      productInGroups = selectedProductInGroup;
    }
  };

  const handleProductDeselect = (index: number) => () => {
    selectedProductInGroup.splice(index, 1);
    selectedProductInGroup = selectedProductInGroup;
    if (isAdding) {
      productInGroups = selectedProductInGroup;
    }
  };

  const handleProductDetailOpen = (productId: string) => () => {
    window.open(`/products/${productId}`, "_blank"); // todo: not use window.open
  };
</script>

<FormGroup>
  <TextField
    schema={sectionSchema.fields.title.label("섹션 타이틀")}
    bind:value={$sectionFormStore.fields.title}
    errorText={$sectionFormStore.errors.title}
  />
</FormGroup>

<ProductSearchSection on:select={handleProductSelect} />
<h4>선택된 상품 목록</h4>
<div class="product-list">
  <StructuredList condensed flush>
    <StructuredListHead>
      <StructuredListRow head>
        <StructuredListCell head>썸네일</StructuredListCell>
        <StructuredListCell head>브랜드</StructuredListCell>
        <StructuredListCell head>제품명</StructuredListCell>
        <StructuredListCell head>재고</StructuredListCell>
        <StructuredListCell head>가격</StructuredListCell>
        <StructuredListCell head>우선순위 (낮을수록 상단)</StructuredListCell>
        <StructuredListCell head>Actions</StructuredListCell>
      </StructuredListRow>
    </StructuredListHead>
    <StructuredListBody>
      {#each selectedProductInGroup as { product, priority }, index}
        <StructuredListRow>
          <StructuredListInput value={product.alloff_product_id} />
          <StructuredListCell>
            <img
              class="cell_image"
              src={product.thumbnail_image !== ""
                ? product.thumbnail_image
                : product.images[0]}
              alt={["product_preview", product.alloff_name].join("-")}
            />
            {#if product.images.length > 1}
              <img
                class="cell_image"
                src={product.images[1]}
                alt={["product_preview", product.alloff_name].join("-")}
              />
            {/if}
          </StructuredListCell>
          <StructuredListCell noWrap>
            {product.brand_kor_name}
          </StructuredListCell>
          <StructuredListCell noWrap>
            {product.alloff_name}
          </StructuredListCell>
          <StructuredListCell noWrap>
            {#each product.inventory as inv}
              <Row padding>
                {inv.size} : {inv.quantity}개
              </Row>
            {/each}
          </StructuredListCell>
          <StructuredListCell noWrap>
            {product.original_price} -> {product.discounted_price} ({(
              ((product.original_price - product.discounted_price) /
                product.original_price) *
              100
            ).toFixed(0)}%)
          </StructuredListCell>
          <StructuredListCell class="product-list-number">
            <NumberInput bind:value={priority} />
          </StructuredListCell>
          <StructuredListCell>
            <Row padding>
              <Button
                tooltipPosition="bottom"
                tooltipAlignment="end"
                iconDescription="상품 상세"
                icon={Launch16}
                kind="ghost"
                size="small"
                on:click={handleProductDetailOpen(product.alloff_product_id)}
              />
              <Button
                tooltipPosition="bottom"
                tooltipAlignment="end"
                iconDescription="상품 삭제"
                icon={TrashCan16}
                kind="danger"
                size="small"
                on:click={handleProductDeselect(index)}
              />
            </Row>
          </StructuredListCell>
        </StructuredListRow>
      {/each}
    </StructuredListBody>
  </StructuredList>
</div>

<style>
  :global(.bx--structured-list-td) {
    vertical-align: top;
  }

  :global(.product-list-number) :global(.bx--number) {
    max-width: 180px;
  }

  .cell_image {
    width: 80px;
    height: 80px;
    object-fit: cover;
  }

  :global(.search-wrapper.bx--row) {
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    align-items: flex-end;
    margin-bottom: 10px;
  }

  .product-list {
    max-height: 300px;
    overflow-y: auto;
  }
</style>

<script lang="ts">
  import { createEventDispatcher, onMount } from "svelte";
  import {
    Row,
    Column,
    StructuredList,
    StructuredListHead,
    StructuredListRow,
    StructuredListCell,
    StructuredListBody,
    Button,
    Search,
    Content,
  } from "carbon-components-svelte";
  import TrashCan16 from "carbon-icons-svelte/lib/TrashCan16";
  import Launch16 from "carbon-icons-svelte/lib/Launch16";

  import { Product, ProductsApi, ItemTypeEnum, OptionsEnum } from "@api";
  import { Autocomplete, AutocompleteItem } from "@app/components/autocomplete";
  import BrandSelect from "@app/components/BrandSelect.svelte";
  import ContentBox from "@app/components/ContentBox.svelte";

  import { HometabItemType } from "../../constants";

  interface HometabExhibitionsSectionValue {
    products: Product[];
    options: OptionsEnum[];
  }

  export let value: HometabExhibitionsSectionValue;
  export let isAdding: boolean = false;

  let products: Product[] = [];
  let filteredProducts: Product[] = [];
  let selectedProducts: Product[] = [];
  let selectedBrandId = "";
  let productSearchQuery = "";
  let selectedProductIds: string[] = [];

  const dispatch = createEventDispatcher();
  const productApi = new ProductsApi();

  onMount(async () => {
    selectedProducts = value.products ?? [];
  });

  const handleBrandChange = (
    event: CustomEvent<{ value?: AutocompleteItem }>,
  ) => {
    selectedBrandId = event.detail.value?.key ?? "";
  };

  const handleProductSearch = async () => {
    const res = await productApi.productsList({
      searchQuery: productSearchQuery ?? "",
      brandId: selectedBrandId ?? "",
    });
    products = res.data.products;
    filteredProducts = products.filter(
      ({ alloff_product_id }) =>
        !selectedProductIds.includes(alloff_product_id),
    );
  };

  const handleProductSelect = (selectedItem: Product) => (event: any) => {
    selectedProducts = [...selectedProducts, selectedItem];
    selectedProductIds = selectedProducts.map(
      ({ alloff_product_id }) => alloff_product_id,
    );
    filteredProducts = products.filter(
      ({ alloff_product_id }) =>
        !selectedProductIds.includes(alloff_product_id),
    );
  };

  const handleProductDeselect = (index: number) => () => {
    selectedProducts.splice(index, 1);
    selectedProducts = selectedProducts;
  };

  const handleProductDetailOpen = (productId: string) => () => {
    window.open(`/products/${productId}`, "_blank"); // todo: not use window.open
  };

  $: if (selectedProducts) {
    dispatch("change", {
      item_type: ItemTypeEnum.ProductsA,
      product_ids: selectedProductIds,
    });
  }
</script>

<ContentBox title={`${HometabItemType.ProductsA} 정보`}>
  <Row>
    <Column>
      <h4>상품 검색 결과</h4>
      <div class="product-list">
        <StructuredList condensed selection flush>
          <StructuredListHead>
            <StructuredListRow head>
              <StructuredListCell head>썸네일</StructuredListCell>
              <StructuredListCell head>브랜드</StructuredListCell>
              <StructuredListCell head>제품명</StructuredListCell>
              <StructuredListCell head>Actions</StructuredListCell>
            </StructuredListRow>
          </StructuredListHead>
          <StructuredListBody>
            {#each filteredProducts as product}
              <StructuredListRow on:click={handleProductSelect(product)}>
                <StructuredListCell>
                  <img
                    class="cell_image"
                    src={product.images[0]}
                    alt={["product_preview", product.alloff_name].join("-")}
                  />
                </StructuredListCell>
                <StructuredListCell noWrap>
                  {product.brand_kor_name}
                </StructuredListCell>
                <StructuredListCell>
                  {product.alloff_category_name}
                </StructuredListCell>
                <StructuredListCell noWrap>
                  {product.alloff_name}
                </StructuredListCell>
                <StructuredListCell>
                  <Row>
                    <Button
                      tooltipPosition="bottom"
                      tooltipAlignment="end"
                      iconDescription="상품 상세"
                      icon={Launch16}
                      kind="ghost"
                      size="small"
                      on:click={handleProductDetailOpen(
                        product.alloff_product_id,
                      )}
                    />
                  </Row>
                </StructuredListCell>
              </StructuredListRow>
            {/each}
          </StructuredListBody>
        </StructuredList>
      </div>
    </Column>
  </Row>
</ContentBox>
<ContentBox title="상품 추가">
  <h4>상품 추가</h4>
  <Row class="search-wrapper">
    <Column sm={1}>
      <div class="bx--label">브랜드</div>
      <BrandSelect on:change={handleBrandChange} />
    </Column>
    <Column sm={2}>
      <div class="bx--label">상품 검색</div>
      <Search bind:value={productSearchQuery} placeholder="상품 이름 검색" />
    </Column>
    <Column sm={1}>
      <Button on:click={handleProductSearch}>상품 검색</Button>
    </Column>
  </Row>

  <Row>
    <Column>
      <h4>상품 검색 결과</h4>
      <div class="product-list">
        <StructuredList condensed selection flush>
          <StructuredListHead>
            <StructuredListRow head>
              <StructuredListCell head>썸네일</StructuredListCell>
              <StructuredListCell head>브랜드</StructuredListCell>
              <StructuredListCell head>제품명</StructuredListCell>
              <StructuredListCell head>Actions</StructuredListCell>
            </StructuredListRow>
          </StructuredListHead>
          <StructuredListBody>
            {#each filteredProducts as product}
              <StructuredListRow on:click={handleProductSelect(product)}>
                <StructuredListCell>
                  <img
                    class="cell_image"
                    src={product.images[0]}
                    alt={["product_preview", product.alloff_name].join("-")}
                  />
                </StructuredListCell>
                <StructuredListCell noWrap>
                  {product.brand_kor_name}
                </StructuredListCell>
                <StructuredListCell>
                  {product.alloff_category_name}
                </StructuredListCell>
                <StructuredListCell noWrap>
                  {product.alloff_name}
                </StructuredListCell>
                <StructuredListCell>
                  <Row>
                    <Button
                      tooltipPosition="bottom"
                      tooltipAlignment="end"
                      iconDescription="상품 상세"
                      icon={Launch16}
                      kind="ghost"
                      size="small"
                      on:click={handleProductDetailOpen(
                        product.alloff_product_id,
                      )}
                    />
                  </Row>
                </StructuredListCell>
              </StructuredListRow>
            {/each}
          </StructuredListBody>
        </StructuredList>
      </div>
    </Column>
  </Row>

  <Row>
    <Column>
      <h4>선택된 상품 목록</h4>
      <div class="product-list">
        <StructuredList condensed>
          <StructuredListHead>
            <StructuredListRow head>
              <StructuredListCell head>썸네일</StructuredListCell>
              <StructuredListCell head>브랜드</StructuredListCell>
              <StructuredListCell head>제품명</StructuredListCell>
              <StructuredListCell head>Actions</StructuredListCell>
            </StructuredListRow>
          </StructuredListHead>
          <StructuredListBody>
            {#each selectedProducts as product, index}
              <StructuredListRow>
                <StructuredListCell>
                  <img
                    class="cell_image"
                    src={product.images[0]}
                    alt={["product_preview", product.alloff_name].join("-")}
                  />
                </StructuredListCell>
                <StructuredListCell noWrap>
                  {product.brand_kor_name}
                </StructuredListCell>
                <StructuredListCell noWrap>
                  {product.alloff_name}
                </StructuredListCell>
                <StructuredListCell>
                  <Row>
                    <Button
                      tooltipPosition="bottom"
                      tooltipAlignment="end"
                      iconDescription="상품 상세"
                      icon={Launch16}
                      kind="ghost"
                      size="small"
                      on:click={handleProductDetailOpen(
                        product.alloff_product_id,
                      )}
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
    </Column>
  </Row>
</ContentBox>

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

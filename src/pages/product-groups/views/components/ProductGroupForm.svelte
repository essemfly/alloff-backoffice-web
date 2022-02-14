<script lang="ts">
  import { debounce } from "lodash";
  import { onMount } from "svelte";
  import {
    Row,
    Column,
    Button,
    TextInput,
    StructuredList,
    StructuredListRow,
    StructuredListCell,
    StructuredListBody,
    StructuredListHead,
    Search,
    NumberInput,
    StructuredListInput,
  } from "carbon-components-svelte";
  import TrashCan16 from "carbon-icons-svelte/lib/TrashCan16";
  import Launch16 from "carbon-icons-svelte/lib/Launch16";

  import {
    ProductGroup,
    ProductsApi,
    ProductGroupsApi,
    ProductInGroup,
    ListProductResult,
    Product,
  } from "@api";
  import { AutocompleteItem } from "@app/components/autocomplete";
  import MultilineTextInput from "@app/components/MultilineTextInput.svelte";
  import ContentBox from "@app/components/ContentBox.svelte";
  import DateTimePicker from "@app/components/DateTimePicker.svelte";
  import ImageUploadField from "@app/components/ImageUploadField.svelte";
  import BrandSelect from "@app/components/BrandSelect.svelte";

  const productGroupApi = new ProductGroupsApi();
  const productApi = new ProductsApi();

  export let form: ProductGroup;
  export let isAdding: boolean = false;

  interface SelectedProductInGroup {
    product: Product;
    priority: number;
  }

  let expanded = false;
  let images: string[] = [];
  let productResult: Product[] = [];
  let filteredProductResult: Product[] = [];

  let selectedProductInGroup: SelectedProductInGroup[] = [];
  let selectedProductIds: string[] = [];

  let filteredProductInGroup: ProductInGroup[] = form.products;

  let productInGroupQuery = "";
  let productSearchQuery = "";
  let productSearchResultQuery = "";
  let selectedBrandId = "";

  onMount(async () => {
    if (form.image_url) {
      images = [form.image_url];
    }
  });

  $: if (images.length > 0) {
    form.image_url = images[0];
  }

  const handleProductSelect = (selectedItem: Product) => (event: any) => {
    const newProduct = {
      product: selectedItem,
      priority: 0,
    };
    selectedProductInGroup = [...selectedProductInGroup, newProduct];
    selectedProductIds = selectedProductInGroup.map(
      ({ product }) => product.alloff_product_id,
    );
    filteredProductResult = productResult.filter(
      ({ alloff_product_id }) =>
        !selectedProductIds.includes(alloff_product_id),
    );
    if (isAdding) {
      form.products = selectedProductInGroup;
    }
  };

  const handleProductDeselect = (index: number) => () => {
    selectedProductInGroup.splice(index, 1);
    selectedProductInGroup = selectedProductInGroup;
  };

  const handleBrandChange = (
    event: CustomEvent<{ value?: AutocompleteItem }>,
  ) => {
    selectedBrandId = event.detail.value?.key ?? "";
  };

  const handleAddProductSubmit = async () => {
    const res = await productGroupApi.productGroupsPushProductsCreate({
      id: form.product_group_id,
      pushProductsRequest: {
        product_group_id: form.product_group_id,
        product_priority: selectedProductInGroup.map(
          ({ product, priority }) => ({
            product_id: product.alloff_product_id,
            priority,
          }),
        ),
      },
    });
    form.products = res.data.products;

    productResult = [];
    filteredProductResult = [];
    selectedProductInGroup = [];
    selectedProductIds = [];
    productInGroupQuery = "";
    productSearchQuery = "";
    productSearchResultQuery = "";
    selectedBrandId = "";
  };

  const handleProductDetailOpen = (productId: string) => () => {
    window.open(`/products/${productId}`, "_blank"); // todo: not use window.open
  };

  const handleDeleteProductFromGroup = (productId: string) => async () => {
    const res = await productGroupApi.productGroupsRemoveProductCreate({
      id: form.product_group_id,
      removeProductInProductGroupRequest: {
        product_group_id: form.product_group_id,
        product_id: productId,
      },
    });
    form.products = res.data.products;
  };

  const handleProductInGroupFilter = debounce((event: Event) => {
    productInGroupFiltering((event.target as HTMLInputElement)?.value ?? "");
  }, 300);

  const productInGroupFiltering = (value: string) => {
    filteredProductInGroup = form.products.filter(
      ({ product }) =>
        product.brand_kor_name.toLocaleLowerCase().includes(value) ||
        product.alloff_name.toLocaleLowerCase().includes(value),
    );
    productInGroupQuery = value;
  };

  const handleProductSearch = async () => {
    const res = await productApi.productsList({
      searchQuery: productSearchQuery ?? "",
      brandId: selectedBrandId ?? "",
    });
    productResult = (res.data as unknown as ListProductResult).products;
    filteredProductResult = productResult.filter(
      ({ alloff_product_id }) =>
        !selectedProductIds.includes(alloff_product_id),
    );
  };

  const handleProductSearchResultFilter = debounce((event: Event) => {
    productSearchResultFiltering(
      (event.target as HTMLInputElement)?.value ?? "",
    );
  }, 300);

  const productSearchResultFiltering = (value: string) => {
    filteredProductResult = productResult.filter(
      (product) =>
        product.brand_kor_name.toLocaleLowerCase().includes(value) ||
        product.alloff_name.toLocaleLowerCase().includes(value),
    );
    productSearchResultQuery = value;
  };

  $: if (form.products) {
    productInGroupFiltering(productInGroupQuery);
  }
</script>

<ContentBox>
  <h3>컬렉션 정보</h3>
  <Row>
    <Column>
      <ImageUploadField label={"대표 이미지"} bind:value={images} />
    </Column>
  </Row>
  <Row>
    <Column>
      <TextInput labelText={"타이틀"} bind:value={form.title} />
    </Column>
  </Row>
  <Row>
    <Column>
      <TextInput labelText={"짧은 타이틀"} bind:value={form.short_title} />
    </Column>
  </Row>
  <Row>
    <Column>
      <MultilineTextInput label="설명" bind:value={form.instruction} />
    </Column>
  </Row>
  <Row>
    <Column>
      <DateTimePicker label={"시작일"} bind:value={form.start_time} />
    </Column>
    <Column>
      <DateTimePicker label={"종료일"} bind:value={form.finish_time} />
    </Column>
  </Row>
</ContentBox>
{#if !isAdding}
  <ContentBox>
    <h3>상품 목록</h3>
    <Row>
      <Column>
        <Search
          placeholder="상품 목록의 상품 검색"
          value={productInGroupQuery}
          on:input={handleProductInGroupFilter}
          on:clear={handleProductInGroupFilter}
        />
        <StructuredList condensed>
          <StructuredListHead>
            <StructuredListRow head>
              <StructuredListCell head>썸네일</StructuredListCell>
              <StructuredListCell head>브랜드</StructuredListCell>
              <StructuredListCell head>제품명</StructuredListCell>
              <StructuredListCell head>
                우선순위 (낮을수록 상단)
              </StructuredListCell>
              <StructuredListCell head>Actions</StructuredListCell>
            </StructuredListRow>
          </StructuredListHead>
          <StructuredListBody>
            {#each filteredProductInGroup as product}
              <StructuredListRow>
                <StructuredListCell>
                  <img
                    class="cell_image"
                    src={product.product.images[0]}
                    alt={["product_preview", product.product.alloff_name].join(
                      "-",
                    )}
                  />
                </StructuredListCell>
                <StructuredListCell noWrap>
                  {product.product.brand_kor_name}
                </StructuredListCell>
                <StructuredListCell noWrap>
                  {product.product.alloff_name}
                </StructuredListCell>
                <StructuredListCell>
                  {product.priority}
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
                        product.product.alloff_product_id,
                      )}
                    />
                    <Button
                      tooltipPosition="bottom"
                      tooltipAlignment="end"
                      iconDescription="상품 삭제"
                      icon={TrashCan16}
                      kind="danger"
                      size="small"
                      on:click={handleDeleteProductFromGroup(
                        product.product.alloff_product_id,
                      )}
                    />
                  </Row>
                </StructuredListCell>
              </StructuredListRow>
            {/each}
          </StructuredListBody>
        </StructuredList>
      </Column>
    </Row>
  </ContentBox>
{/if}

<ContentBox>
  <h3>상품 추가</h3>
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
      <div class="button-wrapper">
        <Search
          value={productSearchResultQuery}
          on:input={handleProductSearchResultFilter}
          on:clear={handleProductSearchResultFilter}
          size="sm"
          placeholder="검색결과 내 검색"
          expandable
          bind:expanded
          on:expand
          on:collapse
        />
      </div>
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
            {#each filteredProductResult as product}
              <StructuredListRow on:click={handleProductSelect(product)}>
                <StructuredListInput value={product.alloff_product_id} />
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
              <StructuredListCell head>
                우선순위 (낮을수록 상단)
              </StructuredListCell>
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
                <StructuredListCell class="product-list-number">
                  <NumberInput bind:value={priority} />
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

      {#if !isAdding}
        <div class="button-wrapper">
          <Button
            on:click={handleAddProductSubmit}
            disabled={selectedProductInGroup.length === 0}>컬렉션에 저장</Button
          >
        </div>
      {/if}
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

  .button-wrapper {
    margin-top: 10px;
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
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

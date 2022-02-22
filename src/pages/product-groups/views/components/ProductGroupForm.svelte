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
    Product,
    GroupTypeEnum,
  } from "@api";
  import MultilineTextInput from "@app/components/MultilineTextInput.svelte";
  import ContentBox from "@app/components/ContentBox.svelte";
  import DateTimePicker from "@app/components/DateTimePicker.svelte";
  import ImageUploadField from "@app/components/ImageUploadField.svelte";
  import ProductSearchSection from "@app/components/ProductSearchSection.svelte";

  const productGroupApi = new ProductGroupsApi();

  export let form: ProductGroup;
  export let label: string = "컬렉션";
  export let isAdding: boolean = false;

  interface SelectedProductInGroup {
    product: Product;
    priority: number;
  }

  let images: string[] = [];
  let selectedProductInGroup: SelectedProductInGroup[] = [];
  let productInGroupQuery = "";
  let filteredProductInGroup: ProductInGroup[] = form.products;

  onMount(async () => {
    if (form.image_url) {
      images = [form.image_url];
    }
  });

  const handleProductSelect = (event: CustomEvent<Product>) => {
    const newProduct = {
      product: event.detail,
      priority: 0,
    };
    selectedProductInGroup = [...selectedProductInGroup, newProduct];
    if (isAdding) {
      form.products = selectedProductInGroup;
    }
  };

  const handleProductDeselect = (index: number) => () => {
    selectedProductInGroup.splice(index, 1);
    selectedProductInGroup = selectedProductInGroup;
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

    selectedProductInGroup = [];
    productInGroupQuery = "";
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

  $: if (images.length > 0) {
    form.image_url = images[0];
  }

  $: if (form.products) {
    productInGroupFiltering(productInGroupQuery);
  }
</script>

<ContentBox title={`${label} 정보`}>
  {#if form.group_type === GroupTypeEnum.Timedeal}
    <Row padding>
      <Column>
        <ImageUploadField label={"대표 이미지"} bind:value={form.image_url} />
      </Column>
    </Row>
  {/if}
  <Row padding>
    <Column>
      <TextInput labelText={"타이틀"} bind:value={form.title} />
    </Column>
  </Row>
  <Row padding>
    <Column>
      <TextInput labelText={"짧은 타이틀"} bind:value={form.short_title} />
    </Column>
  </Row>
  <Row padding>
    <Column>
      <MultilineTextInput label="설명" bind:value={form.instruction} />
    </Column>
  </Row>
  {#if form.group_type === GroupTypeEnum.Timedeal}
    <Row padding>
      <Column>
        <DateTimePicker label={"시작일"} bind:value={form.start_time} />
      </Column>
      <Column>
        <DateTimePicker label={"종료일"} bind:value={form.finish_time} />
      </Column>
    </Row>
  {/if}
</ContentBox>
{#if !isAdding}
  <ContentBox>
    <h3>상품 목록</h3>
    <Row padding>
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
                  <Row padding>
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

<ContentBox subtitle="상품 추가">
  <ProductSearchSection on:select={handleProductSelect} />

  <Row padding>
    <Column>
      <h4>선택된 상품 목록</h4>
      <div class="product-list">
        <StructuredList condensed>
          <StructuredListHead>
            <StructuredListRow head>
              <StructuredListCell head>썸네일</StructuredListCell>
              <StructuredListCell head>브랜드</StructuredListCell>
              <StructuredListCell head>제품명</StructuredListCell>
              <StructuredListCell head>재고</StructuredListCell>
              <StructuredListCell head>가격</StructuredListCell>
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
    width: 200px;
    height: 200px;
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
    max-height: 800px;
    overflow-y: auto;
    margin-bottom: 50px;
  }
</style>

<script lang="ts">
  import { debounce } from "lodash";
  import { toast } from "@zerodevx/svelte-toast";
  import { onMount } from "svelte";
  import {
    Row,
    Column,
    Button,
    StructuredList,
    StructuredListRow,
    StructuredListCell,
    StructuredListBody,
    StructuredListHead,
    Search,
    NumberInput,
    StructuredListInput,
    FormGroup,
  } from "carbon-components-svelte";
  import TrashCan16 from "carbon-icons-svelte/lib/TrashCan16";
  import Launch16 from "carbon-icons-svelte/lib/Launch16";

  import {
    ProductGroupsApi,
    ProductInGroup,
    Product,
    GroupTypeEnum,
  } from "@api";
  import ContentBox from "@app/components/ContentBox.svelte";
  import Dot from "@app/components/Dot.svelte";
  import ProductSearchSection from "@app/components/ProductSearchSection.svelte";
  import {
    DateTimeField,
    ImageUploadField,
    MultilineTextField,
    TextField,
  } from "@app/components/form";

  import { formStore, schema } from "../../models/schema";

  const productGroupApi = new ProductGroupsApi();

  export let label: string = "컬렉션";
  export let productInGroups: ProductInGroup[] = [];
  export let isAdding: boolean = false;

  let productInGroupQuery = "";
  let selectedProductInGroup: ProductInGroup[] = [];
  let filteredProductInGroup: ProductInGroup[] = [];
  let isSubmitting: boolean = false;

  onMount(() => {
    filteredProductInGroup = productInGroups;
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

  const handleAddProductSubmit = async () => {
    if (isSubmitting) {
      return;
    }
    try {
      isSubmitting = true;
      const res = await productGroupApi.productGroupsPushProductsCreate({
        id: $formStore.fields.productGroupId,
        pushProductsRequest: {
          product_group_id: $formStore.fields.productGroupId,
          product_priority: selectedProductInGroup.map(
            ({ product, priority }) => ({
              product_id: product.alloff_product_id,
              priority,
            }),
          ),
        },
      });
      productInGroups = res.data.products;
      selectedProductInGroup = [];
      productInGroupQuery = "";
    } catch (e) {
      toast.push("상품 목록 수정이 실패했습니다.");
    } finally {
      isSubmitting = false;
    }
  };

  const handleProductDetailOpen = (productId: string) => () => {
    window.open(`/products/${productId}`, "_blank"); // todo: not use window.open
  };

  const handleDeleteProductFromGroup = (productId: string) => async () => {
    if (isSubmitting) {
      return;
    }
    try {
      isSubmitting = true;
      const res = await productGroupApi.productGroupsRemoveProductCreate({
        id: $formStore.fields.productGroupId,
        removeProductInProductGroupRequest: {
          product_group_id: $formStore.fields.productGroupId,
          product_id: productId,
        },
      });
      productInGroups = res.data.products;
    } catch (e) {
      toast.push("상품 목록 수정이 실패했습니다.");
    } finally {
      isSubmitting = false;
    }
  };

  const handleProductInGroupFilter = debounce((event: Event) => {
    productInGroupFiltering((event.target as HTMLInputElement)?.value ?? "");
  }, 300);

  const productInGroupFiltering = (value: string) => {
    filteredProductInGroup = productInGroups.filter(
      ({ product }) =>
        product.brand_kor_name.toLocaleLowerCase().includes(value) ||
        product.alloff_name.toLocaleLowerCase().includes(value),
    );
    productInGroupQuery = value;
  };

  $: if (productInGroups) {
    productInGroupFiltering(productInGroupQuery);
  }
</script>

<ContentBox title={`${label} 정보`}>
  <div class="button-right-wrapper">
    <Dot label="필수 입력 사항" />
  </div>

  {#if $formStore.fields.groupType === GroupTypeEnum.Timedeal}
    <FormGroup>
      <ImageUploadField
        schema={schema.fields.imageUrl.required()}
        bind:value={$formStore.fields.imageUrl}
        errorText={$formStore.errors.imageUrl}
      />
    </FormGroup>
  {/if}
  <FormGroup>
    <TextField
      schema={schema.fields.title}
      bind:value={$formStore.fields.title}
      errorText={$formStore.errors.title}
    />
  </FormGroup>
  <FormGroup>
    <TextField
      schema={schema.fields.shortTitle}
      bind:value={$formStore.fields.shortTitle}
      errorText={$formStore.errors.shortTitle}
    />
  </FormGroup>
  <FormGroup>
    <MultilineTextField
      schema={schema.fields.instruction}
      bind:value={$formStore.fields.instruction}
      errorText={$formStore.errors.instruction}
    />
  </FormGroup>

  {#if $formStore.fields.groupType === GroupTypeEnum.Timedeal}
    <Row padding>
      <Column>
        <DateTimeField
          schema={schema.fields.startTime}
          bind:value={$formStore.fields.startTime}
          errorText={$formStore.errors.startTime}
        />
      </Column>
      <Column>
        <DateTimeField
          schema={schema.fields.finishTime}
          bind:value={$formStore.fields.finishTime}
          errorText={$formStore.errors.finishTime}
        />
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
        {#if selectedProductInGroup.length === 0}
          <StructuredListRow>
            <StructuredListCell>선택된 상품이 없습니다.</StructuredListCell>
          </StructuredListRow>
        {/if}
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

  {#if !isAdding}
    <div class="button-wrapper">
      <Button
        on:click={handleAddProductSubmit}
        disabled={isSubmitting || selectedProductInGroup.length === 0}
      >
        컬렉션에 {isSubmitting ? "저장중..." : "저장"}
      </Button>
    </div>
  {/if}
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

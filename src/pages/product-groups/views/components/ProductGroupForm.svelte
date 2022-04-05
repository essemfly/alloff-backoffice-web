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
    StructuredListInput,
    Toggle,
    FormGroup,
  } from "carbon-components-svelte";
  import TrashCan16 from "carbon-icons-svelte/lib/TrashCan16";
  import Launch16 from "carbon-icons-svelte/lib/Launch16";
  import Save16 from "carbon-icons-svelte/lib/Save16";

  import {
    ProductGroupsApi,
    ProductInGroup,
    Product,
    GroupTypeEnum,
  } from "@api";
  import ContentBox from "@app/components/ContentBox.svelte";
  import Dot from "@app/components/Dot.svelte";
  import ProductSearchSection from "@app/components/ProductSearchSection.svelte";
  import SortButtonSet from "@app/components/SortButtonSet.svelte";
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

  let isEditProductList: boolean = false;
  let isEdited = false;
  let tempEditProducts: ProductInGroup[] = [];

  onMount(async () => {
    filteredProductInGroup = productInGroups.sort(
      (a, b) => a.priority - b.priority,
    );
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

  const handleDeleteProductFromGroup = (productId: string) => async () => {
    if (isSubmitting) {
      return;
    }
    try {
      isSubmitting = true;
      const res = await productGroupApi.productGroupsRemoveProductCreate({
        id: $formStore.fields.productGroupId,
        removeProductInPgRequest: {
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
    if (isEditProductList) {
      filteredProductInGroup = tempEditProducts.filter(
        ({ product }) =>
          product.brand_kor_name.toLocaleLowerCase().includes(value) ||
          product.alloff_name.toLocaleLowerCase().includes(value),
      );
    } else {
      filteredProductInGroup = productInGroups
        .filter(
          ({ product }) =>
            product.brand_kor_name.toLocaleLowerCase().includes(value) ||
            product.alloff_name.toLocaleLowerCase().includes(value),
        )
        .sort((a, b) => a.priority - b.priority);
    }
    productInGroupQuery = value;
  };

  const handleToggle = (event: CustomEvent<{ toggled: boolean }>) => {
    const { toggled } = event.detail;
    if (!toggled) {
      if (isEdited) {
        isEditProductList = false;
        event.preventDefault();
        event.stopPropagation();
        return;
      }
      tempEditProducts = [];
    } else {
      tempEditProducts = productInGroups;
      productInGroupQuery = ""; // reset search query
    }
    isEditProductList = toggled;
  };

  const handleAddListSortChange = (event: CustomEvent<ProductInGroup[]>) => {
    selectedProductInGroup = event.detail;
  };

  const handleEditListSortChange = (event: CustomEvent<ProductInGroup[]>) => {
    tempEditProducts = event.detail;
    isEdited = true;
    productInGroupFiltering("");
  };

  const handleAddProductSubmit = async () => {
    const productList = selectedProductInGroup.map(({ product }, i) => ({
      product_id: product.alloff_product_id,
      priority: i,
    }));
    const res = await productGroupApi.productGroupsPushProductsCreate({
      id: $formStore.fields.productGroupId!,
      productsInPgRequest: {
        product_group_id: $formStore.fields.productGroupId!,
        product_priorities: productList,
      },
    });
    productInGroups = res.data.products;
    selectedProductInGroup = [];
    productInGroupQuery = "";
    productInGroupFiltering("");
  };

  const handleEditListSubmit = async () => {
    const productList = tempEditProducts.map(({ product }, i) => ({
      product_id: product.alloff_product_id,
      priority: i + 10,
    }));
    const res = await productGroupApi.productGroupsUpdateProductsCreate({
      id: $formStore.fields.productGroupId!,
      productsInPgRequest: {
        product_group_id: $formStore.fields.productGroupId!,
        product_priorities: productList,
      },
    });
    productInGroups = res.data.products;
    tempEditProducts = [];
    productInGroupQuery = "";
    isEditProductList = false;
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
  <ContentBox subtitle="상품 목록">
    <div slot="actions">
      {#if isEditProductList}
        <div class="button-save">
          <Button
            on:click={handleEditListSubmit}
            size="small"
            disabled={!isEdited}
            icon={Save16}
            hasIconOnly
            tooltipPosition="bottom"
            tooltipAlignment="end"
            iconDescription="상품 목록 저장"
          />
        </div>
      {/if}
      <Toggle
        labelText="상품 목록 수정 모드"
        toggled={isEditProductList}
        on:toggle={handleToggle}
        size="sm"
      />
    </div>
    {#if !isEditProductList}
      <div class="button-right-wrapper">
        <Search
          placeholder="상품 목록의 상품 검색"
          value={productInGroupQuery}
          on:input={handleProductInGroupFilter}
          on:clear={handleProductInGroupFilter}
          expandable
        />
      </div>
    {/if}
    <StructuredList condensed flush>
      <StructuredListHead>
        <StructuredListRow head>
          <StructuredListCell head>썸네일</StructuredListCell>
          <StructuredListCell head>브랜드</StructuredListCell>
          <StructuredListCell head>제품명</StructuredListCell>
          <StructuredListCell head>Actions</StructuredListCell>
        </StructuredListRow>
      </StructuredListHead>
      <StructuredListBody>
        {#each filteredProductInGroup as { product }, index}
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
            <StructuredListCell>
              {product.alloff_name}
            </StructuredListCell>
            <StructuredListCell noWrap>
              {#if isEditProductList}
                <SortButtonSet
                  value={filteredProductInGroup}
                  {index}
                  on:change={handleEditListSortChange}
                  disabled={!isEditProductList}
                />
              {/if}
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
                on:click={handleDeleteProductFromGroup(
                  product.alloff_product_id,
                )}
              />
            </StructuredListCell>
          </StructuredListRow>
        {/each}
      </StructuredListBody>
    </StructuredList>
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
              <StructuredListCell head>Actions</StructuredListCell>
            </StructuredListRow>
          </StructuredListHead>
          <StructuredListBody>
            {#each selectedProductInGroup as { product }, index}
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
                <StructuredListCell>
                  <SortButtonSet
                    value={selectedProductInGroup}
                    {index}
                    on:change={handleAddListSortChange}
                  />
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
                </StructuredListCell>
              </StructuredListRow>
            {/each}
          </StructuredListBody>
        </StructuredList>
      </div>
    </Column>
  </Row>
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

  .button-save {
    margin-right: 10px;
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

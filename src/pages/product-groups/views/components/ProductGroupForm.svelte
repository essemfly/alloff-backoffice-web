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
  } from "carbon-components-svelte";
  import TrashCan16 from "carbon-icons-svelte/lib/TrashCan16";
  import Launch16 from "carbon-icons-svelte/lib/Launch16";

  import {
    ProductGroup,
    ProductsApi,
    ProductGroupsApi,
    ProductInGroup,
    ListProductResult,
  } from "@api";
  import { Autocomplete, AutocompleteItem } from "@app/components/autocomplete";
  import MultilineTextInput from "@app/components/MultilineTextInput.svelte";
  import ContentBox from "@app/components/ContentBox.svelte";
  import DateTimePicker from "@app/components/DateTimePicker.svelte";
  import ImageUploadField from "@app/components/ImageUploadField.svelte";

  const productGroupApi = new ProductGroupsApi();

  export let form: ProductGroup;
  export let isAdding: boolean = false;

  interface SelectedProductInGroup {
    productId: string;
    productName: string;
    priority: number;
  }

  let images: string[] = [];
  let productOptions: AutocompleteItem[] = [];
  let filteredProductOptions: AutocompleteItem[] = [];
  let selectedProductInGroup: SelectedProductInGroup[] = [];
  let selectedProductIds: string[] = [];
  let filteredProductInGroup: ProductInGroup[] = form.products;
  let searchQuery = "";

  onMount(async () => {
    const productApi = new ProductsApi();
    const res = await productApi.productsList();
    productOptions = (res.data as unknown as ListProductResult).products.map(
      ({
        alloff_product_id,
        alloff_name,
        alloff_category_name,
        brand_kor_name,
      }) => ({
        key: alloff_product_id,
        value: `[${brand_kor_name}] ${alloff_name}`,
        subvalue: alloff_category_name,
      }),
    );
    filteredProductOptions = productOptions;

    if (form.image_url) {
      images = [form.image_url];
    }
  });

  $: if (images.length > 0) {
    form.image_url = images[0];
  }

  const handleProductSelect = async (selectedItem: AutocompleteItem) => {
    const newProduct = {
      productId: selectedItem.key,
      productName: selectedItem.value,
      priority: 0,
    };
    selectedProductInGroup = [...selectedProductInGroup, newProduct];
    selectedProductIds = selectedProductInGroup.map(
      ({ productId }) => productId,
    );
    filteredProductOptions = productOptions.filter(
      (x) => !selectedProductIds.includes(x.key),
    );
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
          ({ productId, priority }) => ({ product_id: productId, priority }),
        ),
      },
    });
    form.products = res.data.products;
    selectedProductInGroup = [];
    selectedProductIds = [];
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

  const handleFilter = debounce((event: Event) => {
    productFiltering((event.target as HTMLInputElement)?.value ?? "");
  }, 300);

  const productFiltering = (value: string) => {
    filteredProductInGroup = form.products.filter(
      ({ product }) =>
        product.brand_kor_name.includes(value) ||
        product.alloff_name.includes(value),
    );
    searchQuery = value;
  };

  $: if (form.products) {
    productFiltering(searchQuery);
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
          value={searchQuery}
          on:input={handleFilter}
          on:clear={handleFilter}
        />
        <StructuredList condensed>
          <StructuredListHead>
            <StructuredListRow head>
              <StructuredListCell head>썸네일</StructuredListCell>
              <StructuredListCell head>브랜드</StructuredListCell>
              <StructuredListCell head>카테고리 이름</StructuredListCell>
              <StructuredListCell head>제품명</StructuredListCell>
              <StructuredListCell head noWrap>가중치</StructuredListCell>
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
                <StructuredListCell>
                  {product.product.alloff_category_name}
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
  <Row>
    <Column>
      <div class="bx--label">상품 검색</div>
      <Autocomplete
        options={filteredProductOptions}
        onSubmit={handleProductSelect}
        placeholder="상품 이름/브랜드 이름/상품 ID로 검색"
        labelText="상품 검색"
      />
    </Column>
  </Row>
  <Row>
    <Column>
      <StructuredList>
        <StructuredListBody>
          {#each selectedProductInGroup as product, index}
            <StructuredListRow>
              <StructuredListCell noWrap>
                {product.productName}
              </StructuredListCell>
              <StructuredListCell>
                <NumberInput
                  class="cell_input"
                  bind:value={product.priority}
                  size="sm"
                />
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
                    on:click={handleProductDetailOpen(product.productId)}
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
      {#if !isAdding}
        <Button
          on:click={handleAddProductSubmit}
          disabled={selectedProductInGroup.length === 0}>컬렉션에 저장</Button
        >
      {/if}
    </Column>
  </Row>
</ContentBox>

<style>
  :global(.bx--structured-list-td) {
    vertical-align: top;
  }

  .cell_image {
    width: 80px;
    height: 80px;
    object-fit: cover;
  }

  :global(.bx--structured-list-td) :global(.bx--form-item) {
    width: 120px;
  }

  :global(.bx--number) {
    width: auto;
  }
</style>

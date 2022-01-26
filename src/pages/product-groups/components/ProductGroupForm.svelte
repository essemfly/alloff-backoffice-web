<script lang="ts">
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
  } from "carbon-components-svelte";
  import TrashCan16 from "carbon-icons-svelte/lib/TrashCan16";
  import { Autocomplete, AutocompleteItem } from "../../../common/autocomplete";

  import { ProductGroup, ProductsApi, ProductGroupsApi } from "../../../api";
  import ContentBox from "../../../components/ContentBox.svelte";
  import DateTimePicker from "../../../components/DateTimePicker.svelte";
  import ImageUploadField from "../../../components/ImageUploadField.svelte";
  import { DateTime } from "luxon";

  const productGroupApi = new ProductGroupsApi();

  export let form: ProductGroup;

  let productOptions: AutocompleteItem[] = [];
  let images: string[] = [];
  let selectedProduct = "";
  let selectedProducts: AutocompleteItem[] = [];

  const handleAddProduct = async (selectedItem: AutocompleteItem) => {
    selectedProducts = [...selectedProducts, selectedItem];
  };

  const handleDeleteProduct = (index: number) => () => {
    selectedProducts.splice(index, 1);
    selectedProducts = selectedProducts;
  };

  const handleProductSubmit = async () => {
    const res = await productGroupApi.productGroupsPushProductsCreate({
      id: form.product_group_id,
      pushProductsRequest: {
        product_group_id: form.product_group_id,
        priority: 0,
        product_id: selectedProducts.map((x) => x.key),
      },
    });
  };

  onMount(async () => {
    const productApi = new ProductsApi();
    const res = await productApi.productsList();
    productOptions = res.data.map(
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

    if (form.image_url) {
      images = [form.image_url];
    }
  });

  $: if (images) {
    form.image_url = images[0];
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
      <DateTimePicker label={"시작일"} bind:value={form.start_time} />
    </Column>
    <Column>
      <DateTimePicker label={"종료일"} bind:value={form.finish_time} />
    </Column>
  </Row>
</ContentBox>
<ContentBox>
  <h3>상품 목록</h3>
  <Row>
    <Column>
      <div class="bx--label">상품 추가</div>
      <Autocomplete
        options={productOptions}
        onSubmit={handleAddProduct}
        placeholder="상품 이름/브랜드 이름/상품 ID로 검색"
        labelText="상품 검색"
        selectedValue={selectedProduct}
      />
    </Column>
  </Row>
  <Row>
    <Column>
      <Button on:click={handleProductSubmit}>저장</Button>
      <StructuredList>
        <StructuredListBody>
          {#each selectedProducts as product, index}
            <StructuredListRow>
              <StructuredListCell noWrap>
                {product.value}
              </StructuredListCell>
              <StructuredListCell>
                <div class="delete-button">
                  <Button
                    tooltipPosition="bottom"
                    tooltipAlignment="end"
                    iconDescription="상품 삭제"
                    icon={TrashCan16}
                    kind="danger"
                    on:click={handleDeleteProduct(index)}
                  />
                </div>
              </StructuredListCell>
            </StructuredListRow>
          {/each}
        </StructuredListBody>
      </StructuredList>
    </Column>
  </Row>
  <Row>
    <Column>
      <StructuredList>
        <StructuredListBody>
          {#each form.products as product, index}
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
              <StructuredListCell head>
                {product.product.brand_kor_name}
              </StructuredListCell>
              <StructuredListCell>
                {product.product.alloff_category_name}
              </StructuredListCell>
              <StructuredListCell noWrap>
                {product.product.alloff_name}
              </StructuredListCell>
              <StructuredListCell>
                <div class="delete-button">
                  <Button
                    tooltipPosition="bottom"
                    tooltipAlignment="end"
                    iconDescription="상품 삭제"
                    icon={TrashCan16}
                    kind="danger"
                    on:click={handleDeleteProduct(index)}
                  />
                </div>
              </StructuredListCell>
            </StructuredListRow>
          {/each}
        </StructuredListBody>
      </StructuredList>
    </Column>
  </Row>
</ContentBox>

<style>
  .cell_image {
    width: 100px;
    height: 100px;
    object-fit: cover;
  }
</style>

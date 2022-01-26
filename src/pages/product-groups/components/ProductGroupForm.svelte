<script lang="ts">
  import { onMount } from "svelte";
  import { Row, Column, Button, TextInput } from "carbon-components-svelte";
  import TrashCan16 from "carbon-icons-svelte/lib/TrashCan16";
  import { Autocomplete, AutocompleteItem } from "../../../common/autocomplete";

  import {
    ProductGroup,
    Product,
    ProductsApi,
    ProductGroupsApi,
  } from "../../../api";
  import ContentBox from "../../../components/ContentBox.svelte";
  import DateTimePicker from "../../../components/DateTimePicker.svelte";

  export let form: ProductGroup;

  let productOptions: AutocompleteItem[] = [];

  const handleAddProduct = async () => {
    const productGroupApi = new ProductGroupsApi();
    const res = await productGroupApi.productGroupsPushProductsCreate({
      id: form.product_group_id,
      pushProductsRequest: {
        product_group_id: form.product_group_id,
        priority: 0,
      },
    });
    console.log(res);
  };

  const handleDeleteProduct = (index: number) => () => {
    form.products.splice(index, 1);
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
  });
</script>

<ContentBox>
  <h3>컬렉션 정보</h3>
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
      <DateTimePicker label={"시작일"} value={form.start_time} />
    </Column>
    <Column>
      <DateTimePicker label={"종료일"} value={form.finish_time} />
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
      />
    </Column>
    <Column>
      <ul>
        {#each form.products as product, index}
          <li>
            {product.product.alloff_name}
            <div class="delete-button">
              <Button
                tooltipPosition="bottom"
                tooltipAlignment="end"
                iconDescription="재고 삭제"
                icon={TrashCan16}
                kind="danger"
                on:click={handleDeleteProduct(index)}
              />
            </div>
          </li>
        {/each}
      </ul>
    </Column>
  </Row>
</ContentBox>

<style>
</style>

<script lang="ts">
  import { Grid, Button } from "carbon-components-svelte";
  import LoggedInFrame from "../common/LoggedInFrame.svelte";
  import Save16 from "carbon-icons-svelte/lib/Save16";

  import ProductForm from "./components/ProductGroupForm.svelte";
  import { ProductGroup, ProductGroupsApi } from "../../api";

  let isTouched = true;
  let productGroup: ProductGroup = {
    title: "",
    short_title: "",
    image_url: "",
    start_time: "",
    finish_time: "",
    product_group_id: "",
    products: [],
    instruction: [],
  };

  const handleSubmit = async () => {
    const productApi = new ProductGroupsApi();
    const res = await productApi.productGroupsCreate({
      createProductGroupSeriazlierRequest: productGroup,
    });
  };
</script>

<LoggedInFrame>
  <Grid>
    <div class="button-wrapper mb10">
      <Button on:click={handleSubmit} disabled={!isTouched} icon={Save16}>
        상품 등록
      </Button>
    </div>
    <ProductForm form={productGroup} />
    <div class="button-wrapper mt10">
      <Button on:click={handleSubmit} disabled={!isTouched} icon={Save16}>
        상품 등록
      </Button>
    </div>
  </Grid>
</LoggedInFrame>

<style>
  .button-wrapper {
    display: flex;
    justify-content: flex-end;
  }

  .mb10 {
    margin-bottom: 10px;
  }

  .mt10 {
    margin-top: 10px;
  }
</style>

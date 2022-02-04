<script lang="ts">
  import { navigate } from "svelte-navigator";
  import { toast } from "@zerodevx/svelte-toast";
  import { Grid, Button } from "carbon-components-svelte";
  import Save16 from "carbon-icons-svelte/lib/Save16";

  import LoggedInFrame from "../../common/LoggedInFrame.svelte";
  import ProductForm from "./components/ProductForm.svelte";
  import {
    CreateProductRequestRequest,
    Product,
    ProductsApi,
  } from "../../../api";

  let isTouched = true;
  let product: Product = {
    alloff_product_id: "",
    alloff_name: "",
    product_id: "",
    brand_kor_name: "",
    category_name: "",
    alloff_category_name: "",
    is_foreign_delivery: true,
    is_refund_possible: true,
    is_removed: false,
    is_soldout: false,
    original_price: 0,
    discounted_price: 0,
    special_price: 0,
    earliest_delivery_days: 2,
    latest_delivery_days: 7,
    refund_fee: 0,
    total_score: 0,
    description: [],
    images: [],
    description_images: [],
    inventory: [],
  };

  const handleSubmit = async () => {
    try {
      const productApi = new ProductsApi();
      const res = await productApi.productsCreate({
        createProductRequestRequest:
          product as unknown as CreateProductRequestRequest,
      });
      toast.push("상품 등록이 완료되었습니다.");
      navigate(-1);
    } catch (e) {
      toast.push(`상품 등록에 오류가 발생했습니다.`);
    }
  };
</script>

<LoggedInFrame>
  <Grid>
    <div class="button-wrapper mb10">
      <Button on:click={handleSubmit} disabled={!isTouched} icon={Save16}>
        상품 등록
      </Button>
    </div>
    <ProductForm form={product} isAdding />
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

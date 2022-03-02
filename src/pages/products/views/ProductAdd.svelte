<script lang="ts">
  import { CreateProductRequestApiRequest,Product,ProductsApi } from "@api";
  import Nav from "@app/components/Nav.svelte";
  import { toast } from "@zerodevx/svelte-toast";
  import { Button,Grid } from "carbon-components-svelte";
  import Save16 from "carbon-icons-svelte/lib/Save16";
  import { navigate } from "svelte-navigator";
  import ProductForm from "./components/ProductForm.svelte";

  let isTouched = true;
  let product: Product = {
    alloff_product_id: "",
    alloff_category_id: "",
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
    module_name: "",
  };

  const handleSubmit = async () => {
    try {
      const productApi = new ProductsApi();
      const res = await productApi.productsCreate({
        createProductRequestApiRequest:
          product as unknown as CreateProductRequestApiRequest,
      });
      toast.push("상품 등록이 완료되었습니다.");
      navigate(-1);
    } catch (e) {
      toast.push(`상품 등록에 오류가 발생했습니다.`);
    }
  };
</script>

<Nav title="상품 추가">
  <Grid>
    <div class="button-right-wrapper mb10">
      <Button on:click={handleSubmit} disabled={!isTouched} icon={Save16}>
        상품 등록
      </Button>
    </div>
    <ProductForm form={product} isAdding />
    <div class="button-right-wrapper mt10">
      <Button on:click={handleSubmit} disabled={!isTouched} icon={Save16}>
        상품 등록
      </Button>
    </div>
  </Grid>
</Nav>

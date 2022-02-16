<script lang="ts">
  import { toast } from "@zerodevx/svelte-toast";
  import { navigate } from "svelte-navigator";
  import { Grid, Button } from "carbon-components-svelte";
  import Save16 from "carbon-icons-svelte/lib/Save16";

  import { ProductGroup, ProductGroupsApi, GroupTypeEnum } from "@api";
  import Nav from "@app/components/Nav.svelte";

  import ProductForm from "./components/ProductGroupForm.svelte";
  import { getGroupTypeLabel } from "../commands/helpers";

  export let productGroupType: GroupTypeEnum;

  let isTouched = true;
  let productGroupTypeLabel = getGroupTypeLabel(productGroupType);

  let productGroup: ProductGroup = {
    title: "",
    short_title: "",
    image_url: "",
    start_time: "",
    finish_time: "",
    product_group_id: "",
    products: [],
    instruction: [],
    group_type: productGroupType,
  };

  const handleSubmit = async () => {
    try {
      const productGroupApi = new ProductGroupsApi();
      const { products, ...requestBody } = productGroup;
      const res = await productGroupApi.productGroupsCreate({
        createProductGroupSeriazlierRequest: requestBody,
      });
      const newProductGroup = res.data;
      await productGroupApi.productGroupsPushProductsCreate({
        id: newProductGroup.product_group_id,
        pushProductsRequest: {
          product_group_id: newProductGroup.product_group_id,
          product_priority: products.map(({ product, priority }) => ({
            product_id: product.alloff_product_id,
            priority,
          })),
        },
      });
      toast.push(`${productGroupTypeLabel} 등록이 완료되었습니다.`);
      navigate(-1);
    } catch (e) {
      toast.push(`${productGroupTypeLabel} 등록에 오류가 발생했습니다.`);
    }
  };
</script>

<Nav title="{productGroupTypeLabel} 추가">
  <Grid>
    <div class="button-right-wrapper mb10">
      <Button on:click={handleSubmit} disabled={!isTouched} icon={Save16}>
        {productGroupTypeLabel} 등록
      </Button>
    </div>
    <ProductForm
      label={productGroupTypeLabel}
      bind:form={productGroup}
      isAdding
    />
    <div class="button-right-wrapper mt10">
      <Button on:click={handleSubmit} disabled={!isTouched} icon={Save16}>
        {productGroupTypeLabel} 등록
      </Button>
    </div>
  </Grid>
</Nav>

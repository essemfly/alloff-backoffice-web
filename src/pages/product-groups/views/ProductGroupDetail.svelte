<script lang="ts">
  import { toast } from "@zerodevx/svelte-toast";
  import { onMount } from "svelte";
  import { navigate } from "svelte-navigator";
  import { Grid, Button, InlineLoading } from "carbon-components-svelte";
  import Save16 from "carbon-icons-svelte/lib/Save16";

  import {
    EditProductGroupRequest,
    ProductGroup,
    ProductGroupsApi,
  } from "@api";
  import Nav from "@app/components/Nav.svelte";

  import ProductForm from "./components/ProductGroupForm.svelte";

  const productGroupApi = new ProductGroupsApi();

  export let productId: string;

  let productGroup: ProductGroup;
  let isLoading = true;
  let isTouched = true;

  onMount(async () => {
    const res = await productGroupApi.productGroupsRetrieve({ id: productId });
    productGroup = res.data;
    isLoading = false;
  });

  const handleSubmit = async () => {
    try {
      // remove products from product group
      const { products, ...restProductGroup } = productGroup;
      await productGroupApi.productGroupsUpdate({
        id: productGroup.product_group_id,
        editProductGroupRequest:
          restProductGroup as unknown as EditProductGroupRequest,
      });
      toast.push("컬렉션 수정이 완료되었습니다.");
      navigate(-1);
    } catch (e) {
      toast.push(`컬렉션 수정에 오류가 발생했습니다.`);
    }
  };
</script>

<Nav title={productGroup?.title ?? "컬렉션 상세"}>
  {#if isLoading}
    <InlineLoading status="active" description="On Loading..." />
  {:else}
    <Grid>
      <div class="button-wrapper mb10">
        <Button on:click={handleSubmit} disabled={!isTouched} icon={Save16}>
          {"수정"}
        </Button>
      </div>
      <ProductForm form={productGroup} />
      <div class="button-wrapper mt10">
        <Button on:click={handleSubmit} disabled={!isTouched} icon={Save16}>
          {"수정"}
        </Button>
      </div>
    </Grid>
  {/if}
</Nav>

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

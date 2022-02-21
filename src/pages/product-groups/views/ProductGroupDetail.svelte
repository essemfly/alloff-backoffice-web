<script lang="ts">
  import { toast } from "@zerodevx/svelte-toast";
  import { onMount } from "svelte";
  import { navigate } from "svelte-navigator";
  import { Grid, Button, InlineLoading } from "carbon-components-svelte";
  import Save16 from "carbon-icons-svelte/lib/Save16";

  import {
    EditProductGroupRequest,
    GroupTypeEnum,
    ProductGroup,
    ProductGroupsApi,
  } from "@api";
  import Nav from "@app/components/Nav.svelte";

  import ProductGroupForm from "./components/ProductGroupForm.svelte";
  import { getGroupTypeLabelByIndex } from "../commands/helpers";

  const productGroupApi = new ProductGroupsApi();

  export let productId: string;

  let productGroup: ProductGroup;
  let isLoading = true;
  let isTouched = true;
  let productGroupTypeLabel = "컬렉션";

  onMount(async () => {
    const res = await productGroupApi.productGroupsRetrieve({ id: productId });
    productGroup = res.data;
    isLoading = false;
    productGroupTypeLabel = getGroupTypeLabelByIndex(
      productGroup.group_type as unknown as number,
    );
  });

  const handleSubmit = async () => {
    try {
      // remove products from product group
      const { products, group_type, ...restProductGroup } = productGroup;
      await productGroupApi.productGroupsUpdate({
        id: productGroup.product_group_id,
        editProductGroupRequest:
          restProductGroup as unknown as EditProductGroupRequest,
      });
      toast.push(`${productGroupTypeLabel} 수정이 완료되었습니다.`);
      navigate(-1);
    } catch (e) {
      toast.push(`${productGroupTypeLabel} 수정에 오류가 발생했습니다.`);
    }
  };
</script>

<Nav title={productGroup?.title ?? `${productGroupTypeLabel} 상세`}>
  {#if isLoading}
    <InlineLoading status="active" description="On Loading..." />
  {:else}
    <div class="button-right-wrapper mb10">
      <Button on:click={handleSubmit} disabled={!isTouched} icon={Save16}>
        {"수정"}
      </Button>
    </div>
    <ProductGroupForm label={productGroupTypeLabel} form={productGroup} />
    <div class="button-right-wrapper mt10">
      <Button on:click={handleSubmit} disabled={!isTouched} icon={Save16}>
        {"수정"}
      </Button>
    </div>
  {/if}
</Nav>

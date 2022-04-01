<script lang="ts">
  import { DateTime } from "luxon";
  import { toast } from "@zerodevx/svelte-toast";
  import { onMount } from "svelte";
  import { navigate } from "svelte-navigator";
  import { Grid, Button } from "carbon-components-svelte";
  import Save16 from "carbon-icons-svelte/lib/Save16";

  import { ProductGroupsApi, GroupTypeEnum, ProductInGroup } from "@api";
  import Nav from "@app/components/Nav.svelte";
  import { convertToSnakeCase } from "@app/helpers/change-case";

  import ProductForm from "./components/ProductGroupForm.svelte";
  import { getGroupTypeLabel } from "../commands/helpers";
  import { formStore } from "../models/schema";

  export let productGroupType: GroupTypeEnum;

  let isSubmitting = false;
  let productGroupTypeLabel = getGroupTypeLabel(productGroupType);
  let productInGroups: ProductInGroup[] = [];

  const productGroupApi = new ProductGroupsApi();

  onMount(() => {
    formStore.initialize();
    formStore.update({ groupType: productGroupType });
  });

  const handleSubmit = async (event: MouseEvent) => {
    isSubmitting = true;
    try {
      event.preventDefault();
      const formData = {
        ...$formStore.fields,
        ...(productGroupType !== GroupTypeEnum.Timedeal && {
          startTime: DateTime.now().toISO(),
          finishTime: DateTime.now().toISO(),
        }),
      };
      const isValid = await formStore.validate(formData, {
        context: { isAdding: true },
      });
      if (!isValid) {
        toast.push("일부 항목값이 올바르지 않습니다.");
        return;
      }
      const res = await productGroupApi.productGroupsCreate({
        createProductGroupSeriazlierRequest: convertToSnakeCase(formData),
      });
      if (productInGroups.length > 0) {
        const newProductGroup = res.data;
        await productGroupApi.productGroupsPushProductsCreate({
          id: newProductGroup.product_group_id,
          pushProductsRequest: {
            product_group_id: newProductGroup.product_group_id,
            product_priority: productInGroups.map(({ product, priority }) => ({
              product_id: product.alloff_product_id,
              priority,
            })),
          },
        });
      }
      toast.push(`${productGroupTypeLabel} 등록이 완료되었습니다.`);
      navigate(-1);
    } catch (e) {
      toast.push(`${productGroupTypeLabel} 등록에 오류가 발생했습니다.`);
    } finally {
      isSubmitting = false;
    }
  };
</script>

<Nav title="{productGroupTypeLabel} 추가">
  <Grid>
    <div class="button-right-wrapper mb10">
      <Button on:click={handleSubmit} disabled={isSubmitting} icon={Save16}>
        {productGroupTypeLabel}
        {isSubmitting ? "등록중..." : "등록"}
      </Button>
    </div>
    <ProductForm label={productGroupTypeLabel} isAdding bind:productInGroups />
    <div class="button-right-wrapper mt10">
      <Button on:click={handleSubmit} disabled={isSubmitting} icon={Save16}>
        {productGroupTypeLabel}
        {isSubmitting ? "등록중..." : "등록"}
      </Button>
    </div>
  </Grid>
</Nav>

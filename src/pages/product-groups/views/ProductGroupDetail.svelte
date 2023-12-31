<script lang="ts">
  import { DateTime } from "luxon";
  import { toast } from "@zerodevx/svelte-toast";
  import { onMount } from "svelte";
  import { navigate } from "svelte-navigator";
  import { Button, InlineLoading } from "carbon-components-svelte";
  import Save16 from "carbon-icons-svelte/lib/Save16";

  import {
    GroupTypeE67Enum as GroupTypeEnum,
    ProductInGroup,
  } from "@lessbutter/alloff-backoffice-api";
  import Nav from "@app/components/Nav.svelte";
  import { convertToCamelCase } from "@app/helpers/change-case";

  import ProductGroupForm from "./components/ProductGroupForm.svelte";
  import {
    getGroupTypeByIndex,
    getGroupTypeLabelByIndex,
  } from "../commands/helpers";
  import { formStore } from "../models/schema";
  import { useProductGroupService } from "../ProductGroupService";

  const productGroupService = useProductGroupService();

  export let productId: string;

  let isLoading = false;
  let isSubmitting = false;
  let productGroupTypeLabel = "컬렉션";
  let productInGroups: ProductInGroup[] = [];

  onMount(async () => {
    isLoading = true;
    try {
      const res = await productGroupService.load(productId);
      const { group_type, products } = res!;
      productInGroups = products;
      const productGroup = convertToCamelCase({
        ...res,
        group_type: getGroupTypeByIndex(group_type as unknown as number),
      });
      formStore.update(productGroup);
      productGroupTypeLabel = getGroupTypeLabelByIndex(
        productGroup.group_type as unknown as number,
      );
    } finally {
      isLoading = false;
    }
  });

  const handleSubmit = async (event: MouseEvent) => {
    isSubmitting = true;
    try {
      event.preventDefault();
      const productGroupType = $formStore.fields.groupType;
      const formData = {
        ...$formStore.fields,
        ...(productGroupType !== GroupTypeEnum.Timedeal && {
          startTime: DateTime.now().toISO(),
          finishTime: DateTime.now().toISO(),
        }),
      };
      const isValid = await formStore.validate(formData);
      if (!isValid) {
        toast.push("일부 항목값이 올바르지 않습니다.");
        return;
      }
      await productGroupService.edit(productId, formData);
      toast.push(`${productGroupTypeLabel} 수정이 완료되었습니다.`);
      navigate(-1);
    } catch (e) {
      toast.push(`${productGroupTypeLabel} 수정에 오류가 발생했습니다.`);
    }
  };
</script>

<Nav title={$formStore.fields.title ?? `${productGroupTypeLabel} 상세`}>
  {#if isLoading}
    <InlineLoading status="active" description="On Loading..." />
  {:else}
    <div class="row-right-wrapper mb10">
      <Button on:click={handleSubmit} disabled={isSubmitting} icon={Save16}>
        {isSubmitting ? "수정중..." : "수정"}
      </Button>
    </div>
    <ProductGroupForm label={productGroupTypeLabel} {productInGroups} />
    <div class="row-right-wrapper mt10">
      <Button on:click={handleSubmit} disabled={isSubmitting} icon={Save16}>
        {isSubmitting ? "수정중..." : "수정"}
      </Button>
    </div>
  {/if}
</Nav>

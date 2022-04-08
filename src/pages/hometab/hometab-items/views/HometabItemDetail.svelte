<script lang="ts">
  import { toast } from "@zerodevx/svelte-toast";
  import { onMount } from "svelte";
  import { navigate } from "svelte-navigator";
  import { Button, InlineLoading } from "carbon-components-svelte";

  import { HomeTab, HometabsApi } from "@api";
  import Nav from "@app/components/Nav.svelte";
  import {
    convertToCamelCase,
    convertToSnakeCase,
  } from "@app/helpers/change-case";

  import HometabItemForm from "./components/HometabItemForm.svelte";
  import { formStore } from "../models/schema";
  import {
    getHometabItemTypeByIndex,
    getSortingOptionByIndex,
  } from "../commands/helpers";

  export let id: string;

  let isLoading = false;
  let isSubmitting = false;

  const hometabApi = new HometabsApi();

  onMount(async () => {
    isLoading = true;
    const res = await hometabApi.hometabsRetrieve({ id });
    const hometabItem = res.data;
    const data = convertToCamelCase({
      ...res.data,
      contents: {
        itemType: getHometabItemTypeByIndex(
          hometabItem.item_type as unknown as number,
        ),
        exhibitionIds: hometabItem.exhibitions.map((x) => x.exhibition_id),
        brandKeynames: hometabItem.brands.map((x) => x.keyname),
        options: hometabItem.reference.options.map((x) =>
          getSortingOptionByIndex(x as unknown as number),
        ),
      },
    });
    formStore.update(data);
    isLoading = false;
  });

  const handleSubmit = async () => {
    try {
      isSubmitting = true;
      const isValid = await formStore.validate($formStore.fields, {
        context: { isAdding: true },
      });
      if (!isValid) {
        toast.push("일부 항목값이 올바르지 않습니다.");
        return;
      }
      await hometabApi.hometabsUpdate({
        id: $formStore.fields.itemId,
        editHomeTabRequest: convertToSnakeCase({
          hometabId: $formStore.fields.itemId,
          ...$formStore.fields,
        }),
      });
      toast.push("홈탭 아이템이 수정되었습니다.");
      navigate(-1);
    } catch (e) {
      toast.push(`홈탭 아이템 등록에 오류가 발생했습니다.`);
    } finally {
      isSubmitting = false;
    }
  };
</script>

<Nav title={`${$formStore.fields.title ?? "홈탭 아이템 상세"}`}>
  {#if isLoading}
    <InlineLoading status="active" description="On Loading..." />
  {:else}
    <div class="row-right-wrapper mb10">
      <Button on:click={handleSubmit} disabled={isSubmitting}>
        홈탭 아이템 {isSubmitting ? "수정중..." : "수정"}
      </Button>
    </div>
    <HometabItemForm />
    <div class="row-right-wrapper mb10">
      <Button on:click={handleSubmit} disabled={isSubmitting}>
        홈탭 아이템 {isSubmitting ? "수정중..." : "수정"}
      </Button>
    </div>
  {/if}
</Nav>

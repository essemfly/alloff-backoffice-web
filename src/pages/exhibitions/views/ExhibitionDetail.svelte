<script lang="ts">
  import { toast } from "@zerodevx/svelte-toast";
  import { onMount } from "svelte";
  import { navigate } from "svelte-navigator";
  import { Button, InlineLoading } from "carbon-components-svelte";
  import Save16 from "carbon-icons-svelte/lib/Save16";

  import {
    EditExhibitionRequest,
    ExhibitionsApi,
    ExhibitionTypeEnum,
  } from "@lessbutter/alloff-backoffice-api";
  import { apiConfigs } from "@app/store";
  import Nav from "@app/components/Nav.svelte";
  import {
    convertToSnakeCase,
    convertToCamelCase,
  } from "@app/helpers/change-case";

  import ExhibitionForm from "./components/ExhibitionForm.svelte";
  import { formStore } from "../models/schema";
  import {
    getExhibitionTypeByIndex,
    getExhibitionTypeLabel,
  } from "../commands/helpers";

  export let id: string;
  export let type: ExhibitionTypeEnum = ExhibitionTypeEnum.Normal;

  let exhibitionLabel = getExhibitionTypeLabel(type);
  let isLoading = false;
  let isSubmitting = false;

  const exhibitionApi = new ExhibitionsApi($apiConfigs);

  onMount(async () => {
    isLoading = true;
    try {
      const res = await exhibitionApi.exhibitionsRetrieve({ id });
      const exhibition = convertToCamelCase({
        ...res.data,
        exhibitionType: getExhibitionTypeByIndex(
          res.data.exhibition_type as unknown as number,
        ),
      });
      formStore.update(exhibition);
    } finally {
      isLoading = false;
    }
  });

  const handleSubmit = async (event: MouseEvent) => {
    isSubmitting = true;
    try {
      event.preventDefault();
      const isValid = await formStore.validate($formStore.fields);
      if (!isValid) {
        toast.push("일부 항목값이 올바르지 않습니다.");
        return;
      }
      await exhibitionApi.exhibitionsUpdate({
        id: $formStore.fields.exhibitionId!,
        editExhibitionRequest: convertToSnakeCase<EditExhibitionRequest>(
          $formStore.fields,
        ),
      });
      toast.push(`${exhibitionLabel} 수정이 완료되었습니다.`);
      if ($formStore.fields.exhibitionType === ExhibitionTypeEnum.Timedeal) {
        navigate(`/timedeals`);
      } else if (
        $formStore.fields.exhibitionType === ExhibitionTypeEnum.Groupdeal
      ) {
        navigate(`/groupdeals`);
      } else {
        navigate(`/exhibitions`);
      }
    } catch (e) {
      toast.push(`${exhibitionLabel} 수정에 오류가 발생했습니다.`);
    } finally {
      isSubmitting = false;
    }
  };
</script>

<Nav title={`${$formStore.fields.title ?? `${exhibitionLabel} 상세`}`}>
  {#if isLoading}
    <InlineLoading status="active" description="On Loading..." />
  {:else}
    <div class="row-right-wrapper mb10">
      <Button on:click={handleSubmit} disabled={isSubmitting} icon={Save16}>
        {isSubmitting ? "수정중..." : "수정"}
      </Button>
    </div>
    <ExhibitionForm label={exhibitionLabel} />
    <div class="row-right-wrapper mb10">
      <Button on:click={handleSubmit} disabled={isSubmitting} icon={Save16}>
        {isSubmitting ? "수정중..." : "수정"}
      </Button>
    </div>
  {/if}
</Nav>

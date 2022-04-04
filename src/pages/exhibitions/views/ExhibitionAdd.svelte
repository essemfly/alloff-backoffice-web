<script lang="ts">
  import { toast } from "@zerodevx/svelte-toast";
  import { onMount } from "svelte";
  import { navigate } from "svelte-navigator";
  import { Button } from "carbon-components-svelte";

  import {
    CreateExhibitionRequest,
    ExhibitionsApi,
    ExhibitionTypeEnum,
  } from "@api";
  import Nav from "@app/components/Nav.svelte";
  import { convertToSnakeCase } from "@app/helpers/change-case";

  import ExhibitionForm from "./components/ExhibitionForm.svelte";
  import { formStore } from "../models/schema";
  import { getExhibitionTypeLabel } from "../commands/helpers";

  export let type: ExhibitionTypeEnum = ExhibitionTypeEnum.Normal;

  let exhibitionLabel = getExhibitionTypeLabel(type);
  let isSubmitting = false;

  const exhibitionApi = new ExhibitionsApi();

  onMount(() => {
    formStore.initialize({ exhibitionType: type });
  });

  const handleSubmit = async (event: MouseEvent) => {
    isSubmitting = true;
    try {
      event.preventDefault();
      const isValid = await formStore.validate($formStore.fields, {
        context: { isAdding: true },
      });
      if (!isValid) {
        toast.push("일부 항목값이 올바르지 않습니다.");
        return;
      }
      await exhibitionApi.exhibitionsCreate({
        createExhibitionRequest: convertToSnakeCase<CreateExhibitionRequest>(
          $formStore.fields,
        ),
      });
      toast.push(`${exhibitionLabel} 등록이 완료되었습니다.`);
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
      toast.push(`${exhibitionLabel} 등록에 오류가 발생했습니다.`);
    } finally {
      isSubmitting = false;
    }
  };
</script>

<Nav title={`${exhibitionLabel} 추가`}>
  <h1>{exhibitionLabel} 추가</h1>
  <div class="button-right-wrapper mb10">
    <Button on:click={handleSubmit} disabled={isSubmitting}>
      {isSubmitting ? "등록중..." : "등록"}
    </Button>
  </div>
  <ExhibitionForm label={exhibitionLabel} isAdding />
  <div class="button-right-wrapper mb10">
    <Button on:click={handleSubmit} disabled={isSubmitting}>
      {isSubmitting ? "등록중..." : "등록"}
    </Button>
  </div>
</Nav>

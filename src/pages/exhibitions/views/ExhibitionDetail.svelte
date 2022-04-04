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
  } from "@api";
  import Nav from "@app/components/Nav.svelte";

  import ExhibitionForm from "./components/ExhibitionForm.svelte";
  import { formStore, schema } from "../models/schema";
  import { convertToSnakeCase } from "@app/helpers/change-case";
  import { getExhibitionTypeLabel } from "../commands/helpers";

  export let id: string;
  export let type: ExhibitionTypeEnum = ExhibitionTypeEnum.Normal;

  let exhibitionLabel = getExhibitionTypeLabel(type);
  let isLoading = false;
  let isSubmitting = false;

  const exhibitionApi = new ExhibitionsApi();

  onMount(async () => {
    isLoading = true;
    try {
      const res = await exhibitionApi.exhibitionsRetrieve({ id });
      const exhibition = schema.camelCase().cast(res.data);
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
        id: $formStore.fields.exhibitionId,
        editExhibitionRequest: convertToSnakeCase<EditExhibitionRequest>(
          $formStore.fields,
        ),
      });
      toast.push(`${exhibitionLabel} 수정이 완료되었습니다.`);
      navigate(-1);
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
    <div class="button-right-wrapper mb10">
      <Button on:click={handleSubmit} disabled={isSubmitting} icon={Save16}>
        {isSubmitting ? "수정중..." : "수정"}
      </Button>
    </div>
    <ExhibitionForm label={exhibitionLabel} />
    <div class="button-right-wrapper mb10">
      <Button on:click={handleSubmit} disabled={isSubmitting} icon={Save16}>
        {isSubmitting ? "수정중..." : "수정"}
      </Button>
    </div>
  {/if}
</Nav>
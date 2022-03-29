<script lang="ts">
  import { toast } from "@zerodevx/svelte-toast";
  import { navigate } from "svelte-navigator";
  import { Button } from "carbon-components-svelte";

  import { CreateExhibitionRequest, ExhibitionsApi } from "@api";
  import Nav from "@app/components/Nav.svelte";
  import { convertToSnakeCase } from "@app/helpers/change-case";

  import ExhibitionForm from "./components/ExhibitionForm.svelte";
  import { formStore } from "../models/schema";
  import { onMount } from "svelte";

  let isSubmitting = false;

  const exhibitionApi = new ExhibitionsApi();

  onMount(() => {
    formStore.initialize();
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
      toast.push("기획전 등록이 완료되었습니다.");
      navigate(-1);
    } catch (e) {
      toast.push(`기획전 등록에 오류가 발생했습니다.`);
    } finally {
      isSubmitting = false;
    }
  };
</script>

<Nav title="기획전 추가">
  <h1>기획전 추가</h1>
  <div class="button-right-wrapper mb10">
    <Button on:click={handleSubmit} disabled={isSubmitting}>
      {isSubmitting ? "등록중..." : "등록"}
    </Button>
  </div>
  <ExhibitionForm isAdding />
  <div class="button-right-wrapper mb10">
    <Button on:click={handleSubmit} disabled={isSubmitting}>
      {isSubmitting ? "등록중..." : "등록"}
    </Button>
  </div>
</Nav>

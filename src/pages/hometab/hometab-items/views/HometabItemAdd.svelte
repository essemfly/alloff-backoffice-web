<script lang="ts">
  import { toast } from "@zerodevx/svelte-toast";
  import { navigate } from "svelte-navigator";
  import { Button } from "carbon-components-svelte";

  import { CreateHomeTabRequest, HometabsApi } from "@api";
  import Nav from "@app/components/Nav.svelte";
  import { convertToSnakeCase } from "@app/helpers/change-case";

  import HometabItemForm from "./components/HometabItemForm.svelte";
  import { formStore } from "../models/schema";

  const hometabApi = new HometabsApi();

  const handleSubmit = async (event: MouseEvent) => {
    try {
      event.preventDefault();
      const isValid = await formStore.validate($formStore.fields);
      if (!isValid) {
        toast.push("일부 항목값이 올바르지 않습니다.");
        return;
      }
      await hometabApi.hometabsCreate({
        createHomeTabRequest: convertToSnakeCase<CreateHomeTabRequest>(
          $formStore.fields,
        ),
      });
      toast.push("홈탭 아이템 등록이 완료되었습니다.");
      navigate(-1);
    } catch (e) {
      toast.push(`홈탭 아이템 등록에 오류가 발생했습니다.`);
    }
  };
</script>

<Nav title="홈탭 아이템 추가">
  <h1>홈탭 아이템 추가</h1>
  <div class="button-right-wrapper mb10">
    <Button on:click={handleSubmit}>홈탭 아이템 등록</Button>
  </div>
  <HometabItemForm isAdding />
  <div class="button-right-wrapper mt10">
    <Button on:click={handleSubmit}>홈탭 아이템 등록</Button>
  </div>
</Nav>

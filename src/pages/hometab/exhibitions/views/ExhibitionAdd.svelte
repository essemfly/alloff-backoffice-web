<script lang="ts">
  import { toast } from "@zerodevx/svelte-toast";
  import { navigate } from "svelte-navigator";
  import { Button } from "carbon-components-svelte";

  import { CreateExhibitionRequest, Exhibition, ExhibitionsApi } from "@api";
  import Nav from "@app/components/Nav.svelte";

  import ExhibitionForm from "./components/ExhibitionForm.svelte";

  let exhibition: Exhibition = {
    exhibition_id: "",
    title: "",
    subtitle: "",
    banner_image: "",
    thumbnail_image: "",
    description: "",
    start_time: "",
    finish_time: "",
    pgs: [],
  };

  const exhibitionApi = new ExhibitionsApi();

  const handleSubmit = async () => {
    try {
      const { exhibition_id, ...requestBody } = exhibition;
      const res = await exhibitionApi.exhibitionsCreate({
        createExhibitionRequest:
          requestBody as unknown as CreateExhibitionRequest,
      });
      toast.push("기획전 등록이 완료되었습니다.");
      navigate(-1);
    } catch (e) {
      toast.push(`기획전 등록에 오류가 발생했습니다.`);
    }
  };
</script>

<Nav title="기획전 추가">
  <h1>기획전 추가</h1>
  <div class="button-right-wrapper mb10">
    <Button on:click={handleSubmit}>기획전 등록</Button>
  </div>
  <ExhibitionForm form={exhibition} isAdding />
  <div class="button-right-wrapper mb10">
    <Button on:click={handleSubmit}>기획전 등록</Button>
  </div>
</Nav>

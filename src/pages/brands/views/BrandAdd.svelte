<script lang="ts">
  import { toast } from "@zerodevx/svelte-toast";
  import { navigate } from "svelte-navigator";
  import { Button } from "carbon-components-svelte";

  import { BrandRequest, BrandsApi } from "@api";
  import Nav from "@app/components/Nav.svelte";

  import BrandForm from "./components/BrandForm.svelte";

  let brand: BrandRequest = {
    brand_id: "",
    keyname: "",
    korname: "",
    engname: "",
    logo_image_url: "",
    back_image_url: "",
    description: "",
    size_guide: [],
    is_popular: false,
    is_open: false,
    in_maintenance: false,
  };

  const brandApi = new BrandsApi();

  const handleSubmit = async () => {
    try {
      const res = await brandApi.brandsCreate({
        createBrandRequest: brand,
      });
      toast.push("브랜드 등록이 완료되었습니다.");
      navigate(-1);
    } catch (e) {
      toast.push(`브랜드 등록에 오류가 발생했습니다.`);
    }
  };
</script>

<Nav title="브랜드 추가">
  <h1>브랜드 추가</h1>
  <div class="button-right-wrapper mb10">
    <Button on:click={handleSubmit}>브랜드 등록</Button>
  </div>
  <BrandForm bind:form={brand} isAdding />
  <div class="button-right-wrapper mt10">
    <Button on:click={handleSubmit}>브랜드 등록</Button>
  </div>
</Nav>

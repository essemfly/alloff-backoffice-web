<script lang="ts">
  import { toast } from "@zerodevx/svelte-toast";
  import { navigate } from "svelte-navigator";
  import { Grid, Button } from "carbon-components-svelte";
  import Save16 from "carbon-icons-svelte/lib/Save16";

  import { ProductGroup, ProductGroupsApi, ProductInGroup } from "../../api";
  import LoggedInFrame from "../common/LoggedInFrame.svelte";
  import ProductForm from "./components/ProductGroupForm.svelte";

  let isTouched = true;
  let productGroup: ProductGroup = {
    title: "",
    short_title: "",
    image_url: "",
    start_time: "",
    finish_time: "",
    product_group_id: "",
    products: [],
    instruction: [],
  };

  const handleSubmit = async () => {
    try {
      const productGroupApi = new ProductGroupsApi();
      await productGroupApi.productGroupsCreate({
        createProductGroupSeriazlierRequest: productGroup,
      });
      toast.push("컬렉션 등록이 완료되었습니다.");
      navigate(-1);
    } catch (e) {
      toast.push(`컬렉션 등록에 오류가 발생했습니다.`);
    }
  };
</script>

<LoggedInFrame>
  <Grid>
    <div class="button-wrapper mb10">
      <Button on:click={handleSubmit} disabled={!isTouched} icon={Save16}>
        컬렉션 등록
      </Button>
    </div>
    <ProductForm bind:form={productGroup} isAdding />
    <div class="button-wrapper mt10">
      <Button on:click={handleSubmit} disabled={!isTouched} icon={Save16}>
        컬렉션 등록
      </Button>
    </div>
  </Grid>
</LoggedInFrame>

<style>
  .button-wrapper {
    display: flex;
    justify-content: flex-end;
  }

  .mb10 {
    margin-bottom: 10px;
  }

  .mt10 {
    margin-top: 10px;
  }
</style>

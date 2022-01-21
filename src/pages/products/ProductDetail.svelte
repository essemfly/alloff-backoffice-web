<script lang="ts">
  import { onMount } from "svelte";
  import {
    Grid,
    Row,
    Column,
    Button,
    TextInput,
    InlineLoading,
  } from "carbon-components-svelte";
  import Save16 from "carbon-icons-svelte/lib/Save16";

  import LoggedInFrame from "../common/LoggedInFrame.svelte";
  import InstructionAdder from "./components/InstructionAdder.svelte";
  import ContentBox from "./components/ContentBox.svelte";

  // dummys
  import { Product, response } from "./samples/response";

  export let productId: string;

  let product: Product;
  let isLoading = true;
  let isTouched = false;

  onMount(async () => {
    product = await Promise.resolve(response.products[0])!;

    // todo: integrate api
    // products = (await api.product({ id: timedeal.id })).data;
    isLoading = false;
  });

  const handleSubmit = () => {
    // todo add
  };
</script>

<LoggedInFrame>
  {#if isLoading}
    <InlineLoading status="active" description="On Loading..." />
  {:else}
    <h1>{product.alloffName}</h1>
    <div class="button-wrapper">
      <Button on:click={handleSubmit} disabled={!isTouched} icon={Save16}>
        {"수정"}
      </Button>
    </div>

    <Grid>
      <ContentBox>
        <Row>
          <h3>상품 정보</h3>
        </Row>
        <Row>
          <Column>
            <TextInput labelText={"상품명"} bind:value={product.alloffName} />
            <TextInput
              labelText={"기존 가격"}
              bind:value={product.originalPrice}
            />
          </Column>
          <Column>
            <TextInput labelText={"브랜드"} bind:value={product.brandKorName} />
            <TextInput
              labelText={"할인된 가격 (할인율:" + product.discountRate + "%)"}
              bind:value={product.discountedPrice}
            />
          </Column>
        </Row>
        <Row>
          <Column>
            <TextInput labelText="제품번호" bind:value={product.productId} />
          </Column>
        </Row>
        <Row>
          <Column>
            <div class="bx--label">상품 이미지</div>
            <div class="image-container">
              <!-- todo: integrate api -->
              <!-- {#each product.images as image, idx}
                <div class="image-wrapper" class:mobile>
                  <img class="image" class:mobile src={image} alt="timedeal" />
                  <div class="delete-button">
                    <Button
                      tooltipPosition="bottom"
                      tooltipAlignment="end"
                      iconDescription="이미지 삭제"
                      icon={TrashCan16}
                      kind="danger"
                      on:click={() => deleteProductImage(idx)}
                    />
                  </div>
                </div>
              {/each} -->
            </div>
          </Column>
        </Row>
        <Row>
          <Column>
            <InstructionAdder
              instructionTitle="상품 설명"
              instructions={product.description ? product.description : []}
            />
          </Column>
        </Row>
      </ContentBox>
    </Grid>
  {/if}
</LoggedInFrame>

<style>
  :global(.right-button) {
    margin-left: 1rem;
  }
  :global(.bx--modal-content) {
    padding-right: 3% !important;
  }
  :global(h3) {
    margin: 0.5rem 0;
  }

  .button-wrapper {
    display: flex;
    justify-content: flex-end;
  }

  /*
  .image {
    width: auto;
    min-width: 200px;
    max-height: 200px;
    margin-right: 10px;
    object-fit: contain;
  }

  .image-container {
    margin-left: 0px;
  }

  .image-wrapper {
    display: inline-block;
    position: relative;
    margin-right: 15px;
    margin-bottom: 15px;
    padding: 10px;
    background-color: grey;
    border-radius: 15px;
    box-shadow: 5px 5px 13px -5px rgba(0, 0, 0, 0.2);
    -webkit-box-shadow: 5px 5px 13px -5px rgba(0, 0, 0, 0.2);
    -moz-box-shadow: 5px 5px 13px -5px rgba(0, 0, 0, 0.2);
  }

  .image-wrapper.mobile {
    width: 100%;
  }

  .image-wrapper > .delete-button {
    position: absolute;
    top: 10px;
    right: 10px;
  }

  .image {
    width: auto;
    width: 300px;
    height: 300px;
    object-fit: contain;
  }

  .image.mobile {
    width: 100%;
  } */

  :global(.my-modal .bx--modal .bx--modal-container) {
    width: 90%;
  }
</style>

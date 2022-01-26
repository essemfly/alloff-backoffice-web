<script lang="ts">
  import { onMount } from "svelte";
  import {
    Grid,
    Row,
    Column,
    Button,
    TextInput,
    InlineLoading,
    NumberInput,
    ButtonSet,
  } from "carbon-components-svelte";
  import Save16 from "carbon-icons-svelte/lib/Save16";
  import TrashCan16 from "carbon-icons-svelte/lib/TrashCan16";

  import { Product, ProductsApi } from "../../api";
  import LoggedInFrame from "../common/LoggedInFrame.svelte";
  import InstructionAdder from "./components/InstructionAdder.svelte";
  import ContentBox from "./components/ContentBox.svelte";

  export let productId: string;

  let product: Product;
  let isLoading = true;
  let isTouched = true;
  let discountRate = "0";
  let inventoryTextInput = "";

  onMount(async () => {
    const productApi = new ProductsApi();
    const res = await productApi.productsRetrieve({ id: productId });
    product = res.data;
    isLoading = false;
    discountRate = (
      ((product.original_price - product.discounted_price) /
        product.original_price) *
      100
    ).toFixed(0);
  });

  const handleImageDelete = (id: number) => () => {
    // todo: remove image
  };

  const handleAddInventory = (fieldName: string) => () => {
    // todo
  };

  const handleChangeInventory = (index: number) => () => {
    // todo
  };

  const handleDeleteInventory = () => {
    // todo
  };

  const handleSubmit = () => {
    // todo add
  };
</script>

<LoggedInFrame>
  {#if isLoading}
    <InlineLoading status="active" description="On Loading..." />
  {:else}
    <div class="button-wrapper">
      <Button on:click={handleSubmit} disabled={!isTouched} icon={Save16}>
        {"수정"}
      </Button>
    </div>
    <Grid>
      <ContentBox>
        <h3>상품 정보</h3>
        <Row>
          <Column>
            <TextInput labelText={"상품명"} bind:value={product.alloff_name} />
            <TextInput
              labelText={"기존 가격"}
              bind:value={product.original_price}
            />
          </Column>
          <Column>
            <TextInput
              labelText={"브랜드"}
              bind:value={product.brand_kor_name}
            />
            <TextInput
              labelText={"할인된 가격 (할인율:" + discountRate + "%)"}
              bind:value={product.discounted_price}
            />
          </Column>
        </Row>
        <Row>
          <Column>
            <TextInput labelText="제품번호" bind:value={product.product_id} />
          </Column>
        </Row>
        <Row>
          <Column>
            <div class="bx--label">상품 이미지</div>
            <div class="image-container">
              {#each product.images as image, idx}
                <div class="image-wrapper">
                  <img
                    class="image"
                    src={image}
                    alt={[product.alloff_name, idx].join("_")}
                  />
                  <div class="delete-button">
                    <Button
                      tooltipPosition="bottom"
                      tooltipAlignment="end"
                      iconDescription="이미지 삭제"
                      icon={TrashCan16}
                      kind="danger"
                      on:click={handleImageDelete(idx)}
                    />
                  </div>
                </div>
              {/each}
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
      <ContentBox>
        <h3>재고 정보</h3>
        <Row>
          <Column>
            <TextInput
              labelText={"신규 사이즈 등록"}
              placeholder="작성 후 추가 버튼을 누르세요"
              bind:value={inventoryTextInput}
            />
            <Button
              kind="secondary"
              on:click={handleAddInventory(inventoryTextInput)}>추가</Button
            >
            {#each product.inventory as inv, i}
              <NumberInput
                label={inv.size}
                bind:value={inv.quantity}
                on:change={handleChangeInventory(i)}
              />
            {/each}
          </Column>
        </Row>
        <Row>
          <Column />
        </Row>
      </ContentBox>
      <Row>
        <ButtonSet class="right-button">
          <Button on:click={handleSubmit}>상품 수정</Button>
        </ButtonSet>
      </Row>
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

  :global(.my-modal .bx--modal .bx--modal-container) {
    width: 90%;
  }

  :global(.right-button) {
    margin-left: 1rem;
  }
</style>

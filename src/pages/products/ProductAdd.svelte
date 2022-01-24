<script lang="ts">
  import { onMount } from "svelte";
  import {
    Grid,
    Row,
    Column,
    ButtonSet,
    Button,
    TextInput,
    FileUploaderDropContainer,
    InlineLoading,
  } from "carbon-components-svelte";
  // import { AlloffProductBrand, Brand, BrandsApi } from "../../api";
  import LoggedInFrame from "../common/LoggedInFrame.svelte";
  import InstructionAdder from "./components/InstructionAdder.svelte";
  import ContentBox from "./components/ContentBox.svelte";

  import { AutocompleteItem } from "../../common/autocomplete/utils";
  import Autocomplete from "../../common/autocomplete/Autocomplete.svelte";
  import { AlloffProductBrand, Brand } from "./samples/response"; // todo: remove

  let discountrate = 0; // todo: fix
  let isImagesUploading = false;
  let inventoryTextInput = "";
  let brands: Brand[] = [];
  let productBrand: AlloffProductBrand;

  onMount(async () => {
    // todo: api integrate
    // const brandsAPi = new BrandsApi();
    // brands = (await brandsAPi.brandsList()).data;
  });

  const handleSubmit = () => {
    // todo
  };

  const handleBrandChange = (selectedValue: AutocompleteItem) => {
    const selectedBrand = brands.find((b) => b.id === selectedValue.key);
    if (!selectedBrand) return;
    productBrand = { _id: selectedBrand.id, ...selectedBrand };
  };

  const handleAddInventory = (fieldName: string) => () => {
    // todo
  };

  console.log("s");
</script>

<LoggedInFrame>
  <Grid>
    <h1>상품 등록</h1>
    <ContentBox>
      <h3>상품 정보</h3>
      <Row>
        <Column>
          <TextInput labelText={"상품명"} />
          <TextInput labelText={"기존 가격"} />
        </Column>
        <Column>
          <div class="bx--label">브랜드</div>
          <Autocomplete
            options={brands.map((brand) => ({
              key: brand.id,
              value: brand.korname,
              subvalue: brand.keyname,
            }))}
            onSubmit={handleBrandChange}
            placeholder="브랜드 이름/Keyname/ID로 검색"
            labelText="브랜드 검색"
            selectedValue={productBrand?.korname}
          />
          <TextInput labelText={"할인된 가격 (할인율:" + discountrate + "%)"} />
        </Column>
      </Row>
      <Row>
        <Column>
          <TextInput labelText="제품번호" />
        </Column>
      </Row>
      <Row>
        <Column>
          <div class="bx--label">상품 이미지</div>
          <div class="image-container" />
          {#if isImagesUploading}
            <InlineLoading
              status="active"
              description="이미지를 업로드하는 중..."
            />
          {/if}
          <FileUploaderDropContainer
            labelText="여기에 파일을 드래그하거나 이곳을 클릭해서 파일을 선택하세요."
            multiple
            accept={["image/*"]}
            on:add={async (e) => {
              const files = e.detail;
              isImagesUploading = true;
              for (let i = 0; i < files.length; i++) {
                // Needs refactoring --- keep the file sequence but upload asynchronously
                await Promise.resolve();
                // await imageApi
                //   .imageUploadUploadCreate({ file: files[i] })
                //   .then((res) => {
                //     const { random_key, url } = res.data;
                //     product.images = [...product.images, url];
                //   });
              }
              isImagesUploading = false;
            }}
          />
        </Column>
      </Row>
      <Row>
        <Column>
          <InstructionAdder instructionTitle="상품 설명" instructions={[]} />
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
        </Column>
      </Row>
      <Row>
        <Column />
      </Row>
    </ContentBox>
    <Row>
      <ButtonSet class="right-button">
        <Button on:click={handleSubmit}>상품 등록</Button>
      </ButtonSet>
    </Row>
  </Grid>
</LoggedInFrame>

<style>
</style>

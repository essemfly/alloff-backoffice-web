<script lang="ts">
  import InstructionAdder from "../components/InstructionAdder.svelte";
  import LoggedInFrame from "../../common/LoggedInFrame.svelte";
  import ContentBox from "../components/ContentBox.svelte";
  import ProductTemplateTable from "../components/ProductTemplateTable.svelte";
  import { AutocompleteItem } from "../../../common/autocomplete/utils";
  import Autocomplete from "../../../common/autocomplete/Autocomplete.svelte";
  import TrashCan16 from "carbon-icons-svelte/lib/TrashCan16";

  import {
    Grid,
    Row,
    Column,
    ButtonSet,
    Button,
    Modal,
    TextInput,
    ContentSwitcher,
    Switch,
    FileUploaderDropContainer,
    NumberInput,
    InlineLoading,
  } from "carbon-components-svelte";

  import {
    ImageUploadApi,
    TimedealProductTemplate,
    TimedealProductTemplatesApi,
    TimedealProductsApi,
    TimedealProductAddRequest,
    Brand,
    BrandsApiFactory,
    AlloffProductBrand,
  } from "../../../api";
  import type { DataTableRow } from "carbon-components-svelte/types/DataTable/DataTable";
  import { onMount } from "svelte";

  const templateApi = new TimedealProductTemplatesApi();
  const productApi = new TimedealProductsApi();
  const imageApi = new ImageUploadApi();

  export let mobile: boolean;
  export let productGroupId: string;
  export let productId: string;

  let templateModalOpen = false;
  let selectedIndex = -1;
  let templates: TimedealProductTemplate[] | undefined;

  let inventoryTextInput = "";

  let tempFault = {
    image: "",
    description: "",
  };
  let faultImageUploading = false;
  let productImagesUploading = false;

  let productBrand: AlloffProductBrand;
  let brands: Brand[] = [];

  let product: TimedealProductAddRequest = {
    faults: [],
    canceldescription: [],
    deliverydescription: [],
    description: [],
    sizedescription: [],
    instruction: {
      title: "",
      description: [],
    },
    discountrate: 0,
    discountedprice: 10000,
    originalprice: 10000,
    name: "",
    producttype: [],
    productgroupid: productGroupId,
    soldout: false,
    images: [],
    inventory: [],
    brandid: "",
    originalproductid: "",
  };

  $: discountrate = (
    ((product.originalprice - product.discountedprice) /
      product.originalprice) *
    100
  ).toFixed(0);

  onMount(async () => {
    const { data } = await BrandsApiFactory().brandsList();
    brands = data;

    if (productId !== "") {
      const { data } = await productApi.timedealProductsRetrieve({
        id: productId,
      });

      product = { ...data, brandid: data.brand._id };
      if (data.producttype[1] === "1년차 B품/샘플") {
        selectedIndex = 1;
      } else {
        selectedIndex = 0;
      }

      productBrand = data.brand;
    }
  });

  const loadTimedealProductTemplates = async () => {
    const templatesData = await templateApi.timedealProductTemplatesList({
      page: 1,
      size: 100,
    });

    templates = templatesData.data.results;
  };

  // UI Click funcions
  function openTemplateModal() {
    loadTimedealProductTemplates();
    templateModalOpen = true;
  }

  function addInventory(inventoryKey: string) {
    product.inventory = [
      ...product.inventory,
      { size: inventoryKey, quantity: 1 },
    ];
    inventoryTextInput = "";
  }

  const handleChooseBrand = (selectedValue: AutocompleteItem) => {
    const selectedBrand = brands.find((b) => b.id === selectedValue.key);
    if (!selectedBrand) return;
    productBrand = { _id: selectedBrand.id, ...selectedBrand };
  };

  function selectProductType(type: number) {
    if (type === 0) {
      product.producttype = ["타임딜", "아울렛 특가"];
      product.instruction = {
        title: "아울렛 특가 유의사항",
        description: [
          "본 상품은 팩토리 아울렛 및 현대/롯데/신세계 프리미엄 아울렛에서 판매하는 아울렛 특가 상품입니다.",
          "아울렛 특가 상품은 보관 및 매장 진열 과정에서 포장 부자재, 택 누락이 있을 수 있습니다. 아래 상품설명을 꼭 확인해주세요.",
        ],
      };
    } else if (type === 1) {
      product.producttype = ["타임딜", "1년차 B품/샘플"];
      product.instruction = {
        title: "1년차 B품/샘플 유의사항",
        description: [
          "본 상품은 스크래치/진열/미세 오염 등의 사유로 저렴하게 판매하는 1년차 아울렛 상품입니다.",
          "아래 [B품/샘플 상세정보]를 통해 자세한 사진과 설명을 꼭 확인해주세요.",
        ],
      };
    }
  }

  function addFaultInfo() {
    if (product.faults) {
      product.faults = [...product.faults, tempFault];
    } else {
      product.faults = [tempFault];
    }
    tempFault = {
      image: "",
      description: "",
    };
  }

  function loadTemplateData(data: DataTableRow) {
    templateModalOpen = false;
    Object.assign(product, data);
    if (data.producttype[1] == "1년차 B품/샘플") {
      selectedIndex = 1;
    } else if (data.producttype[1] == "아울렛 특가") {
      selectedIndex = 0;
    } else {
      selectedIndex = -1;
    }

    product = product;
    productBrand = data.brand;
  }

  function handleInventoryChange(idx: number) {
    if (product.inventory[idx].quantity < 1) {
      product.inventory.splice(idx, 1);
    }
  }

  const deleteProductImage = (idx: number) => {
    product.images.splice(idx, 1);
    product = product;
  };

  const saveTimedealProduct = async () => {
    const newProduct: TimedealProductAddRequest = {
      ...product,
    };

    newProduct.brandid = productBrand._id;

    await productApi
      .timedealProductsCreate({
        timedealProductAddRequest: newProduct,
      })
      .then((res) => {
        if (res.status === 201) {
          window.location.href =
            "/timedeals/" + product.productgroupid + "#products";
        } else {
          console.log(res);
          alert("오류가 발생했습니다: " + res.statusText);
        }
      })
      .catch((err) => {
        alert("에러가 발생했습니다: " + err);
        console.log(err);
      });
  };

  const editTimedealProduct = async () => {
    const newProduct: TimedealProductAddRequest = {
      ...product,
    };

    newProduct.brandid = productBrand._id;
    if (newProduct.instruction.thumbnail == null) {
      delete newProduct.instruction.thumbnail;
    }

    await productApi
      .timedealProductsUpdate({
        id: productId,
        timedealProductAddRequest: newProduct,
      })
      .then((res) => {
        if (res.status === 200) {
          window.location.href =
            "/timedeals/" + product.productgroupid + "#products";
        } else {
          console.log(res);
          alert("오류가 발생했습니다: " + res.statusText);
        }
      })
      .catch((err) => {
        alert("에러가 발생했습니다: " + err);
        console.log(err);
      });
  };
</script>

<LoggedInFrame>
  <Grid>
    <Row>
      <ButtonSet class="right-button">
        <Button on:click={openTemplateModal}>템플릿 불러오기</Button>
      </ButtonSet>
      <div class="my-modal">
        <Modal
          passiveModal
          preventCloseOnClickOutside
          modalHeading="템플릿 불러오기"
          on:open
          on:close
          bind:open={templateModalOpen}
        >
          <ProductTemplateTable
            templateData={templates}
            onCloseModal={(data) => loadTemplateData(data)}
          />
        </Modal>
      </div>
    </Row>

    <ContentBox>
      <h3>상품 정보</h3>
      <Row>
        <Column>
          <TextInput labelText={"상품명"} bind:value={product.name} />
          <TextInput
            labelText={"기존 가격"}
            bind:value={product.originalprice}
          />
        </Column>
        <Column>
          <div class="bx--label">브랜드</div>
          <Autocomplete
            options={brands.map((brand) => ({
              key: brand.id,
              value: brand.korname,
              subvalue: brand.keyname,
            }))}
            onSubmit={handleChooseBrand}
            placeholder="브랜드 이름/Keyname/ID로 검색"
            labelText="브랜드 검색"
            selectedValue={productBrand?.korname}
          />
          <TextInput
            labelText={"할인된 가격 (할인율:" + discountrate + "%)"}
            bind:value={product.discountedprice}
          />
        </Column>
      </Row>
      <Row>
        <Column>
          <TextInput
            labelText="제품번호"
            bind:value={product.originalproductid}
          />
        </Column>
      </Row>
      <Row>
        <Column>
          <div class="bx--label">상품 이미지</div>
          <div class="image-container">
            {#each product.images as image, idx}
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
            {/each}
          </div>
          {#if productImagesUploading}
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
              productImagesUploading = true;
              for (let i = 0; i < files.length; i++) {
                // Needs refactoring --- keep the file sequence but upload asynchronously
                await imageApi
                  .imageUploadUploadCreate({ file: files[i] })
                  .then((res) => {
                    const { random_key, url } = res.data;
                    product.images = [...product.images, url];
                  });
              }
              productImagesUploading = false;
            }}
          />
        </Column>
      </Row>
      <Row>
        <Column>
          <div class="bx--label">상품 타입</div>
          <ContentSwitcher
            bind:selectedIndex
            on:click={() => selectProductType(selectedIndex)}
          >
            <Switch text="아울렛 특가" />
            <Switch text="1년차 B품/샘플" />
          </ContentSwitcher>
          <InstructionAdder
            instructionTitle={product.instruction?.title}
            instructions={product.instruction === null
              ? []
              : product.instruction.description}
          />
        </Column>
        <Column>
          {#if selectedIndex === 1}
            <span class="bx--label" style="margin-top: 0;">하자 정보</span>
            {#if tempFault.image !== ""}
              <img class="image" src={tempFault.image} alt="timedeal" />
            {/if}
            {#if faultImageUploading}
              <InlineLoading
                status="active"
                description="이미지를 업로드하는 중..."
              />
            {/if}
            <FileUploaderDropContainer
              labelText="여기에 파일을 드래그하거나 이곳을 클릭해서 파일을 선택하세요."
              accept={["image/*"]}
              on:add={(e) => {
                const file = e.detail[0];
                tempFault.image = "";
                faultImageUploading = true;
                imageApi.imageUploadUploadCreate({ file }).then((res) => {
                  const { random_key, url } = res.data;
                  tempFault.image = url;
                  faultImageUploading = false;
                });
              }}
            />
            <TextInput
              placeholder="작성 후 추가 버튼을 누르세요"
              bind:value={tempFault.description}
            />
            <Button kind="secondary" on:click={addFaultInfo}>추가</Button>
            {#if product.faults && product.faults.length > 0}
              {#each product.faults as fault}
                <img class="image" src={fault.image} alt="timedeal-products" />
                <span>{fault.description}</span>
              {/each}
            {/if}
          {/if}
        </Column>
      </Row>
      <Row>
        <Column>
          <InstructionAdder
            instructionTitle="사이즈 정보"
            instructions={product.sizedescription
              ? product.sizedescription
              : []}
          />
        </Column>
        <Column>
          <InstructionAdder
            instructionTitle="상품 설명"
            instructions={product.description ? product.description : []}
          />
        </Column>
      </Row>
      <Row>
        <Column>
          <InstructionAdder
            instructionTitle="배송 안내"
            instructions={product.deliverydescription}
          />
        </Column>
        <Column>
          <InstructionAdder
            instructionTitle="취소/교환/반품"
            instructions={product.canceldescription}
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
            on:click={() => addInventory(inventoryTextInput)}>추가</Button
          >

          {#each product.inventory as inv, i}
            <NumberInput
              label={inv.size}
              bind:value={inv.quantity}
              on:change={() => handleInventoryChange(i)}
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
        {#if productId === ""}
          <Button on:click={saveTimedealProduct}>상품 생성</Button>
        {:else}
          <Button on:click={editTimedealProduct}>상품 수정</Button>
        {/if}
      </ButtonSet>
    </Row>
  </Grid>
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
  }

  :global(.my-modal .bx--modal .bx--modal-container) {
    width: 90%;
  }
</style>

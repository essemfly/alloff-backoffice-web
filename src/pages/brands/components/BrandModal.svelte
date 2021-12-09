<script lang="ts">
  import {
    FileUploaderDropContainer,
    TextInput,
    Modal,
    Button,
    RadioButtonGroup,
    RadioButton,
    Grid,
    Row,
    Column,
    InlineLoading,
  } from "carbon-components-svelte";

  import TrashCan16 from "carbon-icons-svelte/lib/TrashCan16";

  import { BrandsApi, ImageUploadApi, BrandRequest } from "../../../api";

  export let isModalOpen: boolean = false;
  export let onCloseModal: () => void;

  let newBrandInput: BrandRequest = {
    keyname: "",
    korname: "",
    engname: "",
    logoimgurl: "",
    description: "",
    sizeguide: [],
    onpopular: false,
    isopen: false,
    ishide: false,
  };

  let imageUploading = false;
  let onPopular: string = newBrandInput.onpopular === true ? "true" : "false";
  let isHide: string = newBrandInput.ishide === true ? "true" : "false";
  let isOpen: string = newBrandInput.isopen === true ? "true" : "false";
  let tempGuide = {
    label: "",
    imgurl: "",
  };

  const brandApi = new BrandsApi();
  const imageApi = new ImageUploadApi();

  const addBrand = async () => {
    newBrandInput.ishide = isHide === "true" ? true : false;
    newBrandInput.isopen = isOpen === "true" ? true : false;
    newBrandInput.onpopular = onPopular === "true" ? true : false;

    if (
      newBrandInput.keyname === "" ||
      newBrandInput.korname === "" ||
      newBrandInput.engname === ""
    ) {
      alert("상점 명이 입력되지 않았습니다.");
      return;
    }

    if (newBrandInput.logoimgurl === "") {
      alert("로고사진을 입력해주세요");
      return;
    }

    if (newBrandInput.description === "") {
      alert("브랜드 설명을 입력해주세요");
      return;
    }

    brandApi
      .brandsCreate({ brandRequest: newBrandInput })
      .then((res) => {
        if (res.status == 201) {
          onCloseModal();
        } else {
          alert("에러가 발생했습니다. 관리자에게 알려주세요");
          console.log(res);
        }
      })
      .catch((err) => {
        alert("에러가 발생했습니다. 관리자에게 알려주세요");
        console.log(err);
      });
  };

  const addSizeGuide = async () => {
    if (tempGuide.label === "" || tempGuide.imgurl === "") {
      alert("가이드의 라벨이나, 이미지를 추가해주세요.");
      return;
    }
    if (newBrandInput.sizeguide) {
      newBrandInput.sizeguide = [...newBrandInput.sizeguide, tempGuide];
    } else {
      newBrandInput.sizeguide = [tempGuide];
    }

    tempGuide = {
      label: "",
      imgurl: "",
    };
  };

  const deleteSizeGuide = async (idx: number) => {
    newBrandInput.sizeguide?.splice(idx, 1);
    newBrandInput = newBrandInput;
  };
</script>

<Modal
  preventCloseOnClickOutside
  modalHeading="브랜드 추가"
  on:open
  primaryButtonText="브랜드 생성"
  secondaryButtonText="취소"
  on:click:button--secondary={onCloseModal}
  on:close={onCloseModal}
  bind:open={isModalOpen}
  on:submit={addBrand}
>
  <Grid>
    <Row>
      <Column>
        <TextInput
          labelText="브랜드 키네임"
          bind:value={newBrandInput.keyname}
        />
        <TextInput
          labelText="브랜드명(한글)"
          bind:value={newBrandInput.korname}
        />
        <TextInput
          labelText="브랜드명(영문)"
          bind:value={newBrandInput.engname}
        />
        <TextInput labelText="설명" bind:value={newBrandInput.description} />
      </Column>
      <Column>
        <RadioButtonGroup
          legendText="인기있는 브랜드"
          bind:selected={onPopular}
        >
          <RadioButton labelText="True" value="true" />
          <RadioButton labelText="False" value="false" />
        </RadioButtonGroup>
        <RadioButtonGroup legendText="브랜드 오픈여부" bind:selected={isOpen}>
          <RadioButton labelText="Open" value="true" />
          <RadioButton labelText="Closed" value="false" />
        </RadioButtonGroup>
        <RadioButtonGroup legendText="숨김처리" bind:selected={isHide}>
          <RadioButton labelText="Yes" value="true" />
          <RadioButton labelText="No" value="false" />
        </RadioButtonGroup>
        <div style="display: grid;">
          <div class="bx--label">로고 이미지</div>
          {#if newBrandInput.logoimgurl != ""}
            <img
              class="image-preview-modal"
              src={newBrandInput.logoimgurl}
              alt="new-brand-logo"
            />
          {/if}
          {#if imageUploading}
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
              newBrandInput.logoimgurl = "";
              imageUploading = true;
              imageApi
                .imageUploadUploadCreate({ file, path: "brands" })
                .then((res) => {
                  const { random_key, url } = res.data;
                  newBrandInput.logoimgurl = url;
                  imageUploading = false;
                });
            }}
          />
        </div>
      </Column>
    </Row>
    <Row>
      <Column>
        <TextInput
          labelText="가이드 영역 추가"
          placeholder="가이드 영역 이름"
          bind:value={tempGuide.label}
        />
        {#if tempGuide.imgurl != ""}
          <div style="display: grid;">
            <img
              class="image-preview-modal"
              src={tempGuide.imgurl}
              alt="new-brand-logo"
            />
          </div>
        {/if}
        <FileUploaderDropContainer
          labelText="여기에 파일을 드래그하거나 이곳을 클릭해서 파일을 선택하세요."
          accept={["image/*"]}
          on:add={(e) => {
            const file = e.detail[0];
            tempGuide.imgurl = "";

            imageApi
              .imageUploadUploadCreate({ file, path: "sizeguides" })
              .then((res) => {
                const { random_key, url } = res.data;
                tempGuide.imgurl = url;
              });
          }}
        />
        <Button kind="secondary" on:click={() => addSizeGuide()}>추가</Button>
      </Column>

      <Column>
        {#if newBrandInput.sizeguide && newBrandInput.sizeguide.length > 0}
          <div class="bx--label">가이드 이미지</div>
          <div>
            {#each newBrandInput.sizeguide as guide, idx}
              <div class="delete-guide-button">
                <p>{guide.label}</p>
                <Button
                  tooltipPosition="bottom"
                  tooltipAlignment="end"
                  iconDescription="사이즈 삭제"
                  icon={TrashCan16}
                  kind="danger"
                  on:click={() => deleteSizeGuide(idx)}
                />
              </div>
              <img
                class="image-preview-modal"
                src={guide.imgurl}
                alt="guide_image"
              />
            {/each}
          </div>
        {:else}
          <div class="bx--label">가이드 이미지</div>
          <div>이미지가 없습니다.</div>
        {/if}
      </Column>
    </Row>
  </Grid>
</Modal>

<style>
  :global(.bx--form-item) {
    margin: 1rem 0;
  }
  :global(.image-preview-modal) {
    max-width: 250px;
  }
</style>

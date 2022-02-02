<script lang="ts">
  import {
    Button,
    Tag,
    RadioButtonGroup,
    RadioButton,
    FileUploaderDropContainer,
    TextInput,
  } from "carbon-components-svelte";

  import TrashCan16 from "carbon-icons-svelte/lib/TrashCan16";
  import { Brand, BrandsApi, ImageUploadApi } from "../../../api";

  const brandApi = new BrandsApi();
  const imageApi = new ImageUploadApi();

  export let brand: Brand;
  export let mobile: boolean;

  let tempGuide = {
    label: "",
    imgurl: "",
  };

  let onPopular: string = brand.onpopular === true ? "true" : "false";
  let isHide: string = brand.ishide === true ? "true" : "false";
  let isOpen: string = brand.isopen === true ? "true" : "false";

  const deleteBrand = async (brand: Brand) => {
    if (confirm("브랜드를 완전히 삭제하시겠습니까?")) {
      brandApi
        .brandsDestroy({
          id: brand.id,
        })
        .then((res) => {
          console.log("RES", res);
        });
    }
  };

  const deleteSizeGuide = async (idx: number) => {
    brand.sizeguide?.splice(idx, 1);
    brand.sizeguide = brand.sizeguide;
    brandApi
      .brandsPartialUpdate({
        id: brand.id,
        patchedBrandRequest: {
          sizeguide: brand.sizeguide,
        },
      })
      .then((res) => {
        if (res.status !== 200) {
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

    if (brand.sizeguide) {
      brand.sizeguide = [...brand.sizeguide, tempGuide];
    } else {
      brand.sizeguide = [tempGuide];
    }

    tempGuide = {
      label: "",
      imgurl: "",
    };

    brandApi
      .brandsPartialUpdate({
        id: brand.id,
        patchedBrandRequest: {
          sizeguide: brand.sizeguide,
        },
      })
      .then((res) => {
        console.log("res", res);
      });
  };

  const updateStatus = async () => {
    brandApi
      .brandsPartialUpdate({
        id: brand.id,
        patchedBrandRequest: {
          onpopular: onPopular === "true" ? true : false,
          isopen: isOpen === "true" ? true : false,
          ishide: isHide === "true" ? true : false,
        },
      })
      .then((res) => {
        console.log("res", res);
      });
  };
</script>

<div class="brand" class:mobile>
  <div class="delete-button">
    <Button
      tooltipPosition="bottom"
      tooltipAlignment="end"
      iconDescription="상품 삭제"
      icon={TrashCan16}
      kind="danger"
      on:click={() => deleteBrand(brand)}
    />
  </div>
  <div class="image">
    <img src={brand.logo_image_url} alt="img" />
  </div>
  <div class="info">
    <Tag>{brand.keyname}</Tag>
    <p>{brand.korname}</p>
    <p>{brand.description}</p>
    <p>최대 할인율: {brand.maxdiscountrate}%</p>
    <hr />
    <RadioButtonGroup
      legendText="인기있는 브랜드"
      bind:selected={onPopular}
      on:change={updateStatus}
    >
      <RadioButton labelText="True" value="true" />
      <RadioButton labelText="False" value="false" />
    </RadioButtonGroup>
    <RadioButtonGroup
      legendText="브랜드 오픈여부"
      bind:selected={isOpen}
      on:change={updateStatus}
    >
      <RadioButton labelText="Open" value="true" />
      <RadioButton labelText="Closed" value="false" />
    </RadioButtonGroup>
    <RadioButtonGroup
      legendText="숨김처리"
      bind:selected={isHide}
      on:change={updateStatus}
    >
      <RadioButton labelText="Yes" value="true" />
      <RadioButton labelText="No" value="false" />
    </RadioButtonGroup>
    <hr />
    <div class="bx--label">사이즈 가이드</div>
    {#if brand.sizeguide && brand.sizeguide.length > 0}
      {#each brand.sizeguide as guide, idx}
        <div>
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
          <img class="guide_image" src={guide.imgurl} alt="guide_image" />
        </div>
      {/each}
      <div />
    {/if}
    <div>
      <TextInput
        labelText="가이드 추가"
        placeholder="가이드 영역 이름"
        bind:value={tempGuide.label}
      />
      {#if tempGuide.imgurl !== ""}
        <img
          class="image-preview-modal"
          src={tempGuide.imgurl}
          alt="new-brand-logo"
        />
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
    </div>
  </div>
</div>

<style>
  .brand {
    position: relative;
    margin: 15px;
    width: 300px;
    background-color: white;
    -webkit-box-shadow: 3px 3px 10px -5px rgba(0, 0, 0, 0.4);
    -moz-box-shadow: 3px 3px 10px -5px rgba(0, 0, 0, 0.4);
    box-shadow: 3px 3px 10px -5px rgba(0, 0, 0, 0.4);
    border-radius: 10px;
    overflow: hidden;
  }

  .brand:first-of-type {
    margin-left: 0;
  }

  .brand.mobile {
    margin-left: 0;
    margin-right: 0;
    width: 100%;
  }

  .brand > .delete-button {
    position: absolute;
    top: 10px;
    right: 10px;
  }

  .brand > .image {
    height: 200px;
  }

  .brand > .image > img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .brand > .info {
    padding: 10px;
  }

  .brand > .info > p {
    font-size: 1rem;
    margin: 0.2rem 0;
  }

  :global(.guide_image) {
    width: 90%;
  }
</style>

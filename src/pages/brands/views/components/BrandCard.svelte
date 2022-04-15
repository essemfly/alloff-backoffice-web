<script lang="ts">
  import { apiConfigs } from "@app/store";
  import {
    Button,
    Tag,
    RadioButtonGroup,
    RadioButton,
    FileUploaderDropContainer,
    TextInput,
  } from "carbon-components-svelte";
  import TrashCan16 from "carbon-icons-svelte/lib/TrashCan16";

  import {
    Brand,
    BrandsApi,
    ImageUploadApi,
  } from "@lessbutter/alloff-backoffice-api";
  import ImageUploadInput from "@app/components/ImageUploadInput.svelte";

  const brandApi = new BrandsApi($apiConfigs);
  const imageApi = new ImageUploadApi($apiConfigs);

  export let brand: Brand;
  export let mobile: boolean;

  let tempGuide = {
    label: "",
    image_url: "",
  };

  let isPopular: string = brand.is_popular === true ? "true" : "false";
  let isHide: string = brand.in_maintenance === true ? "true" : "false";
  let isOpen: string = brand.is_open === true ? "true" : "false";

  // const deleteBrand = async (brand: Brand) => {
  //   if (confirm("브랜드를 완전히 삭제하시겠습니까?")) {
  //     brandApi
  //       .brandsDestroy({
  //         id: brand.id,
  //       })
  //       .then((res) => {
  //         console.log("RES", res);
  //       });
  //   }
  // };

  const deleteSizeGuide = async (idx: number) => {
    brand.size_guide?.splice(idx, 1);
    brand.size_guide = brand.size_guide;
    brandApi
      .brandsPartialUpdate({
        id: brand.brand_id,
        patchedBrandRequest: {
          keyname: brand.keyname,
          size_guide: brand.size_guide,
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
    if (tempGuide.label === "" || tempGuide.image_url === "") {
      alert("가이드의 라벨이나, 이미지를 추가해주세요.");
      return;
    }

    if (brand.size_guide) {
      brand.size_guide = [...brand.size_guide, tempGuide];
    } else {
      brand.size_guide = [tempGuide];
    }

    tempGuide = {
      label: "",
      image_url: "",
    };

    brandApi
      .brandsPartialUpdate({
        id: brand.brand_id,
        patchedBrandRequest: {
          keyname: brand.keyname,
          size_guide: brand.size_guide,
        },
      })
      .then((res) => {
        console.log("res", res);
      });
  };

  const updateStatus = async () => {
    brandApi
      .brandsPartialUpdate({
        id: brand.brand_id,
        patchedBrandRequest: {
          keyname: brand.keyname,
          is_popular: isPopular === "true" ? true : false,
          is_open: isOpen === "true" ? true : false,
          in_maintenance: isHide === "true" ? true : false,
        },
      })
      .then((res) => {
        console.log("res", res);
      });
  };

  const handleBackgroundImageUpdate = async (event: CustomEvent<string>) => {
    const value = event.detail;
    const res = await brandApi.brandsPartialUpdate({
      id: brand.brand_id,
      patchedBrandRequest: {
        keyname: brand.keyname,
        back_image_url: value,
      },
    });

    console.log(event.detail);
  };
</script>

<div class="brand" class:mobile>
  <!-- <div class="delete-button">
    <Button
      tooltipPosition="bottom"
      tooltipAlignment="end"
      iconDescription="상품 삭제"
      icon={TrashCan16}
      kind="danger"
      on:click={() => deleteBrand(brand)}
    />
  </div> -->
  <div class="image">
    <img src={brand.logo_image_url} alt="img" />
  </div>
  <div class="info">
    <Tag>{brand.keyname}</Tag>
    <p>{brand.korname}</p>
    <p>{brand.description}</p>
    <hr />
    <RadioButtonGroup
      legendText="인기있는 브랜드"
      bind:selected={isPopular}
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
    <ImageUploadInput
      label={"배경 이미지"}
      bind:value={brand.back_image_url}
      on:change={handleBackgroundImageUpdate}
    />
    <hr />
    <div class="bx--label">사이즈 가이드</div>
    {#if brand.size_guide && brand.size_guide.length > 0}
      {#each brand.size_guide as guide, idx}
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
          <img class="guide_image" src={guide.image_url} alt="guide" />
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
      {#if tempGuide.image_url !== ""}
        <img
          class="image-preview-modal"
          src={tempGuide.image_url}
          alt="new-brand-logo"
        />
      {/if}
      <FileUploaderDropContainer
        labelText="여기에 파일을 드래그하거나 이곳을 클릭해서 파일을 선택하세요."
        accept={["image/*"]}
        on:add={(e) => {
          const file = e.detail[0];
          tempGuide.image_url = "";
          imageApi
            .imageUploadUploadCreate({ file, path: "size_guides" })
            .then((res) => {
              const { random_key, url } = res.data;
              tempGuide.image_url = url;
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

  /* .brand > .delete-button {
    position: absolute;
    top: 10px;
    right: 10px;
  } */

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

  .image-preview-modal {
    max-width: 100%;
  }
</style>

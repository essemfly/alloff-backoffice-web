<script lang="ts">
  import Autocomplete from "../../../common/autocomplete/Autocomplete.svelte";
  import {
    Button,
    FileUploaderDropContainer,
    Form,
    FormGroup,
    TextInput,
    NumberInput,
  } from "carbon-components-svelte";
  import DocumentAdd16 from "carbon-icons-svelte/lib/DocumentAdd16";
  import Save16 from "carbon-icons-svelte/lib/Save16";
  import TrashCan16 from "carbon-icons-svelte/lib/TrashCan16";
  import {
    Brand,
    BrandsApiFactory,
    ImageUploadApi,
    PatchedTimedealRequest,
    TimedealProduct,
    TimedealProductsApi,
    TimedealRequest,
  } from "../../../api";
  import { RemovableStringList } from "../../../helpers/removeable-string-list";
  import StringList from "../../common/StringList.svelte";
  import { AutocompleteItem } from "../../../common/autocomplete/utils";
  import { onMount } from "svelte";
  import { settings } from "../../../core/constants";

  export let product: TimedealProduct | undefined = undefined;
  export let load: (() => Promise<void>) | undefined = undefined;
  export let mobile: boolean;
  export let api: TimedealProductsApi;
  export let submitting: boolean;

  const imageApi = new ImageUploadApi();

  let {
    brand,
    canceldescription,
    deliverydescription,
    discountedprice,
    discountrate,
    images,
    instruction,
    inventory,
    name,
    originalprice,
    producttype,
    sizedescription,
    faults,
    description,
    soldout,
  } = product ?? {
    brand: undefined,
    canceldescription: settings.presets.cancelDescriptions,
    deliverydescription: settings.presets.deliveryDescriptions,
    discountedprice: undefined,
    discountrate: undefined,
    images: undefined,
    instruction: { title: "", description: [] },
    inventory: undefined,
    name: undefined,
    originalprice: undefined,
    producttype: undefined,
    sizedescription: undefined,
    faults: undefined,
    description: undefined,
    soldout: undefined,
  };

  const { map: _images, ...imageManager } = RemovableStringList.from({
    initialValues: images,
    onChange: (state) => {},
  });
  let partial: PatchedTimedealRequest = {};
  let complete: TimedealRequest | undefined;

  let valid = true;
  let startTimeValid = true;
  let finishTimeValid = true;

  let touched = false;

  $: {
    // const _newStartTime = DateTime.fromISO(startDate + "T" + startTime)
    //   .toUTC()
    //   .toISO();
    // const _newFinishTime = DateTime.fromISO(finishDate + "T" + finishTime)
    //   .toUTC()
    //   .toISO();
    // startTimeValid = _newStartTime !== null;
    // finishTimeValid = _newFinishTime !== null;
    // const newStartTime =
    //   _newStartTime === start?.toUTC().toISO() ? undefined : _newStartTime;
    // const newFinishTime =
    //   _newFinishTime === finish?.toUTC().toISO() ? undefined : _newFinishTime;
    // const titleTouched = title !== (timedeal?.title ?? "");
    // const shorttitleTouched = shorttitle !== (timedeal?.shorttitle ?? "");
    // const imageurlTouched = image?.url !== imgurl;
    // if ((newStartTime || starttime) && (newFinishTime || finishtime)) {
    //   newStatus.set(
    //     getTimedealStatus(
    //       new Date(newStartTime ?? starttime),
    //       new Date(newFinishTime ?? finishtime)
    //     )
    //   );
    // }
    // if (
    //   newStartTime ||
    //   newFinishTime ||
    //   titleTouched ||
    //   shorttitleTouched ||
    //   imageurlTouched
    // ) {
    //   touched = true;
    // }
    // if (
    //   newStartTime &&
    //   newFinishTime &&
    //   title !== "" &&
    //   image &&
    //   image.url !== ""
    // ) {
    //   const newComplete: TimedealRequest = {
    //     finishtime: newFinishTime,
    //     starttime: newStartTime,
    //     imgurl: image.url,
    //     title,
    //     instruction,
    //   };
    //   complete = newComplete;
    // }
    // const newPartial = {
    //   ...partial,
    //   starttime: newStartTime,
    //   finishtime: newFinishTime,
    //   title: titleTouched ? title : undefined,
    //   shorttitle: shorttitleTouched ? shorttitle : undefined,
    //   imgurl: imageurlTouched ? image?.url : undefined,
    //   instruction,
    // };
    // partial = Object.fromEntries(
    //   Object.entries(newPartial).filter(([_, val]) => !!val)
    // );
    // touched = Object.entries(partial).length > 0;
    // const formValid =
    //   startTimeValid && finishTimeValid && title !== "" && image?.url !== "";
    // valid = timedeal ? formValid : formValid && !!complete;
  }

  const submit = async () => {
    // submitting = true;
    // if (timedeal) {
    //   try {
    //     await api.timedealsPartialUpdate({
    //       id: timedeal.id,
    //       patchedTimedealRequest: partial,
    //     });
    //   } catch (e: any) {
    //     alert("타임딜 수정 도중 문제가 발생했습니다!");
    //   } finally {
    //     submitting = false;
    //     if (load) return load();
    //   }
    // } else {
    //   if (complete) {
    //     try {
    //       const { data } = await api.timedealsCreate({
    //         timedealRequest: complete,
    //       });
    //       window.location.href = `../timedeals/${data.id}`;
    //     } catch (e: any) {
    //       alert("타임딜 저장 도중 문제가 발생했습니다!");
    //     } finally {
    //       submitting = false;
    //       if (load) return load();
    //     }
    //   }
    // }
  };

  let search = "";

  let brands: Brand[] = [];
  onMount(async () => {
    const { data } = await BrandsApiFactory().brandsList();
    brands = data;
  });

  const handleSubmit = (selectedValue: AutocompleteItem) => {
    const selectedBrand = brands.find((b) => b.id === selectedValue.key);
    if (!selectedBrand) return;
    const { id, ...rest } = selectedBrand;
    brand = { _id: id, ...rest };
  };

  $: discountrate =
    discountedprice && originalprice
      ? Math.round((1 - discountedprice / originalprice) * 100)
      : undefined;
</script>

<div style="height: 10px" />
<div class="button-wrapper">
  <Button
    on:click={submit}
    disabled={!touched || !valid}
    icon={product ? Save16 : DocumentAdd16}>{product ? "수정" : "추가"}</Button
  >
</div>
<div style="height: 10px" />

<h4>기본정보</h4>
<div class="form-group" class:mobile>
  <TextInput size="xl" labelText="상품명" bind:value={name} />
  <div>
    <h6>
      선택된 브랜드: {brand ? `${brand.korname} (${brand.keyname})` : "없음"}
    </h6>
    <div style="height: 10px" />
    <Autocomplete
      options={brands.map((brand) => ({
        key: brand.id,
        value: brand.korname,
        subvalue: brand.keyname,
      }))}
      onSubmit={handleSubmit}
      placeholder="브랜드 이름/Keyname/ID로 검색"
      labelText="브랜드 검색"
      selectedValue={brand?.korname}
    />
  </div>
</div>
<div style="height: 20px" />

<h4>가격 (할인율: {discountrate ? `${discountrate}%` : "-"})</h4>
<div class="form-group" class:mobile>
  <NumberInput label="기존 가격" bind:value={originalprice} />
  <NumberInput label="할인된 가격" bind:value={discountedprice} />
</div>
<div style="height: 20px" />

<h4>상품 이미지</h4>
<div style="height: 10px" />
<div class="image-container">
  {#each $_images as image}
    <div class="image-wrapper" class:mobile>
      <img class="image" class:mobile src={image.body} alt="timedeal" />
      <div class="delete-button">
        <Button
          tooltipPosition="bottom"
          tooltipAlignment="end"
          iconDescription="이미지 삭제"
          icon={TrashCan16}
          kind="danger"
          on:click={() => imageManager.remove(image.key)}
        />
      </div>
    </div>
  {/each}
</div>
<div style="height: 10px" />
<FileUploaderDropContainer
  labelText="드래그하거나 클릭해서 파일을 선택하세요"
  accept={["image/*"]}
  multiple
  on:add={(e) => {
    const files = e.detail;
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      imageApi.imageUploadUploadCreate({ file }).then((res) => {
        const { url } = res.data;
        imageManager.add(url);
      });
    }
  }}
/>

<h4>안내사항</h4>
<div class="form-group start" class:mobile>
  <div>
    <h6>사이즈 정보</h6>
    <StringList
      color="blue"
      initialValues={sizedescription ?? []}
      onChange={(state) => {
        sizedescription = state.map(({ body }) => body);
      }}
    />
  </div>
  <div>
    <h6>상품 설명</h6>
    <StringList
      color="yellow"
      initialValues={description ?? []}
      onChange={(state) => {
        description = state.map(({ body }) => body);
      }}
    />
  </div>
</div>

<div class="form-group start" class:mobile>
  <div>
    <h6>배송 안내</h6>
    <StringList
      color="green"
      initialValues={deliverydescription}
      onChange={(state) => {
        deliverydescription = state.map(({ body }) => body);
      }}
    />
  </div>
  <div>
    <h6>취소/교환/반품</h6>
    <StringList
      color="pink"
      initialValues={canceldescription}
      onChange={(state) => {
        description = state.map(({ body }) => body);
      }}
    />
  </div>
</div>

<div style="height: 20px" />

<!-- <h6>타임딜 설명</h6>

<StringList
  initialValues={instruction.description}
  onChange={(state) => {
    instruction = {
      ...instruction,
      description: state.map(({ body }) => body),
    };
  }}
/> -->
<style>
  h4 {
    margin-bottom: 15px;
    margin-top: 10px;
  }

  .form-group {
    display: grid;
    grid-template-columns: 1fr 1fr;
    align-items: flex-end;
    grid-gap: 15px;
    margin-bottom: 20px;
  }

  .form-group.start {
    align-items: flex-start;
  }

  .form-group.mobile {
    grid-template-columns: 1fr;
  }

  .button-wrapper {
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
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
</style>

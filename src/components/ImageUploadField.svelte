<script lang="ts">
  import { toast } from "@zerodevx/svelte-toast";
  import { createEventDispatcher, onMount } from "svelte";
  import {
    Button,
    FileUploaderDropContainer,
    InlineLoading,
  } from "carbon-components-svelte";
  import TrashCan16 from "carbon-icons-svelte/lib/TrashCan16";

  import { ImageUploadApi } from "@api";

  export let label: string;
  export let value: string | string[];
  export let multiple = false;
  export let disabled: boolean = false;

  let images: string[] = [];
  let isImageUploading = false;

  const imageApi = new ImageUploadApi();
  const dispatch = createEventDispatcher();

  onMount(() => {
    if (value) {
      if (multiple) {
        images = (value as string[]) ?? [];
      } else {
        images = [value as string] ?? [];
      }
    }
  });

  $: if (value) {
    if (multiple) {
      images = (value as string[]) ?? [];
    } else {
      images = [value as string] ?? [];
    }
  }

  const handleImageAdd = async (event: CustomEvent<FileList>) => {
    try {
      isImageUploading = true;
      const promises = Array.from(event.detail).map((file: File) =>
        imageApi.imageUploadUploadCreate({ file }),
      );
      const res = await Promise.all(promises);
      res.forEach(({ data: { url } }) => {
        if (multiple) {
          updateValue([...value, url]);
        } else {
          updateValue([url]);
        }
      });
    } catch (e) {
      toast.push("이미지 등록 중 오류가 발생했습니다.");
    } finally {
      isImageUploading = false;
    }
  };

  const handleImageDelete = (index: number) => () => {
    images.splice(index, 1);
    updateValue(images);
  };

  const updateValue = (updatedValue: string[]) => {
    images = updatedValue;
    if (multiple) {
      value = images;
    } else {
      value = images[0];
    }
    dispatch("change", value);
  };
</script>

<div class="bx--label">{label}</div>
<div class="image-container">
  {#each images as image, idx}
    <div class="image-wrapper">
      <img class="image" src={image} alt={[label, idx].join("_")} />
      <div class="delete-button">
        <Button
          tooltipPosition="bottom"
          tooltipAlignment="end"
          iconDescription="이미지 삭제"
          icon={TrashCan16}
          kind="danger"
          on:click={handleImageDelete(idx)}
          {disabled}
        />
      </div>
    </div>
  {/each}
</div>
{#if isImageUploading}
  <InlineLoading status="active" description="이미지를 업로드하는 중..." />
{/if}
<FileUploaderDropContainer
  labelText="여기에 파일을 드래그하거나 이곳을 클릭해서 파일을 선택하세요."
  {multiple}
  accept={["image/*"]}
  on:add={handleImageAdd}
  {disabled}
/>

<style>
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

  .image-wrapper:last-child {
    margin-right: 0;
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
    max-width: 100%;
    object-fit: contain;
  }
</style>

<script lang="ts">
  import {
    Button,
    FileUploaderDropContainer,
    InlineLoading,
  } from "carbon-components-svelte";
  import TrashCan16 from "carbon-icons-svelte/lib/TrashCan16";
  import { ImageUploadApi } from "../api";

  export let label: string;
  export let value: string[];
  export let multiple = false;

  let isImageUploading = false;

  const imageApi = new ImageUploadApi();

  const handleImageAdd = async (event: CustomEvent<FileList>) => {
    const files = event.detail;
    isImageUploading = true;
    for (let i = 0; i < files.length; i++) {
      // Needs refactoring --- keep the file sequence but upload asynchronously
      await imageApi.imageUploadUploadCreate({ file: files[i] }).then((res) => {
        const { url } = res.data;
        value = [...value, url];
      });
    }
    isImageUploading = false;
  };

  const handleImageDelete = (index: number) => () => {
    value.splice(index, 1);
    value = value;
  };
</script>

<div class="bx--label">{label}</div>
<div class="image-container">
  {#each value as image, idx}
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
</style>

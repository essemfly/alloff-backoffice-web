<script lang="ts">
  import { toast } from "@zerodevx/svelte-toast";
  import { createEventDispatcher, onMount } from "svelte";
  import {
    Button,
    FileUploaderDropContainer,
    InlineLoading,
    StructuredList,
    StructuredListRow,
    StructuredListBody,
    StructuredListCell,
  } from "carbon-components-svelte";
  import TrashCan16 from "carbon-icons-svelte/lib/TrashCan16";

  import { ImageUploadApi } from "@api";
  import SortButtonSet from "./SortButtonSet.svelte";

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

  const handleImageAdd = async (event: CustomEvent<File[]>) => {
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

  const handleImageRemove = (index: number) => () => {
    images.splice(index, 1);
    updateValue(images);
  };

  const handleSortChange = (event: CustomEvent<string[]>) => {
    images = event.detail;
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

<div class="image-upload-field">
  {#if label}
    <div class="bx--label">{label}</div>
  {/if}
  <FileUploaderDropContainer
    labelText="여기에 파일을 드래그하거나 이곳을 클릭해서 파일을 선택하세요."
    {multiple}
    accept={["image/*"]}
    on:add={handleImageAdd}
    {disabled}
  />

  <StructuredList condensed flush>
    <StructuredListBody>
      {#each value as item, index}
        <StructuredListRow class="image-upload-field-box-list-item">
          <StructuredListCell>
            <div class="image-wrapper">
              <img class="image" src={item} alt={[label, index].join("_")} />
            </div>
          </StructuredListCell>
          <StructuredListCell noWrap>
            <SortButtonSet
              value={images}
              {index}
              on:change={handleSortChange}
            />
            <Button
              size="small"
              icon={TrashCan16}
              kind="danger"
              class="memo-delete"
              iconDescription="Delete"
              on:click={handleImageRemove(index)}
            />
          </StructuredListCell>
        </StructuredListRow>
      {/each}
    </StructuredListBody>
  </StructuredList>
  {#if isImageUploading}
    <InlineLoading status="active" description="이미지를 업로드하는 중..." />
  {/if}
</div>

<style>
  .image {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }

  .image-wrapper {
    width: 300px;
    height: 300px;
    position: relative;
    background-color: var(--ui-03);
    border-radius: 2px;
  }

  .image-upload-field :global(.bx--structured-list) {
    margin-bottom: 0;
  }
</style>

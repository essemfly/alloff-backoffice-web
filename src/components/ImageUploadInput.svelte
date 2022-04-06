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
    Toggle,
  } from "carbon-components-svelte";
  import TrashCan16 from "carbon-icons-svelte/lib/TrashCan16";

  import { ImageUploadApi } from "@api";
  import SortButtonSet from "./SortButtonSet.svelte";

  export let label: string = "";
  export let value: string | string[] | undefined;
  export let multiple = false;
  export let disabled: boolean = false;
  export let helperText: string = "";
  export let errorText: string = "";
  export let hasThumbnail: boolean = false;
  export let thumbnail: string = "";

  let images: string[] = [];
  let isImageUploading = false;
  let toggleIndex = 0;

  const imageApi = new ImageUploadApi();
  const dispatch = createEventDispatcher();

  onMount(() => {
    if (value) {
      if (multiple) {
        images = (value as string[]) ?? [];
        if (hasThumbnail) {
          if (thumbnail) {
            toggleIndex = images.indexOf(thumbnail);
          } else {
            toggleIndex = 0;
          }
          thumbnail = images[toggleIndex];
        }
      } else {
        images = [value as string] ?? [];
      }
    }
  });

  $: if (value) {
    if (multiple) {
      images = (value as string[]) ?? [];
      if (hasThumbnail) {
        if (thumbnail) {
          toggleIndex = images.indexOf(thumbnail);
        } else {
          toggleIndex = 0;
        }
        thumbnail = images[toggleIndex];
      }
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

  const handleToggle =
    (index: number) => (event: CustomEvent<{ toggled: boolean }>) => {
      const { toggled } = event.detail;
      if (hasThumbnail) {
        if (toggled) {
          thumbnail = images[index];
          toggleIndex = index;
          dispatch("change:thumbnail", toggleIndex > 0 ? thumbnail : undefined);
        } else if (!toggled && index === toggleIndex) {
          thumbnail = images[0];
          toggleIndex = 0;
          dispatch("change:thumbnail", undefined);
        }
      }
    };
</script>

<div class="image-upload-input">
  {#if label}
    <div class="bx--label">{label}</div>
  {/if}
  <FileUploaderDropContainer
    labelText="여기에 파일을 드래그하거나 이곳을 클릭해서 파일을 선택하세요."
    {multiple}
    accept={["image/*"]}
    on:add={handleImageAdd}
    {disabled}
    {...!!errorText ? { "data-invalid": true } : {}}
  />
  {#if !!helperText && !errorText}
    <div class="bx--form__helper-text">{helperText}</div>
  {/if}
  {#if !!errorText}
    <div class="bx--form-requirement">{errorText}</div>
  {/if}

  <StructuredList condensed flush>
    <StructuredListBody>
      {#each images as item, index (index)}
        <StructuredListRow class="image-upload-input-box-list-item">
          <StructuredListCell>
            <div class="image-wrapper">
              <img class="image" src={item} alt={[label, index].join("_")} />
            </div>
          </StructuredListCell>
          {#if hasThumbnail}
            <StructuredListCell>
              <Toggle
                labelText="대표 이미지"
                size="sm"
                toggled={index === toggleIndex}
                on:toggle={handleToggle(index)}
              />
            </StructuredListCell>
          {/if}
          <StructuredListCell noWrap>
            {#if multiple}
              <SortButtonSet
                value={images}
                {index}
                on:change={handleSortChange}
              />
            {/if}
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

  .image-upload-input :global(.bx--structured-list) {
    margin-bottom: 0;
  }

  .bx--form-requirement {
    display: block;
    max-height: none;
    color: var(--danger-01);
  }

  .image-upload-input
    :global(.bx--file[data-invalid] .bx--file__drop-container) {
    outline: 2px solid var(--danger-01);
    outline-offset: -2px;
    color: var(--danger-01);
  }

  .image-upload-input :global(.bx--file-browse-btn) {
    margin-bottom: 0;
  }
</style>

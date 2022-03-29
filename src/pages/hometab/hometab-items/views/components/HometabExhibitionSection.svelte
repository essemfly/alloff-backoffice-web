<script lang="ts">
  import { onMount } from "svelte";
  import { InlineLoading, FormGroup } from "carbon-components-svelte";

  import { ExhibitionsApi } from "@api";
  import { AutocompleteItem } from "@app/components/autocomplete";
  import ContentBox from "@app/components/ContentBox.svelte";
  import MultilineTextInput from "@app/components/MultilineTextInput.svelte";
  import { AutocompleteField, ImageUploadField } from "@app/components/form";

  import { HometabItemType } from "../../constants";
  import { schema, formStore } from "../../models/schema";

  let exhibitions: AutocompleteItem[] = [];
  let isLoading = false;

  const exhibitionApi = new ExhibitionsApi();

  const load = async () => {
    isLoading = true;
    try {
      const res = await exhibitionApi.exhibitionsList();
      exhibitions = res.data.exhibitions.map(
        ({ exhibition_id, title, subtitle }) => ({
          key: exhibition_id,
          label: title,
          value: exhibition_id,
          subvalue: subtitle,
        }),
      );
    } finally {
      isLoading = false;
    }
  };

  onMount(load);

  const handleExhibitionChange = (event: CustomEvent<AutocompleteItem>) => {
    formStore.update({
      contents: {
        ...$formStore.fields.contents,
        exhibitionIds: event.detail ? [event.detail.value] : [],
      },
    });
  };

  $: selectedExhibitionId = $formStore.fields.contents?.exhibitionIds
    ? $formStore.fields.contents?.exhibitionIds[0]
    : "";
</script>

<ContentBox title={`${HometabItemType.Exhibition} 정보`}>
  {#if isLoading}
    <InlineLoading status="active" description="Loading..." />
  {:else}
    <FormGroup>
      <ImageUploadField
        schema={schema.fields.backImageUrl.required()}
        errorText={$formStore.errors.backImageUrl}
        bind:value={$formStore.fields.backImageUrl}
      />
    </FormGroup>
    <FormGroup>
      <MultilineTextInput
        label="상품 설명"
        bind:value={$formStore.fields.tags}
      />
    </FormGroup>
    <FormGroup>
      <AutocompleteField
        options={exhibitions}
        schema={schema.fields.contents?.fields.exhibitionIds
          .required()
          .meta({ placeholder: "기획전 이름/ID로 검색" })}
        errorText={$formStore.errors.contents?.exhibitionIds}
        value={selectedExhibitionId}
        on:select={handleExhibitionChange}
      />
    </FormGroup>
  {/if}
</ContentBox>

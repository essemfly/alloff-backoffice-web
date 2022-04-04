<script lang="ts">
  import { onMount } from "svelte";
  import { FormGroup, InlineLoading } from "carbon-components-svelte";

  import { ExhibitionsApi, ExhibitionTypeEnum } from "@api";
  import { AutocompleteItem } from "@app/components/autocomplete";
  import ContentBox from "@app/components/ContentBox.svelte";
  import Dot from "@app/components/Dot.svelte";
  import {
    AutocompleteField,
    ImageUploadField,
    TextAreaField,
    TextField,
    ToggleField,
  } from "@app/components/form";

  import { schema, formStore } from "../../models/schema";

  export let isAdding: boolean = false;

  let exhibitions: AutocompleteItem[] = [];
  let isLoading = false;

  const exhibitionApi = new ExhibitionsApi();

  const load = async () => {
    isLoading = true;
    try {
      const res = await exhibitionApi.exhibitionsList({
        exhibitionType: ExhibitionTypeEnum.Normal,
      });
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
</script>

<ContentBox title="배너 정보">
  <div class="button-right-wrapper">
    <Dot label="필수 입력 사항" />
  </div>
  {#if isLoading}
    <InlineLoading status="active" description="Loading..." />
  {:else}
    {#if !isAdding}
      <FormGroup>
        <TextField
          schema={schema.fields.bannerId}
          bind:value={$formStore.fields.bannerId}
          readonly
        />
      </FormGroup>
    {/if}
    <FormGroup>
      <ImageUploadField
        schema={schema.fields.bannerImage}
        errorText={$formStore.errors.bannerImage}
        bind:value={$formStore.fields.bannerImage}
      />
    </FormGroup>
    <FormGroup>
      <TextAreaField
        schema={schema.fields.title}
        errorText={$formStore.errors.title}
        bind:value={$formStore.fields.title}
      />
    </FormGroup>
    <FormGroup>
      <TextAreaField
        schema={schema.fields.subtitle}
        bind:value={$formStore.fields.subtitle}
        errorText={$formStore.errors.subtitle}
      />
    </FormGroup>
    <FormGroup>
      <TextField
        schema={schema.fields.weight}
        bind:value={$formStore.fields.weight}
        errorText={$formStore.errors.weight}
      />
    </FormGroup>
    <FormGroup>
      <ToggleField
        schema={schema.fields.isLive}
        bind:value={$formStore.fields.isLive}
        errorText={$formStore.errors.isLive}
      />
    </FormGroup>
    <FormGroup>
      <AutocompleteField
        options={exhibitions}
        schema={schema.fields.exhibitionId}
        errorText={$formStore.errors.exhibitionId}
        bind:value={$formStore.fields.exhibitionId}
      />
    </FormGroup>
  {/if}
</ContentBox>

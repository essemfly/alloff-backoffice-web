<script lang="ts">
  import {
    Row,
    Column,
    TextInput,
    NumberInput,
    Toggle,
  } from "carbon-components-svelte";

  import { TopBanner, ExhibitionsApi } from "@api";
  import { AutocompleteItem } from "@app/components/autocomplete";
  import ContentBox from "@app/components/ContentBox.svelte";
  import ImageUploadField from "@app/components/ImageUploadField.svelte";
  import { onMount } from "svelte";
  import Autocomplete from "@app/components/autocomplete/Autocomplete.svelte";

  export let form: TopBanner;
  export let isAdding: boolean = false;

  let exhibitions: AutocompleteItem[] = [];

  const exhibitionApi = new ExhibitionsApi();

  const handleExhibitionChange = (value?: AutocompleteItem) => {
    form.exhibition_id = value?.key ?? "";
  };

  onMount(async () => {
    const res = await exhibitionApi.exhibitionsList();
    exhibitions = res.data.exhibitions.map(
      ({ exhibition_id, title, subtitle }) => ({
        key: exhibition_id,
        value: title,
        subvalue: subtitle,
      }),
    );
  });
</script>

<ContentBox>
  <h3>배너 정보</h3>
  {#if !isAdding}
    <Row>
      <Column>
        <TextInput labelText={"ID"} bind:value={form.banner_id} readonly />
      </Column>
    </Row>
  {/if}
  <Row>
    <Column>
      <ImageUploadField label={"배너 이미지"} bind:value={form.banner_image} />
    </Column>
  </Row>
  <Row>
    <Column>
      <TextInput labelText={"타이틀"} bind:value={form.title} />
    </Column>
  </Row>
  <Row>
    <Column>
      <TextInput labelText={"서브 타이틀"} bind:value={form.subtitle} />
    </Column>
  </Row>
  <Row>
    <Column>
      <NumberInput label={"가중치"} bind:value={form.weight} />
    </Column>
  </Row>
  <Row>
    <Column>
      <Toggle labelText="활성화 여부" bind:toggled={form.is_live} />
    </Column>
  </Row>
  <Row>
    <Column>
      <div class="bx--label">관련 기획전</div>
      <Autocomplete
        options={exhibitions}
        onSubmit={handleExhibitionChange}
        keepValueOnSubmit
      />
    </Column>
  </Row>
</ContentBox>

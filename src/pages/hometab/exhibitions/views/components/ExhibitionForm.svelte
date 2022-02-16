<script lang="ts">
  import { Row, Column, TextInput } from "carbon-components-svelte";

  import { Exhibition } from "@api";
  import ContentBox from "@app/components/ContentBox.svelte";
  import ImageUploadField from "@app/components/ImageUploadField.svelte";
  import DateTimePicker from "@app/components/DateTimePicker.svelte";

  export let form: Exhibition;
  export let isAdding: boolean = false;
</script>

<ContentBox>
  <h3>기획전 정보</h3>
  {#if !isAdding}
    <Row>
      <Column>
        <TextInput labelText={"ID"} bind:value={form.exhibition_id} readonly />
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
      <ImageUploadField
        label={"썸네일 이미지"}
        bind:value={form.thumbnail_image}
      />
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
      <TextInput labelText={"상세"} bind:value={form.description} />
    </Column>
  </Row>
  <Row>
    <Column>
      <DateTimePicker label={"시작일"} bind:value={form.start_time} />
    </Column>
    <Column>
      <DateTimePicker label={"종료일"} bind:value={form.finish_time} />
    </Column>
  </Row>
</ContentBox>

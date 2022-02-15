<script lang="ts">
  import { Button, Form, FormGroup, TextInput } from "carbon-components-svelte";

  import Nav from "@app/components/Nav.svelte";
  import ContentBox from "@app/components/ContentBox.svelte";
  import ImageUploadField from "@app/components/ImageUploadField.svelte";

  const handleSubmit = () => {
    // todo
  };
</script>

<Nav title="배너 추가">
  <h1>배너 추가</h1>
  <Form on:submit={handleSubmit}>
    <div class="button-wrapper mb10">
      <Button on:click={handleSubmit}>배너 등록</Button>
    </div>

    <ContentBox>
      <FormGroup>
        <ImageUploadField label="배너 이미지" value="" />
      </FormGroup>
      <FormGroup>
        <TextInput labelText="제목" required />
      </FormGroup>
      <FormGroup>
        <TextInput labelText="부제목" required />
      </FormGroup>
    </ContentBox>
  </Form>
</Nav>

<style>
  .button-wrapper {
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
  }

  .mb10 {
    margin-bottom: 10px;
  }

  .mt10 {
    margin-top: 10px;
  }
</style>

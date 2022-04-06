<script lang="ts">
  import Editor from "cl-editor";
  import {
    Button,
    Checkbox,
    Column,
    FormGroup,
    NumberInput,
    Row,
    TextInput,
  } from "carbon-components-svelte";
  import TrashCan16 from "carbon-icons-svelte/lib/TrashCan16";

  import ButtonTextInput from "@app/components/ButtonTextInput.svelte";
  import ContentBox from "@app/components/ContentBox.svelte";
  import Dot from "@app/components/Dot.svelte";
  import ImageUploadInput from "@app/components/ImageUploadInput.svelte";
  import MultilineTextInput from "@app/components/MultilineTextInput.svelte";
  import {
    TextField,
    ToggleField,
    BrandSelectField,
    CategorySelectField,
  } from "@app/components/form";

  import ProductCategoryClassifiedTag from "./ProductCategoryClassifiedTag.svelte";
  import { FormSchema, formStore, schema } from "../../models/schema";

  export let isAdding: boolean = false;

  let discountRate = "0";
  let descriptionInfoLabelTextInput = "";
  let productInfoLabelTextInput = "";
  let inventoryTextInput = "";
  let useHtml = false;
  let html = $formStore.fields.rawHtml ?? "";

  const handleAddInventory = () => {
    const inventory = [
      ...($formStore.fields.inventory ?? []),
      { size: inventoryTextInput, quantity: 1 },
    ];
    formStore.update({ inventory });
    inventoryTextInput = "";
  };

  const handleChangeInventory = (index: number) => () => {
    if (($formStore.fields.inventory ?? [])[index].quantity < 1) {
      // zero inventory means remove
      handleDeleteInventory(index);
    }
  };

  const handleDeleteInventory = (index: number) => () => {
    const newValue = ($formStore.fields.inventory ?? []).slice();
    newValue.splice(index, 1);
    formStore.update({ inventory: newValue });
  };

  const handleInfoAdd =
    (fieldName: keyof FormSchema) => (event: CustomEvent) => {
      formStore.update({
        [fieldName]: {
          ...($formStore.fields[fieldName] as any),
          [event.detail]: "",
        },
      });
      descriptionInfoLabelTextInput = "";
      productInfoLabelTextInput = "";
    };

  const handleInfoChange =
    (fieldName: keyof FormSchema, label: string) => (event: CustomEvent) => {
      formStore.update({
        [fieldName]: {
          ...($formStore.fields[fieldName] as any),
          [label]: event.detail,
        },
      });
    };

  const handleInfoDelete =
    (fieldName: keyof FormSchema, label: string) => () => {
      const { [label]: _, ...newValue } = $formStore.fields[fieldName];
      formStore.update({ [fieldName]: newValue });
    };

  $: if ($formStore.fields.originalPrice && $formStore.fields.discountedPrice) {
    discountRate = (
      (($formStore.fields.originalPrice - $formStore.fields.discountedPrice) /
        $formStore.fields.originalPrice) *
      100
    ).toFixed(0);
  }

  $: {
    formStore.update({ rawHtml: useHtml ? html : null });
  }
</script>

<ContentBox title="상품 정보">
  <div class="button-right-wrapper">
    <Dot label="필수 입력 사항" />
  </div>
  {#if !isAdding}
    <FormGroup>
      <TextField
        schema={schema.fields.alloffProductId}
        bind:value={$formStore.fields.alloffProductId}
        readonly
      />
    </FormGroup>
  {/if}
  <Row padding>
    <Column>
      <TextField
        schema={schema.fields.alloffName}
        errorText={$formStore.errors.alloffName}
        bind:value={$formStore.fields.alloffName}
      />
    </Column>
    <Column>
      <BrandSelectField
        schema={schema.fields.brandKeyName}
        selectedBrandName={$formStore.fields.brandKorName}
        errorText={$formStore.errors.brandKeyName}
        bind:value={$formStore.fields.brandKeyName}
      />
    </Column>
  </Row>
  <Row padding>
    <Column>
      <TextField
        schema={schema.fields.originalPrice}
        errorText={$formStore.errors.originalPrice}
        bind:value={$formStore.fields.originalPrice}
      />
    </Column>
    <Column>
      <TextField
        schema={schema.fields.discountedPrice}
        errorText={$formStore.errors.discountedPrice}
        bind:value={$formStore.fields.discountedPrice}
        label={`할인가 (할인율: ${discountRate}%)`}
      />
    </Column>
    <Column>
      <TextField
        schema={schema.fields.specialPrice}
        errorText={$formStore.errors.specialPrice}
        bind:value={$formStore.fields.specialPrice}
      />
    </Column>
  </Row>
  <Row padding>
    <Column>
      {#if !isAdding}
        <ProductCategoryClassifiedTag
          isClassifiedTouched={$formStore.fields.isClassifiedTouched}
          isClassifiedDone={$formStore.fields.isClassifiedDone}
        />
      {/if}
      <CategorySelectField
        schema={schema.fields.alloffCategoryId}
        errorText={$formStore.errors.alloffCategoryId}
        bind:value={$formStore.fields.alloffCategoryId}
        initialCategoryName={$formStore.fields.alloffCategoryName ?? undefined}
      />
    </Column>
    <Column>
      <TextField
        schema={schema.fields.productUrl}
        errorText={$formStore.errors.productUrl}
        bind:value={$formStore.fields.productUrl}
      />
    </Column>
  </Row>
  <Row padding>
    <Column>
      <ImageUploadInput
        label={"상품 이미지"}
        bind:value={$formStore.fields.images}
        bind:thumbnail={$formStore.fields.thumbnailImage}
        hasThumbnail
        multiple
      />
    </Column>
  </Row>
  <Row padding>
    <Column>
      <MultilineTextInput
        label="상품 설명"
        bind:value={$formStore.fields.description}
      />
    </Column>
  </Row>
  <Row padding>
    <Column>
      <ImageUploadInput
        label={"상품 설명 이미지"}
        bind:value={$formStore.fields.descriptionImages}
        multiple
      />
    </Column>
  </Row>
  <Row padding>
    <Column>
      <TextField
        schema={schema.fields.totalScore}
        errorText={$formStore.errors.totalScore}
        bind:value={$formStore.fields.totalScore}
      />
    </Column>
  </Row>

  <Row padding>
    <Column>
      <ButtonTextInput
        label={"상품 정보"}
        placeholder="작성 후 추가 버튼을 누르세요"
        bind:value={descriptionInfoLabelTextInput}
        on:click={handleInfoAdd("descriptionInfos")}
        buttonText="추가"
      />
      <div class="inventory-item-list">
        {#each Object.entries($formStore.fields.descriptionInfos) ?? [] as [label, text], index}
          <div class="inventory-item">
            <label for={label}>{label}</label>
            <TextInput
              bind:value={text}
              on:change={handleInfoChange("descriptionInfos", label)}
            />
            <div class="delete-button">
              <Button
                tooltipPosition="bottom"
                tooltipAlignment="end"
                iconDescription="삭제"
                icon={TrashCan16}
                kind="danger"
                on:click={handleInfoDelete("descriptionInfos", label)}
              />
            </div>
          </div>
        {/each}
      </div>
    </Column>
  </Row>
  <Row padding>
    <Column>
      <ButtonTextInput
        label={"상품정보 제공고시"}
        placeholder="작성 후 추가 버튼을 누르세요"
        bind:value={productInfoLabelTextInput}
        on:click={handleInfoAdd("productInfos")}
        buttonText="추가"
      />
      <div class="inventory-item-list">
        {#each Object.entries($formStore.fields.productInfos) ?? [] as [label, text], index}
          <div class="inventory-item">
            <label for={label}>{label}</label>
            <TextInput
              bind:value={text}
              on:change={handleInfoChange("productInfos", label)}
            />
            <div class="delete-button">
              <Button
                tooltipPosition="bottom"
                tooltipAlignment="end"
                iconDescription="삭제"
                icon={TrashCan16}
                kind="danger"
                on:click={handleInfoDelete("productInfos", label)}
              />
            </div>
          </div>
        {/each}
      </div>
    </Column>
  </Row>
</ContentBox>
<ContentBox title="배송 관련 정보">
  <div class="button-right-wrapper">
    <Dot label="필수 입력 사항" />
  </div>
  <Row padding>
    <Column>
      <TextField
        schema={schema.fields.earliestDeliveryDays}
        errorText={$formStore.errors.earliestDeliveryDays}
        bind:value={$formStore.fields.earliestDeliveryDays}
      />
    </Column>
    <Column>
      <TextField
        schema={schema.fields.latestDeliveryDays}
        errorText={$formStore.errors.latestDeliveryDays}
        bind:value={$formStore.fields.latestDeliveryDays}
      />
    </Column>
  </Row>
  <Row padding>
    <Column>
      <TextField
        schema={schema.fields.refundFee}
        errorText={$formStore.errors.refundFee}
        bind:value={$formStore.fields.refundFee}
      />
    </Column>
  </Row>
  <Row padding>
    <Column>
      <ToggleField
        schema={schema.fields.isRefundPossible}
        errorText={$formStore.errors.isRefundPossible}
        bind:value={$formStore.fields.isRefundPossible}
      />
    </Column>
    <Column>
      <ToggleField
        schema={schema.fields.isForeignDelivery}
        errorText={$formStore.errors.isForeignDelivery}
        bind:value={$formStore.fields.isForeignDelivery}
      />
    </Column>
  </Row>
</ContentBox>
<ContentBox title="재고 정보">
  <div class="button-right-wrapper">
    <Dot label="필수 입력 사항" />
  </div>
  <Row padding>
    <Column>
      <ToggleField
        schema={schema.fields.isRemoved}
        errorText={$formStore.errors.isRemoved}
        bind:value={$formStore.fields.isRemoved}
      />
    </Column>
    <Column>
      <ToggleField
        schema={schema.fields.isSoldout}
        errorText={$formStore.errors.isSoldout}
        bind:value={$formStore.fields.isSoldout}
      />
    </Column>
  </Row>

  <Row padding>
    <Column>
      <ButtonTextInput
        label={"신규 사이즈 등록"}
        placeholder="작성 후 추가 버튼을 누르세요"
        bind:value={inventoryTextInput}
        on:click={handleAddInventory}
        buttonText="추가"
      />
      <div class="inventory-item-list">
        {#each $formStore.fields.inventory ?? [] as inv, index}
          <div class="inventory-item">
            <label for={inv.size}>{inv.size}</label>
            <NumberInput
              bind:value={inv.quantity}
              min={0}
              on:change={handleChangeInventory(index)}
            />
            <div class="delete-button">
              <Button
                tooltipPosition="bottom"
                tooltipAlignment="end"
                iconDescription="재고 삭제"
                icon={TrashCan16}
                kind="danger"
                on:click={handleDeleteInventory(index)}
              />
            </div>
          </div>
        {/each}
      </div>
    </Column>
  </Row>
</ContentBox>
<ContentBox title="HTML 상품 정보">
  <Checkbox labelText={"HTML 상품 정보 사용"} bind:checked={useHtml} />
  <p>{"<>"}버튼을 누르면 HTML 태그를 직접 복사/붙여넣기 할 수 있습니다.</p>
  <p>
    <span style="color: red; font-weight: bold;">
      HTML 상품 정보를 사용하면, 상품설명 이미지와 상품설명이 모두
      덮어씌워집니다!
    </span>
  </p>
  {#if useHtml}
    <div style="margin-top: 20px;">
      <Editor bind:html on:change={(evt) => (html = evt.detail)} />
    </div>
  {/if}
</ContentBox>

<style>
  .inventory-item-list {
    margin-top: 10px;
  }

  .inventory-item label {
    width: 80px;
  }

  .inventory-item {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-start;
    margin-bottom: 5px;
  }

  .inventory-item :global(.bx--btn) {
    height: 2.5rem;
    min-height: auto;
    padding: 10px;
  }
</style>

<script lang="ts">
  import { FormGroup } from "carbon-components-svelte";

  import { Exhibition, ProductGroup } from "@lessbutter/alloff-backoffice-api";
  import { TextField, RadioField } from "@app/components/form";
  import ContentBox from "@app/components/ContentBox.svelte";
  import Dot from "@app/components/Dot.svelte";
  import ExhibitionListSection from "@app/components/ExhibitionListSection.svelte";

  import {
    NotificationType,
    NotificationTypeEnum,
  } from "../../models/Notification";
  import { formStore, schema } from "../../models/schema";
  import ProductGroupSection from "./ProductGroupSection.svelte";

  let selectedExhibition: Exhibition;

  const disabled = [
    "EventNotification",
    "ProductDiffNotification",
    "BrandNewProductNotification",
    "BrandOpenNotification",
  ];

  const notiTypes = Object.keys(NotificationType).map((key) => ({
    key,
    label: NotificationType[key as keyof typeof NotificationType],
    value:
      NotificationTypeEnum[key as keyof typeof NotificationTypeEnum].toString(),
    disabled: disabled.includes(key),
  }));

  const handleExhibitionChange = (event: CustomEvent<Exhibition>) => {
    formStore.update({ referenceId: event.detail.exhibition_id });
    selectedExhibition = event.detail;
  };

  const handleProductGroupSelect = (event: CustomEvent<ProductGroup>) => {
    formStore.update({ referenceId: event.detail.product_group_id });
  };

  const handleChange = (event: CustomEvent<string>) => {
    const notiType = event.detail;
    switch ($formStore.fields.notiType) {
      case NotificationTypeEnum.ExhibitionNotification:
        formStore.update({
          referenceId: "",
          notiType,
        });

        break;
      case NotificationTypeEnum.GeneralNotification:
        formStore.update({ referenceId: "/", notiType });
        break;
      default:
      // pass
    }
  };
</script>

<ContentBox title="푸시알림 정보">
  <div class="row-right-wrapper">
    <Dot label="필수 입력 사항" />
  </div>
  <FormGroup>
    <TextField
      schema={schema.fields.title}
      errorText={$formStore.errors.title}
      bind:value={$formStore.fields.title}
    />
  </FormGroup>
  <FormGroup>
    <TextField
      schema={schema.fields.message}
      errorText={$formStore.errors.message}
      bind:value={$formStore.fields.message}
    />
  </FormGroup>
  <FormGroup>
    <RadioField
      schema={schema.fields.notiType}
      errorText={$formStore.errors.notiType}
      bind:value={$formStore.fields.notiType}
      options={notiTypes}
      on:change={handleChange}
    />
  </FormGroup>
  <FormGroup>
    {#if $formStore.fields.notiType === NotificationTypeEnum.ExhibitionNotification}
      <div class="bx--label">
        관련 기획전
        <Dot kind="danger" />
      </div>
      {#if !!$formStore.errors.referenceId}
        <div class="bx--form-requirement">{$formStore.errors.referenceId}</div>
      {/if}
      <ExhibitionListSection
        byExhibitionType
        value={selectedExhibition ? [selectedExhibition?.exhibition_id] : []}
        on:select={handleExhibitionChange}
      />
    {:else if $formStore.fields.notiType === NotificationTypeEnum.TimedealOpenNotification}
      <div class="bx--label">
        타임딜
        <Dot kind="danger" />
      </div>
      {#if !!$formStore.errors.referenceId}
        <div class="bx--form-requirement">{$formStore.errors.referenceId}</div>
      {/if}
      <ProductGroupSection
        bind:value={$formStore.fields.referenceId}
        on:select={handleProductGroupSelect}
      />
    {/if}
  </FormGroup>
</ContentBox>

<style>
  .bx--form-requirement {
    display: block;
    max-height: none;
    color: var(--danger-01);
  }
</style>

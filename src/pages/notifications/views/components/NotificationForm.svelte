<script lang="ts">
  import { FormGroup } from "carbon-components-svelte";

  import { Exhibition, ProductGroupsApi } from "@api";
  import { AutocompleteItem } from "@app/components/autocomplete";
  import {
    TextField,
    RadioField,
    AutocompleteField,
  } from "@app/components/form";
  import ContentBox from "@app/components/ContentBox.svelte";
  import Dot from "@app/components/Dot.svelte";

  import {
    NotificationType,
    NotificationTypeEnum,
  } from "../../models/Notification";
  import { formStore, schema } from "../../models/schema";
  import ExhibitionListSection from "./ExhibitionListSection.svelte";

  let productGroupOptions: AutocompleteItem[] = [];
  let selectedValue = "";
  let selectedExhibition: Exhibition;

  const productGroupsApi = new ProductGroupsApi();

  const disabledNotiTypes = [
    "TimedealOpenNotification",
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
    disabled: disabledNotiTypes.includes(key),
  }));

  const loadProductGroupList = async () => {
    const res = await productGroupsApi.productGroupsList();
    productGroupOptions = res.data.pgs.map(
      ({ product_group_id, title, short_title }) => ({
        key: product_group_id,
        value: title,
        subvalue: short_title,
      }),
    );
  };

  const handleProductGroupChange = (selected?: AutocompleteItem) => {
    if (selected) {
      formStore.update({ referenceId: selected.key });
      selectedValue = selected.value;
    }
  };

  const handleExhibitionChange = (event: CustomEvent<Exhibition>) => {
    formStore.update({ referenceId: event.detail.exhibition_id });
    selectedExhibition = event.detail;
  };

  $: if ($formStore.fields.notiType) {
    switch ($formStore.fields.notiType) {
      // it is deprecated. just remain for older apis
      case NotificationTypeEnum.TimedealOpenNotification:
        if (productGroupOptions.length === 0) {
          loadProductGroupList();
        }
        break;
      case NotificationTypeEnum.GeneralNotification:
        formStore.update({ referenceId: "/" });
        break;
      default:
      // pass
    }
  }
</script>

<ContentBox title="푸시알림 정보">
  <div class="button-right-wrapper">
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
    />
  </FormGroup>
  <FormGroup>
    {#if $formStore.fields.notiType === NotificationTypeEnum.TimedealOpenNotification}
      <AutocompleteField
        onSubmit={handleProductGroupChange}
        options={productGroupOptions}
        schema={schema.fields.referenceId}
        errorText={$formStore.errors.referenceId}
        bind:value={selectedValue}
      />
    {:else if $formStore.fields.notiType === NotificationTypeEnum.ExhibitionNotification}
      <div class="bx--label">관련 기획전</div>
      <ExhibitionListSection
        value={selectedExhibition ? [selectedExhibition?.exhibition_id] : []}
        on:select={handleExhibitionChange}
      />
    {/if}
  </FormGroup>
</ContentBox>

<script lang="ts">
  import {
    FormGroup,
    TextInput,
    RadioButtonGroup,
    RadioButton,
    Row,
    Column,
  } from "carbon-components-svelte";

  import { Noti, ProductGroupsApi, Exhibition } from "@api";
  import { Autocomplete, AutocompleteItem } from "@app/components/autocomplete";
  import ContentBox from "@app/components/ContentBox.svelte";

  import {
    NotificationType,
    NotificationTypeEnum,
  } from "../../models/Notification";
  import ExhibitionListSection from "./ExhibitionListSection.svelte";
  import { formatDate } from "@app/helpers/date";

  export let form: Noti;
  export let isAdding = false;

  let productGroupOptions: AutocompleteItem[] = [];
  let selectedValue = "";
  let selectedExhibition: Exhibition;

  const productGroupsApi = new ProductGroupsApi();

  const notiTypes = Object.keys(NotificationType).map((key) => ({
    key,
    label: NotificationType[key as keyof typeof NotificationType],
    value: NotificationTypeEnum[key as keyof typeof NotificationTypeEnum],
  }));

  const disabledNotiTypes = [
    "TimedealOpenNotification",
    "EventNotification",
    "ProductDiffNotification",
    "BrandNewProductNotification",
    "BrandOpenNotification",
  ];

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

  $: if (form.noti_type) {
    switch (form.noti_type) {
      // it is deprecated. just remain for older apis
      case NotificationTypeEnum.TimedealOpenNotification:
        if (productGroupOptions.length === 0) {
          loadProductGroupList();
        }
        break;
      case NotificationTypeEnum.GeneralNotification:
        form.reference_id = "/";
        break;
      default:
      // pass
    }
  }

  const handleOptionChange = (selected: AutocompleteItem) => {
    form.reference_id = selected.key;
    selectedValue = selected.value;
  };

  const handleExhibitionChange = (event: CustomEvent<Exhibition>) => {
    form.reference_id = event.detail.exhibition_id;
    selectedExhibition = event.detail;
  };
</script>

<ContentBox title="푸시알림 정보">
  {#if !isAdding}
    <FormGroup>
      <TextInput labelText="타이틀" bind:value={form.notification_id} />
    </FormGroup>
  {/if}
  <FormGroup>
    <TextInput labelText="타이틀" bind:value={form.title} />
  </FormGroup>
  <FormGroup>
    <TextInput labelText="메시지" bind:value={form.message} />
  </FormGroup>
  <FormGroup>
    <RadioButtonGroup legendText="푸시 종류" bind:selected={form.noti_type}>
      {#each notiTypes as notiType}
        <RadioButton
          labelText={notiType.label}
          value={notiType.value}
          disabled={disabledNotiTypes.includes(notiType.key)}
        />
      {/each}
    </RadioButtonGroup>
  </FormGroup>

  <FormGroup>
    {#if form.noti_type === NotificationTypeEnum.TimedealOpenNotification}
      <div class="bx--label">관련 타임딜</div>
      <Autocomplete
        options={productGroupOptions}
        onSubmit={handleOptionChange}
        placeholder="타임딜 이름/ID로 검색"
        labelText="타임딜 검색"
        {selectedValue}
      />
    {:else if form.noti_type === NotificationTypeEnum.ExhibitionNotification}
      <div class="bx--label">관련 기획전</div>
      <ExhibitionListSection
        value={selectedExhibition ? [selectedExhibition?.exhibition_id] : []}
        on:select={handleExhibitionChange}
      />
    {/if}
  </FormGroup>
</ContentBox>

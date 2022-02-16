<script lang="ts">
  import { onMount } from "svelte";
  import {
    Row,
    Column,
    TextInput,
    RadioButtonGroup,
    RadioButton,
  } from "carbon-components-svelte";

  import { Noti, ProductGroupsApi } from "@api";
  import { Autocomplete, AutocompleteItem } from "@app/components/autocomplete";
  import ContentBox from "@app/components/ContentBox.svelte";

  import {
    NotificationType,
    NotificationTypeEnum,
  } from "../../models/Notification";

  export let form: Noti;
  export const isAdding = false;

  let productGroupOptions: AutocompleteItem[] = [];
  let selectedValue = "";

  const productGroupsApi = new ProductGroupsApi();

  const notiTypes = Object.keys(NotificationType).map((key) => ({
    key,
    label: NotificationType[key as keyof typeof NotificationType],
    value: NotificationTypeEnum[key as keyof typeof NotificationTypeEnum],
  }));

  const disabledNotiTypes = [
    "EventNotification",
    "ProductDiffNotification",
    "BrandNewProductNotification",
    "BrandOpenNotification",
    "GeneralNotification",
  ];

  onMount(async () => {
    const res = await productGroupsApi.productGroupsList();
    productGroupOptions = res.data.map(
      ({ product_group_id, title, short_title }) => ({
        key: product_group_id,
        value: title,
        subvalue: short_title,
      }),
    );
  });

  const handleProductGroupChange = (selected: AutocompleteItem) => {
    form.reference_id = selected.key;
    selectedValue = selected.value;
  };
</script>

<ContentBox>
  <h3>푸시알림 정보</h3>
  <Row>
    <Column>
      <TextInput labelText="타이틀" bind:value={form.title} />
    </Column>
  </Row>
  <Row>
    <Column>
      <TextInput labelText="메시지" bind:value={form.message} />
    </Column>
  </Row>
  <Row>
    <Column>
      <RadioButtonGroup legendText="푸시 종류" bind:selected={form.noti_type}>
        {#each notiTypes as notiType}
          <RadioButton
            labelText={notiType.label}
            value={notiType.value}
            disabled={disabledNotiTypes.includes(notiType.key)}
          />
        {/each}
      </RadioButtonGroup>
    </Column>
  </Row>

  <Row>
    <Column>
      {#if form.noti_type === NotificationTypeEnum.TimedealOpenNotification}
        <div class="bx--label">관련 컬렉션</div>
        <Autocomplete
          options={productGroupOptions}
          onSubmit={handleProductGroupChange}
          placeholder="컬렉션 이름/ID로 검색"
          labelText="컬렉션 검색"
          {selectedValue}
        />
      {:else}
        <TextInput labelText="관련ID" bind:value={form.reference_id} />
      {/if}
    </Column>
  </Row>
</ContentBox>

<style>
</style>

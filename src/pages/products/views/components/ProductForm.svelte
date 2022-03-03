<script lang="ts">
  import { Product } from "@api";
  import { AutocompleteItem } from "@app/components/autocomplete";
  import BrandSelect from "@app/components/BrandSelect.svelte";
  import ContentBox from "@app/components/ContentBox.svelte";
  import ImageUploadField from "@app/components/ImageUploadField.svelte";
  import MultilineTextInput from "@app/components/MultilineTextInput.svelte";
  import {
  Button,
  Checkbox,
  Column,
  NumberInput,
  Row,
  TextInput,
  Toggle
  } from "carbon-components-svelte";
  import TrashCan16 from "carbon-icons-svelte/lib/TrashCan16";
  import Editor from "cl-editor/src/Editor.svelte";
  import { debounce } from "lodash";
  import CategorySelect from "../../../../components/CategorySelect.svelte";

  export let form: Product & {
    brand_key_name: string;
  };
  export let isAdding: boolean = false;

  let discountRate = "0";
  let inventoryTextInput = "";
  let useHtml = false;
  let html = form.raw_html ?? "";

  const handleBrandChange = (
    event: CustomEvent<{ value?: AutocompleteItem }>,
  ) => {
    form.brand_key_name = event.detail.value?.subvalue ?? "";
  };

  const handleCategoryChange = (
    event: CustomEvent<{ value?: AutocompleteItem }>,
  ) => {
    form.alloff_category_id = event.detail.value?.key ?? "";
  };

  const handleAddInventory = () => {
    form.inventory = [
      ...form.inventory,
      { size: inventoryTextInput, quantity: 1 },
    ];
    inventoryTextInput = "";
  };

  const handleChangeInventory = (index: number) => () => {
    if (form.inventory[index].quantity < 1) {
      // zero inventory means remove
      handleDeleteInventory(index);
    }
  };

  const handleDeleteInventory = (index: number) => () => {
    const newValue = form.inventory.slice();
    newValue.splice(index, 1);
    form.inventory = newValue;
  };

  const handleKeydown = debounce((event: KeyboardEvent) => {
    if (event.key === "Enter") {
      handleAddInventory();
    }
  }, 100);

  $: if (form.original_price || form.discounted_price) {
    discountRate = (
      ((form.original_price - form.discounted_price) / form.original_price) *
      100
    ).toFixed(0);
  }

  $: {
    form.raw_html = useHtml ? html : null;
  }
</script>

<ContentBox>
  <h3>상품 정보</h3>
  {#if !isAdding}
    <Row padding>
      <Column>
        <TextInput
          labelText={"상품ID"}
          bind:value={form.alloff_product_id}
          readonly
        />
      </Column>
    </Row>
  {/if}
  <Row padding>
    <Column>
      <TextInput labelText={"상품명"} bind:value={form.alloff_name} />
    </Column>
    <Column>
      <div class="bx--label">브랜드</div>
      <BrandSelect
        on:change={handleBrandChange}
        selectedValue={form.brand_kor_name}
      />
    </Column>
  </Row>
  <Row padding>
    <Column>
      <TextInput labelText={"기존 가격"} bind:value={form.original_price} />
    </Column>
    <Column>
      <TextInput
        labelText={"할인된 가격 (할인율:" + discountRate + "%)"}
        bind:value={form.discounted_price}
      />
    </Column>
    <Column>
      <TextInput labelText="우선적용가" bind:value={form.special_price} />
    </Column>
  </Row>
  <Row padding>
    <Column>
      <CategorySelect
        initialCategoryName={form.alloff_category_name === ""
          ? undefined
          : form.alloff_category_name}
        on:change={handleCategoryChange}
      />
    </Column>
    <Column>
      <TextInput labelText="제품번호" bind:value={form.product_id} />
    </Column>
  </Row>
  <Row padding>
    <Column>
      <ImageUploadField
        label={"상품 이미지"}
        bind:value={form.images}
        multiple
      />
    </Column>
  </Row>
  <Row padding>
    <Column>
      <MultilineTextInput label="상품 설명" bind:value={form.description} />
    </Column>
  </Row>
  <Row padding>
    <Column>
      <ImageUploadField
        label={"상품 설명 이미지"}
        bind:value={form.description_images}
        multiple
      />
    </Column>
  </Row>
  <Row padding>
    <Column>
      <NumberInput label={"Total Score"} bind:value={form.total_score} />
    </Column>
  </Row>
</ContentBox>
<ContentBox>
  <h3>배송 관련 정보</h3>
  <Row padding>
    <Column>
      <NumberInput
        label="가장 빠른 도착예정일"
        bind:value={form.earliest_delivery_days}
      />
    </Column>
    <Column>
      <NumberInput
        label="가장 느린 도착예정일"
        bind:value={form.latest_delivery_days}
      />
    </Column>
  </Row>
  <Row padding>
    <Column>
      <TextInput labelText="반품 비용" bind:value={form.refund_fee} />
    </Column>
  </Row>
  <Row padding>
    <Column>
      <Toggle
        labelText="반품가능 여부"
        bind:toggled={form.is_refund_possible}
      />
    </Column>
    <Column>
      <Toggle
        labelText="해외배송 여부"
        bind:toggled={form.is_foreign_delivery}
      />
    </Column>
  </Row>
</ContentBox>
<ContentBox>
  <h3>재고 정보</h3>
  <Row padding>
    <Column>
      <Toggle labelText="판매불가 여부" bind:toggled={form.is_removed} />
    </Column>
    <Column>
      <Toggle labelText="품절 여부" bind:toggled={form.is_soldout} />
    </Column>
  </Row>
  <Row padding>
    <Column>
      <TextInput
        labelText={"신규 사이즈 등록"}
        placeholder="작성 후 추가 버튼을 누르세요"
        bind:value={inventoryTextInput}
        on:keydown={handleKeydown}
      />
      <Button kind="secondary" on:click={handleAddInventory}>추가</Button>
      {#each form.inventory as inv, index}
        <NumberInput
          label={inv.size}
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
      {/each}
    </Column>
  </Row>
</ContentBox>
<ContentBox>
  <h3>HTML 상품 정보</h3>
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
</style>

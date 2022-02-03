<script lang="ts">
  import { onMount } from "svelte";
  import {
    Row,
    Column,
    Button,
    TextInput,
    NumberInput,
    Toggle,
  } from "carbon-components-svelte";
  import TrashCan16 from "carbon-icons-svelte/lib/TrashCan16";
  import {
    Autocomplete,
    AutocompleteItem,
  } from "../../../../common/autocomplete";

  import { Product, Brand, BrandsApi } from "../../../../api";
  import InstructionAdder from "../../../../components/InstructionAdder.svelte";
  import ContentBox from "../../../../components/ContentBox.svelte";
  import ImageUploadField from "../../../../components/ImageUploadField.svelte";

  export let form: Product;

  let discountRate = "0";
  let inventoryTextInput = "";
  let brands: Brand[] = [];

  const handleBrandChange = (selected: AutocompleteItem) => {
    form.brand_key_name = selected.subvalue;
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
      form.inventory.splice(index, 1); // zero inventory means remove
    }
  };

  const handleDeleteInventory = (index: number) => () => {
    form.inventory.splice(index, 1);
  };

  onMount(async () => {
    const brandsAPi = new BrandsApi();
    const res = await brandsAPi.brandsList();
    brands = res.data;
  });
</script>

<ContentBox>
  <h3>상품 정보</h3>
  <Row>
    <Column>
      <TextInput
        labelText={"상품ID"}
        bind:value={form.alloff_product_id}
        readonly
      />
    </Column>
  </Row>
  <Row>
    <Column>
      <TextInput labelText={"상품명"} bind:value={form.alloff_name} />
    </Column>
    <Column>
      <div class="bx--label">브랜드</div>
      <Autocomplete
        options={brands.map(({ brand_id, korname, keyname }) => ({
          key: brand_id,
          value: korname,
          subvalue: keyname,
        }))}
        onSubmit={handleBrandChange}
        placeholder="브랜드 이름/Keyname/ID로 검색"
        labelText="브랜드 검색"
        selectedValue={form.brand_kor_name ?? ""}
      />
    </Column>
  </Row>
  <Row>
    <Column>
      <TextInput labelText={"기존 가격"} bind:value={form.original_price} />
    </Column>
    <Column>
      <TextInput
        labelText={"할인된 가격 (할인율:" + discountRate + "%)"}
        bind:value={form.discounted_price}
      />
    </Column>
  </Row>
  <Row>
    <Column>
      <TextInput labelText="카테고리" bind:value={form.category_name} />
    </Column>
    <Column>
      <TextInput labelText="제품번호" bind:value={form.product_id} />
    </Column>
  </Row>
  <Row>
    <Column>
      <ImageUploadField
        label={"상품 이미지"}
        bind:value={form.images}
        multiple
      />
    </Column>
  </Row>
  <Row>
    <Column>
      <InstructionAdder
        instructionTitle="상품 설명"
        bind:instructions={form.description}
      />
    </Column>
  </Row>
  <Row>
    <Column>
      <ImageUploadField
        label={"상품 설명 이미지"}
        bind:value={form.description_images}
        multiple
      />
    </Column>
  </Row>
  <Row>
    <Column>
      <NumberInput label={"Total Score"} bind:value={form.total_score} />
    </Column>
  </Row>
</ContentBox>
<ContentBox>
  <h3>배송 관련 정보</h3>
  <Row>
    <Column>
      <TextInput
        labelText="가장 빠른 도착예정일"
        bind:value={form.earliest_delivery_days}
      />
    </Column>
    <Column>
      <TextInput
        labelText="가장 느린 도착예정일"
        bind:value={form.latest_delivery_days}
      />
    </Column>
  </Row>
  <Row>
    <Column>
      <TextInput labelText="반품 비용" bind:value={form.refund_fee} />
    </Column>
    <Column>
      <TextInput labelText="우선적용가" bind:value={form.special_price} />
    </Column>
  </Row>
  <Row>
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
  <Row>
    <Column>
      <Toggle labelText="판매불가 여부" bind:toggled={form.is_removed} />
    </Column>
    <Column>
      <Toggle labelText="품절 여부" bind:toggled={form.is_soldout} />
    </Column>
  </Row>
  <Row>
    <Column>
      <TextInput
        labelText={"신규 사이즈 등록"}
        placeholder="작성 후 추가 버튼을 누르세요"
        bind:value={inventoryTextInput}
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
  <Row>
    <Column />
  </Row>
</ContentBox>

<style>
</style>

<script lang="ts">
  import { Product } from "@lessbutter/alloff-backoffice-api";
  import { toast } from "@zerodevx/svelte-toast";
  import { onMount } from "svelte";
  import { navigate, useLocation } from "svelte-navigator";
  import {
    Button,
    Checkbox,
    Column,
    Grid,
    Modal,
    Row,
    Search,
  } from "carbon-components-svelte";
  import DocumentAdd16 from "carbon-icons-svelte/lib/DocumentAdd16";
  import TrashCan16 from "carbon-icons-svelte/lib/TrashCan16";

  import { AutocompleteItem } from "@app/components/autocomplete";
  import BrandSelect from "@app/components/BrandSelect.svelte";
  import CategorySelect from "@app/components/CategorySelect.svelte";
  import CheckboxGroup from "@app/components/CheckboxGroup.svelte";
  import GridTile from "@app/components/GridTile.svelte";
  import Nav from "@app/components/Nav.svelte";
  import Pagination from "@app/components/Pagination.svelte";
  import {
    formatQueryString,
    parseQueryString,
  } from "@app/helpers/query-string";

  import { SearchQueryParam, useProductService } from "../ProductService";
  import ProductCard from "./components/ProductCard.svelte";
  import { debounce } from "lodash";

  const productService = useProductService();

  let products: Product[] = [];
  let searchFilter = productService.filter;
  let isLoading = false;
  let selectedProductIds: string[] = [];
  let isDeleteModalOpen = false;

  const location = useLocation<SearchQueryParam>();

  const checkboxOptions = [
    { label: "설정됨", value: "true" },
    { label: "미설정", value: "false" },
  ];

  onMount(() => {
    searchFilter = parseQueryString($location.search);
    handleSearch();
  });

  const load = async (params: SearchQueryParam) => {
    if (isLoading) return;
    try {
      isLoading = true;
      await productService.list(params);
      products = productService.products;
      searchFilter = productService.filter;
    } finally {
      isLoading = false;
    }
  };

  const handlePageChange = (
    event: CustomEvent<{ offset: number; limit: number }>,
  ) => {
    const { offset, limit } = event.detail;
    searchFilter = {
      ...searchFilter,
      offset,
      limit,
    };
    handleSearch();
  };

  const handleBrandChange = (event: CustomEvent<AutocompleteItem>) => {
    const brandId = event.detail?.key ?? "";
    searchFilter = {
      ...searchFilter,
      brandId,
    };
  };

  const handleCategoryChange = (event: CustomEvent<AutocompleteItem>) => {
    const alloffCategoryId = event.detail?.key ?? "";
    searchFilter = {
      ...searchFilter,
      alloffCategoryId,
    };
  };

  const handleSearchKeydown = (e: KeyboardEvent) => {
    const value = (e.target as HTMLInputElement).value.trim();
    if (e.key === "Enter") {
      searchFilter = {
        ...searchFilter,
        offset: 0,
        searchQuery: value,
      };
      handleSearch();
    }
  };

  const handleIsClassifiedCheck = (event: CustomEvent<string[]>) => {
    if (
      event.detail.length === checkboxOptions.length ||
      event.detail.length === 0
    ) {
      // all checked
      searchFilter = {
        ...searchFilter,
        isClassifiedDone: undefined,
      };
    } else {
      const [value] = event.detail;
      searchFilter = {
        ...searchFilter,
        isClassifiedDone: value,
      };
    }
  };

  const handleSearch = () => {
    const queryString = formatQueryString({ ...searchFilter });
    if (`?${queryString}` !== $location.search) {
      navigate(`${$location.pathname}?${queryString}`);
    }
    load(searchFilter);
    selectedProductIds = [];
  };

  const handleAddClick = (event: MouseEvent) => {
    event.preventDefault();
    navigate("/products/add");
  };

  const handleProductSelect = (
    event: CustomEvent<{ product: Product; selected: boolean }>,
  ) => {
    const { product } = event.detail;
    if (!selectedProductIds.includes(product.alloff_product_id)) {
      selectedProductIds = [...selectedProductIds, product.alloff_product_id];
    } else {
      selectedProductIds = selectedProductIds.filter(
        (x) => x !== product.alloff_product_id,
      );
    }
  };

  const handleProductAllSelect = (event: CustomEvent<boolean>) => {
    const checked = event.detail;
    if (checked) {
      selectedProductIds = products.map((x) => x.alloff_product_id);
    } else {
      selectedProductIds = [];
    }
  };

  const handleProductClear = (event: MouseEvent) => {
    event.preventDefault();
    selectedProductIds = [];
  };

  const handleModalToggle = (value: boolean) => {
    isDeleteModalOpen = value;
  };

  const handleModalOpen = () => handleModalToggle(true);
  const handleModalClose = () => handleModalToggle(false);

  const handleSelectedSoldout = async (event: MouseEvent) => {
    event.preventDefault();
    try {
      const promises = selectedProductIds.map((x) =>
        productService.patch(x, {
          is_soldout: true,
          inventory: [],
        }),
      );
      await Promise.all(promises);
      toast.push(`${selectedProductIds.length}개의 상품이 품절처리되었습니다.`);
      handleSearch();
    } catch (e) {
      toast.push(`상품 수정에 오류가 발생했습니다.`);
    }
  };

  const handleDeleteSubmit = async () => {
    try {
      const promises = selectedProductIds.map((x) =>
        productService.patch(x, {
          is_removed: true,
        }),
      );
      await Promise.all(promises);
      toast.push(`${selectedProductIds.length}개의 상품이 삭제되었습니다.`);
      handleSearch();
      handleModalToggle(false);
    } catch (e) {
      toast.push(`상품 삭제에 오류가 발생했습니다.`);
    }
  };

  $: isChecked = selectedProductIds.length === products.length;
</script>

<Nav title="상품 목록">
  <Grid slot="header" noGutter>
    <Row>
      <Column sm={1}>
        <p class="bx--label">브랜드</p>
        <BrandSelect size="lg" on:change={handleBrandChange} />
      </Column>
      <Column sm={1}>
        <p class="bx--label">카테고리</p>
        <CategorySelect
          on:change={handleCategoryChange}
          initialCategoryName=""
        />
      </Column>
      <Column>
        <CheckboxGroup
          label="카테고리 설정 여부"
          options={checkboxOptions}
          on:change={handleIsClassifiedCheck}
        />
      </Column>
    </Row>
    <Row padding>
      <Column>
        <Search
          labelText="검색어"
          on:keydown={handleSearchKeydown}
          bind:value={searchFilter.searchQuery}
        />
      </Column>
    </Row>
    <Row>
      <Column>
        <div class="row-right-wrapper">
          <Button on:click={handleSearch}>검색</Button>
        </div>
      </Column>
    </Row>
  </Grid>

  <GridTile loading={isLoading}>
    <svelte:fragment slot="header">
      <Row>
        <Column>
          <div class="row-space-wrapper">
            <Checkbox
              labelText="전체 선택"
              checked={isChecked}
              on:check={handleProductAllSelect}
            />
            {#if selectedProductIds.length > 0}
              <div class="row-right-wrapper">
                <p>
                  {selectedProductIds.length}개의 선택된 상품
                </p>
                <!-- <Button kind="tertiary" on:click={handleSelectedSoldout}>
                  선택 품절처리
                </Button> -->
                <Button
                  kind="danger-tertiary"
                  icon={TrashCan16}
                  on:click={handleModalOpen}
                >
                  선택 삭제
                </Button>
                <Button kind="ghost" on:click={handleProductClear}>
                  선택 취소
                </Button>
              </div>
            {:else}
              <div class="row-right-wrapper">
                <Button icon={DocumentAdd16} on:click={handleAddClick}>
                  상품 추가
                </Button>
              </div>
            {/if}
          </div>
        </Column>
      </Row>
      <Row>
        <Column>
          <Pagination
            limit={searchFilter.limit}
            offset={searchFilter.offset}
            totalCounts={searchFilter.totalCounts}
            on:change={handlePageChange}
          />
        </Column>
      </Row>
    </svelte:fragment>

    {#each products as product}
      <Column sm={1}>
        <ProductCard
          {product}
          selectable
          selected={selectedProductIds.includes(product.alloff_product_id)}
          on:select={handleProductSelect}
          on:delete={handleSearch}
        />
      </Column>
    {/each}

    <svelte:fragment slot="footer">
      <Row>
        <Column>
          <Pagination
            limit={searchFilter.limit}
            offset={searchFilter.offset}
            totalCounts={searchFilter.totalCounts}
            on:change={handlePageChange}
          />
        </Column>
      </Row>
      <Row>
        <Column>
          <div class="row-right-wrapper">
            <Button icon={DocumentAdd16} on:click={handleAddClick}>
              상품 추가
            </Button>
          </div>
        </Column>
      </Row>
    </svelte:fragment>
  </GridTile>
</Nav>

<Modal
  danger
  open={isDeleteModalOpen}
  modalHeading={"여러개의 상품 삭제"}
  primaryButtonText="삭제"
  secondaryButtonText="삭제 취소"
  on:click:button--secondary={handleModalClose}
  on:close={handleModalClose}
  on:submit={handleDeleteSubmit}
>
  <p>{selectedProductIds.length}개의 상품을 삭제합니다</p>
</Modal>

<style>
  .row-right-wrapper {
    align-items: center;
  }

  .row-right-wrapper p {
    font-size: 0.95em;
    margin-right: 10px;
  }
</style>

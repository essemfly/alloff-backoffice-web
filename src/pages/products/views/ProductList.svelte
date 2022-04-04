<script lang="ts">
  import { onMount } from "svelte";
  import { navigate, useLocation } from "svelte-navigator";
  import {
    Button,
    Checkbox,
    Column,
    FormGroup,
    Grid,
    Row,
    Search,
  } from "carbon-components-svelte";
  import DocumentAdd16 from "carbon-icons-svelte/lib/DocumentAdd16";

  import {
    Product,
    ProductsApi,
    ProductsApiProductsListRequest as SearchQueryParam,
  } from "@api";
  import Nav from "@app/components/Nav.svelte";
  import BrandSelect from "@app/components/BrandSelect.svelte";
  import { AutocompleteItem } from "@app/components/autocomplete";
  import CategorySelect from "@app/components/CategorySelect.svelte";
  import GridTile from "@app/components/GridTile.svelte";
  import Pagination from "@app/components/Pagination.svelte";
  import {
    formatQueryString,
    parseQueryString,
  } from "@app/helpers/query-string";

  import ProductCard from "./components/ProductCard.svelte";
  import CheckboxGroup from "@app/components/CheckboxGroup.svelte";
  import { search } from "@app/pages/logistics/inventories/store";

  let products: Product[] = [];
  let searchFilter: SearchQueryParam = {
    offset: 0,
    limit: 50,
    searchQuery: "",
    brandId: "",
    alloffCategoryId: "",
    // isClassifiedDone: false,
  };
  let totalItems = 0;
  let isLoading = false;

  const productApi = new ProductsApi();
  const location = useLocation<SearchQueryParam>();

  const checkboxOptions = [
    { label: "설정됨", value: "true" },
    { label: "미설정", value: "false" },
  ];

  const load = async (params: SearchQueryParam) => {
    if (isLoading) return;
    try {
      isLoading = true;
      let res = await productApi.productsList({ ...searchFilter, ...params });

      products = res.data.products;

      // query strings
      searchFilter = {
        offset: res.data.offset,
        limit: res.data.limit,
        searchQuery: res.data.list_query.search_query,
        brandId: res.data.list_query.brand_id,
        // isClassifiedDone: res.data.list_query.is_classified_done,
      };
      totalItems = res.data.total_counts;
    } finally {
      isLoading = false;
    }
  };

  onMount(async () => {
    const params = parseQueryString<SearchQueryParam>($location.search);
    await load(params);
  });

  const handleAddClick = (event: MouseEvent) => {
    event.preventDefault();
    navigate("/products/add");
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

  const handleBrandChange = (
    event: CustomEvent<{ value?: AutocompleteItem }>,
  ) => {
    const brandId = event.detail.value?.key ?? "";
    searchFilter = {
      ...searchFilter,
      brandId,
    };
  };

  const handleCategoryChange = (
    event: CustomEvent<{ value?: AutocompleteItem }>,
  ) => {
    const alloffCategoryId = event.detail.value?.key ?? "";
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
        searchQuery: value,
      };
      handleSearch();
    }
  };

  const handleSearch = () => {
    const queryString = formatQueryString({ ...searchFilter, offset: 0 });
    navigate(`${$location.pathname}?${queryString}`);
  };

  const handleIsClassifiedCheck = (event: CustomEvent<string[]>) => {
    if (
      event.detail.length === checkboxOptions.length ||
      event.detail.length === 0
    ) {
      // all checked
      searchFilter.isClassifiedDone = undefined;
    } else {
      const [value] = event.detail;
      searchFilter.isClassifiedDone = value;
    }
  };

  $: if ($location) {
    const params = parseQueryString<SearchQueryParam>($location.search);
    load(params);
  }
</script>

<Nav title="상품 목록">
  <Grid slot="header" noGutter>
    <Row>
      <Column sm={1}>
        <p class="bx--label">브랜드</p>
        <BrandSelect on:change={handleBrandChange} />
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
        <div class="button-right-wrapper">
          <Button on:click={handleSearch}>검색</Button>
        </div>
      </Column>
    </Row>
  </Grid>

  <GridTile loading={isLoading}>
    <svelte:fragment slot="header">
      <Row>
        <Column>
          <div class="button-right-wrapper">
            <Button icon={DocumentAdd16} on:click={handleAddClick}>
              상품 추가
            </Button>
          </div>
        </Column>
      </Row>
      <Row>
        <Column>
          <Pagination
            limit={searchFilter.limit}
            offset={searchFilter.offset}
            {totalItems}
            on:change={handlePageChange}
          />
        </Column>
      </Row>
    </svelte:fragment>

    {#each products as product}
      <Column sm={1}>
        <ProductCard {product} />
      </Column>
    {/each}

    <svelte:fragment slot="footer">
      <Row>
        <Column>
          <Pagination
            limit={searchFilter.limit}
            offset={searchFilter.offset}
            {totalItems}
            on:change={handlePageChange}
          />
        </Column>
      </Row>
      <Row>
        <Column>
          <div class="button-right-wrapper">
            <Button icon={DocumentAdd16} on:click={handleAddClick}>
              상품 추가
            </Button>
          </div>
        </Column>
      </Row>
    </svelte:fragment>
  </GridTile>
</Nav>

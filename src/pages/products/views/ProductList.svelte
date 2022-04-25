<script lang="ts">
  import { AutocompleteItem } from "@app/components/autocomplete";
  import BrandSelect from "@app/components/BrandSelect.svelte";
  import CategorySelect from "@app/components/CategorySelect.svelte";
  import CheckboxGroup from "@app/components/CheckboxGroup.svelte";
  import GridTile from "@app/components/GridTile.svelte";
  import Nav from "@app/components/Nav.svelte";
  import Pagination from "@app/components/Pagination.svelte";
  import { formatQueryString } from "@app/helpers/query-string";
  import { Product } from "@lessbutter/alloff-backoffice-api";
  import { Button, Column, Grid, Row, Search } from "carbon-components-svelte";
  import DocumentAdd16 from "carbon-icons-svelte/lib/DocumentAdd16";
  import { onMount } from "svelte";
  import { navigate, useLocation } from "svelte-navigator";
  import { SearchQueryParam, useProductService } from "../ProductService";
  import ProductCard from "./components/ProductCard.svelte";

  const productService = useProductService();

  let products: Product[] = [];
  let searchFilter = productService.filter;
  let isLoading = false;

  const location = useLocation<SearchQueryParam>();

  const checkboxOptions = [
    { label: "설정됨", value: "true" },
    { label: "미설정", value: "false" },
  ];

  onMount(() => handleSearch());

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
    console.log(event.detail);
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
    navigate(`${$location.pathname}?${queryString}`);
    load(searchFilter);
  };

  const handleAddClick = (event: MouseEvent) => {
    event.preventDefault();
    navigate("/products/add");
  };
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
          <div class="row-right-wrapper">
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
            totalItems={searchFilter.totalItems}
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
            totalItems={searchFilter.totalItems}
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

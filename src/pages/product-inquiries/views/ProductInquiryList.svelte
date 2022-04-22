<script lang="ts">
  import CheckboxGroup from "@app/components/CheckboxGroup.svelte";
  import Nav from "@app/components/Nav.svelte";
  import MediaQuery from "@app/helpers/MediaQuery.svelte";
  import { formatQueryString } from "@app/helpers/query-string";
  import { ProductInquiry } from "@lessbutter/alloff-backoffice-api";
  import {
    Button,
    Column,
    DatePicker,
    DatePickerInput,
    Grid,
    Pagination,
    Row,
    Search,
  } from "carbon-components-svelte";
  import { onMount } from "svelte";
  import { navigate, useLocation } from "svelte-navigator";
  import {
    SearchQueryParam,
    useProductInquiryService,
  } from "../ProductInquiryService";
  import ProductInquiryTable from "./components/ProductInquiryTable.svelte";

  const productInquiryService = useProductInquiryService();
  const location = useLocation<SearchQueryParam>();

  let inquiries: ProductInquiry[] = [];
  let searchFilter = productInquiryService.filter;

  onMount(() => handleSearch());

  const checkboxOptions = [
    { label: "답변대기", value: "true" },
    { label: "답변완료", value: "false" },
  ];

  const load = async (params: Partial<SearchQueryParam>) => {
    await productInquiryService.list(params);
    inquiries = productInquiryService.inquiries;
    searchFilter = productInquiryService.filter;
  };

  const handleCheck = (event: CustomEvent<string[]>) => {
    if (
      event.detail.length === checkboxOptions.length ||
      event.detail.length === 0
    ) {
      // all checked
      searchFilter = {
        ...searchFilter,
        isPending: undefined,
      };
    } else {
      const [value] = event.detail;
      searchFilter = {
        ...searchFilter,
        isPending: value,
      };
    }
  };

  const handleSearchKeydown = (e: KeyboardEvent) => {
    const value = (e.target as HTMLInputElement).value.trim();
    if (e.key === "Enter") {
      searchFilter = { ...searchFilter, page: 1, search: value };
      handleSearch();
    }
  };

  const handleSearch = () => {
    const queryString = formatQueryString({ ...searchFilter });
    navigate(`${$location.pathname}?${queryString}`);
    load(searchFilter);
  };
</script>

<Nav title="상품문의 목록" let:isMobile>
  <Grid slot="header" noGutter>
    <Row>
      <Column>
        <DatePicker
          datePickerType="range"
          bind:valueFrom={searchFilter.dateFrom}
          bind:valueTo={searchFilter.dateTo}
          dateFormat="Y-m-d"
        >
          <DatePickerInput labelText="시작일" placeholder="yyyy-mm-dd" />
          <DatePickerInput labelText="종료일" placeholder="yyyy-mm-dd" />
        </DatePicker>
      </Column>
      <Column>
        <CheckboxGroup
          label="답변 여부"
          options={checkboxOptions}
          on:change={handleCheck}
        />
      </Column>
    </Row>
    <Row>
      <Column>
        <Search
          labelText="검색어"
          on:keydown={handleSearchKeydown}
          bind:value={searchFilter.search}
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
  <!-- Need expandable improvement -->
  <!-- <DataTable data={inquiries} columns={productInquiryColumns} {isMobile} /> -->
  <Pagination
    totalItems={searchFilter.totalItems}
    bind:page={searchFilter.page}
    bind:pageSize={searchFilter.size}
  />
  <MediaQuery query="(max-width: 480px)" let:matches>
    <ProductInquiryTable
      isMobile={matches}
      {inquiries}
      reload={() => load(searchFilter)}
    />
  </MediaQuery>
</Nav>

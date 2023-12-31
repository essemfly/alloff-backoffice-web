<script lang="ts">
  import { formatDate } from "@app/helpers/date";
  import { getExhibitionTypeLabel } from "@app/pages/exhibitions/commands/helpers";
  import { useExhibitionService } from "@app/pages/exhibitions/ExhibitionService";
  import {
    Exhibition,
    ExhibitionTypeEnum,
  } from "@lessbutter/alloff-backoffice-api";
  import { toast } from "@zerodevx/svelte-toast";
  import {
    Button,
    Column,
    InlineLoading,
    RadioButton,
    RadioButtonGroup,
    Row,
    Search,
    StructuredList,
    StructuredListBody,
    StructuredListCell,
    StructuredListHead,
    StructuredListInput,
    StructuredListRow,
  } from "carbon-components-svelte";
  import Launch16 from "carbon-icons-svelte/lib/Launch16";
  import TrashCan16 from "carbon-icons-svelte/lib/TrashCan16";
  import { debounce } from "lodash";
  import { createEventDispatcher, onMount } from "svelte";

  const exhibitionService = useExhibitionService();
  const { filter } = exhibitionService;

  export let exhibitionType: ExhibitionTypeEnum = ExhibitionTypeEnum.Normal;
  export let disabledIds: string[] = [];
  export let value: string | string[];
  export let multiple = false;
  export let hideSelection = false;
  export let byExhibitionType = false;

  let isLoading = false;

  let exhibitions: Exhibition[] = [];
  let filteredExhibition: Exhibition[] = [];
  let listSearchQuery = "";
  let selectedExhibitions: Exhibition[] = [];
  let selectedExhibitionIds: string[] = [];
  let scrollableList: HTMLDivElement;
  let searchFilter = filter;

  const dispatch = createEventDispatcher();

  const exhibitionTypes = Object.keys(ExhibitionTypeEnum).map((key) => ({
    key,
    label: getExhibitionTypeLabel(
      ExhibitionTypeEnum[key as keyof typeof ExhibitionTypeEnum],
    ),
    value: ExhibitionTypeEnum[key as keyof typeof ExhibitionTypeEnum],
  }));

  onMount(() => {
    handleSearch(0);

    if (value) {
      if (multiple) {
        selectedExhibitionIds = (value as string[]) ?? [];
      } else {
        selectedExhibitionIds = [value as string] ?? [];
      }
    }
  });

  $: if (value) {
    if (multiple) {
      selectedExhibitionIds = (value as string[]) ?? [];
    } else {
      selectedExhibitionIds = [value as string] ?? [];
    }
  }

  const handleScroll = debounce(() => {
    const { scrollTop, scrollHeight, clientHeight } = scrollableList;
    const nextOffset = searchFilter.offset + searchFilter.limit;
    if (
      nextOffset <= searchFilter.totalCounts &&
      (scrollTop + clientHeight) / scrollHeight > 0.7
    ) {
      loadNext();
    }
  }, 300);

  const loadNext = () => handleSearch(searchFilter.offset + searchFilter.limit);

  const handleSelect = (selectedItem: Exhibition) => () => {
    if (multiple) {
      selectedExhibitions = [...selectedExhibitions, selectedItem];
    } else {
      selectedExhibitions = [selectedItem];
    }
    dispatch("select", selectedItem);
  };

  const handleDeselect = (index: number) => () => {
    selectedExhibitions.splice(index, 1);
    selectedExhibitions = selectedExhibitions;
  };

  $: if (selectedExhibitions) {
    selectedExhibitionIds = selectedExhibitions.map(
      ({ exhibition_id }) => exhibition_id,
    );
    filtering();
    dispatch("change", selectedExhibitions);
  }

  const handleDetailOpen = (exhibitionId: string) => () => {
    window.open(`/exhibitions/${exhibitionId}`, "_blank"); // todo: not use window.open
  };

  const handleSearch = async (offset: number) => {
    if (isLoading) {
      return;
    }
    try {
      isLoading = true;
      await exhibitionService.list({ ...searchFilter, exhibitionType, offset });
      searchFilter = exhibitionService.filter;
      if (offset > 0) {
        exhibitions = [...exhibitions, ...exhibitionService.exhibitions];
      } else {
        exhibitions = exhibitionService.exhibitions;
      }
      filtering();
    } catch (e) {
      toast.push("기획전 검색에 오류가 발생했습니다.");
    } finally {
      isLoading = false;
    }
  };

  const handleProductSearchResultFilter = debounce((event: Event) => {
    listSearchQuery = (event.target as HTMLInputElement)?.value ?? "";
    filtering();
  }, 300);

  const filtering = () => {
    filteredExhibition = exhibitions.filter(
      (exhibition) =>
        !selectedExhibitionIds.includes(exhibition.exhibition_id) &&
        (exhibition.title.toLocaleLowerCase().includes(listSearchQuery) ||
          exhibition.subtitle.toLocaleLowerCase().includes(listSearchQuery)),
    );
  };
</script>

{#if !hideSelection}
  <Row padding>
    <Column>
      <h4>선택된 기획전</h4>
      <StructuredList condensed flush>
        <StructuredListHead>
          <StructuredListRow head>
            <StructuredListCell head>썸네일/배너 이미지</StructuredListCell>
            <StructuredListCell head>타이틀/서브 타이틀</StructuredListCell>
            <StructuredListCell head>시작일 - 종료일</StructuredListCell>
            <StructuredListCell head>Actions</StructuredListCell>
          </StructuredListRow>
        </StructuredListHead>
        <StructuredListBody>
          {#if selectedExhibitions.length === 0}
            <StructuredListRow>
              <StructuredListCell>선택된 기획전 없음</StructuredListCell>
            </StructuredListRow>
          {/if}
          {#each selectedExhibitions as exhibition, index}
            <StructuredListRow
              disabled={disabledIds.includes(exhibition.exhibition_id)}
            >
              <StructuredListInput value={exhibition.exhibition_id} />
              <StructuredListCell>
                <img
                  class="cell_image selected"
                  src={exhibition.thumbnail_image}
                  alt={["exhibition_thumbnail", exhibition.title].join("-")}
                />
                <img
                  class="cell_image selected"
                  src={exhibition.banner_image}
                  alt={["exhibition_banner", exhibition.title].join("-")}
                />
              </StructuredListCell>
              <StructuredListCell noWrap>
                {exhibition.title}<br />
                <small>{exhibition.subtitle}</small>
              </StructuredListCell>
              <StructuredListCell>
                {formatDate(exhibition.start_time, {
                  month: "short",
                  day: "numeric",
                  weekday: "narrow",
                  hour: "numeric",
                  minute: "numeric",
                })}<br />
                -<br />
                {formatDate(exhibition.finish_time, {
                  month: "short",
                  day: "numeric",
                  weekday: "narrow",
                  hour: "numeric",
                  minute: "numeric",
                })}
              </StructuredListCell>
              <StructuredListCell>
                <Row padding>
                  <Button
                    size="small"
                    tooltipPosition="bottom"
                    tooltipAlignment="end"
                    iconDescription="삭제"
                    icon={TrashCan16}
                    kind="danger"
                    on:click={handleDeselect(index)}
                  />
                  <Button
                    tooltipPosition="bottom"
                    tooltipAlignment="end"
                    iconDescription="기획전 상세"
                    icon={Launch16}
                    kind="ghost"
                    size="small"
                    on:click={handleDetailOpen(exhibition.exhibition_id)}
                  />
                </Row>
              </StructuredListCell>
            </StructuredListRow>
          {/each}
        </StructuredListBody>
      </StructuredList>
    </Column>
  </Row>
{/if}

<Row>
  <Column>
    <h4>기획전 목록</h4>
    {#if byExhibitionType}
      <Row>
        <Column>
          <RadioButtonGroup
            legendText="기획전 종류"
            bind:selected={exhibitionType}
          >
            {#each exhibitionTypes as option}
              <RadioButton
                labelText={option.label}
                value={option.value}
                checked={option.value === exhibitionType}
              />
            {/each}
          </RadioButtonGroup>
        </Column>
        <Column>
          <div class="row-right-wrapper">
            <Button on:click={() => handleSearch(0)}>검색</Button>
          </div>
        </Column>
      </Row>
    {/if}
    <div class="row-right-wrapper">
      <Search
        value={listSearchQuery}
        on:input={handleProductSearchResultFilter}
        on:clear={handleProductSearchResultFilter}
        placeholder="검색결과 내 검색"
        expandable
      />
    </div>
    <div
      class="product-list"
      bind:this={scrollableList}
      on:scroll={handleScroll}
    >
      <StructuredList
        condensed
        flush
        selection={!(
          searchFilter.totalCounts === 0 || filteredExhibition.length === 0
        )}
      >
        <StructuredListHead>
          <StructuredListRow head>
            <StructuredListCell head>썸네일/배너 이미지</StructuredListCell>
            <StructuredListCell head>타이틀/서브 타이틀</StructuredListCell>
            <StructuredListCell head>시작일 - 종료일</StructuredListCell>
            <StructuredListCell head>Actions</StructuredListCell>
          </StructuredListRow>
        </StructuredListHead>
        <StructuredListBody>
          {#if searchFilter.totalCounts === 0 || filteredExhibition.length === 0}
            <StructuredListRow>
              <StructuredListCell>
                검색조건에 맞는 기획전을 찾지 못했습니다
              </StructuredListCell>
            </StructuredListRow>
          {/if}
          {#each filteredExhibition as exhibition}
            <StructuredListRow
              on:click={handleSelect(exhibition)}
              disabled={disabledIds.includes(exhibition.exhibition_id)}
            >
              <StructuredListInput value={exhibition.exhibition_id} />
              <StructuredListCell>
                <img
                  class="cell_image"
                  src={exhibition.thumbnail_image}
                  alt={["exhibition_thumbnail", exhibition.title].join("-")}
                />
                <img
                  class="cell_image"
                  src={exhibition.banner_image}
                  alt={["exhibition_banner", exhibition.title].join("-")}
                />
              </StructuredListCell>
              <StructuredListCell noWrap>
                {exhibition.title}<br />
                <small>{exhibition.subtitle}</small>
              </StructuredListCell>
              <StructuredListCell>
                {formatDate(exhibition.start_time, {
                  month: "short",
                  day: "numeric",
                  weekday: "narrow",
                  hour: "numeric",
                  minute: "numeric",
                })}<br />
                -<br />
                {formatDate(exhibition.finish_time, {
                  month: "short",
                  day: "numeric",
                  weekday: "narrow",
                  hour: "numeric",
                  minute: "numeric",
                })}
              </StructuredListCell>
              <StructuredListCell>
                <Row padding>
                  <Button
                    tooltipPosition="bottom"
                    tooltipAlignment="end"
                    iconDescription="기획전 상세"
                    icon={Launch16}
                    kind="ghost"
                    size="small"
                    on:click={handleDetailOpen(exhibition.exhibition_id)}
                  />
                </Row>
              </StructuredListCell>
            </StructuredListRow>
          {/each}
          {#if isLoading}
            <InlineLoading status="active" description="검색중..." />
          {/if}
          {#if !isLoading && searchFilter.offset + searchFilter.limit <= searchFilter.totalCounts}
            <Button size="small" kind="tertiary" on:click={loadNext}>
              더보기
            </Button>
          {/if}
        </StructuredListBody>
      </StructuredList>
    </div>
  </Column>
</Row>

<style>
  :global(.bx--structured-list-td) {
    vertical-align: top;
  }

  .cell_image {
    width: 120px;
    height: 120px;
    object-fit: cover;
  }

  .selected {
    width: 180px;
    height: 180px;
  }

  :global(.search-wrapper.bx--row) {
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    align-items: flex-end;
    margin-bottom: 10px;
  }

  .product-list {
    max-height: 800px;
    overflow-y: auto;
    margin-bottom: 50px;
  }
</style>

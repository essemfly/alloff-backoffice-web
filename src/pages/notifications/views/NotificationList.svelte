<script lang="ts">
  import Nav from "@app/components/Nav.svelte";
  import Pagination from "@app/components/Pagination.svelte";
  import {
    formatQueryString,
    parseQueryString,
  } from "@app/helpers/query-string";
  import { apiConfig } from "@app/store";
  import {
    Noti,
    NotificationsApi,
    NotificationsApiNotificationsListRequest as SearchQueryParam,
  } from "@lessbutter/alloff-backoffice-api";
  import { toast } from "@zerodevx/svelte-toast";
  import { Button, InlineLoading } from "carbon-components-svelte";
  import AddComment16 from "carbon-icons-svelte/lib/AddComment16";
  import { onMount } from "svelte";
  import { navigate, useLocation } from "svelte-navigator";
  import NotificationDataTable from "./components/NotificationDataTable.svelte";

  let notifications: Array<Noti & { id: string }> = [];
  let offset = 0;
  let limit = 50;
  let totalCounts = 0;
  let isLoading = false;
  let searchFilter: SearchQueryParam;

  const notificationApi = new NotificationsApi(apiConfig);
  const location = useLocation<SearchQueryParam>();

  onMount(async () => {
    searchFilter = parseQueryString<SearchQueryParam>($location.search);
    handleSearch();
  });

  const load = async (params: SearchQueryParam) => {
    if (isLoading) return;
    try {
      isLoading = true;
      const res = await notificationApi.notificationsList({
        offset: params.offset ?? 0,
        limit: params.limit ?? 50,
      });
      const { data } = res;
      notifications = data.notis.map((x: Noti) => ({
        ...x,
        id: x.notification_id,
      }));

      // query strings
      offset = data.offset;
      // limit = data.limit;
      limit = data.limit > 0 ? data.limit : 50;
      totalCounts = 1000000; // todo: fix
    } finally {
      isLoading = false;
    }
  };

  const handleAddClick = (event: MouseEvent) => {
    event.preventDefault();
    navigate("/notifications/add");
  };

  const handlePageChange = (
    event: CustomEvent<{ offset: number; limit: number }>,
  ) => {
    const { offset, limit } = event.detail;
    searchFilter = {
      offset,
      limit,
      // query: searchQuery,
    };
    handleSearch();
  };

  const handleSearch = () => {
    const queryString = formatQueryString({ ...searchFilter });
    if (`?${queryString}` !== $location.search) {
      navigate(`${$location.pathname}?${queryString}`);
    }
    load(searchFilter);
  };

  const handleSendClick = async (event: CustomEvent<{ id: string }>) => {
    const { id } = event.detail;
    try {
      await notificationApi.notificationsSendCreate({
        id,
        sendNotiRequest: {
          notification_id: id,
        },
      });
      toast.push("푸시알림이 발송되었습니다.");
    } catch (e: any) {
      toast.push("푸시알림 발송을 실패했습니다.");
    }
  };
</script>

<Nav title="푸시알림 목록">
  <div class="row-right-wrapper mb10">
    <Button icon={AddComment16} on:click={handleAddClick}>추가</Button>
  </div>

  <Pagination {limit} {offset} {totalCounts} on:change={handlePageChange} />
  {#if isLoading}
    <InlineLoading label="Loading..." />
  {:else}
    <NotificationDataTable {notifications} on:send={handleSendClick} />
  {/if}
  <div class="row-right-wrapper mt10">
    <Button icon={AddComment16} on:click={handleAddClick}>추가</Button>
  </div>
</Nav>

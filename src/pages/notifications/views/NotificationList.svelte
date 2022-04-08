<script lang="ts">
  import { toast } from "@zerodevx/svelte-toast";
  import { onMount } from "svelte";
  import { navigate, useLocation } from "svelte-navigator";
  import { Button, InlineLoading } from "carbon-components-svelte";
  import AddComment16 from "carbon-icons-svelte/lib/AddComment16";

  import {
    Noti,
    NotificationsApi,
    NotificationsApiNotificationsListRequest as SearchQueryParam,
    ListNoti,
  } from "@api";
  import Nav from "@app/components/Nav.svelte";
  import Pagination from "@app/components/Pagination.svelte";
  import {
    formatQueryString,
    parseQueryString,
  } from "@app/helpers/query-string";

  import NotificationDataTable from "./components/NotificationDataTable.svelte";

  let notifications: Array<Noti & { id: string }> = [];
  let offset = 0;
  let limit = 50;
  let searchQuery = "";
  let totalItems = 0;
  let isLoading = false;

  const notificationApi = new NotificationsApi();
  const location = useLocation<SearchQueryParam>();

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
      totalItems = data.notis.length; // todo: fix
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
    navigate("/notifications/add");
  };

  const handlePageChange = (
    event: CustomEvent<{ offset: number; limit: number }>,
  ) => {
    const { offset, limit } = event.detail;
    const queryString = formatQueryString({
      offset,
      limit,
      query: searchQuery,
    });
    navigate(`${$location.pathname}?${queryString}`);
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

  $: if ($location) {
    const params = parseQueryString<SearchQueryParam>($location.search);
    load(params);
  }
</script>

<Nav title="푸시알림 목록">
  <div class="row-right-wrapper mb10">
    <Button icon={AddComment16} on:click={handleAddClick}>추가</Button>
  </div>

  <Pagination {limit} {offset} {totalItems} on:change={handlePageChange} />
  {#if isLoading}
    <InlineLoading label="Loading..." />
  {:else}
    <NotificationDataTable {notifications} on:send={handleSendClick} />
  {/if}
  <div class="row-right-wrapper mt10">
    <Button icon={AddComment16} on:click={handleAddClick}>추가</Button>
  </div>
</Nav>

<script lang="ts">
  import { Pagination, Button } from "carbon-components-svelte";
  import { NotificationsApi, Notification } from "../../api";
  import MediaQuery from "../../helpers/MediaQuery.svelte";
  import LoggedInFrame from "../common/LoggedInFrame.svelte";
  import NotificationTable from "./components/NotificationTable.svelte";
  import AddComment16 from "carbon-icons-svelte/lib/AddComment16";

  const load = async (p: number, size: number) => {
    const {
      data: { count, results },
    } = await api.notificationsList({ page: p, size });

    totalItems = count ?? 0;
    if (results !== undefined) {
      notifications = results;
    }
  };

  const api = new NotificationsApi();
  let notifications: Notification[] = [];
  let page = 1;
  let pageSize = 20;
  let totalItems = 0;
  const pageSizes = [20, 50, 100];

  $: load(page, pageSize);
</script>

<LoggedInFrame>
  <div class="button-wrapper">
    <Button
      size="field"
      icon={AddComment16}
      on:click={() => (window.location.href = `../notifications/new`)}
      >추가</Button
    >
  </div>

  <Pagination {...{ totalItems, pageSizes }} bind:page bind:pageSize />
  <MediaQuery query="(max-width: 480px)" let:matches>
    <NotificationTable isMobile={matches} {notifications} />
  </MediaQuery>
</LoggedInFrame>

<style>
  .button-wrapper {
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
  }
</style>

<script lang="ts">
  import { Pagination } from "carbon-components-svelte";
  import { NotificationsApi, Notification } from "../../api";
  import MediaQuery from "../../helpers/MediaQuery.svelte";
  import LoggedInFrame from "../common/LoggedInFrame.svelte";
  import NotificationTable from "./components/NotificationTable.svelte";

  const load = async (p: number, size: number) => {
    const {
      data: { count, results },
    } = await api.notificationsList(p, size);

    totalItems = count ?? 0;
    if (results !== undefined) {
      notifications = results;
    }
    console.log("RESULT", results)
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
  <Pagination {...{ totalItems, pageSizes }} bind:page bind:pageSize />
  <MediaQuery query="(max-width: 480px)" let:matches>
    <NotificationTable isMobile={matches} {notifications} />
  </MediaQuery>
</LoggedInFrame>

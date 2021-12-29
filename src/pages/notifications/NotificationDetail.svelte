<script lang="ts">
  import { Breakpoint, InlineLoading } from "carbon-components-svelte";
  import { Notification, NotificationsApi } from "../../api";
  import LoggedInFrame from "../common/LoggedInFrame.svelte";
  import NotificationSectionBasic from "./sections/NotificationSectionBasic.svelte";

  export let notificationId: string | undefined = undefined;

  let notification: Notification | undefined;
  const submitting = false;
  let loading = !!notificationId;
  let mobile = false;
  let size: "sm" | "md" | "lg" | "xlg" | "max";

  const api = new NotificationsApi();

  const load = async () => {
    if (!notificationId) return;
    loading = true;
    const { data } = await api.notificationsRetrieve({ id: notificationId });
    notification = data;
    loading = false;
  };

  $: mobile = size === "sm";
  $: {
    if (notificationId) {
      load();
    }
  }
</script>

<LoggedInFrame>
  {#if loading || submitting}
    <div class="overlay">
      <div>
        <InlineLoading
          description={loading
            ? "Fetching notification..."
            : "Updating notification..."}
        />
      </div>
    </div>
  {:else}
    <Breakpoint bind:size />
    {#if !notification}
      <NotificationSectionBasic
        {...{ notification, api, submitting, load, mobile }}
      />
    {/if}
  {/if}
</LoggedInFrame>

<style>
  .overlay {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    width: 100%;
    height: 100%;
    display: grid;
    place-items: center;
  }
</style>

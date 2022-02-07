<script lang="ts">
  import { Grid, Button } from "carbon-components-svelte";
  import Save16 from "carbon-icons-svelte/lib/Save16";

  import {
    Noti,
    CreateNotiRequest as Notification,
    NotificationsApi,
  } from "../../../api";
  import LoggedInFrame from "../../common/LoggedInFrame.svelte";
  import { NotificationTypeEnum } from "../models/Notification";
  import NotificationForm from "./components/NotificationForm.svelte";

  let isTouched = true;
  let notification: Notification = {
    noti_type: NotificationTypeEnum.TimedealOpenNotification,
    reference_id: "",
    title: "",
    message: "",
  };

  const handleSubmit = async () => {
    const notificationApi = new NotificationsApi();
    await notificationApi.notificationsCreate({
      createNotiRequest: notification,
    });
  };
</script>

<LoggedInFrame>
  <Grid>
    <div class="button-wrapper mb10">
      <Button on:click={handleSubmit} disabled={!isTouched} icon={Save16}>
        푸시알림 등록
      </Button>
    </div>
    <NotificationForm bind:form={notification} isAdding />
    <div class="button-wrapper mt10">
      <Button on:click={handleSubmit} disabled={!isTouched} icon={Save16}>
        푸시알림 등록
      </Button>
    </div>
  </Grid>
</LoggedInFrame>

<style>
  .button-wrapper {
    display: flex;
    justify-content: flex-end;
  }

  .mb10 {
    margin-bottom: 10px;
  }

  .mt10 {
    margin-top: 10px;
  }
</style>

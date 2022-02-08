<script lang="ts">
  import { toast } from "@zerodevx/svelte-toast";
  import { navigate } from "svelte-navigator";
  import { Grid, Button } from "carbon-components-svelte";
  import Save16 from "carbon-icons-svelte/lib/Save16";

  import {
    CreateNotiRequest as Notification,
    NotificationsApi,
  } from "../../../api";
  import Nav from "../../../components/Nav.svelte";
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
    try {
      const notificationApi = new NotificationsApi();
      await notificationApi.notificationsCreate({
        createNotiRequest: notification,
      });
      toast.push("푸시알림이 등록되었습니다.");
      navigate(-1);
    } catch (e) {
      toast.push("푸시알림 등록에 오류가 발생했습니다.");
    }
  };
</script>

<Nav title={"푸시알림 추가"}>
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
</Nav>

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

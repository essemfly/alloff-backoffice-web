<script lang="ts">
  import { toast } from "@zerodevx/svelte-toast";
  import { onMount } from "svelte";
  import { navigate } from "svelte-navigator";
  import { Button } from "carbon-components-svelte";
  import Save16 from "carbon-icons-svelte/lib/Save16";

  import {
    CreateNotiRequest,
    NotificationsApi,
  } from "@lessbutter/alloff-backoffice-api";
  import Nav from "@app/components/Nav.svelte";
  import { convertToSnakeCase } from "@app/helpers/change-case";

  import NotificationForm from "./components/NotificationForm.svelte";
  import { formStore } from "../models/schema";
  import { apiConfig } from "@app/store";
  import { NotificationTypeEnum } from "../models/Notification";

  let isSubmitting = false;

  const notificationApi = new NotificationsApi(apiConfig);

  onMount(() => {
    formStore.initialize();
  });

  const handleSubmit = async (event: MouseEvent) => {
    isSubmitting = true;
    try {
      event.preventDefault();
      const isValid = await formStore.validate($formStore.fields);
      if (!isValid) {
        toast.push("일부 항목값이 올바르지 않습니다.");
        return;
      }
      if (
        $formStore.fields.notiType === NotificationTypeEnum.GeneralNotification
      ) {
        formStore.update({ referenceId: "/" });
      }
      console.log(formStore);
      await notificationApi.notificationsCreate({
        createNotiRequest: convertToSnakeCase<CreateNotiRequest>(
          $formStore.fields,
        ),
      });
      toast.push("푸시알림이 등록되었습니다.");
      navigate(-1);
    } catch (e) {
      toast.push("푸시알림 등록에 오류가 발생했습니다.");
    } finally {
      isSubmitting = false;
    }
  };
</script>

<Nav title={"푸시알림 추가"} loading={isSubmitting}>
  <div class="row-right-wrapper mb10">
    <Button type={"button"} on:click={handleSubmit} icon={Save16}>
      푸시알림 등록
    </Button>
  </div>
  <NotificationForm />
  <div class="row-right-wrapper mt10">
    <Button type={"button"} on:click={handleSubmit} icon={Save16}>
      푸시알림 등록
    </Button>
  </div>
</Nav>

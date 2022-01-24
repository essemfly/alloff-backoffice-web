<script lang="ts">
  import {
    Button,
    Form,
    FormGroup,
    RadioButtonGroup,
    RadioButton,
    TextInput,
  } from "carbon-components-svelte";
  import DocumentAdd16 from "carbon-icons-svelte/lib/DocumentAdd16";
  import Save16 from "carbon-icons-svelte/lib/Save16";
  import { DateTime } from "luxon";
  import {
    NotificationsApi,
    Notification,
    NotificationtypeEnum,
    CreateNotificationRequest,
  } from "../../../api";

  export let notification: Notification | undefined = undefined;
  export let load: (() => Promise<void>) | undefined = undefined;
  export let mobile: boolean;
  export let api: NotificationsApi;
  export let submitting: boolean;

  let { title, message, notificationtype, scheduleddate, referenceid } =
    notification ?? {
      title: "",
      message: "",
      notificationtype: NotificationtypeEnum.TimedealOpenNotification,
      scheduleddate: DateTime.now().toISO(),
      referenceid: "",
    };

  const touched = true;
  let complete: CreateNotificationRequest | undefined;

  $: {
    const newComplete: CreateNotificationRequest = {
      title: title,
      message: message,
      referenceid: referenceid,
      scheduleddate: scheduleddate,
      notificationtype: notificationtype,
    };
    complete = newComplete;
  }

  const submit = async () => {
    submitting = true;
    if (!notification) {
      if (complete) {
        try {
          await api.notificationsCreate({
            createNotificationRequest: complete,
          });
          window.location.href = `../notifications`;
        } catch (e: any) {
          console.log(e);
          alert("푸시 저장 도중 문제가 발생했습니다!");
        } finally {
          submitting = false;
          if (load) return load();
        }
      }
    }
  };
</script>

<div style="height: 10px" />
<div class="button-wrapper">
  <Button
    on:click={submit}
    disabled={!touched}
    icon={notification ? Save16 : DocumentAdd16}
    >{notification ? "수정" : "추가"}</Button
  >
</div>
<div style="height: 10px" />
<Form>
  <FormGroup>
    <TextInput labelText="타이틀" bind:value={title} />
    <TextInput labelText="메시지" bind:value={message} />
  </FormGroup>
  <RadioButtonGroup legendText="푸쉬 종류" bind:selected={notificationtype}>
    <RadioButton
      labelText="타임딜 오픈 푸시"
      value={NotificationtypeEnum.TimedealOpenNotification}
    />
    <RadioButton
      labelText="일반 푸시"
      value={NotificationtypeEnum.GeneralNotification}
    />
    <RadioButton
      labelText="브랜드 오픈 푸시"
      value={NotificationtypeEnum.BrandOpenNotification}
    />
    <RadioButton
      labelText="상품가격 푸시"
      value={NotificationtypeEnum.ProductDiffNotification}
    />
  </RadioButtonGroup>
  <div class="referenceid">
    <FormGroup>
      <TextInput labelText="관련ID" bind:value={referenceid} />
    </FormGroup>
  </div>
</Form>

<style>
  .button-wrapper {
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
  }

  .referenceid {
    margin-top: 20px;
  }
</style>

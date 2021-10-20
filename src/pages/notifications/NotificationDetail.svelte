<script lang="ts">
    import {
      Breakpoint,
      InlineLoading,
      Tab,
      TabContent,
      Tabs,
    } from "carbon-components-svelte";
    import { Notification, NotificationsApi } from "../../api";
    import LoggedInFrame from "../common/LoggedInFrame.svelte";
    import TimedealSectionBasic from "../timedeals/sections/TimedealSectionBasic.svelte";
    import TimedealSectionProducts from "../timedeals/sections/TimedealSectionProducts.svelte";
    import TimedealSectionTop from "../timedeals/sections/TimedealSectionTop.svelte";
  
    export let notificationId: string | undefined = undefined;
  
    let notification: Notification | undefined;
    let submitting = false;
    let loading = !!notificationId;
    let mobile = false;
    let size: "sm" | "md" | "lg" | "xlg" | "max";
  
    let tabIndex = 0;
  
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
              ? "Fetching timedeal..."
              : "Updating timedeal..."}
          />
        </div>
      </div>
    {:else}
      <Breakpoint bind:size />
      <TimedealSectionTop {notification} />
      {#if notification}
        <Tabs bind:selected={tabIndex}>
          <Tab label="기본정보" />
          <Tab label="상품" />
          <div slot="content">
            <TabContent style="padding: 0;">
              <TimedealSectionBasic
                {...{ notification, api, submitting, load, mobile }}
              />
            </TabContent>
            <TimedealSectionProducts
              {...{ notification, mobile, api, load, submitting }}
            />
          </div>
        </Tabs>
      {:else}
        <TimedealSectionBasic {...{ notification, api, submitting, load, mobile }} />
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
  
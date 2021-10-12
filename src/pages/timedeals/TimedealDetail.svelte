<script lang="ts">
  import {
    Breakpoint,
    InlineLoading,
    Tab,
    TabContent,
    Tabs,
  } from "carbon-components-svelte";
  import { Timedeal, TimedealsApi } from "../../api";
  import LoggedInFrame from "../common/LoggedInFrame.svelte";
  import TimedealSectionBasic from "./sections/TimedealSectionBasic.svelte";
  import TimedealSectionProducts from "./sections/TimedealSectionProducts.svelte";
  import TimedealSectionTop from "./sections/TimedealSectionTop.svelte";

  export let timedealId: string | undefined = undefined;

  let timedeal: Timedeal | undefined;
  let submitting = false;
  let loading = !!timedealId;
  let mobile = false;
  let size: "sm" | "md" | "lg" | "xlg" | "max";

  let tabIndex = 0;

  const api = new TimedealsApi();

  const load = async () => {
    if (!timedealId) return;
    loading = true;
    const { data } = await api.timedealsRetrieve(timedealId);
    timedeal = data;
    loading = false;
    console.log({ tabIndex });
  };

  $: mobile = size === "sm";
  $: {
    if (timedealId) {
      load();
    }
  }
  $: console.log({ tabIndex });
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
    <TimedealSectionTop {timedeal} />
    {#if timedeal}
      <Tabs bind:selected={tabIndex}>
        <Tab label="기본정보" />
        <Tab label="상품" />
        <div slot="content">
          <TabContent style="padding: 0;">
            <TimedealSectionBasic
              {...{ timedeal, api, submitting, load, mobile }}
            />
          </TabContent>
          <TimedealSectionProducts
            {...{ timedeal, mobile, api, load, submitting }}
          />
        </div>
      </Tabs>
    {:else}
      <TimedealSectionBasic {...{ timedeal, api, submitting, load, mobile }} />
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

<script lang="ts">
  import {
    Breakpoint,
    InlineLoading,
    Tab,
    TabContent,
    Tabs,
  } from "carbon-components-svelte";
  import { TimedealProduct, TimedealProductsApi } from "../../api";
  import LoggedInFrame from "../common/LoggedInFrame.svelte";
  import TimedealProductSectionBasic from "./sections/TimedealProductSectionBasic.svelte";
  import TimedealProductSectionTop from "./sections/TimedealProductSectionTop.svelte";

  export let timedealProductId: string | undefined = undefined;

  let product: TimedealProduct | undefined;
  let submitting = false;
  let loading = !!timedealProductId;
  let mobile = false;
  let size: "sm" | "md" | "lg" | "xlg" | "max";

  let tabIndex = 0;

  const api = new TimedealProductsApi();

  const load = async () => {
    if (!timedealProductId) return;
    loading = true;
    const { data } = await api.timedealProductsRetrieve({
      id: timedealProductId,
    });
    product = data;
    loading = false;
  };

  $: mobile = size === "sm";
  $: {
    if (timedealProductId) {
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
            ? "Fetching timedeal product..."
            : "Updating timedeal product..."}
        />
      </div>
    </div>
  {:else}
    <Breakpoint bind:size />
    <TimedealProductSectionTop {product} />
    {#if product}
      <Tabs bind:selected={tabIndex}>
        <Tab label="기본정보" />
        <div slot="content">
          <TabContent style="padding: 0;">
            <TimedealProductSectionBasic
              {...{ product, api, submitting, load, mobile }}
            />
          </TabContent>
        </div>
      </Tabs>
    {:else}
      <TimedealProductSectionBasic
        {...{ product, api, submitting, load, mobile }}
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

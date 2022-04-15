<script lang="ts">
  import { onMount } from "svelte";
  import { Button } from "carbon-components-svelte";
  import ArrowLeft16 from "carbon-icons-svelte/lib/ArrowLeft16";

  import {
    ShippingCandidateProto,
    ShippingNoticesApi,
  } from "@lessbutter/alloff-backoffice-api";
  import MediaQuery from "@app/helpers/MediaQuery.svelte";
  import Nav from "@app/components/Nav.svelte";

  import CandidatesTable from "./components/CandidatesTable.svelte";
  import { apiConfigs } from "@app/store";

  const api = new ShippingNoticesApi($apiConfigs);

  let loading = true;
  let fulfilledCandidates: ShippingCandidateProto[] = [];
  let partialCandidates: ShippingCandidateProto[] = [];

  onMount(async () => {
    const res = await api.shippingNoticesGetCandidatesList();
    fulfilledCandidates = res.data.filter((c) => c.is_fulfilled);
    partialCandidates = res.data.filter((c) => !c.is_fulfilled);
    loading = false;
  });
</script>

<Nav>
  <MediaQuery query="(max-width: 480px)" let:matches>
    <Button
      icon={ArrowLeft16}
      kind="tertiary"
      on:click={() => window.history.back()}>뒤로</Button
    >
    <CandidatesTable
      isMobile={matches}
      {...{ fulfilledCandidates, partialCandidates, loading }}
    />
  </MediaQuery>
</Nav>

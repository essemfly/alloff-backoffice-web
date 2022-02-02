<script lang="ts">
  import { onMount } from "svelte";
  import MediaQuery from "../../../helpers/MediaQuery.svelte";
  import LoggedInFrame from "../../common/LoggedInFrame.svelte";
  import { ShippingCandidateProto, ShippingNoticesApi } from "../../../api";
  import CandidatesTable from "./components/CandidatesTable.svelte";
  const api = new ShippingNoticesApi();
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

<LoggedInFrame>
  <MediaQuery query="(max-width: 480px)" let:matches>
    <CandidatesTable
      isMobile={matches}
      {...{ fulfilledCandidates, partialCandidates, loading }}
    />
  </MediaQuery>
</LoggedInFrame>

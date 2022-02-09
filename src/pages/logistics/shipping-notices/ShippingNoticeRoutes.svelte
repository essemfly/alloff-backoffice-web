<script lang="ts">
  import { Route } from "svelte-navigator";
  import Candidates from "./Candidates.svelte";
  import ShippingNoticeDetail from "./ShippingNoticeDetail.svelte";
  import ShippingNotices from "./ShippingNotices.svelte";
</script>

<Route path="/">
  <ShippingNotices />
</Route>
<Route path=":id" let:params>
  <ShippingNoticeDetail noticeId={parseInt(params.id)} />
</Route>
<Route path="candidates">
  <Candidates />
</Route>

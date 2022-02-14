<script lang="ts">
  import { Route } from "svelte-navigator";
  import Candidates from "./views/Candidates.svelte";
  import ShippingNoticeDetail from "./views/ShippingNoticeDetail.svelte";
  import ShippingNotices from "./views/ShippingNotices.svelte";
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

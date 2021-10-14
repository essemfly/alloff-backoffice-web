<script lang="ts">
  import "carbon-components-svelte/css/g10.css";
  import { Route, Router } from "svelte-navigator";
  import Login from "./pages/auth/Login.svelte";
  import OrderDetail from "./pages/orders/OrderDetail.svelte";
  import Orders from "./pages/orders/Orders.svelte";
  import TimedealDetail from "./pages/timedeals/TimedealDetail.svelte";
  import Timedeals from "./pages/timedeals/Timedeals.svelte";
  import Notifications from "./pages/notifications/Notifications.svelte"
  
  import { ApolloClient,  createHttpLink, InMemoryCache  } from "@apollo/client";
  import { setClient } from "svelte-apollo";
  const client = new ApolloClient({
  link: createHttpLink({
    uri: `http://127.0.0.1/query`,
    headers: {
      "X-App-Version": "0.3.0",
    },
  }),
  cache: new InMemoryCache(),
  ssrMode: true,
  defaultOptions: {
    query: {
      fetchPolicy: "no-cache",
    },
  },
});

setClient(client);

</script>

<Router primary={false}>
  <Route path="orders/*">
    <Route path="/">
      <Orders />
    </Route>
    <Route path=":id" let:params>
      <OrderDetail orderId={params.id} />
    </Route>
  </Route>
  <Route path="timedeals/*">
    <Route path="/">
      <Timedeals />
    </Route>
    <Route path=":id" let:params>
      <TimedealDetail timedealId={params.id} />
    </Route>
    <Route path="new">
      <TimedealDetail />
    </Route>
    </Route> -->
    <!-- <Route path=":id" let:params>
      <OrderDetail orderId={params.id} />
    </Route> -->
  <!-- </Route> -->
  <Route path="notifications/*">
    <Route path="/">
      <Notifications />
    </Route>
    <!-- <Route path=":id" let:params>
      <NotificationDetial notificationId={params.id} />
    </Route> -->
  </Route>
  <Route path="login">
    <Login />
  </Route>
  <Route path="/">
    <Orders />
  </Route>
</Router>

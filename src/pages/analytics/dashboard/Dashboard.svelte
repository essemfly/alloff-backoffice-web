<script>
  import { DateTime } from "luxon";
  import { onMount } from "svelte";
  import * as d3 from "d3";
  import { InlineLoading } from "carbon-components-svelte";

  import { OrdersApi } from "@lessbutter/alloff-backoffice-api";

  import Nav from "@app/components/Nav.svelte";
  import DashboardTable from "./components/DashboardTable.svelte";

  const api = new OrdersApi();
  let data = [];
  let loading = true;

  onMount(() => {
    load();
  });

  const load = async () => {
    const orders = (await api.ordersListMinimumAllList()).data;
    loading = false;
    const mapping = {};
    orders.forEach((d) => {
      const _date = d.created.split("T")[0];
      const date = DateTime.fromISO(_date).toJSDate();
      if (!mapping[date]) {
        mapping[date] = {
          date: date,
          nominal: { amount: 0, count: 0 },
          noncancel: { amount: 0, count: 0 },
        };
      }
      mapping[date].nominal.amount += d.totalprice;
      mapping[date].nominal.count++;

      if (!d.orderstatus.includes("CANCEL")) {
        mapping[date].noncancel.amount += d.totalprice;
        mapping[date].noncancel.count++;
      }
    });

    // set the dimensions and margins of the graph
    const margin = { top: 10, right: 30, bottom: 30, left: 60 };
    const width = 800 - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;
    // append the svg object to the body of the page
    const svg = d3
      .select("#chart")
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    const svg2 = d3
      .select("#chart2")
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    data = Object.values(mapping);
    // Add X axis --> it is a date format
    const x = d3
      .scaleTime()
      .domain(
        d3.extent(data, function (o) {
          return o.date;
        }),
      )
      .range([0, width]);

    svg
      .append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x));

    svg2
      .append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x));

    // Add Y axis
    const y = d3
      .scaleLinear()
      .domain([
        0,
        d3.max(data, function (o) {
          return o.nominal.amount;
        }),
      ])
      .range([height, 0]);
    svg.append("g").call(d3.axisLeft(y));
    // Add Y axis
    const y2 = d3
      .scaleLinear()
      .domain([
        0,
        d3.max(data, function (o) {
          return o.nominal.count;
        }),
      ])
      .range([height, 0]);
    svg2.append("g").call(d3.axisLeft(y2));

    // Add the line
    svg
      .append("path")
      .datum(data)
      .attr("fill", "none")
      .attr("stroke", "red")
      .attr("stroke-width", 1.5)
      .attr(
        "d",
        d3
          .line()
          .x(function (d) {
            return x(d.date);
          })
          .y(function (d) {
            return y(d.nominal.amount);
          }),
      );

    // Add the line
    svg
      .append("path")
      .datum(data)
      .attr("fill", "none")
      .attr("stroke", "steelblue")
      .attr("stroke-width", 1.5)
      .attr(
        "d",
        d3
          .line()
          .x(function (d) {
            return x(d.date);
          })
          .y(function (d) {
            return y(d.noncancel.amount);
          }),
      );

    // Add the line
    svg2
      .append("path")
      .datum(data)
      .attr("fill", "none")
      .attr("stroke", "red")
      .attr("stroke-width", 1.5)
      .attr(
        "d",
        d3
          .line()
          .x(function (d) {
            return x(d.date);
          })
          .y(function (d) {
            return y2(d.nominal.count);
          }),
      );

    // Add the line
    svg2
      .append("path")
      .datum(data)
      .attr("fill", "none")
      .attr("stroke", "steelblue")
      .attr("stroke-width", 1.5)
      .attr(
        "d",
        d3
          .line()
          .x(function (d) {
            return x(d.date);
          })
          .y(function (d) {
            return y2(d.noncancel.count);
          }),
      );
  };
</script>

<Nav>
  {#if loading}
    <InlineLoading description="Fetching data..." />
  {/if}
  <h6>빨강이 전체, 파랑이 유효(비취소) 기준</h6>
  <h2>거래액</h2>
  <div id="chart" />
  <h2>건수</h2>
  <div id="chart2" />

  <DashboardTable
    data={data
      .sort((a, b) => (a.date > b.date ? -1 : b.date > a.date ? 1 : 0))
      .map((d) => ({ id: d.date, ...d }))}
  />
</Nav>

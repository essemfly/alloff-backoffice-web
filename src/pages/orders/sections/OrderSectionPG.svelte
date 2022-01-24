<script lang="ts">
  import { TabContent } from "carbon-components-svelte";
  import { OrderRetrieve } from "../../../api";
  import { numberWithCommas } from "../../../helpers/number";
  import InfoSection from "../../common/InfoSection.svelte";

  export let order: OrderRetrieve;
</script>

<TabContent style="padding: 0;">
  {#if order.iamport}
    <InfoSection
      title="PG 정보"
      menuItems={[
        {
          text: "영수증 URL 복사",
          onClick: () =>
            navigator.clipboard.writeText(order.iamport.receipt_url),
        },
        {
          text: "PG ID 복사",
          onClick: () => navigator.clipboard.writeText(order.iamport.imp_uid),
        },
      ]}
      rows={[
        {
          header: "상태",
          body:
            order.iamport.status === "cancelled"
              ? order.iamport.amount === order.iamport.cancel_amount
                ? "전체취소"
                : "부분취소"
              : order.iamport.status === "paid"
              ? "결제됨"
              : "기타",
          tagType:
            order.iamport.status === "cancelled"
              ? order.iamport.amount === order.iamport.cancel_amount
                ? "red"
                : "magenta"
              : order.iamport.status === "paid"
              ? "green"
              : "purple",
        },
        { header: "PG ID", body: order.iamport.imp_uid },
        {
          header: "결제수단",
          body:
            order.iamport.pay_method === "card"
              ? "신용카드"
              : order.iamport.pay_method === "point"
              ? "포인트"
              : "기타",
        },
        {
          header: "결제사",
          body:
            order.iamport.pg_provider === "danal_tpay"
              ? "다날"
              : order.iamport.pg_provider === "kakaopay"
              ? "카카오"
              : "기타",
        },
        {
          header: "결제금액",
          body: numberWithCommas(order.iamport.amount),
        },
        {
          header: "취소금액",
          body: numberWithCommas(order.iamport.cancel_amount),
        },
      ]}
    />
    {#each order.iamport.cancel_history as history, i}
      <InfoSection
        smallTitle
        fontSize={11}
        title={`취소 #${i + 1}`}
        rows={[
          {
            header: "금액",
            body: numberWithCommas(history.amount),
          },
          { header: "사유", body: history.reason },
          {
            header: "영수증",
            body: "링크",
            href: history.receipt_url,
          },
        ]}
      />
    {/each}
  {:else}
    <div>없음</div>
  {/if}
</TabContent>

<script lang="ts">
  import { TabContent } from "carbon-components-svelte";

  import { OrderItemRetrieve } from "@api";
  import { numberWithCommas } from "@app/helpers/number";
  import InfoSection from "./InfoSection.svelte";

  export let item: OrderItemRetrieve;
</script>

<TabContent style="padding: 0;">
  <div style="margin-top:20px;">
    <h5>
      PG 정보는 주문서 기준입니다. 결제금액이 단건 금액보다 클 수 있습니다.
    </h5>
  </div>
  {#if item.iamport}
    <InfoSection
      title="PG 정보"
      menuItems={[
        {
          text: "영수증 URL 복사",
          onClick: () =>
            navigator.clipboard.writeText(item.iamport.receipt_url),
        },
        {
          text: "PG ID 복사",
          onClick: () => navigator.clipboard.writeText(item.iamport.imp_uid),
        },
      ]}
      rows={[
        {
          header: "상태",
          body:
            item.iamport.status === "cancelled"
              ? item.iamport.amount === item.iamport.cancel_amount
                ? "전체취소"
                : "부분취소"
              : item.iamport.status === "paid"
              ? "결제됨"
              : "기타",
          tagType:
            item.iamport.status === "cancelled"
              ? item.iamport.amount === item.iamport.cancel_amount
                ? "red"
                : "magenta"
              : item.iamport.status === "paid"
              ? "green"
              : "purple",
        },
        { header: "PG ID", body: item.iamport.imp_uid },
        {
          header: "결제수단",
          body:
            item.iamport.pay_method === "card"
              ? "신용카드"
              : item.iamport.pay_method === "point"
              ? "포인트"
              : "기타",
        },
        {
          header: "결제사",
          body:
            item.iamport.pg_provider === "danal_tpay"
              ? "다날"
              : item.iamport.pg_provider === "kakaopay"
              ? "카카오"
              : "기타",
        },
        {
          header: "결제금액",
          body: numberWithCommas(item.iamport.amount),
        },
        {
          header: "취소금액",
          body: numberWithCommas(item.iamport.cancel_amount),
        },
      ]}
    />
    {#each item.iamport.cancel_history as history, i}
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

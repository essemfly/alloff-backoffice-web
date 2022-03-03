<script lang="ts">
  import { OrderItemList, OrderItemRetrieve, OrderItemsApi } from "@api";
  import { toLocaleDateTime } from "@app/helpers/datetime";
  import { numberWithCommas } from "@app/helpers/number";
  import { getIsForeignLabel, getTypeLabel } from "@app/helpers/order-item";
  import { admin } from "@app/store";
  import { Button, TabContent, TextInput } from "carbon-components-svelte";
  import Send16 from "carbon-icons-svelte/lib/Send16";
  import InfoSection from "./InfoSection.svelte";

  export let item: OrderItemRetrieve;
  export let userItems: OrderItemList[];
  export let mobile: boolean;
  export let api: OrderItemsApi;
  export let load: () => {};
  export let submitting: boolean;

  const sendNewMemo = async () => {
    if (newMemo === "") return;
    submitting = true;
    await api.orderItemsAddMemoCreate({
      id: item.id,
      addOrderItemMemoRequest: { body: newMemo },
    });
    submitting = false;
    load();
  };
  const deleteMemo = async (memoId: number) => {
    submitting = true;
    try {
      await api.orderItemsDeleteMemoCreate({
        id: item.id,
        deleteItemOrderMemoRequest: { memo_id: memoId },
      });
    } catch (e: any) {
      alert("메모를 삭제할 수 없습니다. " + e.response.data.message);
    }
    submitting = false;
    load();
  };

  let newMemo: string = "";
</script>

<TabContent style="padding: 0;">
  <InfoSection
    title="고객정보"
    rows={[
      ...[{ header: "휴대폰", body: item.order.user.mobile }],
      ...($admin?.profile.is_admin
        ? [
            { header: "유저 ID", body: item.order.user_id },
            {
              header: "개인통관고유번호",
              body: item.order.payment.personal_customs_number ?? "-",
            },
            {
              header: "주문수",
              body: `${userItems.length}건`,
              href: `/items/?userid=${item.order.user.id}`,
            },
          ]
        : []),
    ]}
  />

  <InfoSection
    title="배송정보"
    rows={[
      {
        header: "받는사람",
        body: `${item.order.payment.buyer_name} (${item.order.payment.buyer_mobile})`,
      },
      {
        header: "주소",
        body: `${item.order.payment.buyer_address} (${item.order.payment.buyer_post_code})`,
      },
      { header: "요청사항", body: item.order.user_memo ?? "" },
      {
        header: "송장번호",
        body:
          item.tracking_number.length > 0
            ? item.tracking_number[item.tracking_number.length - 1]
            : "",
      },
      {
        header: "추적 URL",
        href:
          item.tracking_url.length > 0
            ? item.tracking_url[item.tracking_url.length - 1]
            : "",
        body: item.tracking_url.length > 0 ? "링크" : "",
      },
    ]}
  />
  <div class="products">
    <h4>상품 정보</h4>
    <div class="product-item" class:mobile>
      <div class="product-info">
        <InfoSection
          title={item.product_name}
          smallTitle
          menuItems={$admin?.profile.is_admin
            ? [
                {
                  text: "재입고처리 (1개)",
                  onClick: async () => {
                    submitting = true;
                    await api.orderItemsForceReceiveCreate({ id: item.id });
                    submitting = false;
                    window.location.reload();
                  },
                },
              ]
            : []}
          rows={[
            {
              header: "상품타입",
              body: getTypeLabel(item.order_item_type),
            },
            {
              header: "해외소싱여부",
              body: getIsForeignLabel(item.is_foreign),
            },
            {
              header: "사이즈",
              body: item.size,
            },
            {
              header: "수량",
              body: `${item.quantity} EA`,
            },
            {
              header: "브랜드",
              body: `${item.brand_korname} (${item.brand_keyname})`,
            },
            {
              header: "상품 ID",
              body: item.product_id,
            },
            {
              header: "상품 URL",
              href: item.product_url ?? "",
              body: item.product_url !== "" ? "링크" : "",
            },
            {
              header: "단가",
              body: `${numberWithCommas(item.sales_price)}원`,
            },
          ]}
        />
      </div>
      <div>
        <img
          class="product-image"
          class:mobile
          src={item.product_img}
          alt="product"
        />
      </div>
    </div>
  </div>
  {#if $admin?.profile.is_admin}
    <div class="memo">
      <h4>관리자 메모</h4>
      <div class="memo-form">
        <TextInput
          placeholder="새 메모 입력"
          bind:value={newMemo}
          on:keydown={(e) =>
            e.key === "Enter" ? (() => sendNewMemo())() : undefined}
        />
        <div>
          <Button
            size="field"
            icon={Send16}
            iconDescription="전송"
            on:click={() => sendNewMemo()}
          />
        </div>
      </div>
      <div class="memo-items">
        {#each item.memos as memo}
          <div class="memo-item" class:mobile>
            <caption>[{toLocaleDateTime(memo.created_at)}]&nbsp;</caption>
            {memo.body}&nbsp;
            <div class="memo-user noselect">
              <h6>{memo.admin.profile.name} ({memo.admin.username})</h6>
              {#if $admin && memo.admin.id === $admin.id}
                <div class="memo-delete" on:click={() => deleteMemo(memo.id)}>
                  ❌
                </div>
              {/if}
            </div>
          </div>
        {/each}
      </div>
    </div>
  {/if}
</TabContent>

<style>
  .products > h4 {
    margin-bottom: 15px;
  }

  .product-item {
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    margin-bottom: 20px;
  }

  .product-item.mobile {
    flex-direction: column;
  }

  .product-info {
    flex-grow: 1;
  }

  .product-image {
    width: 50vw;
    min-width: 300px;
    max-height: 400px;
    object-fit: contain;
  }

  .product-image.mobile {
    width: 100%;
  }

  .memo {
    margin-top: 10px;
  }

  .memo-form {
    margin-top: 10px;
    display: flex;
    flex-direction: row;
    align-items: center;
  }

  .memo-item {
    margin-top: 8px;
    margin-bottom: 8px;
    display: flex;
    flex-direction: row;
    align-items: center;
    line-height: 20px;
  }

  .memo-item.mobile {
    flex-direction: column;
    align-items: start;
  }

  .memo-user {
    display: flex;
    flex-direction: row;
    align-items: center;
  }

  .memo-delete {
    margin-left: 3px;
    font-size: 10px;
    cursor: pointer;
  }
</style>

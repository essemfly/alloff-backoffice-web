<script lang="ts">
  import { TabContent, TextInput, Button } from "carbon-components-svelte";
  import { OrderRetrieve, OrdersApi } from "../../../api";
  import OrderSection from "../components/OrderSection.svelte";
  import Send16 from "carbon-icons-svelte/lib/Send16";
  import { toLocaleDateTime } from "../../../helpers/datetime";
  import { admin } from "../../../store";
  export let order: OrderRetrieve;
  export let mobile: boolean;
  export let api: OrdersApi;
  export let load: () => {};
  export let submitting: boolean;

  const sendNewMemo = async () => {
    if (newMemo === "") return;
    submitting = true;
    await api.ordersAddMemo(order.id, { body: newMemo });
    submitting = false;
    load();
  };

  const deleteMemo = async (memoId: number) => {
    submitting = true;
    try {
      await api.ordersDeleteMemo(order.id, { memo_id: memoId });
    } catch (e: any) {
      alert("메모를 삭제할 수 없습니다. " + e.response.data.message);
    }
    submitting = false;
    load();
  };

  let newMemo: string = "";
</script>

<TabContent style="padding: 0;">
  <OrderSection
    title="고객정보"
    menuItems={[
      {
        text: "휴대폰 복사",
        onClick: () => navigator.clipboard.writeText(order.user.mobile),
      },
      {
        onClick: () => navigator.clipboard.writeText(order.user._id),
        text: "유저 ID 복사",
      },
    ]}
    rows={[
      { header: "휴대폰", body: order.user.mobile },
      { header: "유저 ID", body: order.user._id },
    ]}
  />
  <OrderSection
    title="배송정보"
    menuItems={[
      {
        hide: order.memo === "",
        text: "요청사항 복사",
        onClick: () => navigator.clipboard.writeText(order.memo),
      },
      {
        hide:
          !order.deliverytrackingnumber || order.deliverytrackingnumber === "",
        text: "송장번호 복사",
        onClick: () =>
          navigator.clipboard.writeText(order.deliverytrackingnumber),
      },
      {
        hide: !order.deliverytrackingurl || order.deliverytrackingurl === "",
        text: "추적 URL 복사",
        onClick: () => navigator.clipboard.writeText(order.deliverytrackingurl),
      },
    ]}
    rows={[
      { header: "요청사항", body: order.memo },
      { header: "송장번호", body: order.deliverytrackingnumber },
      {
        header: "추적 URL",
        href: order.deliverytrackingurl,
        body: order.deliverytrackingurl !== "" ? "링크" : "",
      },
    ]}
  />
  <div class="memo">
    <h4>관리자 메모</h4>
    <div class="memo-form">
      <TextInput
        placeholder="새 메모 입력"
        bind:value={newMemo}
        on:keydown={(e) =>
          e.key === "Enter" ? (() => sendNewMemo())() : undefined}
      />
      <Button
        size="field"
        icon={Send16}
        iconDescription="전송"
        on:click={() => sendNewMemo()}
      />
    </div>
    <div class="memo-items">
      {#each order.memos as memo}
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
</TabContent>

<style>
  .memo {
    margin-top: 10px;
  }

  .memo-form {
    margin-top: 10px;
    display: flex;
    flex-direction: row;
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

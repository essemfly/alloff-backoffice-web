<script lang="ts">
  import { TabContent, TextInput, Button, Tag } from "carbon-components-svelte";
  import { OrderRetrieve, OrdersApi } from "../../../api";
  import InfoSection from "../../common/InfoSection.svelte";
  import Send16 from "carbon-icons-svelte/lib/Send16";
  import { toLocaleDateTime } from "../../../helpers/datetime";
  import { admin } from "../../../store";
  import { numberWithCommas } from "../../../helpers/number";
  export let order: OrderRetrieve;
  export let mobile: boolean;
  export let api: OrdersApi;
  export let load: () => {};
  export let submitting: boolean;

  const sendNewMemo = async () => {
    if (newMemo === "") return;
    submitting = true;
    await api.ordersAddMemoCreate(order.id, { body: newMemo });
    submitting = false;
    load();
  };

  const deleteMemo = async (memoId: number) => {
    submitting = true;
    try {
      await api.ordersDeleteMemoCreate(order.id, { memo_id: memoId });
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
  <InfoSection
    title="배송정보"
    menuItems={[
      {
        text: "전체주소 복사",
        onClick: () =>
          navigator.clipboard.writeText(
            `${order?.payment?.buyeraddress} (${order?.payment?.buyerpostcode})`
          ),
      },
      {
        text: "주소만 복사",
        onClick: () =>
          navigator.clipboard.writeText(order?.payment?.buyeraddress ?? ""),
      },
      {
        text: "우편번호만 복사",
        onClick: () =>
          navigator.clipboard.writeText(order?.payment?.buyerpostcode ?? ""),
      },
      {
        text: "이름 복사",
        onClick: () =>
          navigator.clipboard.writeText(order?.payment?.buyername ?? ""),
      },
      {
        text: "휴대폰 복사",
        onClick: () =>
          navigator.clipboard.writeText(order?.payment?.buyermobile ?? ""),
      },
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
          navigator.clipboard.writeText(order.deliverytrackingnumber ?? ""),
      },
      {
        hide: !order.deliverytrackingurl || order.deliverytrackingurl === "",
        text: "추적 URL 복사",
        onClick: () =>
          navigator.clipboard.writeText(order.deliverytrackingurl ?? ""),
      },
    ]}
    rows={[
      {
        header: "받는사람",
        body: `${order?.payment?.buyername} (${order?.payment?.buyermobile})`,
      },
      {
        header: "주소",
        body: `${order?.payment?.buyeraddress} (${order?.payment?.buyerpostcode})`,
      },
      { header: "요청사항", body: order.memo },
      { header: "송장번호", body: order.deliverytrackingnumber },
      {
        header: "추적 URL",
        href: order.deliverytrackingurl,
        body: order.deliverytrackingurl !== "" ? "링크" : "",
      },
    ]}
  />
  <div class="products">
    <h4>상품 정보</h4>
    {#each order.orders as o, i}
      <div class="product-item" class:mobile>
        <div class="product-info">
          <InfoSection
            title={`상품 #${i + 1}`}
            smallTitle
            menuItems={[
              {
                text: "상품명 복사",
                onClick: () =>
                  navigator.clipboard.writeText(
                    (o.product ?? o.alloffproduct)?.name ?? ""
                  ),
              },
              {
                text: "브랜드 복사",
                onClick: () =>
                  navigator.clipboard.writeText(
                    `${(o.product ?? o.alloffproduct)?.brand.korname} (${(o.product ?? o.alloffproduct)?.brand.keyname})`
                  ),
              },
              {
                text: "상품ID 복사",
                onClick: () =>
                  navigator.clipboard.writeText(
                    `${o?.alloffproduct ? "alloffproduct" : "product"} - ${
                      (o.product ?? o.alloffproduct)?._id
                    }`
                  ),
              },
            ]}
            rows={[
              {
                header: "상품타입",
                body: o.alloffproduct ? "타임딜상품" : "일반상품",
                tagType: o.alloffproduct ? "green" : "purple",
              },
              {
                header: "상품명",
                body: (o.product ?? o.alloffproduct)?.name,
              },
              {
                header: "사이즈",
                body: o.size,
              },
              {
                header: "수량",
                body: `${o.quantity} EA`,
              },
              {
                header: "브랜드",
                body: `${(o.product ?? o.alloffproduct)?.brand.korname} (${
                  (o.product ?? o.alloffproduct)?.brand.keyname
                })`,
              },
              {
                header: "상품 ID",
                body: (o.product ?? o.alloffproduct)?._id,
              },
              {
                header: "상품 URL",
                href: o.product?.producturl ?? "",
                body: o.product?.producturl ? "링크" : "",
              },
              {
                header: "단가",
                body: `${numberWithCommas(
                  (o.product ?? o.alloffproduct)?.discountedprice ?? 0
                )}원`,
              },
            ]}
          />
        </div>
        <div>
          <img
            class="product-image"
            class:mobile
            src={(o.product ?? o.alloffproduct)?.images &&
            (o.product ?? o.alloffproduct)?.images.length > 0
              ? (o.product ?? o.alloffproduct).images[0]
              : ""}
            alt="product"
          />
        </div>
      </div>
    {/each}
  </div>
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

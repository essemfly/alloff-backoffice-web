<script lang="ts">
  import { ProductInquiry } from "@api";
  import {
    Button,
    DataTable,
    InlineLoading,
    TextInput,
    Toolbar,
    ToolbarContent,
    ToolbarSearch,
  } from "carbon-components-svelte";
  import type { DataTableHeader } from "carbon-components-svelte/types/DataTable/DataTable";
  import Delete16 from "carbon-icons-svelte/lib/Delete16";
  import Popup16 from "carbon-icons-svelte/lib/Popup16";
  import Send16 from "carbon-icons-svelte/lib/Send16";
  import debounce from "lodash/debounce";
  import { DateTime } from "luxon";
  import { InquiriesApi } from "../../../../api";
  import { search } from "../../store";

  export let inquiries: ProductInquiry[] = [];
  export let isMobile = false;
  export let reload: () => Promise<void>;

  const api = new InquiriesApi();
  const ellipsisExtent = 50;

  let newReplyMap: { [inquiryId: string]: string } = {};
  let loading = false;

  const mobileHeaders: DataTableHeader[] = [
    { key: "id", value: "ID" },
    { key: "body", value: "본문" },
  ];

  const headers: DataTableHeader[] = [
    { key: "id", value: "ID" },
    { key: "brand_keyname", value: "브랜드코드" },
    { key: "status", value: "상태" },
    { key: "product_name", value: "제품명" },
    { key: "body", value: "본문" },
    { key: "created_at", value: "일시" },
    { key: "product_img", value: "이미지" },
  ];

  const handleSearch = debounce((e) => {
    search.set(e.target.value);
  }, 300);
</script>

{#if loading}
  <div class="overlay">
    <div>
      <InlineLoading description="LOADING..." />
    </div>
  </div>
{:else}
  <DataTable
    headers={isMobile ? mobileHeaders : headers}
    rows={inquiries}
    sortable
    expandable
  >
    <Toolbar>
      <ToolbarContent>
        <ToolbarSearch on:input={handleSearch} />
      </ToolbarContent>
    </Toolbar>
    <span slot="cell" let:cell let:row>
      {#if cell.key === "created_at"}
        {DateTime.fromISO(cell.value).setLocale("ko").toLocaleString({
          month: "2-digit",
          day: "2-digit",
          weekday: "narrow",
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        })}
      {:else if cell.key === "status"}
        {!row.is_pending ? "답변완료" : "답변대기"}
      {:else if cell.key === "body"}
        {row.body.length > ellipsisExtent
          ? row.body.substring(0, Math.min(row.body.length, ellipsisExtent)) +
            "..."
          : row.body}
      {:else if cell.key === "product_name"}
        {row.product.alloff_name}
      {:else if cell.key === "product_img"}
        <img
          src={row.product.thumbnail_image !== ""
            ? row.product.thumbnail_image
            : row.product.images[0]}
          height="100"
          alt="상품 이미지"
        />
      {:else if cell.key.includes("time")}
        {DateTime.fromISO(cell.value).setLocale("ko").toLocaleString({
          month: "2-digit",
          day: "2-digit",
          weekday: "narrow",
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        })}
      {:else if cell.value}{cell.value}
      {:else}
        <div />
      {/if}
    </span>
    <div slot="expanded-row" let:row>
      <div style="height: 20px" />
      <Button
        icon={Popup16}
        size="small"
        on:click={() => window.open(`/products/${row.product_id}`, "_blank")}
        >상품 페이지 열기 (새 창)</Button
      >
      <div style="height: 10px" />
      <h4>고객 이름</h4>
      {row.user_name}
      <div style="height: 10px" />
      <h4>본문</h4>
      {row.body}
      <div style="height: 10px" />
      <h4>답변 작성하기</h4>
      <div style="height: 10px" />
      <div class="memo-form">
        <TextInput
          placeholder="새 메모 입력"
          on:keyup={(e) => {
            newReplyMap = { ...newReplyMap, [row.id]: e.currentTarget.value };
          }}
        />
        <div>
          <Button
            size="field"
            icon={Send16}
            iconDescription="전송"
            on:click={async () => {
              await api.inquiriesCreateReplyCreate({
                id: row.id,
                createProductInquiryReplyRequest: { body: newReplyMap[row.id] },
              });
              reload();
            }}
          />
        </div>
      </div>
      <div style="height: 10px" />
      {#if row.replies.length > 0}
        <h4>작성된 답변</h4>
      {:else}
        <h4>작성된 답변이 없습니다.</h4>
      {/if}
      {#each row.replies as reply}
        <div class="reply">
          <div>{reply.body}</div>
          <div
            style="margin-top: 10px; color: gray; font-size: 0.8rem; font-weight: bold;"
          >
            {DateTime.fromISO(reply.created_at).setLocale("ko").toLocaleString({
              month: "2-digit",
              day: "2-digit",
              weekday: "narrow",
              hour: "2-digit",
              minute: "2-digit",
              hour12: true,
            })} by {reply.user_username}
          </div>
          <div style="height: 10px" />
          <Button
            size="small"
            kind="danger"
            icon={Delete16}
            on:click={async () => {
              if (!confirm("정말 삭제하시겠습니까?")) return;
              api.inquiriesDeleteReplyCreate({
                deleteProductInquiryReplyRequest: { id: reply.id },
              });
              window.location.reload();
            }}>답변 삭제하기</Button
          >
        </div>
      {/each}
      <div style="height: 20px" />
    </div>
  </DataTable>
{/if}

<style>
  .overlay {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    width: 100%;
    height: 100%;
    display: grid;
    place-items: center;
  }
  .memo-form {
    display: flex;
    flex-direction: row;
    align-items: center;
  }
  .reply {
    margin: 10px 0;
    padding: 10px;
    box-shadow: 0 0 5px rgba(0, 0, 0, 0.2);
    border-radius: 5px;
    background-color: #fafafa;
  }
</style>

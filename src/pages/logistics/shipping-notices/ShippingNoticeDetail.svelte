<script lang="ts">
  import {
    Breakpoint,
    InlineLoading,
    Tag,
    Button,
    UnorderedList,
    ListItem,
    Link,
    FileUploader,
  } from "carbon-components-svelte";
  import {
    OrderStatusEnum,
    Package,
    PackagesApi,
    PackageStatusEnum,
    ShippingNotice,
    ShippingNoticesApi,
    ShippingNoticesResultUploadApi,
    ShippingNoticeStatusEnum,
  } from "../../../api";
  import LoggedInFrame from "../../common/LoggedInFrame.svelte";
  import Package16 from "carbon-icons-svelte/lib/Package16";
  import { getStatusBadgeColor, getStatusLabel } from "../../../helpers/order";

  export let noticeId: string | undefined = undefined;

  let notice: ShippingNotice | undefined;
  let submitting = false;
  let loading = !!noticeId;
  let mobile = false;
  let size: "sm" | "md" | "lg" | "xlg" | "max";

  const tabIndex = 0;

  const api = new ShippingNoticesApi();

  const load = async () => {
    if (!noticeId) return;
    loading = true;
    const { data } = await api.shippingNoticesRetrieve({
      id: parseInt(noticeId),
    });
    notice = data;
    loading = false;
  };

  const submitPackaging = async () => {
    if (!noticeId) return;
    submitting = true;
    notice = (await api.shippingNoticesPackageCreate({ id: noticeId })).data;
    submitting = false;
  };

  const submitSeal = async () => {
    if (!noticeId) return;
    submitting = true;
    notice = (await api.shippingNoticesSealCreate({ id: noticeId })).data;
    submitting = false;
  };

  const submitMakeTemplate = async () => {
    if (!noticeId) return;
    submitting = true;
    notice = (
      await api.shippingNoticesMakeUploadTemplateCreate({ id: noticeId })
    ).data;
    submitting = false;
  };

  const submitUploadResult = async (file: File) => {
    if (!noticeId) return;
    submitting = true;
    try {
      const resultApi = new ShippingNoticesResultUploadApi();
      notice = (
        await resultApi.shippingNoticesResultUploadUploadCreate({
          file,
          noticeId,
        })
      ).data;
    } catch (e: any) {
      alert(e.message);
    } finally {
      submitting = false;
    }
  };

  const submitReprintLabel = async (pkg: Package) => {
    submitting = true;
    const packageApi = new PackagesApi();
    try {
      await packageApi.packagesReprintCreate({ id: pkg.id.toString() });
    } catch (e: any) {
      alert(e.message);
    } finally {
      submitting = false;
    }
  };

  $: mobile = size === "sm";
  $: {
    if (noticeId) {
      load();
    }
  }
</script>

<LoggedInFrame>
  {#if loading || submitting}
    <div class="overlay">
      <div>
        <InlineLoading
          description={loading
            ? "Fetching shipping notice..."
            : "Updating shipping notice..."}
        />
      </div>
    </div>
  {:else}
    <Breakpoint bind:size />
    {#if notice}
      <div>
        <Tag type="blue">{notice.status}</Tag>
        <h3>{notice.code}</h3>
        {#if notice.status === ShippingNoticeStatusEnum.Created}
          <Button
            size="small"
            icon={Package16}
            on:click={() => submitPackaging()}>패키징</Button
          >
        {:else if notice.status === ShippingNoticeStatusEnum.Locked}
          <Button
            size="small"
            icon={Package16}
            kind="danger-tertiary"
            on:click={() => submitSeal()}>라벨링</Button
          >
        {:else if notice.status === ShippingNoticeStatusEnum.Sealed}
          <Button
            size="small"
            icon={Package16}
            kind="tertiary"
            on:click={() => submitMakeTemplate()}>템플릿</Button
          >
        {/if}
        <h4>ITEMS - Total of {notice.items.length}</h4>
        <div class="notice-items">
          <UnorderedList>
            {#each notice.items as item}
              <ListItem>
                {item.inventory.code} - {item.item.name}
              </ListItem>
            {/each}
          </UnorderedList>
        </div>
        {#if notice.packages.length > 0}
          <h4>PACKAGES - Total of {notice.packages.length}</h4>
        {/if}
        {#if notice.template_url}
          <Link href={notice.template_url}>{notice.template_url}</Link>
          {#if notice.status !== ShippingNoticeStatusEnum.Shipped}
            <FileUploader
              labelTitle="발송결과 업로드"
              buttonLabel="파일 선택"
              labelDescription="이지어드민 xls 파일"
              accept={[".xls", ".htm"]}
              on:add={(e) => {
                if (e.detail.length === 0) {
                  return alert("파일이 잘못되거나 선택되지 않았습니다.");
                }
                submitUploadResult(e.detail[0]);
              }}
            />
          {/if}
        {/if}
        {#each notice.packages as pkg}
          <div class="package">
            <h6>{pkg.code}</h6>
            <h5>{pkg.recipient_name} ({pkg.recipient_mobile})</h5>
            {pkg.address} ({pkg.postcode})<br />
            <Tag type="blue">{pkg.shipping_notice_items.length}EA</Tag>
            <Tag type="green">{pkg.status}</Tag><br />
            <Button
              size="small"
              kind="tertiary"
              on:click={() => submitReprintLabel(pkg)}>라벨 재출력</Button
            >
            {#if pkg.status === PackageStatusEnum.Shipped}
              <Tag
                type="purple"
                style="cursor: pointer;"
                on:click={() => {
                  window.open(pkg.tracking_url, "_blank");
                }}>{pkg.courier.name} {pkg.tracking_number}</Tag
              >
            {/if}
            <div class="inventories">
              {#each pkg.shipping_notice_items as i}
                <div
                  class="inventory"
                  on:click={() => {
                    window.open(
                      `/orders/${i.item.extended_order.code}`,
                      "_blank",
                    );
                  }}
                >
                  <h6>
                    {i.item.extended_order.code}<Tag
                      type={getStatusBadgeColor(
                        pkg.order_statuses_by_code.find(
                          (el) => el.code === i.item.extended_order.code,
                        )?.status,
                      )}
                      >{getStatusLabel(
                        pkg.order_statuses_by_code.find(
                          (el) => el.code === i.item.extended_order.code,
                        )?.status,
                      )}</Tag
                    >
                  </h6>
                  <Tag size="sm" kind="grey">{i.item.size}</Tag>{i.item.name}
                </div>
              {/each}
            </div>
          </div>
        {/each}
      </div>
    {:else}
      <div>No shipping notice found.</div>
    {/if}
  {/if}
</LoggedInFrame>

<style>
  .notice-items {
    padding: 20px;
  }
  .package {
    margin-top: 20px;
    margin-bottom: 20px;
    margin-right: 20px;
    box-shadow: 0 0 5px rgba(0, 0, 0, 0.2);
    background-color: white;
    padding: 10px;
  }

  .inventories {
    margin-top: 10px;
    margin-bottom: 10px;
  }

  .inventory {
    display: inline-block;
    border-radius: 5px;
    box-shadow: 0 0 5px rgba(0, 0, 0, 0.2);
    background-color: lightgoldenrodyellow;
    padding: 10px;
    cursor: pointer;
  }

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
</style>

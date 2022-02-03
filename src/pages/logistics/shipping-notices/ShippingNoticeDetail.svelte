<script lang="ts">
  import {
    Breakpoint,
    Button,
    FileUploader,
    InlineLoading,
    Link,
    Tag,
  } from "carbon-components-svelte";
  import Package16 from "carbon-icons-svelte/lib/Package16";
  import {
    Package,
    PackagesApi,
    // PackagesApi,
    PackageStatusEnum,
    ShippingNoticeItem,
    ShippingNoticeRetrieve,
    ShippingNoticesApi,
    ShippingNoticesResultUploadApi,
    ShippingNoticeStatusEnum,
  } from "../../../api";
  import {
    getStatusBadgeColor,
    getStatusLabel,
  } from "../../../helpers/order-item";
  import { getShippingNolticeStatusLabel } from "../../../helpers/shipping-notice";
  import LoggedInFrame from "../../common/LoggedInFrame.svelte";

  export let noticeId: number;

  let notice: ShippingNoticeRetrieve | undefined;
  let submitting = false;
  let loading = !!noticeId;
  let mobile = false;
  let size: "sm" | "md" | "lg" | "xlg" | "max";

  const packageMappedItems: { [packageId: string]: ShippingNoticeItem[] } = {};
  const packageHashMap: { [packageId: string]: Package } = {};

  const api = new ShippingNoticesApi();

  const load = async () => {
    if (!noticeId) return;
    loading = true;
    const { data } = await api.shippingNoticesRetrieve({
      id: noticeId,
    });
    notice = data;

    // Codegen --> _package... Why??
    type TempNoticeItem = ShippingNoticeItem & { package: Package };
    (notice.items as TempNoticeItem[]).forEach((item) => {
      console.log({ item });
      if (!item.package) return;
      packageMappedItems[item.package.id] = [
        ...(packageMappedItems[item.package.id] ?? []),
        item,
      ];
      if (!(item.package.id in packageHashMap)) {
        packageHashMap[item.package.id] = item.package;
      }
    });
    loading = false;
  };

  const submitPackaging = async () => {
    if (!noticeId) return;
    submitting = true;
    notice = (await api.shippingNoticesLockAndPackageCreate({ id: noticeId }))
      .data;
    window.location.reload();
  };

  const submitMakeTemplate = async () => {
    if (!noticeId) return;
    submitting = true;
    notice = (
      await api.shippingNoticesMakeUploadTemplateCreate({ id: noticeId })
    ).data;
    window.location.reload();
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
      window.location.reload();
    } catch (e: any) {
      alert(e.message);
    } finally {
      window.location.reload();
    }
  };

  const submitReprintLabel = async (pkg: Package) => {
    submitting = true;
    const packageApi = new PackagesApi();
    try {
      await packageApi.packagesReprintLabelCreate({ id: pkg.id });
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
  $: {
    console.log({ packageMappedItems, packageHashMap });
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
        <Tag type="blue">{getShippingNolticeStatusLabel(notice.status)}</Tag>
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
            kind="tertiary"
            on:click={() => submitMakeTemplate()}>템플릿</Button
          >
        {/if}
        <h4>ITEMS - Total of {notice.items.length}</h4>
        <div class="notice-items">
          {#each notice.items as item}
            <div>
              <Tag type="cyan" style="font-family: monospace; margin-left: 0;"
                >{item.order_item.order_item_code}</Tag
              ><Tag style="font-family: monospace;" type="gray"
                >{item.inventory.code}</Tag
              >{item.order_item.product_name}
            </div>
          {/each}
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
        {#each Object.values(packageHashMap) as pkg}
          <div class="package">
            <h6>{pkg.code}</h6>
            <h5>{pkg.customer_name} ({pkg.customer_mobile})</h5>
            {pkg.address} ({pkg.post_code})<br />
            <Tag type="blue">{packageMappedItems[pkg.id].length}EA</Tag>
            <Tag type="green">{pkg.status}</Tag><br />
            <Button
              size="small"
              kind="tertiary"
              on:click={() => submitReprintLabel(pkg)}>라벨 재출력</Button
            >
            {#if pkg.status === PackageStatusEnum.DomesticDeliveryStarted}
              <Tag
                type="purple"
                style="cursor: pointer;"
                on:click={() => {
                  // window.open(pkg.tracking_url, "_blank");
                }}
                >{pkg.domestic_courier?.name}
                {pkg.domestic_tracking_number}</Tag
              >
            {/if}
            <div class="inventories">
              {#each packageMappedItems[pkg.id] as i}
                <div
                  class="inventory"
                  on:click={() => {
                    window.open(
                      `/items/${i.order_item.order_item_code}`,
                      "_blank",
                    );
                  }}
                >
                  <h6>
                    {i.order_item.order_item_code}<Tag
                      type={getStatusBadgeColor(i.order_item.order_item_status)}
                      >{getStatusLabel(i.order_item.order_item_status)}</Tag
                    >
                  </h6>
                  <Tag size="sm" type="purple">{i.inventory.size}</Tag>
                  <Tag size="sm" type="grey">{i.inventory.code}</Tag>
                  {i.inventory.product_name}
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
    padding-bottom: 20px;
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
    margin-right: 10px;
    margin-bottom: 10px;
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

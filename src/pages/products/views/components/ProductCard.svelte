<script lang="ts">
  import { toast } from "@zerodevx/svelte-toast";
  import { navigate } from "svelte-navigator";
  import {
    Button,
    Modal,
    StructuredList,
    StructuredListBody,
    StructuredListCell,
    StructuredListRow,
    Tag,
    ClickableTile,
  } from "carbon-components-svelte";
  import Share16 from "carbon-icons-svelte/lib/Share16";
  import TrashCan16 from "carbon-icons-svelte/lib/TrashCan16";

  import {
    EditProductRequestApiRequest,
    PatchedProductRequest,
    Product,
    ProductsApi,
  } from "@lessbutter/alloff-backoffice-api";

  import ProductCategoryClassifiedTag from "./ProductCategoryClassifiedTag.svelte";

  export let product: Product;

  const productApi = new ProductsApi();

  let open = false;

  const handleCardClick = (event: MouseEvent) => {
    event.preventDefault();
    navigate(`/products/${product.alloff_product_id}`);
  };

  const handleDeeplinkClick = async (event: MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    const isProd = import.meta.env.PROD;
    const apiKey = !isProd
      ? "AIzaSyAzcMKkMoBjrLVS1OgoaYRxQ270ZFFAZgU"
      : "AIzaSyA1pk7YM0oExgaxRBxvdpzVEj39W1h4wJ0";
    const firebaseUrl = `https://firebasedynamiclinks.googleapis.com/v1/shortLinks?key=${apiKey}`;
    const domain = !isProd ? "alloff-webhome-dev" : "alloff-webhome";
    const longLink = `https://${domain}.lett.io/products/${product.alloff_product_id}`;
    const res = await fetch(firebaseUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        dynamicLinkInfo: {
          domainUriPrefix: !isProd
            ? "https://alloffdev.page.link"
            : "https://alloff.page.link",
          link: longLink,
          androidInfo: {
            androidPackageName: !isProd ? "co.alloff.app.dev" : "co.alloff.app",
            androidFallbackLink:
              "https://play.google.com/store/apps/details?id=co.alloff.app",
          },
          iosInfo: {
            iosBundleId: !isProd ? "co.alloff.app.dev" : "co.alloff.app",
            iosFallbackLink: "https://apps.apple.com/kr/app/1570192380",
          },
        },
      }),
    });
    const json = await res.json();
    const shortLink = json.shortLink;
    navigator.clipboard.writeText(shortLink);
    toast.push(`딥링크를 복사했습니다! (${product.alloff_name})`);
  };

  const handleDeleteClick = async (event: MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    handleModalToggle(true);
  };

  const handleDeleteSubmit = async () => {
    // todo: integrate remove api
    try {
      const res = await productApi.productsPartialUpdate({
        id: product.alloff_product_id,
        patchedProductRequest: {
          is_removed: true,
        } as unknown as PatchedProductRequest,
      });
      toast.push("상품이 삭제되었습니다.");
      handleModalToggle(false);
      window.location.reload();
    } catch (e) {
      toast.push(`상품 삭제에 오류가 발생했습니다.`);
    }
  };

  const handleModalToggle = (value: boolean) => {
    open = value;
  };

  const handleModalClose = () => handleModalToggle(false);
</script>

<ClickableTile on:click={handleCardClick}>
  <div class="product">
    <div class="button-wrapper">
      <Button
        tooltipPosition="bottom"
        tooltipAlignment="end"
        iconDescription="딥링크 복사"
        icon={Share16}
        kind="tertiary"
        size="small"
        on:click={handleDeeplinkClick}
      />
      <Button
        tooltipPosition="bottom"
        tooltipAlignment="end"
        iconDescription="상품 삭제"
        icon={TrashCan16}
        kind="danger"
        size="small"
        on:click={handleDeleteClick}
      />
    </div>
    <div class="image">
      <img
        src={product.thumbnail_image !== ""
          ? product.thumbnail_image
          : product.images[0]}
        alt={[product.brand_kor_name, product.alloff_name].join("-")}
      />
    </div>
    <div class="info">
      <p style="font-weight: bold;">{product.brand_kor_name}</p>
      <p>
        {product.alloff_category_name}
        <ProductCategoryClassifiedTag
          isClassifiedTouched={product.is_classified_touched}
          isClassifiedDone={product.is_classified_done}
        />
      </p>
      <h6>{product.alloff_name}</h6>
      {#if product.inventory.reduce((prev, curr) => prev + curr.quantity, 0) === 0}
        <Tag type="red">⚠️ 재고없음</Tag>
      {/if}
    </div>
    <StructuredList condensed>
      <StructuredListBody>
        {#each product.inventory as inventory}
          <StructuredListRow>
            <StructuredListCell noWrap>{inventory.size}</StructuredListCell>
            <StructuredListCell>{inventory.quantity} EA</StructuredListCell>
          </StructuredListRow>
        {/each}
      </StructuredListBody>
    </StructuredList>
  </div>
</ClickableTile>

<Modal
  danger
  bind:open
  modalHeading={"상품 삭제"}
  primaryButtonText="삭제"
  secondaryButtonText="삭제 취소"
  on:click:button--secondary={handleModalClose}
  on:close={handleModalClose}
  on:submit={handleDeleteSubmit}
>
  <p>{product.alloff_name} 상품을 삭제합니다</p>
</Modal>

<style>
  .product {
    position: relative;
    overflow: hidden;
  }

  .product > .button-wrapper {
    position: absolute;
    top: 10px;
    right: 10px;
    display: flex;
    flex-direction: column;
  }

  .product > .button-wrapper :global(button) {
    margin-bottom: 4px;
  }

  .product > .image {
    height: 200px;
    padding-bottom: 10px;
  }

  .product > .image > img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .product > .info > p {
    font-size: 12px;
  }

  .product :global(.bx--structured-list) {
    margin-bottom: 0px;
  }

  :global(.bx--tile) {
    padding: 10px;
    height: 100%;
  }
</style>

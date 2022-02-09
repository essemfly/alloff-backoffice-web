<script lang="ts">
  import {
    Content,
    Header,
    HeaderAction,
    HeaderNav,
    HeaderNavItem,
    HeaderNavMenu,
    HeaderPanelDivider,
    HeaderPanelLink,
    HeaderPanelLinks,
    HeaderUtilities,
    SideNav,
    SideNavItems,
    SideNavLink,
    SideNavMenu,
    SkipToContent,
  } from "carbon-components-svelte";
  import Receipt16 from "carbon-icons-svelte/lib/Receipt16";
  import Timer16 from "carbon-icons-svelte/lib/Timer16";
  import NotificationNew16 from "carbon-icons-svelte/lib/NotificationNew16";
  import ConnectionReceive16 from "carbon-icons-svelte/lib/ConnectionReceive16";
  import DeliveryTruck16 from "carbon-icons-svelte/lib/DeliveryTruck16";
  import ShoppingCartArrowUp16 from "carbon-icons-svelte/lib/ShoppingCartArrowUp16";
  import ChartLine16 from "carbon-icons-svelte/lib/ChartLine16";

  import UserAvatar16 from "carbon-icons-svelte/lib/UserAvatar16";
  import { onMount } from "svelte";
  import { useLocation } from "svelte-navigator";
  import { AdminUserApi } from "../../api";
  import { removeTokens } from "../../core/auth";
  import { admin } from "../../store";

  let isSideNavOpen = false;
  let isUtilOpen = false;

  const location = useLocation();

  interface MenuItem {
    label: string;
    path?: string;
    items?: MenuItem[];
  }

  onMount(async () => {
    const adminUserApi = new AdminUserApi();
    try {
      const { data } = await adminUserApi.adminUserMeRetrieve();
      admin.set(data);
    } catch {
      // DO NOTHING
    }
  });

  const logout = async () => {
    removeTokens();
    window.location.href = "/login";
  };
</script>

<Header
  company="Alloff"
  platformName="Backoffice"
  bind:isSideNavOpen
  persistentHamburgerMenu
>
  {#if window.document.title.toLowerCase().includes("dev")}
    <p class="dev">DEV</p>
  {/if}
  <div slot="skip-to-content">
    <SkipToContent />
  </div>

  <HeaderNav>
    <HeaderNavItem
      href="/items"
      text="주문"
      isSelected={$location.pathname === "/items"}
    />
    <HeaderNavItem
      href="/notifications"
      text="푸시알림"
      isSelected={$location.pathname === "/notifications"}
    />
    <HeaderNavMenu text="물류">
      <HeaderNavItem
        href="/logistics/ris"
        text="입고"
        isSelected={$location.pathname === "/logistics/ris"}
      />
      <HeaderNavItem
        href="/logistics/inventories"
        text="재고"
        isSelected={$location.pathname === "/logistics/inventories"}
      />
      <HeaderNavItem
        href="/logistics/shipping-notices"
        text="출고"
        isSelected={$location.pathname === "/logistics/shipping-notices"}
      />
    </HeaderNavMenu>
    <!-- <HeaderNavItem
      href="/analytics/dashboard"
      text="대시보드"
      isSelected={$location.pathname === "/analytics/dashboard"}
    /> -->
    <!-- <HeaderNavItem
      href="/brands"
      text="브랜드"
      isSelected={$location.pathname === "/brands"}
    /> -->
    <HeaderNavItem
      href="/products"
      text="상품"
      isSelected={$location.pathname === "/products"}
    />
    <HeaderNavItem
      href="/product-groups"
      text="컬렉션"
      isSelected={$location.pathname === "/product-groups"}
    />
  </HeaderNav>

  <SideNav bind:isOpen={isSideNavOpen}>
    <SideNavItems>
      <SideNavLink
        icon={Receipt16}
        href="/orders"
        text="주문"
        isSelected={$location.pathname === "/orders"}
      />
      <SideNavLink
        icon={NotificationNew16}
        href="/notifications"
        text="푸시알림"
        isSelected={$location.pathname === "/notifications"}
      />
      <SideNavMenu text="물류">
        <SideNavLink
          icon={ConnectionReceive16}
          href="/logistics/ris"
          text="입고"
          isSelected={$location.pathname === "/logistics/ris"}
        />
        <SideNavLink
          icon={DeliveryTruck16}
          href="/logistics/inventories"
          text="재고"
          isSelected={$location.pathname === "/logistics/inventories"}
        />
        <SideNavLink
          icon={ShoppingCartArrowUp16}
          href="/logistics/shipping-notices"
          text="출고"
          isSelected={$location.pathname === "/logistics/shipping-notices"}
        />
      </SideNavMenu>
    </SideNavItems>
    <!-- <SideNavLink
      icon={ChartLine16}
      href="/analytics/dashboard"
      text="대시보드"
      isSelected={$location.pathname === "/analytics/dashboard"}
    /> -->
  </SideNav>

  {#if $admin}
    <HeaderUtilities>
      <HeaderAction bind:isOpen={isUtilOpen} icon={UserAvatar16}>
        <HeaderPanelLinks>
          <HeaderPanelDivider
            >안녕하세요, {$admin.profile.name}님! 😎</HeaderPanelDivider
          >
          <HeaderPanelLink on:click={logout}>로그아웃</HeaderPanelLink>
        </HeaderPanelLinks>
      </HeaderAction>
    </HeaderUtilities>
  {/if}
</Header>
<Content>
  <slot />
</Content>

<style>
  .dev {
    color: greenyellow;
    font-weight: bold;
    margin-right: 30px;
    margin-left: -25px;
  }
</style>

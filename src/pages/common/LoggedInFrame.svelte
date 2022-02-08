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

  const menu: MenuItem[] = [
    { label: "주문", path: "/items" },
    { label: "타임딜", path: "/timedeals" },
    { label: "푸시알림", path: "/notifications" },
    {
      label: "물류",
      items: [
        { label: "입고", path: "/logistics/ris" },
        { label: "재고", path: "/logistics/inventories" },
        { label: "출고", path: "/logistics/shipping-notices" },
      ],
    },
    // { label: "대시보드", path: "/analytics/dashboard" },
    // { label: "브랜드", path: "/brands" },
    { label: "상품", path: "/products" },
    { label: "컬렉션", path: "/product-groups" },
  ];

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
    {#each menu as menuItem}
      {#if menuItem.items && menuItem.items.length > 0}
        <HeaderNavMenu text={menuItem.label}>
          {#each menuItem.items as { label, path }}
            <HeaderNavItem
              href={path}
              text={label}
              isSelected={$location.pathname === path}
            />
          {/each}
        </HeaderNavMenu>
      {:else}
        <HeaderNavItem
          href={menuItem.path}
          text={menuItem.label}
          isSelected={$location.pathname === menuItem.path}
        />
      {/if}
    {/each}
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
        icon={Timer16}
        href="/timedeals"
        text="타임딜"
        isSelected={$location.pathname === "/timedeals"}
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

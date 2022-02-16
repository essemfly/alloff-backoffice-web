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
  SkipToContent
  } from "carbon-components-svelte";
  import ConnectionReceive16 from "carbon-icons-svelte/lib/ConnectionReceive16";
  import DeliveryTruck16 from "carbon-icons-svelte/lib/DeliveryTruck16";
  import NotificationNew16 from "carbon-icons-svelte/lib/NotificationNew16";
  import PhoneIp16 from "carbon-icons-svelte/lib/PhoneIp16";
  import Receipt16 from "carbon-icons-svelte/lib/Receipt16";
  import ShoppingCartArrowUp16 from "carbon-icons-svelte/lib/ShoppingCartArrowUp16";
  import UserAvatar16 from "carbon-icons-svelte/lib/UserAvatar16";
  import { onMount } from "svelte";
  import { useLocation } from "svelte-navigator";
  import { AdminUserApi } from "../api";
  import { removeTokens } from "../core/auth";
  import { admin } from "../store";

  export let title: string = "";

  let pageTitle: string;
  let isSideNavOpen = false;
  let isUtilOpen = false;

  const version = import.meta.env.VITE_PACKAGE_VERSION;
  const isProd = import.meta.env.PROD;
  const location = useLocation();

  $: {
    const defaultTitle = `Backoffice${!isProd ? " DEV" : ""}`;
    pageTitle = title ? `${title} :: ${defaultTitle}` : defaultTitle;
  }

  interface MenuItem {
    label: string;
    path?: string;
    items?: MenuItem[];
    icon?: typeof import("carbon-icons-svelte").CarbonIcon;
  }

  const commonMenu: MenuItem[] = [
    { label: "주문", path: "/items", icon: Receipt16 },
    { label: "상품", path: "/products" },
  ];

  let menu = [...commonMenu];

  $: {
    menu = [
      ...commonMenu,
      ...($admin?.profile.is_admin
        ? [
            {
              label: "푸시알림",
              path: "/notifications",
              icon: NotificationNew16,
            },
            {
              label: "물류",
              items: [
                {
                  label: "입고",
                  path: "/logistics/ris",
                  icon: ConnectionReceive16,
                },
                {
                  label: "재고",
                  path: "/logistics/inventories",
                  icon: DeliveryTruck16,
                },
                {
                  label: "출고",
                  path: "/logistics/shipping-notices",
                  icon: ShoppingCartArrowUp16,
                },
              ],
            },
            { label: "브랜드", path: "/brands" },
            { label: "컬렉션", path: "/product-groups" },
          ]
        : [{ label: "상품문의", path: "/inquiries", icon: PhoneIp16 }]),
    ];
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

<svelte:head>
  <title>{pageTitle}</title>
</svelte:head>

<Header
  company="Alloff"
  platformName={$admin?.profile.is_admin ? "Backoffice" : "SCM"}
  bind:isSideNavOpen
  persistentHamburgerMenu
>
  <div class="subtitle">
    {#if !isProd}
      <p class="dev">DEV</p>
    {/if}
    <small class="version">v{version}</small>
  </div>

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
      {#each menu as menuItem}
        {#if menuItem.items && menuItem.items.length > 0}
          <SideNavMenu text={menuItem.label}>
            {#each menuItem.items as { label, path, icon }}
              <SideNavLink
                {icon}
                href={path}
                text={label}
                isSelected={$location.pathname === path}
              />
            {/each}
          </SideNavMenu>
        {:else}
          <SideNavLink
            icon={menuItem.icon}
            href={menuItem.path}
            text={menuItem.label}
            isSelected={$location.pathname === menuItem.path}
          />
        {/if}
      {/each}
    </SideNavItems>
  </SideNav>
  <div>
    {import.meta.env.VITE_PACKAGE_VERSION}
  </div>

  {#if $admin}
    <HeaderUtilities>
      <HeaderAction bind:isOpen={isUtilOpen} icon={UserAvatar16}>
        <HeaderPanelLinks>
          <HeaderPanelDivider>
            {#if $admin.profile.is_admin}
              <p class="super">⚠️ SUPERUSER 권한 적용중</p>
            {/if}
            Company
            <p class="company name">
              {$admin.profile.company.name}
            </p>
            안녕하세요,<span class="name">{$admin.profile.name}</span>님! 😎
          </HeaderPanelDivider>
          <HeaderPanelLink on:click={logout}>로그아웃</HeaderPanelLink>
          {#if !$admin.profile.is_admin}
            <HeaderPanelDivider>관리중인 브랜드</HeaderPanelDivider>
            {#each $admin.profile.company.company_brands as b}
              <HeaderPanelLink style="cursor: default;"
                >{b.name}</HeaderPanelLink
              >
            {/each}
          {/if}
        </HeaderPanelLinks>
      </HeaderAction>
    </HeaderUtilities>
  {/if}
</Header>
<Content>
  <slot />
</Content>

<style>
  .subtitle {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: baseline;
  }
  .dev {
    color: greenyellow;
    font-weight: bold;
    margin-right: 10px;
    margin-left: -25px;
  }

  .version {
    font-size: 0.85em;
    color: white;
    margin-right: 30px;
  }

  .company {
    margin-bottom: 10px;
  }

  .name {
    font-weight: bold;
    color: white;
  }

  .super {
    font-weight: bold;
    color: greenyellow;
  }
</style>

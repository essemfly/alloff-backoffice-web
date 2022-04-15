<script lang="ts">
  import { removeTokens } from "@app/core/auth";
  import { AdminUserApi } from "@lessbutter/alloff-backoffice-api";
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
    Loading,
    SideNav,
    SideNavItems,
    SideNavLink,
    SideNavMenu,
    SkipToContent,
  } from "carbon-components-svelte";
  import CarouselHorizontal16 from "carbon-icons-svelte/lib/CarouselHorizontal16";
  import Catalog16 from "carbon-icons-svelte/lib/Catalog16";
  import Classification16 from "carbon-icons-svelte/lib/Classification16";
  import ConnectionReceive16 from "carbon-icons-svelte/lib/ConnectionReceive16";
  import DeliveryTruck16 from "carbon-icons-svelte/lib/DeliveryTruck16";
  import Home16 from "carbon-icons-svelte/lib/Home16";
  import ListBoxes16 from "carbon-icons-svelte/lib/ListBoxes16";
  import NotificationNew16 from "carbon-icons-svelte/lib/NotificationNew16";
  import PhoneIp16 from "carbon-icons-svelte/lib/PhoneIp16";
  import Product16 from "carbon-icons-svelte/lib/Product16";
  import Receipt16 from "carbon-icons-svelte/lib/Receipt16";
  import ShoppingCartArrowUp16 from "carbon-icons-svelte/lib/ShoppingCartArrowUp16";
  import Template16 from "carbon-icons-svelte/lib/Template16";
  import Timer16 from "carbon-icons-svelte/lib/Timer16";
  import UserAvatar16 from "carbon-icons-svelte/lib/UserAvatar16";
  import { onMount } from "svelte";
  import { useLocation } from "svelte-navigator";
  import { compute_slots } from "svelte/internal";
  import { admin } from "../store";
  import MetaTags from "./MetaTags/MetaTags.svelte";
  import { MetaTagsProps } from "./MetaTags/types";

  export let title: string = "";
  export let metaTags: MetaTagsProps = {};
  export let loading: boolean = false;
  export let loadingText: string = "Loading";
  export let hidePageTitle: boolean = false;

  let isSideNavOpen = false;
  let isUtilOpen = false;

  const version = import.meta.env.VITE_PACKAGE_VERSION;
  const isProd = import.meta.env.PROD;
  const location = useLocation();

  const defaultTitle = `Alloff Backoffice ${!isProd ? " DEV" : ""}`;

  interface MenuItem {
    label: string;
    path?: string;
    items?: MenuItem[];
    icon?: typeof import("carbon-icons-svelte").CarbonIcon;
  }

  const commonMenu: MenuItem[] = [
    { label: "주문", path: "/items", icon: Receipt16 },
    { label: "상품", path: "/products", icon: Product16 },
  ];

  let menu = [...commonMenu];

  $: {
    menu = [
      ...commonMenu,
      ...($admin?.profile.is_admin
        ? [
            {
              label: "홈탭",
              icon: Home16,
              items: [
                {
                  label: "홈탭 아이템 관리",
                  path: "/hometab",
                  icon: ListBoxes16,
                },
                {
                  label: "배너 목록",
                  path: "/hometab/banners",
                  icon: CarouselHorizontal16,
                },
              ],
            },
            { label: "브랜드", path: "/brands", icon: Classification16 },
            {
              label: "푸시알림",
              path: "/notifications",
              icon: NotificationNew16,
            },
            {
              label: "기획전",
              path: "/exhibitions",
              icon: Catalog16,
            },
            {
              label: "타임딜",
              path: "/timedeals",
              icon: Timer16,
            },
            {
              label: "그룹딜",
              path: "/groupdeals",
              icon: Timer16,
            },
            {
              label: "물류",
              icon: DeliveryTruck16,
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

<MetaTags {title} {defaultTitle} {...metaTags} />

<Header
  company="Alloff"
  platformName={$admin?.profile.is_admin ? "Backoffice" : "SCM"}
  bind:isSideNavOpen
  persistentHamburgerMenu
>
  <Loading small description={loadingText} active={loading} />
  {#if loading}
    {loadingText}
  {/if}
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
    {#each menu as menuItem (menuItem.label)}
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
          <SideNavMenu text={menuItem.label} icon={menuItem.icon}>
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

{#if $$slots.header}
  <header class="nav-header-section">
    {#if !hidePageTitle}
      <h1 class="title">{title}</h1>
    {/if}
    <slot name="header" />
  </header>
{/if}
<Content>
  {#if !hidePageTitle && !$$slots.header}
    <h1 class="title">{title}</h1>
  {/if}
  <slot />
</Content>

<style>
  h1.title {
    margin-bottom: 30px;
  }
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

  .nav-header-section {
    background-color: red;
    margin-top: 3rem;
    padding: 2rem;
    background: white;
  }

  .nav-header-section ~ :global(.bx--content) {
    margin-top: 0;
  }
</style>

<script lang="ts">
  import {
  Content,
  Header,
  HeaderAction,
  HeaderNav,
  HeaderNavItem,
  HeaderPanelDivider,
  HeaderPanelLink,
  HeaderPanelLinks,
  HeaderUtilities,
  SideNav,
  SideNavItems,
  SideNavLink,
  SkipToContent
  } from "carbon-components-svelte";
  import Receipt16 from "carbon-icons-svelte/lib/Receipt16";
  import UserAvatar16 from "carbon-icons-svelte/lib/UserAvatar16";
  import { onMount } from "svelte";
  import { useLocation } from "svelte-navigator";
  import { AdminUserApi } from "../../api";
  import { removeTokens } from "../../core/auth";
  import { admin } from "../../store";

  let isSideNavOpen = false;
  let isUtilOpen = false;

  const location = useLocation();

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
      href="/orders"
      text="주문"
      isSelected={$location.pathname === "/orders"}
    />
    <HeaderNavItem
    href="/timedeals"
    text="타임딜"
    isSelected={$location.pathname === "/timedeals"}
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
      icon={Receipt16}
      href="/timedeals"
      text="타임딜"
      isSelected={$location.pathname === "/timedeals"}
    />
    </SideNavItems>
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

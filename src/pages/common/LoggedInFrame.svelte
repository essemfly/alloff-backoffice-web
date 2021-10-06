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
    SkipToContent,
  } from "carbon-components-svelte";
  import Receipt16 from "carbon-icons-svelte/lib/Receipt16";
  import UserAvatar16 from "carbon-icons-svelte/lib/UserAvatar16";
  import { onMount } from "svelte";
  import { location } from "svelte-spa-router";
  import { AdminUserApi } from "../../api";
  import { admin } from "../../store";

  let isSideNavOpen = false;
  let isUtilOpen = false;

  onMount(async () => {
    const adminUserApi = new AdminUserApi();
    try {
      const { data } = await adminUserApi.adminUserMe();
      admin.set(data);
    } catch {
      // DO NOTHING
    }
  });

  $: console.log($admin);
</script>

<Header
  company="Alloff"
  platformName="Backoffice"
  bind:isSideNavOpen
  persistentHamburgerMenu
>
  {$admin?.profile.name ?? ""}
  <div slot="skip-to-content">
    <SkipToContent />
  </div>

  <HeaderNav>
    <HeaderNavItem
      href="#/orders"
      text="주문목록"
      isSelected={$location === "/orders"}
    />
  </HeaderNav>

  <SideNav bind:isOpen={isSideNavOpen}>
    <SideNavItems>
      <SideNavLink
        icon={Receipt16}
        href="#/orders"
        text="주문목록"
        isSelected={$location === "/orders"}
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
          <HeaderPanelLink>로그아웃</HeaderPanelLink>
        </HeaderPanelLinks>
      </HeaderAction>
    </HeaderUtilities>
  {/if}
</Header>
<Content>
  <slot />
</Content>

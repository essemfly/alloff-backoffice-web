<script lang="ts">
  import {
    Link,
    OverflowMenu,
    OverflowMenuItem,
    StructuredList,
    StructuredListBody,
    StructuredListCell,
    StructuredListRow,
    Tag,
  } from "carbon-components-svelte";

  interface MenuItem {
    text: string;
    onClick: () => void;
    hide?: boolean;
  }

  interface DetailRow {
    header: string;
    body: string;
    href?: string;
    tagType?:
      | "red"
      | "magenta"
      | "purple"
      | "blue"
      | "cyan"
      | "teal"
      | "green"
      | "gray"
      | "cool-gray"
      | "warm-gray"
      | "high-contrast";
  }
  export let title: string;
  export let menuItems: MenuItem[] | undefined = undefined;
  export let rows: DetailRow[];
  export let fontSize: number | undefined = undefined;
  export let smallTitle: boolean | undefined = undefined;
</script>

<div class="title" class:smallTitle>
  {#if smallTitle}
    <h5>
      {title}
    </h5>
  {:else}
    <h4>
      {title}
    </h4>
  {/if}
  {#if menuItems && menuItems.length > 0}
    <OverflowMenu>
      {#each menuItems as menuItem}
        {#if !menuItem.hide}
          <OverflowMenuItem on:click={menuItem.onClick} text={menuItem.text} />
        {/if}
      {/each}
    </OverflowMenu>
  {/if}
</div>
<StructuredList condensed flush style={`margin-bottom: 20px;`}>
  <StructuredListBody>
    {#each rows as row}
      <StructuredListRow>
        <StructuredListCell
          head
          noWrap
          style={(fontSize ? `font-size: ${fontSize}px;` : "") + "width: 1%;"}
          >{row.header}</StructuredListCell
        >
        <StructuredListCell
          style={(fontSize ? `font-size: ${fontSize}px;` : "") +
            "width: auto; word-break: keep-all;"}
        >
          {#if row.href}
            <Link
              href={row.href}
              target="_blank"
              rel="norerferrer"
              style={fontSize ? `font-size: ${fontSize}px;` : undefined}
            >
              {row.body}
            </Link>
          {:else if row.tagType}
            <Tag type={row.tagType} style="margin-left:0; margin-top:0; margin-bottom: 0;">{row.body}</Tag>
          {:else}
            {row.body}
          {/if}
        </StructuredListCell>
      </StructuredListRow>
    {/each}
  </StructuredListBody>
</StructuredList>

<style>
  .title {
    display: flex;
    flex-direction: row;
    align-items: center;
    margin-bottom: 10px;
    margin-top: 20px;
  }

  .smallTitle {
    margin-top: 0px;
  }
</style>

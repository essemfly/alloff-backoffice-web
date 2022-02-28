<script lang="ts">
  import { OpenGraph } from "./types";

  export let title = "";
  export let defaultTitle: string | undefined;
  export let description: string | undefined = undefined;
  export let canonical: string | undefined = undefined;
  export let openGraph: OpenGraph | undefined = undefined;

  let pageTitle: string;

  $: pageTitle =
    title && defaultTitle
      ? `${title} :: ${defaultTitle}`
      : defaultTitle ?? title;
</script>

<svelte:head>
  <!-- for prevent display search engine -->
  <meta name="robots" content="noindex,nofollow" />
  <meta name="googlebot" content="noindex, nofollow" />
  <meta name="Yeti" content="noindex, nofollow" />

  {#if pageTitle}
    <title>{pageTitle}</title>
  {/if}

  {#if description}
    <meta name="description" content={description} />
  {/if}

  {#if canonical}
    <link rel="canonical" href={canonical} />
  {/if}

  {#if openGraph}
    {#if openGraph.url || canonical}
      <meta property="og:url" content={openGraph.url || canonical} />
    {/if}

    {#if openGraph.title || title}
      <meta property="og:title" content={openGraph.title || title} />
    {/if}

    {#if openGraph.description || description}
      <meta
        property="og:description"
        content={openGraph.description || description}
      />
    {/if}

    {#if openGraph.images && openGraph.images.length}
      {#each openGraph.images as image}
        <meta property="og:image" content={image.url} />
        {#if image.alt}
          <meta property="og:image:alt" content={image.alt} />
        {/if}
        {#if image.width}
          <meta property="og:image:width" content={image.width.toString()} />
        {/if}
        {#if image.height}
          <meta property="og:image:height" content={image.height.toString()} />
        {/if}
      {/each}
    {/if}

    {#if openGraph.site_name}
      <meta property="og:site_name" content={openGraph.site_name} />
    {/if}
  {/if}
</svelte:head>

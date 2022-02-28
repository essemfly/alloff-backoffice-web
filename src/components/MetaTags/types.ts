export interface OpenGraph {
  url?: string;
  type?: string;
  title?: string;
  description?: string;
  site_name?: string;
}

export interface MetaTagsProps {
  defaultTitle?: string;
  title?: string;
  description?: string;
  canonical?: string;
  openGraph?: OpenGraph;
}

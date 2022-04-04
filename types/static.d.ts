/* Use this file to declare any custom file extensions for importing */
/* Use this folder to also add/extend a package d.ts file, if needed. */

/* CSS MODULES */
declare module "*.module.css" {
  const classes: { [key: string]: string };
  export default classes;
}
declare module "*.module.scss" {
  const classes: { [key: string]: string };
  export default classes;
}
declare module "*.module.sass" {
  const classes: { [key: string]: string };
  export default classes;
}
declare module "*.module.less" {
  const classes: { [key: string]: string };
  export default classes;
}
declare module "*.module.styl" {
  const classes: { [key: string]: string };
  export default classes;
}

/* CSS */
declare module "*.css";
declare module "*.scss";
declare module "*.sass";
declare module "*.less";
declare module "*.styl";

/* IMAGES */
declare module "*.svg" {
  const ref: string;
  export default ref;
}
declare module "*.bmp" {
  const ref: string;
  export default ref;
}
declare module "*.gif" {
  const ref: string;
  export default ref;
}
declare module "*.jpg" {
  const ref: string;
  export default ref;
}
declare module "*.jpeg" {
  const ref: string;
  export default ref;
}
declare module "*.png" {
  const ref: string;
  export default ref;
}

/* CUSTOM: ADD YOUR OWN HERE */

declare module "cl-editor" {
  import type { SvelteComponent, SvelteComponentTyped } from "svelte";

  export class Editor extends SvelteComponentTyped<{ html: string }> {}

  declare class Editor {
    constructor(options: {
      target: Element;
      props?: {
        actions?: (
          | { name: string; title?: string; icon?: string; result?: Function }
          | string
        )[];
        height?: string;
        html?: string;
        removeFormatTags?: string[];
      };
    });

    $destroy(detach?: boolean);

    $on(event: "change" | "blur", cb: (event?: any) => void);

    exec(cmd: string, value?: string): void;

    getHtml(sanitize?: boolean): string;

    getText(): string;

    setHtml(html: string, sanitize?: boolean): void;

    saveRange(element: Element): void;

    restoreRange(element: Element): void;

    refs: {
      colorPicker: HTMLDivElement;
      editor: HTMLDivElement;
      modal: HTMLDivElement;
      raw: HTMLTextAreaElement;
    };
  }

  export default Editor;
}

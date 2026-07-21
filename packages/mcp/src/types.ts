/** Shared catalog types — consumed by the generated catalog and the server. */

export interface Attribute {
  /** Kebab-case HTML attribute name, e.g. `allow-multiple`. */
  name: string;
  /** camelCase property / field name, e.g. `allowMultiple`. */
  field: string;
  /** Type text from the CEM, e.g. `boolean` or `"horizontal" | "vertical"`. */
  type: string;
  default?: string;
  description?: string;
}

export interface EventDef {
  /** Stencil event name (camelCase), e.g. `andModalClose`. */
  name: string;
  description?: string;
  type?: string;
}

export interface MethodDef {
  name: string;
  description?: string;
}

export interface SlotDef {
  name: string;
  description?: string;
}

export interface CssPartDef {
  name: string;
  description?: string;
}

export interface Component {
  /** Custom element tag, e.g. `and-button`. */
  tag: string;
  /** PascalCase class / wrapper name, e.g. `AndButton`. */
  name: string;
  description: string;
  /** Structural parent tag when this is a sub-component (e.g. `and-card`). */
  parent?: string;
  attributes: Attribute[];
  events: EventDef[];
  methods: MethodDef[];
  slots: SlotDef[];
  cssParts: CssPartDef[];
}

export type Framework = 'html' | 'react' | 'vue' | 'angular';

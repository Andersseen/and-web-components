/**
 * Native Decorators for Web Components
 * Zero-runtime decorators using TC39 stage 3 proposal
 * Compiles to native JavaScript without dependencies
 */

// Metadata storage (weakmap to avoid memory leaks)
const componentMetadata = new WeakMap();

/**
 * Component decorator - defines the custom element
 */
export function Component(options: { tag: string; styles?: string; shadow?: boolean }) {
  return function (target: any) {
    // Store metadata
    componentMetadata.set(target, {
      tag: options.tag,
      styles: options.styles || '',
      shadow: options.shadow !== false, // default true
    });

    // Register the custom element
    if (!customElements.get(options.tag)) {
      customElements.define(options.tag, target);
    }

    return target;
  };
}

/**
 * Property decorator - reactive property
 */
export function Prop(
  options: {
    type?: StringConstructor | NumberConstructor | BooleanConstructor;
    reflect?: boolean;
    mutable?: boolean;
  } = {},
) {
  return function (target: any, propertyKey: string) {
    // Get or create properties list
    const props = target.constructor.observedAttributes || [];

    // Add to observed attributes for attributeChangedCallback
    const attrName = propertyKey.replace(/([A-Z])/g, '-$1').toLowerCase();
    if (!props.includes(attrName)) {
      props.push(attrName);
    }

    // Define getter/setter
    Object.defineProperty(target, propertyKey, {
      get() {
        return this[`_${propertyKey}`];
      },
      set(value) {
        const oldValue = this[`_${propertyKey}`];
        this[`_${propertyKey}`] = value;

        // Reflect to attribute if needed
        if (options.reflect) {
          this.setAttribute(attrName, String(value));
        }

        // Trigger re-render or callback
        if (this.componentWillUpdate) {
          this.componentWillUpdate(propertyKey, oldValue, value);
        }

        // Trigger custom event
        if (this.dispatchEvent) {
          this.dispatchEvent(
            new CustomEvent(`${propertyKey}Change`, {
              detail: { oldValue, newValue: value },
              bubbles: true,
              composed: true,
            }),
          );
        }
      },
      enumerable: true,
      configurable: true,
    });

    // Set observedAttributes static property
    target.constructor.observedAttributes = props;
  };
}

/**
 * Watch decorator - observes property changes
 */
export function Watch(propName: string) {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    // Store watch info in metadata
    const watches = target.constructor.__watches || {};
    watches[propName] = descriptor.value;
    target.constructor.__watches = watches;

    return descriptor;
  };
}

/**
 * Event decorator - defines custom events
 */
export function Event(eventName?: string) {
  return function (target: any, propertyKey: string) {
    const eventKey = eventName || propertyKey;

    Object.defineProperty(target, propertyKey, {
      get() {
        return (detail?: any) => {
          this.dispatchEvent(
            new CustomEvent(eventKey, {
              detail,
              bubbles: true,
              composed: true,
            }),
          );
        };
      },
      enumerable: true,
      configurable: true,
    });
  };
}

/**
 * State decorator - internal reactive state
 */
export function State() {
  return function (target: any, propertyKey: string) {
    // Similar to Prop but doesn't reflect to attribute
    Object.defineProperty(target, propertyKey, {
      get() {
        return this[`_state_${propertyKey}`];
      },
      set(value) {
        const oldValue = this[`_state_${propertyKey}`];
        this[`_state_${propertyKey}`] = value;

        if (this.componentWillUpdate) {
          this.componentWillUpdate(propertyKey, oldValue, value);
        }
      },
      enumerable: true,
      configurable: true,
    });
  };
}

// Export metadata getter
export function getComponentMetadata(target: any) {
  return componentMetadata.get(target);
}

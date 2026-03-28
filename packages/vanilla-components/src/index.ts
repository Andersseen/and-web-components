// Component exports
export { AndButton } from './components/button/button';

// Decorators
export { Component, Prop, Watch, Event, State, getComponentMetadata } from './decorators';

// Utilities
export { cn, toKebabCase, toCamelCase, matches, debounce, throttle } from './utils';

// Styles (for manual import)
import './styles/global.css';

// Auto-register all components
const COMPONENTS = [
  'and-button',
  // Add more components here as they're created
];

console.log(`[@andersseen/vanilla-components] ${COMPONENTS.length} components registered`);

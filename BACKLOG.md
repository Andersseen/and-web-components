# Design System Audit & Backlog

This document outlines the results of a comprehensive audit of the current Lerna monorepo and Stencil.js library, identifying gaps and proposing specific issues to reach a production-ready design system.

## Issues

### Issue 1: Framework-Agnostic Animation Library
**Title**: Create `@my-lib/motion` package
**Problem Statement**: The current system lacks a standardized animation strategy, leading to inconsistent interactions and reliance on ad-hoc CSS animations. A dedicated, reusable animation library is needed.
**Proposed Solution**: Develop a new package `@my-lib/motion` that provides a framework-agnostic API for handling animations, inspired by Framer Motion but compatible with Vanilla JS, Stencil, and React.
**Acceptance Criteria**:
*   The package must export functions or utilities to handle enter and leave transitions.
*   It must support `onHover` and `onTap` interaction states.
*   It must utilize CSS Variables for theming and customization.
*   It must be written in TypeScript.
*   It must have zero dependencies on specific frameworks (React, Angular, etc.).

### Issue 2: Layout Primitive System
**Title**: Implement Layout Primitives Package
**Problem Statement**: The current architecture lacks a layout management system. Developers are forced to write custom CSS for layout (e.g., margins, flex properties) within the Demo App and consuming applications, leading to inconsistency and maintenance overhead.
**Proposed Solution**: Create a new package (e.g., `@my-lib/layout`) containing layout primitives similar to Clarity's `cds-layout`.
**Acceptance Criteria**:
*   Create a **Stack** primitive (component or utility) for vertical and horizontal stacking with configurable gaps.
*   Create a **Grid** primitive for 2D layouts, wrapping CSS Grid functionality.
*   Create a **Horizontal Spacing** utility for consistent spacing between inline elements.
*   All primitives must use CSS Grid and Flexbox internally.
*   Primitives must reduce the need for custom layout CSS in the Demo App by at least 50%.

### Issue 3: Missing Core Component - Data Table
**Title**: Create `my-data-table` Component
**Problem Statement**: The library lacks a component for displaying and managing large sets of tabular data, which is a critical requirement for enterprise applications.
**Proposed Solution**: Build a `my-data-table` component in Stencil.js.
**Acceptance Criteria**:
*   **Purpose**: To display rows of data with sortable columns and optional pagination.
*   **Accessibility (ARIA)**:
    *   Use correct `<table>`, `<thead>`, `<tbody>`, `<tr>`, `<th>`, `<td>` structure or `role="grid"`.
    *   Sortable headers must use `aria-sort` (ascending/descending/none).
*   **Expected Props**:
    *   `data`: `any[]` - Array of data objects.
    *   `columns`: `TableColumn[]` - Configuration for columns (key, title, sortable, etc.).
    *   `pagination`: `boolean | PaginationConfig` - Enable/configure pagination.
    *   `selectable`: `boolean` - Allow row selection.

### Issue 4: Missing Core Component - Combobox
**Title**: Create `my-combobox` Component
**Problem Statement**: Users cannot search or filter within a select list. The existing `my-dropdown` is insufficient for large datasets where scrolling is impractical.
**Proposed Solution**: Build a `my-combobox` component that combines an input field with a listbox for filtering.
**Acceptance Criteria**:
*   **Purpose**: To allow users to select an item from a large list by typing to filter.
*   **Accessibility (ARIA)**:
    *   Input must have `role="combobox"`.
    *   Listbox must have `role="listbox"`.
    *   Implement `aria-expanded`, `aria-controls`, and `aria-activedescendant` for keyboard navigation.
*   **Expected Props**:
    *   `items`: `any[]` - The data source.
    *   `placeholder`: `string` - Input placeholder.
    *   `value`: `string` - Selected value.
    *   `disabled`: `boolean` - Disable interaction.
    *   `filter`: `(item: any, query: string) => boolean` - Custom filter function.

### Issue 5: Missing Core Component - Checkbox
**Title**: Create `my-checkbox` Component
**Problem Statement**: Relying on native `<input type="checkbox">` limits styling capabilities and prevents a consistent visual language across browsers. A custom checkbox component is needed.
**Proposed Solution**: Build a `my-checkbox` component that wraps a native input but allows full styling control.
**Acceptance Criteria**:
*   **Purpose**: To allow users to select one or more options from a set.
*   **Accessibility (ARIA)**:
    *   Use a native input with `opacity: 0` for behavioral correctness, or `role="checkbox"` with strict keyboard handling.
    *   Support `aria-checked` (true/false/mixed).
    *   Support `aria-label` or `aria-labelledby`.
*   **Expected Props**:
    *   `checked`: `boolean` - State of the checkbox.
    *   `indeterminate`: `boolean` - Visual state for nested lists.
    *   `disabled`: `boolean`.
    *   `name`: `string`.
    *   `value`: `string`.
    *   `label`: `string` - Optional label text.

### Issue 6: Missing Core Component - Radio Group
**Title**: Create `my-radio-group` Component
**Problem Statement**: There is no component for mutually exclusive selection sets with custom styling, forcing developers to use unstyled native radio buttons.
**Proposed Solution**: Build `my-radio-group` and `my-radio-item` components.
**Acceptance Criteria**:
*   **Purpose**: To allow users to select exactly one option from a set.
*   **Accessibility (ARIA)**:
    *   Container must have `role="radiogroup"`.
    *   Items must have `role="radio"`.
    *   Support arrow key navigation within the group.
*   **Expected Props**:
    *   `value`: `string` - The currently selected value of the group.
    *   `name`: `string` - Name attribute for the group.
    *   `orientation`: `'horizontal' | 'vertical'` - Layout direction.

### Issue 7: Missing Core Component - Switch
**Title**: Create `my-switch` Component
**Problem Statement**: The design system lacks a toggle component for switching between two states (on/off), which is distinct from a checkbox in user expectation (immediate action vs. form selection).
**Proposed Solution**: Build a `my-switch` component.
**Acceptance Criteria**:
*   **Purpose**: To toggle a setting on or off immediately.
*   **Accessibility (ARIA)**:
    *   Use `role="switch"`.
    *   Support `aria-checked` (true/false).
    *   Support `aria-label` or `aria-labelledby`.
*   **Expected Props**:
    *   `checked`: `boolean`.
    *   `disabled`: `boolean`.
    *   `label`: `string`.
    *   `name`: `string`.

### Issue 8: Demo App Enhancement
**Title**: Enhance Demo App for Layout and Motion
**Problem Statement**: The current Angular-based demo application does not effectively showcase the proposed Layout and Motion systems, nor does it provide a playground for testing them in isolation.
**Proposed Solution**: Update the demo app (`packages/angular-workspace`) to include dedicated sections for Layout and Motion.
**Acceptance Criteria**:
*   Create a new "Layout" section in the demo app demonstrating the `Stack` and `Grid` primitives with interactive controls (e.g., adjusting gap, alignment).
*   Create a new "Motion" section demonstrating the animation library's capabilities (enter/leave, hover effects).
*   Update existing component documentation pages to utilize the new Layout primitives for their examples, removing ad-hoc CSS.

/** Shared styles used across all motion demo page components. */
export const MOTION_DEMO_STYLES = `
  :host { display: block; }

  .motion-page {
    max-width: 900px;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
  }

  .motion-header {
    margin-bottom: 0.5rem;
  }

  .motion-header h1 {
    font-size: 2rem;
    font-weight: 800;
    margin: 0 0 0.5rem 0;
    color: var(--foreground);
    letter-spacing: -0.025em;
  }

  .motion-header p {
    font-size: 1rem;
    color: var(--muted-foreground, #71717a);
    margin: 0;
    line-height: 1.6;
  }

  /* Card */
  .motion-card {
    border: 1px solid var(--border, #e4e4e7);
    border-radius: 12px;
    padding: 1.5rem;
    background: var(--card, #fff);
    transition: box-shadow 0.2s;
  }

  .motion-card:hover {
    box-shadow: 0 4px 24px rgba(0, 0, 0, 0.06);
  }

  .card-header { margin-bottom: 1.25rem; }

  .card-badge {
    display: inline-block;
    font-size: 0.7rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: var(--primary, #3b82f6);
    background: var(--primary-foreground, rgba(59, 130, 246, 0.08));
    padding: 0.2rem 0.6rem;
    border-radius: 50px;
    margin-bottom: 0.5rem;
  }

  .card-header h2 {
    font-size: 1.25rem;
    font-weight: 700;
    color: var(--foreground);
    margin: 0.25rem 0;
  }

  .card-header p {
    font-size: 0.9rem;
    color: var(--muted-foreground, #71717a);
    margin: 0;
    line-height: 1.5;
  }

  /* Actions */
  .card-actions {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    margin-bottom: 1rem;
  }

  .card-actions-grid {
    display: flex;
    gap: 1.5rem;
    margin-bottom: 1rem;
    flex-wrap: wrap;
  }

  .action-group {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .action-label {
    font-size: 0.75rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    color: var(--muted-foreground, #71717a);
  }

  .action-buttons {
    display: flex;
    flex-wrap: wrap;
    gap: 0.35rem;
  }

  /* Demo stage */
  .demo-stage {
    min-height: 120px;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 1px dashed var(--border, #e4e4e7);
    border-radius: 10px;
    background: var(--muted, #f4f4f5);
    margin-bottom: 0.75rem;
    padding: 1rem;
  }

  .demo-stage--overflow {
    overflow: hidden;
    position: relative;
  }

  /* Demo boxes */
  .demo-box {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 0.25rem;
    width: 100px;
    height: 100px;
    border-radius: 12px;
    color: #fff;
    font-weight: 600;
    font-size: 0.9rem;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }

  .demo-box span:first-child { font-size: 1.5rem; }

  /* Gradient backgrounds */
  .gradient-blue   { background: linear-gradient(135deg, #3b82f6, #1d4ed8); }
  .gradient-purple { background: linear-gradient(135deg, #8b5cf6, #6d28d9); }
  .gradient-green  { background: linear-gradient(135deg, #22c55e, #15803d); }
  .gradient-amber  { background: linear-gradient(135deg, #f59e0b, #d97706); }
  .gradient-rose   { background: linear-gradient(135deg, #f43f5e, #be123c); }
  .gradient-teal   { background: linear-gradient(135deg, #14b8a6, #0d9488); }

  /* Code snippet */
  .code-snippet {
    background: var(--muted, #f4f4f5);
    border: 1px solid var(--border, #e4e4e7);
    border-radius: 8px;
    padding: 0.6rem 1rem;
    overflow-x: auto;
  }

  .code-snippet code {
    font-size: 0.8rem;
    color: var(--foreground);
    font-family: 'SF Mono', 'Fira Code', monospace;
    white-space: nowrap;
  }

  /* Accessibility note */
  .a11y-note {
    display: flex;
    align-items: flex-start;
    gap: 0.75rem;
    padding: 1rem 1.25rem;
    border-radius: 10px;
    background: var(--muted, #f4f4f5);
    border: 1px solid var(--border, #e4e4e7);
  }

  .a11y-note span:first-child { font-size: 1.25rem; flex-shrink: 0; }

  .a11y-note p {
    margin: 0;
    font-size: 0.85rem;
    color: var(--muted-foreground, #71717a);
    line-height: 1.5;
  }

  .a11y-note code {
    background: var(--background, #fff);
    padding: 0.1rem 0.35rem;
    border-radius: 4px;
    font-size: 0.78rem;
    border: 1px solid var(--border, #e4e4e7);
  }

  /* Options controls */
  .options-controls {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 1rem;
    margin-bottom: 1rem;
    padding: 1rem;
    border-radius: 10px;
    background: var(--muted, #f4f4f5);
    border: 1px solid var(--border, #e4e4e7);
  }

  .control-group {
    display: flex;
    flex-direction: column;
    gap: 0.35rem;
  }

  .control-group label {
    font-size: 0.75rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    color: var(--muted-foreground, #71717a);
  }

  .control-group input[type='range'] {
    width: 100%;
    accent-color: var(--primary, #3b82f6);
  }

  .control-group select {
    padding: 0.4rem 0.5rem;
    border-radius: 6px;
    border: 1px solid var(--border, #e4e4e7);
    background: var(--background, #fff);
    color: var(--foreground);
    font-size: 0.85rem;
  }

  .control-value {
    font-size: 0.8rem;
    color: var(--foreground);
    font-weight: 500;
    font-variant-numeric: tabular-nums;
  }
`;

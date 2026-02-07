export function format(first?: string, middle?: string, last?: string): string {
  return (first || '') + (middle ? ` ${middle}` : '') + (last ? ` ${last}` : '');
}

export { cn } from './cn';

export function normalizeProps(props: any) {
  const { className, htmlFor, ...rest } = props;
  return {
    class: className,
    for: htmlFor,
    ...rest,
  };
}

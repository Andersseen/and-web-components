export { cn } from './cn';

export function normalizeProps(props: Record<string, unknown>) {
  const { className, htmlFor, ...rest } = props;
  return {
    class: className,
    for: htmlFor,
    ...rest,
  };
}

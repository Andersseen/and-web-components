export { cn } from './cn';

export function normalizeProps(props: any) {
  const { className, htmlFor, ...rest } = props;
  return {
    class: className,
    for: htmlFor,
    ...rest,
  };
}

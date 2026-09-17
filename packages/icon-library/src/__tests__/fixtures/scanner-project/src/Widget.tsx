export const Widget = (props: { dynamicIcon: string }) => (
  <>
    <span and-icon="close" aria-hidden="true"></span>
    <span and-icon="close" aria-hidden="true"></span>
    <span and-icon={props.dynamicIcon} aria-hidden="true"></span>
  </>
);

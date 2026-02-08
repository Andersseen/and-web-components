import { Component, Prop, h, Event, EventEmitter } from '@stencil/core';
import { cn } from '../../utils/utils';

@Component({
  tag: 'my-input',
  styleUrls: ['my-input.css', '../../global/global.css'],
  shadow: true,
})
export class MyInput {
  @Prop() placeholder: string;
  @Prop() value: string;
  @Prop() type: string = 'text';
  @Prop() disabled: boolean = false;
  @Prop() class: string;

  @Event() myInput: EventEmitter<string>;

  private handleInput = (ev: Event) => {
    const value = (ev.target as HTMLInputElement).value;
    this.myInput.emit(value);
  };

  render() {
    return (
      <input
        type={this.type}
        class={cn(
          'flex h-10 w-full rounded-md border border-input bg-background px-t-gap py-t-gap-sm text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
          this.class,
        )}
        placeholder={this.placeholder}
        value={this.value}
        disabled={this.disabled}
        onInput={this.handleInput}
      />
    );
  }
}

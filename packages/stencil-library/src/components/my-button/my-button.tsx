import { Component, h, Prop, Element } from '@stencil/core';
import { cva, VariantProps } from 'class-variance-authority';
import { cn } from '../../utils/cn';

const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-white',
  {
    variants: {
      variant: {
        default: 'bg-blue-600 text-white hover:bg-blue-700',
        destructive: 'bg-red-500 text-white hover:bg-red-600',
        outline: 'border border-slate-200 hover:bg-slate-100 hover:text-slate-900',
        secondary: 'bg-slate-100 text-slate-900 hover:bg-slate-200',
        ghost: 'hover:bg-slate-100 hover:text-slate-900',
        link: 'underline-offset-4 hover:underline text-blue-600',
      },
      size: {
        default: 'h-10 py-2 px-4',
        sm: 'h-9 px-3 rounded-md',
        lg: 'h-11 px-8 rounded-md',
        icon: 'h-10 w-10', // Agregado para botones de solo icono
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
);

export type ButtonProps = VariantProps<typeof buttonVariants>;

@Component({
  tag: 'my-button',
  styleUrl: 'my-button.css',
  shadow: true,
})
export class MyButton {
  @Element() el: HTMLElement;

  @Prop() variant: ButtonProps['variant'] = 'default';
  @Prop() size: ButtonProps['size'] = 'default';
  @Prop() type: 'button' | 'submit' | 'reset' = 'button';
  @Prop() disabled: boolean = false;
  /** Permite pasar clases extra desde fuera */
  @Prop({ attribute: 'class' }) customClass: string;

  render() {
    return (
      <button
        type={this.type}
        disabled={this.disabled}
        // Usamos cn para combinar las variantes con las clases que vengan por prop
        class={cn(buttonVariants({ variant: this.variant, size: this.size }), this.customClass)}
      >
        {/* Eliminamos la prop 'label' y usamos slots para máxima flexibilidad */}
        <slot name="start" />
        <slot />
        <slot name="end" />
      </button>
    );
  }
}

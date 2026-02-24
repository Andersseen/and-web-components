import { cn } from './cn';
import { normalizeProps } from './utils';

describe('cn', () => {
  it('merges class names', () => {
    expect(cn('foo', 'bar')).toEqual('foo bar');
  });

  it('handles conditional classes', () => {
    expect(cn('base', false && 'hidden', 'extra')).toEqual('base extra');
  });

  it('resolves tailwind conflicts', () => {
    expect(cn('p-4', 'p-2')).toEqual('p-2');
  });
});

describe('normalizeProps', () => {
  it('maps className to class', () => {
    const result = normalizeProps({ className: 'foo', id: 'bar' });
    expect(result).toEqual({ class: 'foo', id: 'bar' });
  });

  it('maps htmlFor to for', () => {
    const result = normalizeProps({ htmlFor: 'input-1', className: undefined });
    expect(result).toEqual({ class: undefined, for: 'input-1' });
  });
});

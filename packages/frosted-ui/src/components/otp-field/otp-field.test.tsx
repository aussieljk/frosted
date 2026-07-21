import { act, cleanup, fireEvent, render } from '@testing-library/react';
import * as React from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import * as OTPField from './otp-field';

afterEach(cleanup);

describe('OTPField', () => {
  it('renders slots via the render prop and accepts typing', async () => {
    const onChange = vi.fn();
    const { container } = render(
      <OTPField.Root
        maxLength={6}
        onChange={onChange}
        render={({ slots }) => (
          <>
            <OTPField.Group>
              {slots.slice(0, 3).map((slot, index) => (
                <OTPField.Slot key={index} {...slot} />
              ))}
            </OTPField.Group>
            <OTPField.Separator />
            <OTPField.Group>
              {slots.slice(3).map((slot, index) => (
                <OTPField.Slot key={index + 3} {...slot} />
              ))}
            </OTPField.Group>
          </>
        )}
      />,
    );

    expect(container.querySelector('.fui-OTPFieldRoot')).toBeTruthy();
    const slots = container.querySelectorAll('input.fui-OTPFieldSlot');
    expect(slots.length).toBe(6);
    expect(container.querySelectorAll('.fui-OTPFieldGroup').length).toBe(2);
    expect(container.querySelector('.fui-OTPFieldSeparator')).toBeTruthy();

    const first = slots[0] as HTMLInputElement;
    await act(async () => {
      first.focus();
      fireEvent.change(first, { target: { value: '1' } });
    });
    expect(onChange).toHaveBeenCalledWith('1');
  });

  it('rejects characters not matching pattern', async () => {
    const onChange = vi.fn();
    const { container } = render(
      <OTPField.Root
        maxLength={4}
        pattern="^\d+$"
        onChange={onChange}
        render={({ slots }) => (
          <OTPField.Group>
            {slots.map((slot, index) => (
              <OTPField.Slot key={index} {...slot} />
            ))}
          </OTPField.Group>
        )}
      />,
    );
    const first = container.querySelectorAll('input.fui-OTPFieldSlot')[0] as HTMLInputElement;
    await act(async () => {
      first.focus();
      fireEvent.change(first, { target: { value: 'a' } });
    });
    expect(onChange).not.toHaveBeenCalled();
    await act(async () => {
      fireEvent.change(first, { target: { value: '7' } });
    });
    expect(onChange).toHaveBeenCalledWith('7');
  });

  it('supports a controlled value', async () => {
    const { container } = render(
      <OTPField.Root
        maxLength={4}
        value="12"
        onChange={() => {}}
        render={({ slots }) => (
          <OTPField.Group>
            {slots.map((slot, index) => (
              <OTPField.Slot key={index} {...slot} />
            ))}
          </OTPField.Group>
        )}
      />,
    );
    const slots = container.querySelectorAll('input.fui-OTPFieldSlot');
    expect((slots[0] as HTMLInputElement).value).toBe('1');
    expect((slots[1] as HTMLInputElement).value).toBe('2');
    expect((slots[2] as HTMLInputElement).value).toBe('');
  });
});

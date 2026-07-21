import { act, cleanup, fireEvent, render, screen } from '@testing-library/react';
import * as React from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { Button } from '../button';
import * as Sheet from './sheet';

afterEach(cleanup);

describe('Sheet', () => {
  it('opens via trigger and renders content parts', async () => {
    render(
      <Sheet.Root>
        <Sheet.Trigger>
          <Button>Open sheet</Button>
        </Sheet.Trigger>
        <Sheet.Content>
          <Sheet.Header>
            <Sheet.Title>Title here</Sheet.Title>
            <Sheet.Description>Description here</Sheet.Description>
          </Sheet.Header>
          <Sheet.Body>
            <Sheet.Close>
              <Button>Close</Button>
            </Sheet.Close>
          </Sheet.Body>
        </Sheet.Content>
      </Sheet.Root>,
    );

    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: 'Open sheet' }));
    });

    expect(document.querySelector('.fui-SheetContent')).toBeTruthy();
    expect(document.querySelector('.fui-SheetViewport')).toBeTruthy();
    expect(document.querySelector('.fui-SheetOverlay')).toBeTruthy();
    expect(document.querySelector('.fui-SheetContentHandle')).toBeTruthy();
    expect(screen.getByText('Title here')).toBeTruthy();
    expect(screen.getByText('Description here')).toBeTruthy();
  });

  it('does not close on escape when dismissible={false}', async () => {
    const onOpenChange = vi.fn();
    render(
      <Sheet.Root defaultOpen dismissible={false} onOpenChange={onOpenChange}>
        <Sheet.Content>
          <Sheet.Header>
            <Sheet.Title>Locked</Sheet.Title>
          </Sheet.Header>
        </Sheet.Content>
      </Sheet.Root>,
    );

    await act(async () => undefined);
    const popup = document.querySelector('.fui-SheetContent') as HTMLElement;
    expect(popup).toBeTruthy();
    await act(async () => {
      fireEvent.keyDown(popup, { key: 'Escape' });
    });
    expect(onOpenChange).not.toHaveBeenCalled();
    expect(document.querySelector('.fui-SheetContent')).toBeTruthy();
  });

  it('closes via the Close button and reports onOpenChange', async () => {
    const onOpenChange = vi.fn();
    render(
      <Sheet.Root defaultOpen onOpenChange={onOpenChange}>
        <Sheet.Content>
          <Sheet.Header>
            <Sheet.Title>Dismissible</Sheet.Title>
          </Sheet.Header>
          <Sheet.Body>
            <Sheet.Close>
              <Button>Close</Button>
            </Sheet.Close>
          </Sheet.Body>
        </Sheet.Content>
      </Sheet.Root>,
    );

    await act(async () => undefined);
    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: 'Close' }));
    });
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });
});

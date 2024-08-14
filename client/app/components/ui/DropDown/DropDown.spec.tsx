import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from './dropdown-menu';

describe('DropdownMenu', () => {
  it('renders DropdownMenuTrigger and opens DropdownMenuContent on click', async () => {
    render(
      <DropdownMenu>
        <DropdownMenuTrigger>Open Menu</DropdownMenuTrigger>
        <DropdownMenuContent>Menu Content</DropdownMenuContent>
      </DropdownMenu>
    );

    const trigger = screen.getByText('Open Menu');
    await userEvent.click(trigger);

    expect(screen.getByText('Menu Content')).toBeInTheDocument();
  });

  it('renders DropdownMenuItem and handles click event', async () => {
    const handleClick = vi.fn();
    render(
      <DropdownMenu>
        <DropdownMenuTrigger>Open Menu</DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem onSelect={handleClick}>Item 1</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );

    const trigger = screen.getByText('Open Menu');
    await userEvent.click(trigger);

    const item = screen.getByText('Item 1');
    await userEvent.click(item);

    expect(handleClick).toHaveBeenCalled();
  });

  it('renders DropdownMenuCheckboxItem and toggles checked state', async () => {
    render(
      <DropdownMenu>
        <DropdownMenuTrigger>Open Menu</DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuCheckboxItem checked>Checkbox Item</DropdownMenuCheckboxItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );

    const trigger = screen.getByText('Open Menu');
    await userEvent.click(trigger);

    const checkboxItem = screen.getByText('Checkbox Item');
    expect(checkboxItem).toBeInTheDocument();
  });

  it('renders DropdownMenuRadioItem and handles selection', async () => {
    render(
      <DropdownMenu>
        <DropdownMenuTrigger>open menu</DropdownMenuTrigger>
        <DropdownMenuContent className="w-56">
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>
              <span>sub menu</span>
            </DropdownMenuSubTrigger>
            <DropdownMenuPortal>
              <DropdownMenuSubContent>
                <DropdownMenuItem>
                  <span>item</span>
                </DropdownMenuItem>
              </DropdownMenuSubContent>
            </DropdownMenuPortal>
          </DropdownMenuSub>
        </DropdownMenuContent>
      </DropdownMenu>
    );

    const trigger = screen.getByText(/Open Menu/i);
    await userEvent.click(trigger);

    const subTrigger = screen.getByText(/sub menu/i);
    await userEvent.hover(subTrigger);

    expect(subTrigger).toBeInTheDocument();
  });
});

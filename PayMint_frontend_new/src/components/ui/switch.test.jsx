import { render, screen, fireEvent } from '@testing-library/react';
import { Switch } from './switch';
import { describe, it, expect, vi } from 'vitest';

describe('Switch', () => {
    it('renders correctly', () => {
        render(<Switch />);
        expect(screen.getByRole('switch')).toBeInTheDocument();
    });

    it('toggles state', () => {
        const handleCheckedChange = vi.fn();
        render(<Switch onCheckedChange={handleCheckedChange} />);
        const switchEl = screen.getByRole('switch');
        fireEvent.click(switchEl);
        expect(handleCheckedChange).toHaveBeenCalledWith(true);
    });
});

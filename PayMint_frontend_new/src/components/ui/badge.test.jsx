import { render, screen } from '@testing-library/react';
import { Badge } from './badge';
import { describe, it, expect } from 'vitest';

describe('Badge', () => {
    it('renders correctly', () => {
        render(<Badge>Status</Badge>);
        expect(screen.getByText('Status')).toBeInTheDocument();
    });

    it('renders variants', () => {
        render(<Badge variant="secondary">Secondary</Badge>);
        expect(screen.getByText('Secondary')).toHaveClass('bg-secondary');
    });
});

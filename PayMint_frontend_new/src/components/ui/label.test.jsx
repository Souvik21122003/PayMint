import { render, screen } from '@testing-library/react';
import { Label } from './label';
import { describe, it, expect } from 'vitest';

describe('Label', () => {
    it('renders correctly', () => {
        render(<Label htmlFor="email">Email</Label>);
        const label = screen.getByText('Email');
        expect(label).toBeInTheDocument();
        expect(label).toHaveAttribute('for', 'email');
    });
});

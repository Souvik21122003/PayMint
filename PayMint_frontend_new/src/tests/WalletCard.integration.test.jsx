import { render, screen, fireEvent } from '@testing-library/react';
import { WalletCard } from '../components/WalletCard';
import { describe, it, expect } from 'vitest';

describe('WalletCard', () => {
    it('renders correctly with balance', () => {
        render(<WalletCard balance={5000} />);
        // The balance is formatted as currency, e.g. "₹5,000.00" or similar depending on locale.
        // Since we know the implementation uses 'en-US' and 'INR', it should have '₹' or 'INR' 
        // depending on the environment support for INR symbol in en-US.
        // We can just check for "5,000.00" to be safe or use regex.
        expect(screen.getByText(/5,000.00/)).toBeInTheDocument();
        expect(screen.getByText('Available Balance')).toBeInTheDocument();
    });

    it('renders loading state', () => {
        // When loading is true, it renders a skeleton via class 'animate-shimmer'
        // It does NOT render the balance text.
        const { container } = render(<WalletCard loading={true} balance={5000} />);
        expect(container.querySelector('.animate-shimmer')).toBeInTheDocument();
        expect(screen.queryByText(/5,000.00/)).not.toBeInTheDocument();
    });

    it('toggles balance visibility', () => {
        render(<WalletCard balance={1234.56} />);
        const button = screen.getByRole('button');

        // Initially visible
        expect(screen.getByText(/1,234.56/)).toBeInTheDocument();

        // Click to hide
        fireEvent.click(button);
        expect(screen.queryByText(/1,234.56/)).not.toBeInTheDocument();
        expect(screen.getByText('••••••')).toBeInTheDocument();

        // Click to show
        fireEvent.click(button);
        expect(screen.getByText(/1,234.56/)).toBeInTheDocument();
    });
});

import { render, screen, fireEvent } from '@testing-library/react';
import { TransactionCard } from '../components/TransactionCard';
import { describe, it, expect, vi } from 'vitest';

describe('TransactionCard', () => {
    const mockTransaction = {
        id: '123',
        type: 'CREDIT',
        status: 'SUCCESS',
        amount: 1500,
        date: new Date().toISOString(), // Today
        description: 'Salary',
        fee: 0,
    };

    it('renders credit transaction correctly', () => {
        render(<TransactionCard transaction={mockTransaction} />);
        expect(screen.getByText('Salary')).toBeInTheDocument();
        expect(screen.getByText(/\+.*1,500.00/)).toBeInTheDocument(); // Checks for + and amount
        expect(screen.getByText('SUCCESS')).toBeInTheDocument();
    });

    it('renders debit transaction correctly', () => {
        const debitTransaction = { ...mockTransaction, type: 'DEBIT', amount: 500, description: 'Grocery' };
        render(<TransactionCard transaction={debitTransaction} />);
        expect(screen.getByText('Grocery')).toBeInTheDocument();
        expect(screen.getByText(/-.*500.00/)).toBeInTheDocument(); // Checks for - and amount
    });

    it('renders failed status with correct styling', () => {
        const failedTransaction = { ...mockTransaction, status: 'FAILED', failureReason: 'Insufficient funds' };
        render(<TransactionCard transaction={failedTransaction} />);
        expect(screen.getByText('FAILED')).toBeInTheDocument();
        expect(screen.getByText('Insufficient funds')).toBeInTheDocument();

        // Check for destructive color class on status (simplified check)
        const statusBadge = screen.getByText('FAILED');
        expect(statusBadge.className).toContain('text-destructive');
    });

    it('handles delete action', () => {
        const onDelete = vi.fn();
        render(<TransactionCard transaction={mockTransaction} showDelete={true} onDelete={onDelete} />);

        const deleteButton = screen.getByRole('button'); // In this context, likely the only button
        fireEvent.click(deleteButton);
        expect(onDelete).toHaveBeenCalledWith('123');
    });

    it('does not show delete button if showDelete is false', () => {
        render(<TransactionCard transaction={mockTransaction} showDelete={false} />);
        expect(screen.queryByRole('button')).not.toBeInTheDocument();
    });
});

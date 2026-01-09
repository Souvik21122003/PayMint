import { render, screen } from '@testing-library/react';
import { Alert, AlertTitle, AlertDescription } from './alert';
import { describe, it, expect } from 'vitest';

describe('Alert', () => {
    it('renders alert correctly', () => {
        render(
            <Alert>
                <AlertTitle>Warning</AlertTitle>
                <AlertDescription>Something went wrong</AlertDescription>
            </Alert>
        );
        expect(screen.getByText('Warning')).toBeInTheDocument();
        expect(screen.getByText('Something went wrong')).toBeInTheDocument();
    });

    it('renders destructive variant', () => {
        const { container } = render(
            <Alert variant="destructive">
                <AlertTitle>Error</AlertTitle>
            </Alert>
        );
        // Alert is a div with role="alert"
        expect(screen.getByRole('alert')).toHaveClass('border-destructive/50');
    });
});

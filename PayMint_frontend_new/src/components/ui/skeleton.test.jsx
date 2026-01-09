import { render } from '@testing-library/react';
import { Skeleton } from './skeleton';
import { describe, it, expect } from 'vitest';

describe('Skeleton', () => {
    it('renders correctly', () => {
        const { container } = render(<Skeleton className="w-10 h-10" />);
        // Skeleton is usually a div with animate-pulse
        expect(container.firstChild).toHaveClass('animate-pulse');
    });
});

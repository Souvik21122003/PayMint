import { render, screen } from '@testing-library/react';
import { Avatar, AvatarImage, AvatarFallback } from './avatar';
import { describe, it, expect } from 'vitest';

describe('Avatar', () => {
    it('renders fallback when image is missing', () => {
        render(
            <Avatar>
                <AvatarFallback>JD</AvatarFallback>
            </Avatar>
        );
        expect(screen.getByText('JD')).toBeInTheDocument();
    });
});

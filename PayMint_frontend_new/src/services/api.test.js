import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import axios from 'axios';

const { mockApi } = vi.hoisted(() => {
    return {
        mockApi: {
            post: vi.fn(),
            get: vi.fn(),
            put: vi.fn(),
            delete: vi.fn(),
        }
    }
});

// Mock axios.create to return our mock instance
vi.mock('axios', () => ({
    default: {
        create: vi.fn(() => mockApi),
    },
}));

// Import the service AFTER mocking
import { userApi } from './api';

describe('userApi', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        // Clear localStorage
        localStorage.clear();
    });

    it('login calls api.post and stores user in localStorage', async () => {
        const mockResponse = {
            data: {
                user: { id: 1, name: 'Test User', email: 'test@example.com' },
                token: 'fake-token'
            }
        };

        mockApi.post.mockResolvedValueOnce(mockResponse);

        const result = await userApi.login('test@example.com', 'password');

        expect(mockApi.post).toHaveBeenCalledWith('/users/login', {
            email: 'test@example.com',
            password: 'password'
        });

        expect(result).toEqual(mockResponse.data.user);
        expect(localStorage.getItem('fintech_current_user')).toEqual(JSON.stringify(mockResponse.data));
    });

    it('signup calls api.post and stores user', async () => {
        const mockResponse = {
            data: {
                user: { id: 2, name: 'New User' },
                token: 'new-token'
            }
        };
        mockApi.post.mockResolvedValueOnce(mockResponse);

        const result = await userApi.signup('new@example.com', 'password', 'New User');

        expect(mockApi.post).toHaveBeenCalledWith('/users/signup', {
            email: 'new@example.com',
            password: 'password',
            name: 'New User'
        });
        expect(result).toEqual(mockResponse.data.user);
    });
});

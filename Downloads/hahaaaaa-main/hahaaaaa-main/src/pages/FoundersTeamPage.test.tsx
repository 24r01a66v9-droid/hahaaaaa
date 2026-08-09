import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import FoundersTeamPage from './FoundersTeamPage';

const useAuthMock = vi.fn();

vi.mock('../context/AuthContext', () => ({
  useAuth: () => useAuthMock(),
}));

vi.mock('motion/react', () => ({
  motion: {
    div: ({ children, ...props }: React.PropsWithChildren<any>) => <div {...props}>{children}</div>,
    article: ({ children, ...props }: React.PropsWithChildren<any>) => <article {...props}>{children}</article>,
  },
}));

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual<typeof import('react-router-dom')>('react-router-dom');
  return {
    ...actual,
    Link: ({ children, ...props }: React.PropsWithChildren<any>) => <a {...props}>{children}</a>,
  };
});

describe('FoundersTeamPage', () => {
  beforeEach(() => {
    window.localStorage.clear();
    useAuthMock.mockReturnValue({
      user: { id: 1, name: 'Admin', email: 'admin@example.com', role: 'admin' },
    });
  });

  it('loads leadership members from the dedicated Supabase endpoint', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => [
        {
          id: 'member-1',
          name: 'Ava',
          role: 'Founder',
          image: 'https://cdn.example.com/ava.jpg',
          category: 'founders',
          display_order: 1,
        },
      ],
    });

    vi.stubGlobal('fetch', fetchMock);

    render(<FoundersTeamPage />);

    expect(await screen.findByText('Ava')).toBeInTheDocument();
    expect(screen.getByAltText('Ava')).toHaveAttribute('src', 'https://cdn.example.com/ava.jpg');
    expect(fetchMock).toHaveBeenCalledWith('/api/leadership-members');
  });
});

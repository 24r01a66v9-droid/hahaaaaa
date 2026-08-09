import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import LeadershipPage from './LeadershipPage';

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

describe('LeadershipPage', () => {
  beforeEach(() => {
    window.localStorage.clear();
    useAuthMock.mockReturnValue({
      user: { id: 1, name: 'Admin', email: 'admin@example.com', role: 'admin' },
    });
  });

  it('renders the leadership page with founders and team data', async () => {
    window.localStorage.setItem('ikshana-leadership-reset-complete', 'true');
    window.localStorage.setItem(
      'ikshana-leadership-members',
      JSON.stringify([
        {
          id: 'member-1',
          name: 'Ava',
          role: 'Founder',
          tenure: '2020-present',
          bio: 'A visionary leader.',
          image: 'avatar-1',
          category: 'founders',
          displayOrder: 1,
        },
      ]),
    );

    render(<LeadershipPage />);

    expect(await screen.findByText('Ava')).toBeInTheDocument();
    expect(screen.getByText(/Leadership/i)).toBeInTheDocument();
  });
});

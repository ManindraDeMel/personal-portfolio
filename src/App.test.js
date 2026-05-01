import { render, screen } from '@testing-library/react';
import App from './App';

// Stub Firestore service modules so the test doesn't require a real Firebase
// app at runtime — we just want a smoke test that the tree mounts.
jest.mock('./service/fetchTimeline', () => ({
  __esModule: true,
  default: () => Promise.resolve([]),
}));
jest.mock('./service/fetchSpotlight', () => ({
  __esModule: true,
  default: () => Promise.resolve(null),
}));
jest.mock('./firebase', () => ({ db: {} }));

test('renders the portfolio name in the navbar', () => {
  render(<App />);
  expect(screen.getAllByText(/Manindra de Mel/).length).toBeGreaterThan(0);
});

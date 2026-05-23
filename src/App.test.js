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
  default: () => Promise.resolve([]),
}));
jest.mock('./service/fetchResearch', () => ({
  __esModule: true,
  default: () => Promise.resolve([]),
}));
jest.mock('./firebase', () => ({ db: {} }));

test('mounts the app shell', () => {
  render(<App />);
  // Skip-to-content link is always present in the shell, regardless of route
  // or viewport.
  expect(screen.getByText(/Skip to content/i)).toBeInTheDocument();
});

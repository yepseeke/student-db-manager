import { render, screen } from '@testing-library/react';
import App from './App';

test('renders Student Registry header', () => {
  render(<App />);
  const headerElement = screen.getByText(/Student Registry/i);
  expect(headerElement).toBeInTheDocument();
});

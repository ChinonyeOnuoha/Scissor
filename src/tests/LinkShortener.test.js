// LinkShortener.test.js
import { render, fireEvent, screen } from '@testing-library/react';
import LinkShortener from './LinkShortener';


test('displays error message for invalid input', async () => {
  render(<LinkShortener />);
  fireEvent.input(screen.getByPlaceholderText(/Paste link here/i), {
    target: { value: 'invalidURL' }
  });
  fireEvent.click(screen.getByText(/Shorten link/i));
  const errorMessage = await screen.findByText(/Enter a valid URL/i);
  expect(errorMessage).toBeInTheDocument();
});

test('clicking "Shorten link" button calls shortenLink function', () => {
  const mockShortenLink = jest.fn();
  render(<LinkShortener shortenLink={mockShortenLink} />);
  fireEvent.click(screen.getByText(/Shorten link/i));
  expect(mockShortenLink).toHaveBeenCalled();
});

test('renders LinkShortener input field', () => {
  render(<LinkShortener />);
  const linkInputElement = screen.getByPlaceholderText(/Paste link here/i);
  expect(linkInputElement).toBeInTheDocument();
});
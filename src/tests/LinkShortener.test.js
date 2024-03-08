// LinkShortener.test.js
import { copyToClipboard } from './LinkShortener';

it('should copy text to clipboard', async () => {
  document.execCommand = jest.fn();
  await copyToClipboard('test link');
  expect(document.execCommand).toHaveBeenCalledWith('copy');
});

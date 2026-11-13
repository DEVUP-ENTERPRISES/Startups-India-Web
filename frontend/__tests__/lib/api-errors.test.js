import { friendlyErrorMessage } from '@/lib/api';

describe('friendlyErrorMessage', () => {
  it('never blames the user for our outages', () => {
    expect(friendlyErrorMessage(0)).toMatch(/internet connection/);
    expect(friendlyErrorMessage(500, 'Cannot read properties of undefined')).toMatch(/on our side/);
    expect(friendlyErrorMessage(502)).toMatch(/on our side/);
    expect(friendlyErrorMessage(503)).toMatch(/quick update/);
  });

  it('keeps clear, actionable server messages', () => {
    expect(friendlyErrorMessage(403, 'You are not enrolled in this course')).toBe('You are not enrolled in this course');
    expect(friendlyErrorMessage(409, 'The evaluation fee for this application is already paid.')).toMatch(/already paid/);
  });

  it('translates technical validation wording', () => {
    expect(friendlyErrorMessage(400, 'Invalid request body')).toMatch(/check the details/);
    expect(friendlyErrorMessage(400, 'Cast to ObjectId failed for value "x"')).toMatch(/check the details/);
    expect(friendlyErrorMessage(429)).toMatch(/wait a moment/);
  });
});

/**
 * @jest-environment node
 */

import { GET } from '@/app/api/health/route';

describe('Health Check API', () => {
  beforeAll(() => {
    process.env.NEXT_PUBLIC_API_BASE_URL = 'http://localhost:5000';
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ status: 'ok' }),
    });
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });

  it('should return a response object', async () => {
    const response = await GET();
    expect(response).toBeDefined();
  });

  it('should return JSON with status field', async () => {
    const response = await GET();
    const data = await response.json();
    expect(data).toHaveProperty('status');
    expect(['healthy', 'unhealthy']).toContain(data.status);
  });

  it('should include timestamp', async () => {
    const response = await GET();
    const data = await response.json();
    expect(data).toHaveProperty('timestamp');
    expect(typeof data.timestamp).toBe('string');
  });

  it('should include environment', async () => {
    const response = await GET();
    const data = await response.json();
    expect(data).toHaveProperty('environment');
    expect(['development', 'production', 'test']).toContain(data.environment);
  });

  it('should include version', async () => {
    const response = await GET();
    const data = await response.json();
    expect(data).toHaveProperty('version');
    expect(typeof data.version).toBe('string');
  });

  it('should include checks object', async () => {
    const response = await GET();
    const data = await response.json();
    expect(data).toHaveProperty('checks');
    expect(typeof data.checks).toBe('object');
  });
});

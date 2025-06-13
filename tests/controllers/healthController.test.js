import { checkHealth } from '../../src/controllers/healthController.js';

describe('Health Controller', () => {
  it('should return API status', () => {
    const req = {};
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    checkHealth(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      status: 'ok',
      message: 'API Conecta Artesanato está no ar!',
      timestamp: expect.any(String)
    });
  });
});
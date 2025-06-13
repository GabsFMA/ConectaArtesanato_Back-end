const { registerUser } = require('../../src/controllers/userRegisterController');
const Client = require('../../src/models/Client');

jest.mock('../../src/models/Client');

describe('User Register Controller', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should register a new user successfully', async () => {
    const mockReq = {
      body: {
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123'
      }
    };
    
    const mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    Client.findOne.mockResolvedValue(null);
    Client.prototype.save.mockResolvedValue({
      _id: '123',
      name: 'Test User',
      email: 'test@example.com'
    });

    await registerUser(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(201);
    expect(mockRes.json).toHaveBeenCalledWith({
      message: 'User registered successfully',
      user: expect.objectContaining({
        name: 'Test User',
        email: 'test@example.com'
      })
    });
  });

  it('should return error if email already exists', async () => {
    const mockReq = {
      body: {
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123'
      }
    };
    
    const mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    Client.findOne.mockResolvedValue({
      _id: '123',
      name: 'Existing User',
      email: 'test@example.com'
    });

    await registerUser(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(400);
    expect(mockRes.json).toHaveBeenCalledWith({
      message: 'Email already in use'
    });
  });
});
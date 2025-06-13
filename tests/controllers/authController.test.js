import { register, login } from '../../src/controllers/authController.js';
import Client from '../../src/models/Client.js';
import Artisan from '../../src/models/Artisan.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

jest.mock('bcryptjs');
jest.mock('jsonwebtoken');
jest.mock('../../src/models/Client.js');
jest.mock('../../src/models/Artisan.js');

describe('Auth Controller', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('register', () => {
    it('should register a new client successfully', async () => {
      const req = {
        body: {
          fullName: 'Test Client',
          email: 'client@example.com',
          password: 'Password123!',
          role: 'client'
        }
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      Client.findOne.mockResolvedValue(null);
      Artisan.findOne.mockResolvedValue(null);
      bcrypt.genSalt.mockResolvedValue('salt');
      bcrypt.hash.mockResolvedValue('hashedPassword');
      Client.prototype.save.mockResolvedValue({
        _id: '123',
        fullName: 'Test Client',
        email: 'client@example.com',
        role: 'client',
        toObject: jest.fn().mockReturnValue({
          _id: '123',
          fullName: 'Test Client',
          email: 'client@example.com',
          role: 'client'
        })
      });

      await register(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Usuário cadastrado com sucesso!',
        user: expect.objectContaining({
          fullName: 'Test Client',
          email: 'client@example.com'
        })
      });
    });

    it('should return 400 for invalid password', async () => {
      const req = {
        body: {
          fullName: 'Test Client',
          email: 'client@example.com',
          password: 'weak',
          role: 'client'
        }
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      await register(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: 'A senha deve ter pelo menos 6 caracteres.'
      });
    });
  });

  describe('login', () => {
    it('should login a user successfully', async () => {
      const req = {
        body: {
          email: 'client@example.com',
          password: 'Password123!'
        }
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      const mockUser = {
        _id: '123',
        email: 'client@example.com',
        password: 'hashedPassword',
        role: 'client'
      };

      Client.findOne.mockResolvedValue(mockUser);
      bcrypt.compare.mockResolvedValue(true);
      jwt.sign.mockReturnValue('mockToken');

      await login(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Login bem-sucedido!',
        token: 'mockToken'
      });
    });
  });
});
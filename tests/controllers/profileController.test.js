import { getMyProfile, updateMyProfile } from '../../src/controllers/profileController.js';
import Client from '../../src/models/Client.js';
import Artisan from '../../src/models/Artisan.js';
import Product from '../../src/models/Product.js';

jest.mock('../../src/models/Client.js');
jest.mock('../../src/models/Artisan.js');
jest.mock('../../src/models/Product.js');

describe('Profile Controller', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getMyProfile', () => {
    it('should return client profile', async () => {
      const req = {
        user: {
          id: '123',
          role: 'client'
        }
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      const mockClient = {
        _id: '123',
        fullName: 'Test Client',
        email: 'client@example.com'
      };

      Client.findById.mockResolvedValue(mockClient);

      await getMyProfile(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockClient);
    });

    it('should calculate average rating for artisan', async () => {
      const req = {
        user: {
          id: '123',
          role: 'artisan'
        }
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      const mockArtisan = {
        _id: '123',
        fullName: 'Test Artisan',
        toObject: jest.fn().mockReturnThis()
      };

      const mockProducts = [
        { averageRating: 4 },
        { averageRating: 5 },
        { averageRating: 0 }
      ];

      Artisan.findById.mockResolvedValue(mockArtisan);
      Product.find.mockResolvedValue(mockProducts);

      await getMyProfile(req, res);

      expect(mockArtisan.averageProductRating).toBe(4.5);
      expect(res.status).toHaveBeenCalledWith(200);
    });
  });

  describe('updateMyProfile', () => {
    it('should update client profile', async () => {
      const req = {
        user: {
          id: '123',
          role: 'client'
        },
        body: {
          fullName: 'Updated Name',
          phone: ['123456789']
        }
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      const mockUpdatedClient = {
        _id: '123',
        fullName: 'Updated Name',
        phone: ['123456789']
      };

      Client.findByIdAndUpdate.mockResolvedValue(mockUpdatedClient);

      await updateMyProfile(req, res);

      expect(Client.findByIdAndUpdate).toHaveBeenCalledWith(
        '123',
        { $set: { fullName: 'Updated Name', phone: ['123456789'] } },
        { new: true, runValidators: true }
      );
      expect(res.status).toHaveBeenCalledWith(200);
    });
  });
});
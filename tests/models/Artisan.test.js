import Artisan from '../../src/models/Artisan.js';
import bcrypt from 'bcryptjs';

describe('Artisan Model', () => {
  afterEach(async () => {
    await Artisan.deleteMany({});
  });

  it('should require all artisan-specific fields', async () => {
    const artisan = new Artisan({
      fullName: 'Test Artisan',
      email: 'test@example.com',
      password: 'Password123!',
      role: 'artisan'
    });
    
    let error;
    try {
      await artisan.save();
    } catch (err) {
      error = err;
    }

    expect(error).toBeInstanceOf(mongoose.Error.ValidationError);
    expect(error.errors.brandName).toBeDefined();
    expect(error.errors['personalData.birthDate']).toBeDefined();
  });

  it('should set default role to artisan', async () => {
    const artisanData = {
      fullName: 'Test Artisan',
      email: 'test@example.com',
      password: 'Password123!',
      brandName: 'Test Brand',
      cpf_cnpj: '12345678901',
      personalData: {
        birthDate: new Date('1990-01-01'),
        phone: ['123456789']
      },
      description: 'Test description',
      artInfo: 'Test art info',
      addresses: [{
        street: 'Test St',
        number: '123',
        neighborhood: 'Test',
        city: 'Test City',
        state: 'TS',
        zipCode: '12345678',
        type: 'Comercial'
      }]
    };

    const artisan = new Artisan(artisanData);
    await artisan.save();

    expect(artisan.role).toBe('artisan');
  });
});
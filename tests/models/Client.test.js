import Client from '../../src/models/Client.js';
import bcrypt from 'bcryptjs';

describe('Client Model', () => {
  afterEach(async () => {
    await Client.deleteMany({});
  });

  it('should hash the password before saving', async () => {
    const clientData = {
      fullName: 'Test Client',
      email: 'test@example.com',
      password: 'Password123!'
    };

    const client = new Client(clientData);
    await client.save();

    expect(client.password).not.toBe(clientData.password);
    expect(await bcrypt.compare(clientData.password, client.password)).toBe(true);
  });

  it('should require email, fullName and password', async () => {
    const client = new Client({});
    
    let error;
    try {
      await client.save();
    } catch (err) {
      error = err;
    }

    expect(error).toBeInstanceOf(mongoose.Error.ValidationError);
    expect(error.errors.fullName).toBeDefined();
    expect(error.errors.email).toBeDefined();
    expect(error.errors.password).toBeDefined();
  });

  it('should enforce unique email constraint', async () => {
    const clientData = {
      fullName: 'Test Client',
      email: 'test@example.com',
      password: 'Password123!'
    };

    await new Client(clientData).save();
    
    let error;
    try {
      await new Client(clientData).save();
    } catch (err) {
      error = err;
    }

    expect(error.code).toBe(11000);
  });
});
import Client from '../models/Client.js';
import Artisan from '../models/Artisan.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import asyncHandler from 'express-async-handler';

/**
 * @desc    Registra um novo usuário (cliente ou artesão)
 * @route   POST /api/auth/register
 * @access  Public
 */
const register = asyncHandler(async (req, res) => {
  const { 
    fullName, email, password, role, 
    brandName, cpf_cnpj, birthDate, phone, 
    description, artInfo, addresses 
  } = req.body;

  if (!fullName || !email || !password || !role) {
    res.status(400);
    throw new Error('Campos básicos (nome, email, senha, função) são obrigatórios.');
  }

  if (!/^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/.test(email)) {
    res.status(400);
    throw new Error("Email inválido. Por favor, verifique o formato.");
  }

  if (password.length < 7 || !/[a-z]/.test(password) || !/[A-Z]/.test(password) || !/\d/.test(password) || !/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    res.status(400);
    throw new Error("A senha deve ter no mínimo 7 caracteres, incluindo uma maiúscula, uma minúscula, um número e um caractere especial.");
  }

  const clientExists = await Client.findOne({ email });
  const artisanExists = await Artisan.findOne({ email });

  if (clientExists || artisanExists) {
    res.status(409); // Conflict
    throw new Error('Este email já está em uso.');
  }

  let newUser;
  if (role === 'artisan') {
    const requiredArtisanFields = { brandName, cpf_cnpj, birthDate, phone, description, artInfo, addresses };
    for (const [field, value] of Object.entries(requiredArtisanFields)) {
      if (!value) {
        res.status(400);
        throw new Error(`O campo '${field}' é obrigatório para o cadastro de artesão.`);
      }
    }
    newUser = await Artisan.create({
      fullName,
      email,
      password, // Passando a senha para o Mongoose
      role,
      brandName,
      cpf_cnpj,
      personalData: { birthDate, phone },
      description,
      artInfo,
      addresses
    });
  } else {
    newUser = await Client.create({ 
      fullName, 
      email, 
      password, // Passando a senha para o Mongoose
      role: 'client' 
    });
  }

  if (newUser) {
    const userResponse = newUser.toObject();
    delete userResponse.password;

    res.status(201).json({
      message: 'Usuário cadastrado com sucesso!',
      user: userResponse,
    });
  } else {
    res.status(400);
    throw new Error('Dados de usuário inválidos.');
  }
});

/**
 * @desc    Autentica um usuário e retorna um token JWT
 * @route   POST /api/auth/login
 * @access  Public
 */
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  let user = await Client.findOne({ email }).select('+password');
  if (!user) {
    user = await Artisan.findOne({ email }).select('+password');
  }

  if (user && (await bcrypt.compare(password, user.password))) {
    const payload = { id: user._id, role: user.role };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1d' });

    res.status(200).json({
      message: 'Login bem-sucedido!',
      token: token,
    });
  } else {
    res.status(401);
    throw new Error('Credenciais inválidas.');
  }
});

export { register, login };
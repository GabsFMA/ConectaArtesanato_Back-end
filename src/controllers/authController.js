import Client from "../models/Client.js";
import Artisan from "../models/Artisan.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

/**
 * @desc    Register a new user (client or artisan)
 * @route   POST /api/auth/register
 * @access  Public
 */
const register = async (req, res) => {
    // Validates the request body
  const {
    fullName,
    email,
    password,
    role,
    brandName,
    cpf_cnpj,
    birthDate,
    phone,
    description,
    artInfo,
    addresses,
  } = req.body;

  if (!fullName || !email || !password || !role) {
    return res
      .status(400)
      .json({
        message:
          "Campos básicos (nome, email, senha) são obrigatórios.",
      });
  }

  if (!/^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/.test(email)) {
    return res
      .status(400)
      .json({ message: "Email inválido. Por favor, verifique o formato." });
  }
  
  // Verifies password length
  if (password.length < 6) {
    return res
      .status(400)
      .json({ message: "A senha deve ter pelo menos 6 caracteres." });
  }

  // Verifies if the password contains at least one lowercase letter
  if (!/[a-z]/.test(password)) {
    return res
      .status(400)
      .json({ message: "A senha deve conter pelo menos uma letra minúscula." });
  }

  // Verifies if the password contains at least one uppercase letter
  if (!/[A-Z]/.test(password)) {
    return res
      .status(400)
      .json({ message: "A senha deve conter pelo menos uma letra maiúscula." });
  }

  // Verifies if the password contains at least one digit
  if (!/\d/.test(password)) {
    return res
      .status(400)
      .json({ message: "A senha deve conter pelo menos um número." });
  }

  // Verifies if the password contains at least one special character
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    return res
      .status(400)
      .json({
        message:
          "A senha deve conter pelo menos um caractere especial (ex: !@#$%).",
      });
  }

  try {
    const clientExists = await Client.findOne({ email });
    const artisanExists = await Artisan.findOne({ email });

    if (clientExists || artisanExists) {
      return res.status(409).json({ message: "Este email já está em uso." });
    }

    let newUser;
    if (role === "artisan") {
      const requiredArtisanFields = {
        brandName,
        cpf_cnpj,
        birthDate,
        phone,
        description,
        artInfo,
        addresses,
      };
      for (const [field, value] of Object.entries(requiredArtisanFields)) {
        if (!value) {
          return res
            .status(400)
            .json({
              message: `O campo '${field}' é obrigatório para o cadastro de artesão.`,
            });
        }
      }

      newUser = new Artisan({
        fullName,
        email,
        password,
        role,
        brandName,
        cpf_cnpj,
        personalData: { birthDate, phone },
        description,
        artInfo,
        addresses,
      });
    } else {
      newUser = new Client({ fullName, email, password, role: "client" });
    }

    await newUser.save();

    const userResponse = newUser.toObject();
    delete userResponse.password;

    res.status(201).json({
      message: "Usuário cadastrado com sucesso!",
      user: userResponse,
    });
  } catch (error) {
    if (error.name === "ValidationError" || error.code === 11000) {
      return res
        .status(400)
        .json({
          message: "Erro de validação nos dados enviados.",
          details: error.message,
        });
    }
    console.error("Erro no registro:", error);
    res
      .status(500)
      .json({ message: "Erro no servidor ao tentar cadastrar usuário." });
  }
};

/**
 * @desc    Authenticates a user and returns a token (client or artisan)
 * @route   POST /api/auth/login
 * @access  Public
 */
const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(400)
      .json({ message: "Por favor, forneça email e senha." });
  }

  try {
    // Searches for the user in both Client and Artisan collections
    let user = await Client.findOne({ email }).select("+password");
    if (!user) {
      user = await Artisan.findOne({ email }).select("+password");
    }

    // Verifies if the user exists and if the password matches
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: "Credenciais inválidas." });
    }

    const payload = {
      id: user._id,
      role: user.role,
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "2h",
    });

    res.status(200).json({
      message: "Login bem-sucedido!",
      token: token,
    });
  } catch (error) {
    console.error("Erro no login:", error);
    res
      .status(500)
      .json({ message: "Erro no servidor ao tentar fazer login." });
  }
};

export { register, login };

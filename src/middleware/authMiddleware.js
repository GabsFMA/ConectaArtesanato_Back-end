import jwt from "jsonwebtoken";
import asyncHandler from "express-async-handler";
import Client from "../models/Client.js";
import Artisan from "../models/Artisan.js";

// Middleware to protect routes and check for valid JWT
const protect = asyncHandler(async (req, res, next) => {
  let token;
  // Check if the request has an Authorization header with a Bearer token
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      req.user =
        (await Client.findById(decoded.id).select("-password")) ||
        (await Artisan.findById(decoded.id).select("-password"));

      if (!req.user) {
        res.status(401);
        throw new Error("Não autorizado, usuário não encontrado.");
      }
      next();
    } catch (error) {
      res.status(401);
      throw new Error("Não autorizado, token inválido.");
    }
  }

  if (!token) {
    res.status(401);
    throw new Error("Não autorizado, nenhum token encontrado.");
  }
});

// Middleware for artisan-specific routes (adding, editing and removing products)
//const isArtisan = (req, res, next) => {
//  if (req.user && req.user.role === "artisan") {
//    next();
//  } else {
//    res.status(403);
//    throw new Error("Acesso negado. Rota apenas para artesãos.");
//  }
//};

export { protect };

// Middleware para rotas não encontradas (404)
const notFound = (req, res, next) => {
  const error = new Error(`Rota não encontrada - ${req.originalUrl}`);
  res.status(404);
  next(error);
};

// Middleware para tratar todos os outros erros
const errorHandler = (err, req, res, next) => {
  // Se o status code ainda for 200 (OK), muda para 500 (Erro Interno do Servidor)
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode);

  res.json({
    // Usa a mensagem do erro que foi lançado no controller
    message: err.message,
    // Mostra o stack de erro apenas em ambiente de desenvolvimento
    stack: process.env.NODE_ENV === 'production' ? '🥞' : err.stack,
  });
};

export { notFound, errorHandler };
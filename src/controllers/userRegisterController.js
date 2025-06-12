 const userRegister = (req, res) => {
  res.status(200).json({
    status: 'ok',
    message: 'Página de cadastro de usuário',
    timestamp: new Date().toISOString(),
  });
};

export { userRegister };
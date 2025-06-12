 const userLogin = (req, res) => {
  res.status(200).json({
    status: 'ok',
    message: 'Página de login de usuário',
    timestamp: new Date().toISOString(),
  });
};

export { userLogin };
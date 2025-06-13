const checkHealth = (req, res) => {
  res.status(200).json({
    status: "ok",
    message: "API Conecta Artesanato está no ar!",
    timestamp: new Date().toISOString(),
  });
};

export { checkHealth };

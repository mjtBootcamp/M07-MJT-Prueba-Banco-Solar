const captaErrores = (error, res) => {
  console.log("CaptaError: ", error.message);
  res.writeHead(500).end(JSON.stringify(error));
};

module.exports = {
  captaErrores,
};

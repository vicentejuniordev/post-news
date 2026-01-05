function status(request, response) {
  response.status(200).json({ mensagem: "Hello World" });
}

export default status;

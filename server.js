const http = require("http");
const url = require("url");
const fsPromise = require("fs/promises");
const { captaErrores } = require("./util/errBack");
const {
  insertUser,
  getUsers,
  deleteUser,
  updateUser,
  insertTransaction,
  getHistorial,
} = require("./db/consultas");
const PORT = 3000;
http
  .createServer(async (req, res) => {
    if (req.url == "/" && req.method == "GET") {
      res.writeHead(200, { "Content-type": "text/html" });
      try {
        const html = await fsPromise.readFile("./www/index.html", "utf8");
        res.end(html);
      } catch (error) {
        captaErrores(error, res);
      }
    } else if (req.url == "/usuario" && req.method == "POST") {
      let body = "";
      req.on("data", (chunck) => {
        body += chunck;
      });
      req.on("end", async () => {
        try {
          const candidato = JSON.parse(body);
          await insertUser(Object.values(candidato));
          res.writeHead(201).end();
        } catch (error) {
          captaErrores(error, res);
        }
      });
    } else if (req.url == "/usuarios" && req.method == "GET") {
      try {
        const usuarios = await getUsers();
        res
          .writeHead(201, { "Content-type": "application/json" })
          .end(JSON.stringify(usuarios));
      } catch (error) {
        captaErrores(error, res);
      }
    } else if (req.url.startsWith("/usuario?id") && req.method == "DELETE") {
      let { id } = url.parse(req.url, true).query;
      try {
        await deleteUser(id);
        res.writeHead(201).end("Usuario eliminado");
      } catch (error) {
        captaErrores(error, res);
      }
    } else if (req.url.startsWith("/usuario?id") && req.method == "PUT") {
      let body = "";
      let { id } = url.parse(req.url, true).query;
      req.on("data", (chunck) => {
        body += chunck;
      });
      req.on("end", async () => {
        try {
          const user = JSON.parse(body);
          await updateUser(Object.values(user), id);
          res.writeHead(201).end();
        } catch (error) {
          captaErrores(error, res);
        }
      });
    } else if (req.url == "/transferencia" && req.method == "POST") {
      let body = "";
      req.on("data", (chunck) => {
        body += chunck;
      });
      req.on("end", async () => {
        try {
          const transfer = JSON.parse(body);
          const result = await insertTransaction(Object.values(transfer));
          if (result) {
            res
              .writeHead(201, { "Content-Type": "application/json" })
              .end(JSON.stringify(result));
          } else {
            res.writeHead(500).end("Saldo Insuficiente");
          }
        } catch (error) {
          captaErrores(error, res);
        }
      });
    } else if (req.url == "/transferencias" && req.method == "GET") {
      try {
        const historial = await getHistorial();
        res
          .writeHead(201, { "Content-Type": "application/json" })
          .end(JSON.stringify(historial));
      } catch (error) {
        captaErrores(error, res);
      }
    }
  })
  .listen(PORT, () => console.log(`Corriendo en el puerto ${PORT}`));

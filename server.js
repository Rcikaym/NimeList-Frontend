const jsonserver = require("json-server");
const server = jsonserver.create();
const router = jsonserver.router("./db.json");
const middlewares = jsonserver.defaults();

server.use(middlewares);
server.use((req, res, next) => {
  console.log("request received", req.method, req.url);
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  next();
});
server.use(router);
server.listen(3001, () => {
  console.log("JSON Server is running");
});

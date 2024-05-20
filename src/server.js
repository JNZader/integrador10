const { app, PORT } = require("./app/app.js"); // Destructure exports

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
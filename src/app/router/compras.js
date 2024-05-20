const express = require("express");
const router = express.Router();
const fs = require("fs").promises;
const path = require("path");

router.get("/compras", async (req, res) => {
  try {
    const comprasPath = path.join(__dirname, "../../../compras.json");
    const data = await fs.readFile(comprasPath, "utf8");
    const compras = JSON.parse(data);

    if (req.headers['accept'].includes('application/json')) {
      res.json(compras);
    } else {
      res.render("compras", { compras });
    }
  } catch (err) {
    console.error("Error reading compras.json:", err);
    res.status(500).send("Error reading compras data");
  }
});

module.exports = router;

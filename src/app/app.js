const express = require("express");
const morgan = require("morgan");
const cors = require('cors');

const router=require("./router/router");

const app = express();

const PORT = process.env.PORT || 3000;
const publicPath=__dirname.replace("app","public")

app.set("port",PORT);
app.set("view engine", "pug");
app.set('views', `${publicPath}/view`);

app.use(morgan("dev"));
app.use(express.json());
app.use(cors());
app.use(express.static(publicPath));
app.use(router);


module.exports = { app, PORT };
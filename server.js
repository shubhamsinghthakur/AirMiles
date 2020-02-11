"use strict";
const express = require("express");
const app = express();
app.set('view engine', 'html');
app.use(express.static('public'));
app.use(express.static('views'));
app.use(express.static('scripts'));
app.listen(8080, ()=> console.log("Port at 8080"));
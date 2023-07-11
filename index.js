require("dotenv").config();
const express = require("express");
const xss = require("xss-clean");
const hpp = require("hpp");
const cors = require("cors");
const jwtToken = require("jsonwebtoken");
const bodyParser = require("body-parser");
const compression = require("compression");

//custome packages
const jwt = require("./_helpers/jwt");
const errorHandler = require("./_helpers/error-handler");
const config = require("./config/config");

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json({ limit: '40mb' }));

//security packages 
app.use(xss());
app.use(hpp());

// compression
app.use(compression())

const whiteList = [""];
const oprations = {
    origin: function (origin, callback) {
        if (true || whiteList.indexOf(origin) !== 1) {
            callback(null, true);
        } else {
            callback(new Error("Not allowed by CORS"));
        }
    }
}

app.use(cors(oprations));

//use of jwt token

app.use(jwt());

function verifyToken(req, res, next) {
    const token = req.headers.authorization.split(' ')[1];
    if (!token) {
        return res.status(401).json({ message: "Unauthorized" });
    }

    jwtToken.verify(token, config.secret, (err, decode) => {
        if (err) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        req.userId = decode.userId;
        next();
    })
}

//routes can be from here

//global error handler
app.use(errorHandler)

const port = process.env.APP_PORT || 8080;

app.listen(port, () => {
    console.log("Started port on" + port);
})
const express = require("express");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const { PrismaSessionStore } = require("@quixo3/prisma-session-store");
const passport = require("passport");
const path = require("path");
const prisma = require("./config/database.js");

const app = express();

// defino la variable de entorno
require("dotenv").config();

// configuracion de formulario
app.use(express.urlencoded({ extended: true }));

// la ruta de archivos de imagen
app.use(require("./config/storage.js"));

// configuracion de la cookies
app.use(cookieParser("5654534jk34kjnk346kjn652gf2"));

// configuro el almacen de sesion de mysql
const sessionStore = new PrismaSessionStore(prisma, {
  checkPeriod: 2 * 60 * 1000,
  dbRecordIdIsSessionId: true,
  dbRecordIdFunction: undefined,
});

// configurando la sesion
app.use(
  session({
    secret: "ertt0923723kjnf29v762vl23ov8",
    cookie: { maxAge: 3600000, secure: false },
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
  })
);

// inizializando el passport
app.use(passport.initialize());
app.use(passport.session());

// definiendo el motor de platillas
app.set("views", path.join(__dirname, "/views"));
app.set("view engine", "ejs");

//  definiendo la autenticacion
require("./auth.js")(passport);

// archivos estaticos
app.use(express.static(path.join(__dirname, "/public")));

// rutas
app.use(require("./routes.js"));

// escuchando
app.listen(process.env.PORT, process.env.HOST, () => {
  console.log(`App listening at http://localhost:${process.env.PORT}`);
});

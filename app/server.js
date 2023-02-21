const express = require('express');
const app = express();
const { connection } = require('./database/db');
const routes = require('./routes');
const cors = require('cors')

// Setting
const PORT          = process.env.PORT || 4000;
const ROUTE         = process.env.Route || '/depacomp-api';
const ROUTEVERSION  = process.env.ROUTEVERSION || 'v1';
const WHITELIST     = process.env.WHITELIST || ['http://localhost:3000'];

app.use(cors({
    "Access-Control-Allow-Origin": WHITELIST,
    "optionsSuccessStatus": 200
}));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Rutas
app.use(`${ROUTE}/${ROUTEVERSION}`, routes);

// Arranque Servidor
app.listen(PORT, function () {
    console.log(`La app ha arrancado en http://localhost:${PORT}`);
    
    // TRUE dropea todo
    connection.sync({ force: false }).then(() => {
        console.log("Se ha establecido la conexión");
    })
});
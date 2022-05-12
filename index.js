console.log('desde index.js')   ;
const express = require('express'); 
const {dbConnection} = require('./config/db');


//crecion del servidor
const app = express();

//conexion con la base de datos
dbConnection();

//Habilitar express.json
app.use(express.json({extended: true}));

//puerto de la app
const PORT = process.env.PORT || 4000;

//importar rutas
app.use('/api/usuarios', require('./routes/usuarios'));
app.use('/api/auth', require('./routes/auth'));
app.use('/api/proyectos',require('./routes/proyectos'));



//Definir la página principal
app.get('/', (req, res) => {
    res.send('Hola Mundo')
}); 

//arrancar la app
app.listen(PORT, () => {
    console.log(`El servidor esta funcionando en el puerto ${PORT}`)
})
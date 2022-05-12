const Usuario = require('../models/Usuario');
const bcryptjs = require ('bcryptjs');
const{validationResult}= require('express-validator');
const jwt = require('jsonwebtoken');

exports.crearUsuario = async (req,res) => {

    // revisar si hay errores
    const errores = validationResult(req);
    if(!errores.isEmpty()) {
        return res.status(400).json({erores: errores.array()})
    }



    //extraer email y password
    const {email, password} = req.body;
    
    try {
        // Revisar que el usuario registrado sea unico
        let usuario = await Usuario.findOne({ email });

        if(usuario){
            return res.status(400).json({ msg:' El usuario ya existe'})
        }

        //crear el nuevo usuario
        usuario=new Usuario(req.body);

        //hashear el password
        const salt = await bcryptjs.genSalt(10);
        usuario.password = await bcryptjs.hash(password,salt);


        //guardar usuario
        await usuario.save();

        //crear y firmar el jwt
        const payload = {
            usuario:{
                id: usuario.id 
            }

        };

        //firmar el token
        jwt.sign(payload, process.env.SECRETA, {
            expiresIn: 3600
        },(error,token) =>{
            if(error) throw error;
            //msge confirmacion
            res.json ({token});
        });

       

        //Mensaje de confirmacion
        res.json({ msg:'Usuario creado correctamente'});
    } catch (error) {
        console.log(error);
        res.status(400).send('Hubo un error');
        
    } 
}
const Usuario = require('../models/Usuario');
const bcryptjs = require ('bcryptjs');
const{validationResult}= require('express-validator');
const jwt = require('jsonwebtoken');


exports.autenticarUsuario = async(req, res) => {
      // revisar si hay errores
      const errores = validationResult(req);
      if(!errores.isEmpty()) {
          return res.status(400).json({erores: errores.array()})
      }

//extraer usuario y password del request
const{email, password}  = req.body;

try {
    //revisar que sea un usuario registrado
    let usuario = await Usuario.findOne({email});
    if(!usuario){
        return res.status(400).json({msg:' El usuario no existe'})
    }

    //revisar el password
    const passCorrecto= await bcryptjs.compare(password, usuario.password);
    if(!passCorrecto) {
    return res.status(400).json({msg: ' Password Incorrecto'})
    }

// si todo es correcto crear y firmar el JWT
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
}
  
}
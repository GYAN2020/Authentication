require('dotenv').config()

import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import { getDbConnection } from '../db';



export const SignUpRoute = {

    path: '/api/signup',
    method: 'post',
    handler: async (req,res)=>{
        const { email, password } = req.body;
        const db = getDbConnection('react-auth-db');

        const user=await db.collection('users').findOne({email});

        if(user){
            res.sendStatus(409);
        }

        const passwordHash = await bcrypt.hash(password,10);

        const startingInfo ={
        hairColor:'',
        favoriteFood:'',
        bio:'',
        };

        const result=await db.collection('users').insertOne({
            email,
            passwordHash,
            info: startingInfo,
            inVerified:false,
        });

        const { insertId}=result;

        jwt.sign({
            id:insertId,
            email,
            info:startingInfo,
            isVerified:false,

        },
        process.env.JWT_SECRET,
        {
           expiresIn:'2d',
        },
        (err,token)=>{
           if(err){
            console.log(err);
               return res.status(500).send(err);
           }
           res.status(200).json({token});
        });
    }
}


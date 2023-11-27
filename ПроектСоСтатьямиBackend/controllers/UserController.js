import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { validationResult } from 'express-validator';
import UserModule  from '../modules/User.js';

export const register = async (req, res)=>{
    try{
    
        const password = req.body.password;
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password, salt);
    
        const doc = new UserModule(
            {
                email: req.body.email,
                fullName: req.body.fullName,
                avatarUrl: req.body.avatarUrl,
                passwordHash: hash
            }
        );
    
        const user = await doc.save();

        const token = jwt.sign({
            _id: user._id,
        }, '123', {expiresIn: '30d'});
        
        const {passwordHash, ...userData} = user._doc;

        res.json({
            ...userData,
            token
        });

    } catch (err){
        console.log(err);
        res.status(500).json({
            message: 'не удалось зарегистрироваться'
        });
    }
};

export const login = async (req, res)=>{
    try{
        const user = await UserModule.findOne({email: req.body.email});

        if(!user){
            return res.status(404).json({
                message: 'Пользователь не найден',
            });
        }

        const isValidPass = await bcrypt.compare(req.body.password, user._doc.passwordHash);

        

        if(!isValidPass){
            return res.status(400).json({
                message: 'Пользователь не найден',
            });
        }

        const token = jwt.sign({
            _id: user._id,
        }, '123', {expiresIn: '30d'});

        const {passwordHash, ...userData} = user._doc;

        res.json({
            ...userData,
            token
        });
        

    } catch(err){
        console.log(err);
        res.status(500).json({
            message: 'не удалось авторизоваться'
        });
    }
};

export const getMe = async (req, res) =>{
    try{
        const user = await UserModule.findById(req.userId);
        if(!user){
            return res.status(403).json({
                message: 'Ошибка',
            });
        }

        const {passwordHash, ...userData} = user._doc;

        res.json(userData);

    }catch(err){
        console.log(err);
        return res.status(404).json({
            message: 'Ошибка',
        });
    }
};
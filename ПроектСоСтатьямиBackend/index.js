import express from 'express';
import mongoose from 'mongoose';
import multer from 'multer';
import { registerValidation, loginValidation, postCreateValidation } from './validation.js';
import {UserController, PostController} from './controllers/index.js'
import { checkAuth, handleValidationErrors } from './untils/index.js';
import cors from 'cors';

mongoose
.connect('mongodb+srv://admin:qmNU4phXflITEqvT@cluster0.0xt7gdn.mongodb.net/blog?retryWrites=true&w=majority')
.then(()=>console.log('бд в здании'))
.catch((err)=>console.log('нeee фортануло', err));


const app = express();

const storage = multer.diskStorage({
    destination: (_, __, cb)=>{
        cb(null, 'uploads');
    },
    filename: (_, file, cb)=>{
        cb(null, file.originalname);
    },
});

const upload = multer({storage});

app.use(express.json());
app.use(cors());
app.use('/uploads', express.static('uploads'));

app.get('/', (req, res)=>{
    res.send('Привет, Мир');
});
////////////////////////////////Авторизация////////////////////////////////////////////
app.post('/auth/login', loginValidation, handleValidationErrors, UserController.login);
////////////////////////////////Регистрация////////////////////////////////////////////
app.post('/auth/register', registerValidation, handleValidationErrors, UserController.register);
////////////////////////////////Получение личной информации///////////////////////////
app.get('/auth/me', checkAuth, UserController.getMe);

app.post('/upload', checkAuth, upload.single('image'), (req, res)=>{
    res.json({
        url: `/uploads/${req.file.originalname}`,
    });
});

////////////////////////////////CRUD статьи//////////////////////////////////////
app.get('/tags', PostController.getLastTags);
//
app.get('/posts/tags', PostController.getLastTags);
//получить все статьи
app.get('/posts', PostController.getAll);
//Получить одну статью
app.get('/posts/:id', PostController.getOne);
//создать статью
app.post('/posts', checkAuth, postCreateValidation, handleValidationErrors, PostController.create);
//удалить статью
app.delete('/posts/:id', checkAuth, PostController.remove);
//обновить статью
app.patch('/posts/:id', checkAuth, postCreateValidation, handleValidationErrors, PostController.update);



app.listen(4444, (err)=>{
    if(err){
        return console.log(err);
    }
    console.log('сервер встал с колен');
});


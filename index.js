import express from "express"
import mongoose from "mongoose"
import { registerValidation, loginValidation, postCreateValidation } from "./validation/validations.js"
import {UserController, PostController} from "./controllers/index.js"

import multer from "multer"

import cors from "cors"
//import checkAuth from "./utils/checkAuth.js"
//import handleValidationResult from "./utils/handleValidationResult.js"
//import {} from './utils/index'
import {checkAuth, handleValidationResult} from './utils/index.js'

const app = express()
app.use(cors())
mongoose.connect('mongodb://localhost/newserver')
    .then(() => {
        console.log("DB ok")
    })
    .catch(e => console.log(e))

app.get("/", (req, res) => {
    res.send("hello World")
})
app.use(express.json())

app.use("/upload", express.static("uploads"))


const storage = multer.diskStorage({
    destination:(_,__,cb)=>{
        cb(null, 'uploads')
    },
    filename: (_, file, cb)=>{
        cb(null, file.originalname)
    }
})
const upload = multer({storage})
app.post('/upload', checkAuth, upload.single("image"), (req, res)=>{

    res.json({
        url: `/upload/${req.file.originalname}`
    })
})

app.post("/auth/registration", registerValidation, handleValidationResult, UserController.registration) //регистрация
app.post("/auth/login", loginValidation, handleValidationResult, UserController.login)
app.post("/posts", postCreateValidation, handleValidationResult, checkAuth, PostController.create)// создание поста
app.get("/tags", PostController.getLastTags)
app.get("/tags/:tagsName", PostController.getPostsByTags)
app.delete("/post/:id", checkAuth, PostController.remove)
app.get("/auth/me", checkAuth, UserController.getMe)
app.get("/posts", PostController.getAll)
app.get("/posts/sorted", PostController.getAllSortedByDate)
app.get("/posts/sortedByViews", PostController.getAllSortedByViews)
app.get("/post/:id", PostController.getOne)
app.patch("/posts/:id", postCreateValidation, checkAuth, PostController.update)



app.listen(5000, (err) => {
    if (err) {
        return console.log(err)
    } else {
        console.log("Ok")
    }
})
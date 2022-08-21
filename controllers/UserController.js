import { validationResult } from "express-validator"
import bcrypt from 'bcrypt'
import UserModel from "../models/User.js"
import jwt from "jsonwebtoken"
import multer from "multer"
//регистрация
export const registration = async (req, res) => {
    try {
        //const upload = 
        const password = req.body.password
        console.log(password)
        const solt = await bcrypt.genSalt(10)
        const hash = await bcrypt.hash(password, solt)

        const doc = new UserModel({
            fullName: req.body.fullName,
            email: req.body.email,
            //passwordHash: req.body.passwordHash,
            passwordHash: hash,
            avatarUrl: req.body.avatarUrl
        })

        const user = await doc.save()

        const token = jwt.sign(
            { _id: user._id },
            "secretKey",
            { expiresIn: '30d' }
        )
        const { passwordHash, ...userData } = user._doc;
       // console.log(...userData)
        res.json({ ...userData, token })
    } catch (error) {
        console.log(error)
        res.status(500).json(error)
    }
}
//логин
export const login = async (req, res) => {
    try {
        console.log(req.body.email)
        const user = await UserModel.findOne({
            email: req.body.email
        })
        console.log({user})
        if (!user) {
            return res.status(404).json({
                message: "Пользователь не найден"
            })
        }
        const isValidPass = await bcrypt.compare(req.body.password, user._doc.passwordHash)
        if (!isValidPass) {
            return res.status(404).json({
                message: "Неверный логин или пароль"
            })
        }
        const token = jwt.sign(
            { _id: user._id },
            "secretKey",
            { expiresIn: "30d" }
        )
        const { passwordHash, ...userData } = user._doc;
        res.json({
            ...userData,
            token
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({
            message: "Не удалось авторизоваться"
        })
    }
}

export const getMe = async (req, res) => {
    try {
        const user = await UserModel.findById(req.userId)
        if (!user) {
            return res.status(404).json({
                message: "Пользователь не найден"
            })
        }

        const { passwordHash, ...userData } = user._doc
        res.json(userData)
    } catch (error) {

    }
}
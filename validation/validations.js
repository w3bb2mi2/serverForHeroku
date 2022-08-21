import { body }  from "express-validator"


export const registerValidation = [
    body("email", "неверный формат почты").isEmail(),
    body("password", "Пароль должен быть минимум из 5 символов").isLength({min:5}), 
    body("fullName", "Укажите имя").isLength({min:3}),
    body("avatarUrl", "Ссылка на аватарку не прошла валидацию").optional().isURL()
]

export const loginValidation = [
    body("email", "Неверный формат почты").isEmail(),
    body("password", "Пароль должен содержать минимум 5 символов").isLength({min: 5})
]

export const postCreateValidation = [
    body('title', 'Введите заголовок статьи').isLength({min: 3}).isString(),
    body("text", "Введите текст статьи").isLength({min: 10}).isString(),
    body('tags', 'Неверный формат тэгов(укажите массив)').optional().isArray(),
    body('imageUrl', 'Неверная ссылка на изображение').optional().isString()
]
import express from "express";
import {getAll, getOne, postThings} from "../controller/api_controller";
import {checkSchema} from "express-validator";
import {user_schema} from "../schema/user_schema";
import {App} from "../type/app";

export function getRoutes(app: App) {
    const router = express.Router()

    // router.use((req, res, next) => {
    //     res.write("Début du middleware \n")
    //     // res.send()
    //
    //     next()
    //
    //     res.write("Fin du middleware \n")
    //     res.send()
    // })

    router.get('/', getAll(app))

    router.post('/', checkSchema(user_schema), postThings())

    router.get('/:id(\\d+)', getOne(app))

    router.get('/private', (req, res, next) => {
        res.download("./public/image.png")
    })


    return router
}

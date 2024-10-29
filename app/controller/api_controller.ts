import {Request, Response, NextFunction} from "express";
import {validationResult} from "express-validator";
import {App} from "../type/app";

export function getAll(app: App) {
    return async (req: Request, res: Response, next: NextFunction) => {

        app.repository.todoRepository.getAll().then(data => console.log(data))

        res.write("Je suis dans le controller \n")
        res.send()

        // res.json({
        //     message: "Hello monde incroyable de gens beaux"
        // })
    }
}

export function getOne(app: App) {
    return async (req: Request, res: Response, next: NextFunction) => {
        app.repository.todoRepository.getOne(parseInt(req.params.id) || 0).then(data => console.log(data))

        res.write("Je suis dans le controller \n")
        res.send()

        // res.json({
        //     message: "Hello monde incroyable de gens beaux"
        // })
    }
}

export function postThings() {
    return async (req: Request, res: Response, next: NextFunction) => {
        // console.log(req.body)

        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            res.json(errors.array())
        }

        console.log(req.body)

        res.status(201)
        res.send()
    }
}





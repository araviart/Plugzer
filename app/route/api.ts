import express from "express";
import { getAll } from "../controller/api_controller";
import { checkSchema } from "express-validator";
import { user_schema } from "../schema/user_schema";
import { App } from "../type/app";
import { authenticateToken } from "../middleware/authenticateToken"; // Importez le middleware

export function getRoutes(app: App) {
    const router = express.Router();
    router.get('/', authenticateToken, async (req, res, next) => {
        try {
            await getAll(app)(req, res, next);
        } catch (error) {
            next(error);
        }
    });
    router.post('/', authenticateToken, checkSchema(user_schema), async (req, res, next) => {
        try {
            await postThings()(req, res, next);
        } catch (error) {
            next(error);
        }
    });
    // router.get('/:id(\\d+)', authenticateToken, getOne(app));
    router.get('/private', authenticateToken, (req, res, next) => {
        res.download("./public/image.png");
    });

    return router;
}

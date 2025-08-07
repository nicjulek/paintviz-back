import { Router } from "express";
import { CarroceriaController } from "../controllers/CarroceriaController";
import { AdminMiddleware, AuthMiddleware } from "../middleware/AuthMiddleware";
import { ValidMiddleware } from "../middleware/ValidMiddleware";
import { container } from "tsyringe";
import * as yup from 'yup';

const router = Router();
const carroceriaController = container.resolve(CarroceriaController);

const carroceriaSchema = yup.object({
    nome_modelo: yup.string()
        .required('Nome do modelo é obrigatório')
        .min(3, 'Nome deve ter pelo menos 3 caracteres'),
    lateral_svg: yup.string().nullable(),
    traseira_svg: yup.string().nullable(),
    diagonal_svg: yup.string().nullable()
});

router.post('/', AuthMiddleware, AdminMiddleware, ValidMiddleware(carroceriaSchema),
    async (req, res, next) => {
        try {
            await carroceriaController.createCarroceria(req, res);
        } catch (error) {
            next(error);
        }
    }
);

export default router;
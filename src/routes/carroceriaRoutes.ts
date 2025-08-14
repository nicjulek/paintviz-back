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

//Listar todas
router.get('/', AuthMiddleware,
    async (req, res, next) => {
        try {
            await carroceriaController.listCarrocerias(req, res);
        } catch (error) {
            next(error);
        }
    }
);

// Buscar por ID
router.get('/:id', AuthMiddleware,
    async (req, res, next) => {
        try {
            await carroceriaController.findById(req, res);
        } catch (error) {
            next(error);
        }
    }
);

router.get('/nome/:nome_modelo', AuthMiddleware,
    async (req, res, next) => {
        try {
            await carroceriaController.findByNome(req, res);
        } catch (error) {
            next(error);
        }
    }
);

// Atualizar
router.put('/:id', AuthMiddleware, AdminMiddleware,
    async (req, res, next) => {
        try {
            await carroceriaController.updateCarroceria(req, res);
        } catch (error) {
            next(error);
        }
    }
);

router.delete('/:id', AuthMiddleware, AdminMiddleware,
    async (req, res, next) => {
        try {
            await carroceriaController.deleteCarroceria(req, res);
        } catch (error) {
            next(error);
        }
    }
);

export default router;
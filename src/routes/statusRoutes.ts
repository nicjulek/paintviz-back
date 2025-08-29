import { Router } from "express";
import { StatusController } from "../controllers/StatusController";
import { container } from "tsyringe";

const router = Router();
const statusController = container.resolve(StatusController);

// Busca por ID
router.get('/:id', async (req, res, next) => {
    try {
        await statusController.findById(req, res);
    } catch (error) {
        next(error);
    }
});

// Lista 
router.get('/', async (req, res, next) => {
    try {
        await statusController.listStatus(req, res);
    } catch (error) {
        next(error);
    }
});

export default router;
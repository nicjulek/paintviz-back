import { Router } from "express";
import { CorController } from "../controllers/CorController";
import { container } from "tsyringe";

const router = Router();
const corController = container.resolve(CorController);

// Cria 
router.post('/', async (req, res, next) => {
    try {
        await corController.createCor(req, res);
    } catch (error) {
        next(error);
    }
});

// Deleta
router.delete('/:id', async (req, res, next) => {
    try {
        await corController.deleteCor(req, res);
    } catch (error) {
        next(error);
    }
});

// Lista 
router.get('/', async (req, res, next) => {
    try {
        await corController.listCoresPorPaleta(req, res);
    } catch (error) {
        next(error);
    }
});

// Busca por ID
router.get('/:id', async (req, res, next) => {
    try {
        await corController.findCorById(req, res);
    } catch (error) {
        next(error);
    }
});

// Atualiza 
router.put('/:id', async (req, res, next) => {
    try {
        await corController.updateCor(req, res);
    } catch (error) {
        next(error);
    }
});

export default router;
import { Router } from "express";
import { CorController } from "../controllers/CorController";
import { container } from "tsyringe";

const router = Router();
const corController = container.resolve(CorController);

// Criar cor
router.post('/', async (req, res, next) => {
    try {
        await corController.createCor(req, res);
    } catch (error) {
        next(error);
    }
});

// Listar cores
router.get('/', async (req, res, next) => {
    try {
        await corController.listCores(req, res);
    } catch (error) {
        next(error);
    }
});

// Buscar cor por ID
router.get('/:id', async (req, res, next) => {
    try {
        await corController.findCorById(req, res);
    } catch (error) {
        next(error);
    }
});

// Atualizar cor
router.put('/:id', async (req, res, next) => {
    try {
        await corController.updateCor(req, res);
    } catch (error) {
        next(error);
    }
});

// Deletar cor
router.delete('/:id', async (req, res, next) => {
    try {
        await corController.deleteCor(req, res);
    } catch (error) {
        next(error);
    }
});

export default router;
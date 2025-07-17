import { Router } from "express";
import { PinturaController } from "../controllers/PinturaController";
import { container } from "tsyringe";

const router = Router();
const pinturaController = container.resolve(PinturaController);

// Criar nova pintura
router.post('/', async (req, res, next) => {
    try {
        await pinturaController.createPintura(req, res);
    } catch (error) {
        next(error);
    }
});

// Deletar pintura
router.delete('/:id', async (req, res, next) => {
    try {
        await pinturaController.deletePintura(req, res);
    } catch (error) {
        next(error);
    }
});

// Listar todas as pinturas
router.get('/', async (req, res, next) => {
    try {
        await pinturaController.listPinturas(req, res);
    } catch (error) {
        next(error);
    }
});

// Buscar pintura por ID
router.get('/:id', async (req, res, next) => {
    try {
        await pinturaController.getPinturaById(req, res);
    } catch (error) {
        next(error);
    }
});

// Buscar SVG específico por tipo
router.get('/:id/svg/:tipo', async (req, res, next) => {
    try {
        await pinturaController.getSvgByTipo(req, res);
    } catch (error) {
        next(error);
    }
});

// Buscar todos os SVGs de uma pintura
router.get('/:id/svgs', async (req, res, next) => {
    try {
        await pinturaController.getAllSvgs(req, res);
    } catch (error) {
        next(error);
    }
});

// Atualizar SVG específico
router.put('/:id/svg/:tipo', async (req, res, next) => {
    try {
        await pinturaController.updateSvg(req, res);
    } catch (error) {
        next(error);
    }
});

export default router;
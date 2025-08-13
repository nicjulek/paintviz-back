import { Router } from "express";
import { PaletaController } from "../controllers/PaletaController";
import { container } from "tsyringe";

const router = Router();
const paletaController = container.resolve(PaletaController);

// Cria 
router.post('/', async (req, res, next) => {
    try {
        await paletaController.createPaleta(req, res);
    } catch (error) {
        next(error);
    }
});

// Deleta
router.delete('/:id', async (req, res, next) => {
    try {
        await paletaController.deletePaleta(req, res);
    } catch (error) {
        next(error);
    }
});

// Lista 
router.get('/', async (req, res, next) => {
    try {
        await paletaController.listPaletas(req, res);
    } catch (error) {
        next(error);
    }
});

// Busca por ID
router.get('/:id', async (req, res, next) => {
    try {
        await paletaController.findPaletaById(req, res);
    } catch (error) {
        next(error);
    }
});

// Atualiza 
router.put('/:id', async (req, res, next) => {
    try {
        await paletaController.updatePaleta(req, res);
    } catch (error) {
        next(error);
    }
});

export default router;
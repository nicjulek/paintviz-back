import { Router } from "express";
import { PaletaController } from "../controllers/PaletaController";
import { container } from "tsyringe";

const router = Router();
const paletaController = container.resolve(PaletaController);

// Criar paleta
router.post('/', async (req, res, next) => {
    try {
        await paletaController.createPaleta(req, res);
    } catch (error) {
        next(error);
    }
});

// Listar paletas
router.get('/', async (req, res, next) => {
    try {
        await paletaController.listPaletas(req, res);
    } catch (error) {
        next(error);
    }
});

// Buscar paleta por ID
router.get('/:id', async (req, res, next) => {
    try {
        await paletaController.findPaletaById(req, res);
    } catch (error) {
        next(error);
    }
});

// Atualizar paleta
router.put('/:id', async (req, res, next) => {
    try {
        await paletaController.updatePaleta(req, res);
    } catch (error) {
        next(error);
    }
});

// Deletar paleta
router.delete('/:id', async (req, res, next) => {
    try {
        await paletaController.deletePaleta(req, res);
    } catch (error) {
        next(error);
    }
});

// ===== ROTAS PARA GERENCIAR CORES DA PALETA =====

// Adicionar cor à paleta
router.post('/:id/cores', async (req, res, next) => {
    try {
        await paletaController.addCorToPaleta(req, res);
    } catch (error) {
        next(error);
    }
});

// Listar cores de uma paleta
router.get('/:id/cores', async (req, res, next) => {
    try {
        await paletaController.getCoresDaPaleta(req, res);
    } catch (error) {
        next(error);
    }
});

// Remover cor da paleta
router.delete('/:id/cores/:id_cor', async (req, res, next) => {
    try {
        await paletaController.removeCorFromPaleta(req, res);
    } catch (error) {
        next(error);
    }
});

export default router;
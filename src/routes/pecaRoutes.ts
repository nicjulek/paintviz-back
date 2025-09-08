import { Router } from "express";
import { PecaController } from "../controllers/PecaController";
import { container } from "tsyringe";

const router = Router();
const pecaController = container.resolve(PecaController);

// Cria 
router.post('/', async (req, res, next) => {
    try {
        await pecaController.createPeca(req, res);
    } catch (error) {
        next(error);
    }
});

// NOVO: Aplicar cor em uma peça específica
router.post('/:id_peca/aplicar-cor', async (req, res, next) => {
    try {
        await pecaController.aplicarCorNaPeca(req, res);
    } catch (error) {
        next(error);
    }
});

// NOVO: Aplicar múltiplas cores no SVG
router.post('/aplicar-multiplas-cores', async (req, res, next) => {
    try {
        await pecaController.aplicarMultiplasCores(req, res);
    } catch (error) {
        next(error);
    }
});

// Lista 
router.get('/', async (req, res, next) => {
    try {
        await pecaController.listPecas(req, res);
    } catch (error) {
        next(error);
    }
});

// Busca por ID
router.get('/:id', async (req, res, next) => {
    try {
        await pecaController.findPecaById(req, res);
    } catch (error) {
        next(error);
    }
});

// Atualiza 
router.put('/:id', async (req, res, next) => {
    try {
        await pecaController.updatePeca(req, res);
    } catch (error) {
        next(error);
    }
});

// Deleta
router.delete('/:id', async (req, res, next) => {
    try {
        await pecaController.deletePeca(req, res);
    } catch (error) {
        next(error);
    }
});

router.put('/:id_peca/cor', async (req, res, next) => {
    try {
        await pecaController.aplicarCorNaPeca(req, res);
    } catch (error) {
        next(error);
    }
});


export default router;
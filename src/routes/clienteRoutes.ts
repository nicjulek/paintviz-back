import { Router } from "express";
import { ClienteController } from "../controllers/ClienteController";
import { container } from "tsyringe";

const router = Router();
const clienteController = container.resolve(ClienteController);

// Cria cliente
router.post('/', async (req, res, next) => {
    try {
        await clienteController.createCliente(req, res);
    } catch (error) {
        next(error);
    }
});

// Deleta cliente
router.delete('/:id', async (req, res, next) => {
    try {
        await clienteController.deleteCliente(req, res);
    } catch (error) {
        next(error);
    }
});

// Lista cliente 
router.get('/', async (req, res, next) => {
    try {
        await clienteController.listClientes(req, res);
    } catch (error) {
        next(error);
    }
});

// Busca cliente por ID
router.get('/:id', async (req, res, next) => {
    try {
        await clienteController.findClienteById(req, res);
    } catch (error) {
        next(error);
    }
});

// Atualiza cliente
router.put('/:id', async (req, res, next) => {
    try {
        await clienteController.updateCliente(req, res);
    } catch (error) {
        next(error);
    }
});

export default router;
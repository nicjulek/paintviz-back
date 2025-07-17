import { Router } from "express";
import { UsuarioController } from "../controllers/UsuarioController";
import { container } from "tsyringe";

const router = Router();
const usuarioController = container.resolve(UsuarioController);

// Criar usuário
router.post('/', async (req, res, next) => {
    try {
        await usuarioController.createUsuario(req, res);
    } catch (error) {
        next(error);
    }
});

// Deletar usuário
router.delete('/:id', async (req, res, next) => {
    try {
        await usuarioController.deleteUsuario(req, res);
    } catch (error) {
        next(error);
    }
});

// Listar usuários
router.get('/', async (req, res, next) => {
    try {
        await usuarioController.listUsuarios(req, res);
    } catch (error) {
        next(error);
    }
});

// Buscar usuário por ID
router.get('/:id', async (req, res, next) => {
    try {
        await usuarioController.getUsuarioById(req, res);
    } catch (error) {
        next(error);
    }
});

// Atualizar usuário
router.put('/:id', async (req, res, next) => {
    try {
        await usuarioController.updateUsuario(req, res);
    } catch (error) {
        next(error);
    }
});

export default router;
import { Router } from "express";
import { AuthController } from "../controllers/AuthController";
import { container } from "tsyringe";
import { ValidMiddleware } from "../middleware/ValidMiddleware";
import { AuthMiddleware } from "../middleware/AuthMiddleware";
import * as yup from 'yup';

const router = Router();
const authController = container.resolve(AuthController);

// Validação para login
const loginSchema = yup.object({
    nome: yup.string()
        .required('Nome de usuário é obrigatório')
        .min(3, 'Nome deve ter pelo menos 3 caracteres'),
    senha: yup.string()
        .required('Senha é obrigatória')
        .min(6, 'Senha deve ter pelo menos 6 caracteres')
});

// Login
router.post('/login', ValidMiddleware(loginSchema), async (req, res, next) => {
    try {
        await authController.login(req, res);
    } catch (error) {
        next(error);
    }
});

// Logout
router.post('/logout', AuthMiddleware, async (req, res, next) => {
    try {
        await authController.logout(req, res);
    } catch (error) {
        next(error);
    }
});

export default router;
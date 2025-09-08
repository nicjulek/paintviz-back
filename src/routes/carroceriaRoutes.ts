import { Router } from "express";

const router = Router();


router.get('/:id/pecas', AuthMiddleware, async (req, res, next) => {
    try {
        // Você precisa implementar este método no CarroceriaController
        await carroceriaController.listPecasPorCarroceria(req, res);
    } catch (error) {
        next(error);
    }
});

export default router;
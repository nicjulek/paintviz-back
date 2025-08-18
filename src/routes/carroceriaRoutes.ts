import { Router } from "express";
import { CarroceriaController } from "../controllers/CarroceriaController";
import { CarroceriaRepository } from "../repositories/CarroceriaRepository";
import { AdminMiddleware, AuthMiddleware } from "../middleware/AuthMiddleware";
import { ValidMiddleware } from "../middleware/ValidMiddleware";
import { container } from "tsyringe";
import * as yup from 'yup';

const router = Router();
const carroceriaController = container.resolve(CarroceriaController);

const carroceriaSchema = yup.object({
    nome_modelo: yup.string()
        .required('Nome do modelo é obrigatório')
        .min(3, 'Nome deve ter pelo menos 3 caracteres'),
    lateral_svg: yup.string().nullable(),
    traseira_svg: yup.string().nullable(),
    diagonal_svg: yup.string().nullable()
});

// Criar carroceria
router.post('/', AuthMiddleware, AdminMiddleware, ValidMiddleware(carroceriaSchema),
    async (req, res, next) => {
        try {
            await carroceriaController.createCarroceria(req, res);
        } catch (error) {
            next(error);
        }
    }
);

// Aplica múltiplas cores no SVG da carroceria
router.post('/aplicar-cores', async (req, res, next) => {
    try {
        await carroceriaController.aplicarCoresNaCarroceria(req, res);
    } catch (error) {
        next(error);
    }
});

// Salvar SVG pintado da carroceria
router.put('/:id/salvar-svg/:tipo', async (req, res, next) => {
    try {
        const { id, tipo } = req.params;
        const { svg_pintado } = req.body;
        const repo = container.resolve(CarroceriaRepository);
        const ok = await repo.salvarSvgPintado(Number(id), tipo as 'lateral' | 'traseira' | 'diagonal', svg_pintado);
        if (ok) {
            res.status(200).json({ message: 'SVG pintado salvo com sucesso' });
        } else {
            res.status(500).json({ error: 'Erro ao salvar SVG pintado' });
        }
    } catch (error) {
        next(error);
    }
});

// Listar todas as carrocerias
router.get('/', AuthMiddleware,
    async (req, res, next) => {
        try {
            await carroceriaController.listCarrocerias(req, res);
        } catch (error) {
            next(error);
        }
    }
);

// Buscar carroceria por ID
router.get('/:id', AuthMiddleware,
    async (req, res, next) => {
        try {
            await carroceriaController.findById(req, res);
        } catch (error) {
            next(error);
        }
    }
);

// Buscar carroceria por nome
router.get('/nome/:nome_modelo', AuthMiddleware,
    async (req, res, next) => {
        try {
            await carroceriaController.findByNome(req, res);
        } catch (error) {
            next(error);
        }
    }
);

// Atualizar carroceria
router.put('/:id', AuthMiddleware, AdminMiddleware,
    async (req, res, next) => {
        try {
            await carroceriaController.updateCarroceria(req, res);
        } catch (error) {
            next(error);
        }
    }
);

// Deletar carroceria
router.delete('/:id', AuthMiddleware, AdminMiddleware,
    async (req, res, next) => {
        try {
            await carroceriaController.deleteCarroceria(req, res);
        } catch (error) {
            next(error);
        }
    }
);

export default router;
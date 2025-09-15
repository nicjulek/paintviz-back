    import { Router } from "express";
    import { OrdemDeServicoController } from "../controllers/OrdemDeServicoController";
    import { container } from "tsyringe";

    const router = Router();
    const ordemDeServicoController = container.resolve(OrdemDeServicoController);

    // Cria 
    router.post('/', async (req, res, next) => {
        try {
            await ordemDeServicoController.createOrdemDeServico(req, res);
        } catch (error) {
            next(error);
        }
    });

    // Deleta
    router.delete('/:id', async (req, res, next) => {
        try {
            await ordemDeServicoController.deleteOrdemDeServico(req, res);
        } catch (error) {
            next(error);
        }
    });

    // Lista 
    router.get('/', async (req, res, next) => {
        try {
            await ordemDeServicoController.listOrdemDeServico(req, res);
        } catch (error) {
            next(error);
        }
    });


    router.get('/cliente/:id_cliente', async (req, res, next) => {
        try {
            await ordemDeServicoController.findByCliente(req, res);
        } catch (error) {
            next(error);
        }
    });

    // Busca por ID
    router.get('/:id', async (req, res, next) => {
        try {
            await ordemDeServicoController.findById(req, res);
        } catch (error) {
            next(error);
        }
    });


    // Atualiza 
    router.put('/:id', async (req, res, next) => {
        try {
            await ordemDeServicoController.updateOrdemDeServico(req, res);
        } catch (error) {
            next(error);
        }
    });

    // Alterar status
    router.patch('/:id/status', async (req, res, next) => {
        try {
            await ordemDeServicoController.alterarStatus(req, res);
        } catch (error) {
            next(error);
        }
    });

    // Alterar prioridade (apenas data_entrega)
    router.patch('/:id/prioridade', async (req, res, next) => {
        try {
            await ordemDeServicoController.alterarPrioridade(req, res);
        } catch (error) {
            next(error);
        }
    });

    export default router;
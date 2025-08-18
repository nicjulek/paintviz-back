import { Request, Response } from "express";
import { OrdemDeServicoRepository } from "repositories/OrdemDeServicoRepository";
import { inject, injectable } from "tsyringe";

@injectable()
export class OrdemDeServicoController {
constructor(
        @inject('OrdemDeServicoRepository')
        private ordemDeServicoRepository: OrdemDeServicoRepository
    ) {}

    async createOrdemDeServico(req: Request, res: Response){
        try {
            const { identificacao_veiculo, data_emissao, data_entrega, data_programada, modelo_veiculo, placa_veiculo, numero_box, id_cliente, id_usuario_responsavel, id_status, id_pintura, data_ultima_modificacao } = req.body;

            if (!data_emissao || !modelo_veiculo || !id_cliente || !id_usuario_responsavel || !id_status || !id_pintura || !data_ultima_modificacao) {
                return res.status(400).json({
                    error: 'data_emissao, modelo_veiculo, id_cliente, id_usuario_responsavel, id_status, id_pintura, data_ultima_modificacao são obrigatórios.'
                });
            }

            const novaOrdem = await this.ordemDeServicoRepository.createOrdemDeServico({
                identificacao_veiculo,
                data_emissao,
                data_entrega,
                data_programada,
                modelo_veiculo,
                placa_veiculo,
                numero_box,
                id_cliente: Number(id_cliente),
                id_usuario_responsavel: Number(id_usuario_responsavel),
                id_status: Number(id_status),
                id_pintura: Number(id_pintura),
                data_ultima_modificacao,
            });

            return res.status(201).json(novaOrdem);
        } catch (error) {
            console.error("Erro no controller ao criar ordem de serviço:", error);
            return res.status(500).json({ error: 'Erro ao criar ordem de serviço.' });
        }

    }

    async deleteOrdemDeServico(req: Request, res: Response){
        try {
            const id = parseInt(req.params.id);
            await this.ordemDeServicoRepository.deleteOrdemDeServico(id);
            return res.status(204).send();
        } catch (error) {
            console.error("Erro no controller ao deletar ordem de serviço:", error);
            return res.status(500).json({ error: "Erro ao deletar ordem de serviço" });
        }

    }

    async listOrdemDeServico(req: Request, res: Response){
        try {
            const ordens = await this.ordemDeServicoRepository.listOrdemDeServico();
            return res.status(200).json(ordens);
        } catch (error) {
            console.log('Erro ao listar ordens de serviço:', error);
            return res.status(500).json({ error: 'Erro interno do servidor' });
        }
    }

    async findById(req: Request, res: Response){
        try {
            const id = parseInt(req.params.id);
            const ordem = await this.ordemDeServicoRepository.findById(id);

            if (!ordem) {
                return res.status(404).json({ error: "Ordem de serviço não encontrada" });
            }

            return res.status(200).json(ordem);
        } catch (error) {
            console.error("Erro no controller ao buscar ordem de serviço por ID:", error);
            return res.status(500).json({ error: "Erro ao buscar ordem de serviço" });
        }

    }

    async findByCliente(req: Request, res: Response){
        try {
            const id_cliente = parseInt(req.params.id_cliente);
            const ordem = await this.ordemDeServicoRepository.findByCliente(id_cliente);

            if (!ordem) {
                return res.status(404).json({ error: "Ordem de serviço não encontrada" });
            }

            return res.status(200).json(ordem);
        } catch (error) {
            console.error("Erro no controller ao buscar ordem de serviço por cliente:", error);
            return res.status(500).json({ error: "Erro ao buscar ordem de serviço" });
        }
    }

    async updateOrdemDeServico(req: Request, res: Response){
        try {
            const id = parseInt(req.params.id);
            const dadosAtualizados = req.body;

            const ordemAtualizada = await this.ordemDeServicoRepository.updateOrdemDeServico(id, dadosAtualizados);

            if (!ordemAtualizada) {
                return res.status(404).json({ error: "Ordem não encontrada para atualização" });
            }

            return res.status(200).json(ordemAtualizada);
        } catch (error) {
            console.error("Erro no controller ao atualizar ordem de serviço:", error);
            return res.status(500).json({ error: "Erro ao atualizar ordem" });
        }

    }
}
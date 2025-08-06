import { Request, Response } from "express";
import { PecaRepository } from "repositories/PecaRepository";
import { inject, injectable } from "tsyringe";

@injectable()
export class PecaController {
    constructor(
        @inject('PecaRepository')
        private pecaRepository: PecaRepository
    ) {}

    async createPeca(req: Request, res: Response): Promise<Response> {
        try {
            const { nome_peca, id_svg, id_carroceria } = req.body;

            if (!nome_peca || !id_svg || !id_carroceria) {
                return res.status(400).json({
                    error: 'nome_peca, id_svg e id_carroceria são obrigatórios.'
                });
            }

            const novaPeca = await this.pecaRepository.createPeca({
                nome_peca,
                id_svg,
                id_carroceria,
                id_pintura: null,
                id_cor: null
            });

            return res.status(201).json(novaPeca);
        } catch (error) {
            console.error("Erro ao criar peça:", error);
            return res.status(500).json({ error: 'Erro ao criar peça.' });
        }
    }

    async deletePeca(req: Request, res: Response) {
        try {
            const id = parseInt(req.params.id);
            await this.pecaRepository.deletePeca(id);
            return res.status(204).send(); // No Content
        } catch (error) {
            console.error("Erro no controller ao deletar peça:", error);
            return res.status(500).json({ error: "Erro ao deletar peça" });
        }
    }


    async listPecas(req: Request, res: Response) {
        try {
            const id_carroceria = parseInt(req.query.id_carroceria as string);
            if (isNaN(id_carroceria)) {
                return res.status(400).json({ error: "id_carroceria é obrigatório" });
            }

            const pecas = await this.pecaRepository.listPecasPorModelo(id_carroceria);
            return res.status(200).json(pecas);
        } catch (error) {
            console.error("Erro no controller ao listar peças:", error);
            return res.status(500).json({ error: "Erro ao listar peças" });
        }
    }


    async findPecaById(req: Request, res: Response) {
        try {
            const id = parseInt(req.params.id);
            const peca = await this.pecaRepository.findPecaById(id);

            if (!peca) {
                return res.status(404).json({ error: "Peça não encontrada" });
            }

            return res.status(200).json(peca);
        } catch (error) {
            console.error("Erro no controller ao buscar peça por ID:", error);
            return res.status(500).json({ error: "Erro ao buscar peça" });
        }
    }


    async updatePeca(req: Request, res: Response) {
        try {
            const id = parseInt(req.params.id);
            const dadosAtualizados = req.body;

            const pecaAtualizada = await this.pecaRepository.updatePeca(id, dadosAtualizados);

            if (!pecaAtualizada) {
                return res.status(404).json({ error: "Peça não encontrada para atualização" });
            }

            return res.status(200).json(pecaAtualizada);
        } catch (error) {
            console.error("Erro no controller ao atualizar peça:", error);
            return res.status(500).json({ error: "Erro ao atualizar peça" });
        }
    }

}
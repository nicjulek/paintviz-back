import { Request, Response } from "express";
import { CorRepository } from "repositories/CorRepository";
import { inject, injectable } from "tsyringe";

@injectable()
export class CorController {
    constructor(
        @inject('CorRepository')
        private corRepository: CorRepository
    ) {}

    async createCor(req: Request, res: Response){
        try {
            const { nome_cor, cod_cor, id_paleta } = req.body;

            if (!nome_cor || !cod_cor) {
                return res.status(400).json({
                    error: 'nome e código da cor são obrigatórios.'
                });
            }

            const novaCor = await this.corRepository.createCor({
                nome_cor,
                cod_cor,
                id_paleta,
            });

            return res.status(201).json(novaCor);
        } catch (error) {
            console.error("Erro ao criar cor:", error);
            return res.status(500).json({ error: 'Erro ao criar cor.' });
        }
    }

    async deleteCor(req: Request, res: Response){
        try {
            const id = parseInt(req.params.id);
            await this.corRepository.deleteCor(id);
            return res.status(204).send(); // No Content
        } catch (error) {
            console.error("Erro no controller ao deletar cor:", error);
            return res.status(500).json({ error: "Erro ao deletar cor" });
        }
    }

    async listCoresPorPaleta(req: Request, res: Response){
        try {
            const id_paleta = parseInt(req.query.id_paleta as string);
            if (isNaN(id_paleta)) {
                return res.status(400).json({ error: "id_paleta é obrigatório" });
            }

            const cores = await this.corRepository.listCoresPorPaleta(id_paleta);
            return res.status(200).json(cores);
        } catch (error) {
            console.error("Erro no controller ao listar cores:", error);
            return res.status(500).json({ error: "Erro ao listar cores" });
        }
    }

    async findCorById(req: Request, res: Response){
        try {
            const id = parseInt(req.params.id);
            const cor = await this.corRepository.findCorById(id);

            if (!cor) {
                return res.status(404).json({ error: "Peça não encontrada" });
            }

            return res.status(200).json(cor);
        } catch (error) {
            console.error("Erro no controller ao buscar cor por ID:", error);
            return res.status(500).json({ error: "Erro ao buscar cor" });
        }
    }

    async updateCor(req: Request, res: Response){
        try {
            const id = parseInt(req.params.id);
            const dadosAtualizados = req.body;

            const corAtualizada = await this.corRepository.updateCor(id, dadosAtualizados);

            if (!corAtualizada) {
                return res.status(404).json({ error: "Cor não encontrada para atualização" });
            }

            return res.status(200).json(corAtualizada);
        } catch (error) {
            console.error("Erro no controller ao atualizar cor:", error);
            return res.status(500).json({ error: "Erro ao atualizar cor" });
        }
    }
}


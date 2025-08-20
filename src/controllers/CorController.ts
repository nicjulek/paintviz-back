import { Request, Response } from "express";
import { CorRepository } from "../repositories/CorRepository";
import { inject, injectable } from "tsyringe";

@injectable()
export class CorController {
    constructor(
        @inject('CorRepository')
        private corRepository: CorRepository
    ) {}

    async createCor(req: Request, res: Response): Promise<Response> {
        try {
            const { nome_cor, cod_cor } = req.body;

            if (!nome_cor || !cod_cor) {
                return res.status(400).json({
                    error: 'Nome e código da cor são obrigatórios.'
                });
            }

            // Validar formato hex
            const hexRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
            if (!hexRegex.test(cod_cor.trim())) {
                return res.status(400).json({
                    error: 'Código da cor deve estar no formato hex (#FFFFFF ou #FFF).'
                });
            }

            const novaCor = await this.corRepository.createCor({
                nome_cor: nome_cor.trim(),
                cod_cor: cod_cor.trim().toUpperCase()
            });

            return res.status(201).json({
                message: 'Cor criada com sucesso',
                cor: novaCor
            });
        } catch (error) {
            console.error("Erro ao criar cor:", error);
            return res.status(500).json({ error: 'Erro ao criar cor.' });
        }
    }

    async listCores(req: Request, res: Response): Promise<Response> {
        try {
            const cores = await this.corRepository.listCores();
            return res.status(200).json(cores);
        } catch (error) {
            console.error("Erro ao listar cores:", error);
            return res.status(500).json({ error: "Erro ao listar cores" });
        }
    }

    async findCorById(req: Request, res: Response): Promise<Response> {
        try {
            const id = parseInt(req.params.id);
            
            if (isNaN(id)) {
                return res.status(400).json({ error: "ID inválido" });
            }

            const cor = await this.corRepository.findCorById(id);

            if (!cor) {
                return res.status(404).json({ error: "Cor não encontrada" });
            }

            return res.status(200).json(cor);
        } catch (error) {
            console.error("Erro ao buscar cor por ID:", error);
            return res.status(500).json({ error: "Erro ao buscar cor" });
        }
    }

    async updateCor(req: Request, res: Response): Promise<Response> {
        try {
            const id = parseInt(req.params.id);
            const { nome_cor, cod_cor } = req.body;

            if (isNaN(id)) {
                return res.status(400).json({ error: "ID inválido" });
            }

            if (!nome_cor || !cod_cor) {
                return res.status(400).json({
                    error: 'Nome e código da cor são obrigatórios.'
                });
            }

            // Validar formato hex
            const hexRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
            if (!hexRegex.test(cod_cor.trim())) {
                return res.status(400).json({
                    error: 'Código da cor deve estar no formato hex (#FFFFFF ou #FFF).'
                });
            }

            const corAtualizada = await this.corRepository.updateCor(id, {
                nome_cor: nome_cor.trim(),
                cod_cor: cod_cor.trim().toUpperCase()
            });

            if (!corAtualizada) {
                return res.status(404).json({ error: "Cor não encontrada para atualização" });
            }

            return res.status(200).json({
                message: 'Cor atualizada com sucesso',
                cor: corAtualizada
            });
        } catch (error) {
            console.error("Erro ao atualizar cor:", error);
            return res.status(500).json({ error: "Erro ao atualizar cor" });
        }
    }

    async deleteCor(req: Request, res: Response): Promise<Response> {
        try {
            const id = parseInt(req.params.id);

            if (isNaN(id)) {
                return res.status(400).json({ error: "ID inválido" });
            }

            const cor = await this.corRepository.findCorById(id);
            if (!cor) {
                return res.status(404).json({ error: "Cor não encontrada" });
            }

            await this.corRepository.deleteCor(id);
            return res.status(200).json({ 
                message: 'Cor deletada com sucesso' 
            });
        } catch (error) {
            console.error("Erro ao deletar cor:", error);
            return res.status(500).json({ error: "Erro ao deletar cor" });
        }
    }
}
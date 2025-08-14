import { Request, Response } from "express";
import { PaletaRepository } from "repositories/PaletaRepository";
import { inject, injectable } from "tsyringe";

@injectable()
export class PaletaController {
    constructor(
        @inject('PaletaRepository')
        private paletaRepository: PaletaRepository
    ) {}

    async createPaleta(req: Request, res: Response): Promise<Response>{
        try {
            const { nome_paleta } = req.body;

            if (!nome_paleta) {
                return res.status(400).json({
                    error: 'Nome para a paleta é obrigatório.'
                });
            }
            const novaPaleta = await this.paletaRepository.createPaleta({
                nome_paleta
            });

            return res.status(201).json(novaPaleta);
        } catch(error){
            console.error("Erro ao criar paleta:", error);
            return res.status(500).json({ error: 'Erro ao criar paleta.' });

        }
    }

    async deletePaleta(req: Request, res: Response){
        try {
            const id = parseInt(req.params.id);
            await this.paletaRepository.deletePaleta(id);
            return res.status(204).send(); 
        } catch (error) {
            console.error("Erro no controller ao deletar paleta:", error);
            return res.status(500).json({ error: "Erro ao deletar paleta" });
        }
    }

    async listPaletas(req: Request, res: Response){
        try {
            const paletas = await this.paletaRepository.listPaletas();
            return res.status(200).json(paletas);
        } catch (error) {
            console.error('Erro no controller ao listar paletas:', error);
            return res.status(500).json({ error: 'Erro ao listar paletas' });
        }
    }

    async findPaletaById(req: Request, res: Response){
        try {
            const id = parseInt(req.params.id);
            const paleta = await this.paletaRepository.findPaletaById(id);

            if (!paleta) {
                return res.status(404).json({ error: "Paleta não encontrada" });
            }

            return res.status(200).json(paleta);
        } catch (error) {
            console.error("Erro no controller ao buscar paleta por ID:", error);
            return res.status(500).json({ error: "Erro ao buscar paleta" });
        }

    }

    async updatePaleta(req: Request, res: Response){
        try {
            const id = parseInt(req.params.id);
            const dadosAtualizados = req.body;

            const paletaAtualizada = await this.paletaRepository.updatePaleta(id, dadosAtualizados);

            if (!paletaAtualizada) {
                return res.status(404).json({ error: "Paleta não encontrada para atualização" });
            }

            return res.status(200).json(paletaAtualizada);
        } catch (error) {
            console.error("Erro no controller ao atualizar paleta:", error);
            return res.status(500).json({ error: "Erro ao atualizar paleta" });
        }

    }
}
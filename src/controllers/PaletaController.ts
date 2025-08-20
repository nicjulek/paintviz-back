import { Request, Response } from "express";
import { PaletaRepository } from "../repositories/PaletaRepository";
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

            if (!nome_paleta || nome_paleta.trim().length === 0) {
                return res.status(400).json({
                    error: 'Nome para a paleta é obrigatório.'
                });
            }
            
            const novaPaleta = await this.paletaRepository.createPaleta({
                nome_paleta: nome_paleta.trim()
            });

            return res.status(201).json({
                message: 'Paleta criada com sucesso',
                paleta: novaPaleta
            });
        } catch(error){
            console.error("Erro ao criar paleta:", error);
            return res.status(500).json({ error: 'Erro ao criar paleta.' });
        }
    }

    async deletePaleta(req: Request, res: Response): Promise<Response>{
        try {
            const id = parseInt(req.params.id);
            
            if (isNaN(id)) {
                return res.status(400).json({ error: "ID inválido" });
            }

            // Verificar se paleta existe
            const paleta = await this.paletaRepository.findPaletaById(id);
            if (!paleta) {
                return res.status(404).json({ error: "Paleta não encontrada" });
            }

            await this.paletaRepository.deletePaleta(id);
            return res.status(200).json({ 
                message: 'Paleta deletada com sucesso' 
            }); 
        } catch (error) {
            console.error("Erro no controller ao deletar paleta:", error);
            return res.status(500).json({ error: "Erro ao deletar paleta" });
        }
    }

    async listPaletas(req: Request, res: Response): Promise<Response>{
        try {
            const paletas = await this.paletaRepository.listPaletas();
            return res.status(200).json(paletas);
        } catch (error) {
            console.error('Erro no controller ao listar paletas:', error);
            return res.status(500).json({ error: 'Erro ao listar paletas' });
        }
    }

    async findPaletaById(req: Request, res: Response): Promise<Response>{
        try {
            const id = parseInt(req.params.id);
            
            if (isNaN(id)) {
                return res.status(400).json({ error: "ID inválido" });
            }

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

    async updatePaleta(req: Request, res: Response): Promise<Response>{
        try {
            const id = parseInt(req.params.id);
            const { nome_paleta } = req.body;

            if (isNaN(id)) {
                return res.status(400).json({ error: "ID inválido" });
            }

            if (!nome_paleta || nome_paleta.trim().length === 0) {
                return res.status(400).json({
                    error: 'Nome para a paleta é obrigatório.'
                });
            }

            const paletaAtualizada = await this.paletaRepository.updatePaleta(id, {
                nome_paleta: nome_paleta.trim()
            });

            if (!paletaAtualizada) {
                return res.status(404).json({ error: "Paleta não encontrada para atualização" });
            }

            return res.status(200).json({
                message: 'Paleta atualizada com sucesso',
                paleta: paletaAtualizada
            });
        } catch (error) {
            console.error("Erro no controller ao atualizar paleta:", error);
            return res.status(500).json({ error: "Erro ao atualizar paleta" });
        }
    }

    // Adicionar cor à paleta
    async addCorToPaleta(req: Request, res: Response): Promise<Response> {
        try {
            const id_paleta = parseInt(req.params.id);
            const { id_cor } = req.body;

            if (isNaN(id_paleta) || isNaN(parseInt(id_cor))) {
                return res.status(400).json({ error: "IDs inválidos" });
            }

            // Verificar se paleta existe
            const paleta = await this.paletaRepository.findPaletaById(id_paleta);
            if (!paleta) {
                return res.status(404).json({ error: "Paleta não encontrada" });
            }

            await this.paletaRepository.addCorToPaleta(id_paleta, parseInt(id_cor));
            
            return res.status(201).json({
                message: 'Cor adicionada à paleta com sucesso',
                id_paleta,
                id_cor: parseInt(id_cor)
            });
        } catch (error) {
            console.error("Erro ao adicionar cor à paleta:", error);
            return res.status(500).json({ error: "Erro ao adicionar cor à paleta" });
        }
    }

    // Remover cor da paleta
    async removeCorFromPaleta(req: Request, res: Response): Promise<Response> {
        try {
            const id_paleta = parseInt(req.params.id);
            const id_cor = parseInt(req.params.id_cor);

            if (isNaN(id_paleta) || isNaN(id_cor)) {
                return res.status(400).json({ error: "IDs inválidos" });
            }

            await this.paletaRepository.removeCorFromPaleta(id_paleta, id_cor);
            
            return res.status(200).json({
                message: 'Cor removida da paleta com sucesso'
            });
        } catch (error) {
            console.error("Erro ao remover cor da paleta:", error);
            return res.status(500).json({ error: "Erro ao remover cor da paleta" });
        }
    }

    // Listar cores de uma paleta
    async getCoresDaPaleta(req: Request, res: Response): Promise<Response> {
        try {
            const id_paleta = parseInt(req.params.id);

            if (isNaN(id_paleta)) {
                return res.status(400).json({ error: "ID inválido" });
            }

            const cores = await this.paletaRepository.getCoresDaPaleta(id_paleta);
            
            return res.status(200).json(cores);
        } catch (error) {
            console.error("Erro ao buscar cores da paleta:", error);
            return res.status(500).json({ error: "Erro ao buscar cores da paleta" });
        }
    }
}
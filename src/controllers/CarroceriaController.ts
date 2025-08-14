import { Request, Response } from "express";
import { inject, injectable } from "tsyringe";
import { CarroceriaRepository } from "../repositories/CarroceriaRepository";
import { dbConnection } from "config/database";
import { AuthRequest } from "models";

@injectable()
export class CarroceriaController {
    constructor(
        @inject('CarroceriaRepository')
        private carroceriaRepository: CarroceriaRepository
    ) {}

    async createCarroceria(req: AuthRequest, res: Response) {
        try {
            const { nome_modelo, lateral_svg, traseira_svg, diagonal_svg } = req.body;

            if (!nome_modelo || nome_modelo.trim().length === 0) {
                return res.status(400).json({ error: 'Nome do modelo é obrigatório' });
            }

            const carroceriaExistente = await this.carroceriaRepository.findByNome(nome_modelo);
            if (carroceriaExistente) {
                return res.status(400).json({ error: 'Carroceria já existe' });
            }

            const novaCarroceria = await this.carroceriaRepository.createCarroceria({
                nome_modelo: nome_modelo.trim(),
                lateral_svg: lateral_svg || null,
                traseira_svg: traseira_svg || null,
                diagonal_svg: diagonal_svg || null
            });

            return res.status(201).json({
                message: 'Carroceria criada com sucesso',
                carroceria: novaCarroceria
            });
        } catch (error) {
            console.error('Erro ao criar carroceria:', error);
            return res.status(500).json({
                error: 'Erro interno do servidor'
            });
        }
    }

    async deleteCarroceria(req: Request, res: Response) {
        try {
            const { id } = req.params;

            if (!id) {
                return res.status(400).json({ error: 'ID da carroceria é obrigatório' });
            }

            await this.carroceriaRepository.deleteCarroceria(Number(id));

            return res.status(200).json({ 
                message: 'Carroceria deletada com sucesso' 
            });
        } catch (error) {
            console.log('Erro ao deletar carroceria:', error);
            return res.status(500).json({ error: 'Erro interno do servidor' });
        }
    }

    async updateCarroceria(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const { nome_modelo, lateral_svg, traseira_svg, diagonal_svg } = req.body;

            if (!id) {
                return res.status(400).json({ error: 'ID da carroceria é obrigatório' });
            }

            // Verifica se existe
            const carroceriaExistente = await this.carroceriaRepository.findById(Number(id));
            if (!carroceriaExistente) {
                return res.status(404).json({ error: 'Carroceria não encontrada' });
            }

            // Atualiza
            const sucesso = await this.carroceriaRepository.updateCarroceria(Number(id), {
                nome_modelo: nome_modelo?.trim(),
                lateral_svg,
                traseira_svg,
                diagonal_svg
            });

            if (!sucesso) {
                return res.status(500).json({ error: 'Falha ao atualizar a carroceria' });
            }

            return res.status(200).json({ message: 'Carroceria atualizada com sucesso' });

        } catch (error) {
            console.error('Erro ao atualizar carroceria:', error);
            return res.status(500).json({ error: 'Erro interno do servidor' });
        }
    }


    async findById(req: Request, res: Response){
        try {
            const { id } = req.params;

            if (!id) {
                return res.status(400).json({ error: 'ID do cliente é obrigatório' });
            }

            const carroceria = await this.carroceriaRepository.findById(Number(id));

            if (!carroceria) {
                return res.status(404).json({ error: 'Carroceria não encontrada' });
            }

            return res.status(200).json(carroceria);
        } catch (error) {
            console.log('Erro ao buscar carroceria:', error);
            return res.status(500).json({ error: 'Erro interno do servidor' });
        }
    }

    async findByNome(req: Request, res: Response){
        try {
            const { nome_modelo } = req.params;

            if (!nome_modelo) {
                return res.status(400).json({ error: 'Nome do modelo é obrigatório' });
            }

            const carroceria = await this.carroceriaRepository.findByNome(String(nome_modelo));

            if (!carroceria) {
                return res.status(404).json({ error: 'Carroceria não encontrada' });
            }

            return res.status(200).json(carroceria);
        } catch (error) {
            console.log('Erro ao buscar carroceria:', error);
            return res.status(500).json({ error: 'Erro interno do servidor' });
        }
    }

    async listCarrocerias(req: Request, res: Response) {
        try {
            const carrocerias = await this.carroceriaRepository.listCarrocerias();
            return res.status(200).json(carrocerias);
        } catch (error) {
            console.log('Erro ao listar carrocerias:', error);
            return res.status(500).json({ error: 'Erro interno do servidor' });
        }
    }
}

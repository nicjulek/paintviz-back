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
}

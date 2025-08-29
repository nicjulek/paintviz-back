import { Request, Response } from "express";
import { StatusRepository } from "../repositories/StatusRepository";
import { inject, injectable } from "tsyringe";

@injectable()
export class StatusController {
    constructor(
        @inject('StatusRepository')
        private statusRepository: StatusRepository
    ) { }

    async findById(req: Request, res: Response){
        try {
            const id = parseInt(req.params.id);
            const status = await this.statusRepository.findById(id);

            if (!status) {
                return res.status(404).json({ error: "Status não encontrado" });
            }

            return res.status(200).json(status);
        } catch (error) {
            console.error("Erro no controller ao buscar status por ID:", error);
            return res.status(500).json({ error: "Erro ao buscar status" });
        }

    }

    async listStatus(req: Request, res: Response){
        try {
            const status = await this.statusRepository.listStatus();
            return res.status(200).json(status);
        } catch (error) {
            console.log('Erro ao listar status:', error);
            return res.status(500).json({ error: 'Erro interno do servidor' });
        }
    }
}
import { Request, Response } from "express";
import { StatusRepository } from "repositories/StatusRepository";
import { inject, injectable } from "tsyringe";

@injectable()
export class StatusController {
    constructor(
        @inject('StatusRepository')
        private statusRepository: StatusRepository
    ) { }

    async createStatus(req: Request, res: Response) {
        try {
            const { descricao, data_definicao_status } = req.body;
            if (!descricao || !data_definicao_status) {
                return res.status(400).json({ error: "descricao e data_definicao_status são obrigatórios" });
            }
            const novoStatus = await this.statusRepository.createStatus({ descricao, data_definicao_status });
            return res.status(201).json(novoStatus);
        } catch (error) {
            console.error("Erro ao criar status:", error);
            return res.status(500).json({ error: "Erro ao criar status" });
        }
    }

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
            console.error("Erro ao listar status:", error);
            return res.status(500).json({ error: "Erro ao listar status" });
        }
    }
}
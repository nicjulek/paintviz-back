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
        try{

        } catch(error){

        }
    }

    async deleteOrdemDeServico(req: Request, res: Response){
        try{

        } catch(error){
            
        }
    }

    async listOrdemDeServico(req: Request, res: Response){
        try{

        } catch(error){
            
        }
    }

    async findById(req: Request, res: Response){
        try{

        } catch(error){
            
        }
    }

    async findByCliente(req: Request, res: Response){
        try{

        } catch(error){
            
        }
    }

    async updateOrdemDeServico(req: Request, res: Response){
        try{

        } catch(error){
            
        }
    }
}
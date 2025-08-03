import { Request, Response } from "express";
import { PecaRepository } from "repositories/PecaRepository";
import { inject, injectable } from "tsyringe";

@injectable()
export class PecaController {
    constructor(
        @inject('PecaRepository')
        private pecaRepository: PecaRepository
    ) {}

    async createPeca(req: Request, res: Response){
        try{

        } catch(error){

        }
    }

    async deletePeca(req: Request, res: Response){
        try{

        } catch(error){
            
        }
    }

    async listPecas(req: Request, res: Response){
        try{

        } catch(error){
            
        }
    }

    async findPecaById(req: Request, res: Response){
        try{

        } catch(error){
            
        }
    }

    async updatePeca(req: Request, res: Response){
        try{

        } catch(error){
            
        }
    }
}
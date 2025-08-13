import { Request, Response } from "express";
import { PaletaRepository } from "repositories/PaletaRepository";
import { inject, injectable } from "tsyringe";

@injectable()
export class PaletaController {
    constructor(
        @inject('PecaRepository')
        private pecaRepository: PaletaRepository
    ) {}

    async createPaleta(req: Request, res: Response): Promise<Response>{
        try{
            return;
        } catch(error){

        }
    }

    async deletePaleta(req: Request, res: Response){
        try{
            return;
        } catch(error){

        }
    }

    async listPaletas(req: Request, res: Response){
        try{
            return;
        } catch(error){

        }
    }

    async findPaletaById(req: Request, res: Response){
        try{
            return;
        } catch(error){

        }
    }

    async updatePaleta(req: Request, res: Response){
        try{
            return;
        } catch(error){

        }
    }
}
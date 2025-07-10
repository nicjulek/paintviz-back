import { Request, Response } from "express";
import { PinturaRepository } from "repositories/PinturaRepository";
import { inject, injectable } from "tsyringe";

@injectable()
export class PinturaController {
  constructor(
    @inject('PinturaRepository') 
    private pinturaRepository: PinturaRepository
  ) {}

  async listPinturas(req: Request, res: Response) {
    try {
      const pinturas = await this.pinturaRepository.listPinturas();
      return res.json(pinturas).status(200);
    } catch (error) {
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  }
}

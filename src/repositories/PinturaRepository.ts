import { injectable } from "tsyringe";
import { Pintura } from "../models/Pintura";

@injectable()
export class PinturaRepository {
  pinturas: Pintura[] = [];

  async listPinturas(): Promise<Pintura[]> {
    return this.pinturas;
  }

  async createPintura(pintura: Pintura): Promise<Pintura> {
    this.pinturas.push(pintura);
    return pintura;
  }
}
import { PinturaRepository } from "../repositories/PinturaRepository";
import { container } from "tsyringe";

container.registerSingleton('PinturaRepository', PinturaRepository)

export { container }
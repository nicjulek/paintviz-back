import { container } from "tsyringe";
import { PinturaRepository } from "../repositories/PinturaRepository";

container.registerSingleton('PinturaRepository', PinturaRepository)

export { container }
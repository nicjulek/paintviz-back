import { container } from "tsyringe";
import { PinturaRepository } from "../repositories/PinturaRepository";
import { UsuarioRepository } from "../repositories/UsuarioRepository";

container.registerSingleton('PinturaRepository', PinturaRepository)
container.registerSingleton('UsuarioRepository', UsuarioRepository);

export { container }
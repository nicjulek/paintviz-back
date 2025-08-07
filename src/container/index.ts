import { container } from "tsyringe";
import { PinturaRepository } from "../repositories/PinturaRepository";
import { UsuarioRepository } from "../repositories/UsuarioRepository";
import { ClienteRepository } from "../repositories/ClienteRepository";
import { CarroceriaRepository } from "../repositories/CarroceriaRepository";

container.registerSingleton('PinturaRepository', PinturaRepository);
container.registerSingleton('ClienteRepository', ClienteRepository);
container.registerSingleton('UsuarioRepository', UsuarioRepository);
container.registerSingleton('CarroceriaRepository', CarroceriaRepository);

export { container }
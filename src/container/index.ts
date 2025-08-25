import { container } from "tsyringe";
import { PinturaRepository } from "../repositories/PinturaRepository";
import { UsuarioRepository } from "../repositories/UsuarioRepository";
import { ClienteRepository } from "../repositories/ClienteRepository";
import { OrdemDeServicoRepository } from "../repositories/OrdemDeServicoRepository";
import { StatusRepository } from "../repositories/StatusRepository";

container.registerSingleton('PinturaRepository', PinturaRepository);
container.registerSingleton('ClienteRepository', ClienteRepository);
container.registerSingleton('UsuarioRepository', UsuarioRepository);
container.registerSingleton('OrdemDeServicoRepository', OrdemDeServicoRepository);
container.registerSingleton('StatusRepository', StatusRepository);

export { container }
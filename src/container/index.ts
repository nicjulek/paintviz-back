import { container } from "tsyringe";
import { PinturaRepository } from "../repositories/PinturaRepository";
import { UsuarioRepository } from "../repositories/UsuarioRepository";
import { ClienteRepository } from "../repositories/ClienteRepository";
import { CarroceriaRepository } from "../repositories/CarroceriaRepository";
import { PecaRepository } from "../repositories/PecaRepository";
import { CorRepository } from "../repositories/CorRepository";
import { PaletaRepository } from "../repositories/PaletaRepository";
import { OrdemDeServicoRepository } from "../repositories/OrdemDeServicoRepository";   
import { StatusRepository } from "../repositories/StatusRepository";

container.registerSingleton('PinturaRepository', PinturaRepository);
container.registerSingleton('ClienteRepository', ClienteRepository);
container.registerSingleton('UsuarioRepository', UsuarioRepository);
container.registerSingleton('CarroceriaRepository', CarroceriaRepository);
container.registerSingleton('PecaRepository', PecaRepository);
container.registerSingleton('CorRepository', CorRepository);
container.registerSingleton('PaletaRepository', PaletaRepository);
container.registerSingleton('OrdemDeServicoRepository', OrdemDeServicoRepository);
container.registerSingleton('StatusRepository', StatusRepository);

export { container }
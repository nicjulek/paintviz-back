import { Router } from "express";
import authRoutes from './authRoutes';
import usuarioRoutes from './usuarioRoutes';
import clienteRoutes from './clienteRoutes';
import paletaRoutes from './paletaRoutes';
import pinturaRoutes from './pinturaRoutes';
import carroceriaRoutes from './carroceriaRoutes';
import pecaRoutes from './pecaRoutes';
import ordemServicoRoutes from './ordemServicoRoutes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/usuarios', usuarioRoutes);
router.use('/clientes', clienteRoutes);
router.use('/paletas', paletaRoutes);
router.use('/pinturas', pinturaRoutes);
router.use('/carrocerias', carroceriaRoutes);
router.use('/pecas', pecaRoutes);
router.use('/ordens-servico', ordemServicoRoutes);

export default router;
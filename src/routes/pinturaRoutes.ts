import { Router } from "express";
import { PinturaController } from "../controllers/PinturaController";
import { container } from "tsyringe";

const router = Router()
const pinturaController = container.resolve(PinturaController)

router.get('/', async (req, res, next) => {
  try {
    await pinturaController.listPinturas(req, res);
  } catch (error) {
    next(error);
  }
})


router.get('/:id/svg/:tipo', async (req, res, next) => {
  try {
    await pinturaController.getSvgByTipo(req, res);
  } catch (error) {
    next(error);
  }
})


router.get('/:id/svgs', async (req, res, next) => {
  try {
    await pinturaController.getAllSvgs(req, res);
  } catch (error) {
    next(error);
  }
})

router.post('/', async (req, res, next) => {
  try {
    await pinturaController.createPintura(req, res);
  } catch (error) {
    next(error);
  }
})

router.put('/:id/svg/:tipo', async (req, res, next) => {
  try {
    await pinturaController.updateSvg(req, res);
  } catch (error) {
    next(error);
  }
})

export default router;
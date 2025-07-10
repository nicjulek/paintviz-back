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

export default router;
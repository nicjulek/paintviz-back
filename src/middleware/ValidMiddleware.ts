import { Request, Response, NextFunction } from 'express';
import * as yup from 'yup';

export const ValidMiddleware = (schema: yup.ObjectSchema<any>) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            await schema.validate(req.body, { abortEarly: false });
            next();
        } catch (error) {
            if (error instanceof yup.ValidationError) {
                return res.status(400).json({
                    error: 'Dados inválidos',
                    details: error.errors
                });
            }
            return res.status(500).json({
                error: 'Erro interno do servidor'
            });
        }
    }
}

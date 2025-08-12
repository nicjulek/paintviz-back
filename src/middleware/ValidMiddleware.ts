import { Request, Response, NextFunction } from 'express';
import * as yup from 'yup';

// Validação de dados usando Yup
export const ValidMiddleware = (schema: yup.ObjectSchema<any>) => {
    return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            await schema.validate(req.body, { abortEarly: false });
            next();
        } catch (error) {
            if (error instanceof yup.ValidationError) {
                res.status(400).json({
                    error: 'Dados inválidos',
                    details: error.errors
                });
                return;
            }
            res.status(500).json({
                error: 'Erro interno do servidor'
            });
            return;
        }
    };
};
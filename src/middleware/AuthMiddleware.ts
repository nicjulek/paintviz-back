import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AuthRequest } from '../models';

export const AuthMiddleware = (req: AuthRequest, res: Response, next: NextFunction) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
        return res.status(401).json({ error: 'Token não fornecido' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'key') as any;
        req.user = {
            id: decoded.id,
            nome: decoded.nome,
            isAdmin: decoded.isAdmin
        }
        next();
    } catch (error) {
        return res.status(401).json({ error: 'Token inválido' }); 
    }
};

export const AdminMiddleware = (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user?.isAdmin) {
        return res.status(403).json({ error: 'Acesso negado.' });
    }
    next();
}
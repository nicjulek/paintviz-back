import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AuthRequest } from '../models';

// Verifica se o usuario esta autenticado
export const AuthMiddleware = (req: AuthRequest, res: Response, next: NextFunction): void => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');

        if (!token) {
            res.status(401).json({ error: 'Token não fornecido' });
            return;
        }
        
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'key') as any;
        req.user = {
            id: decoded.id,
            nome: decoded.nome,
            isAdmin: decoded.isAdmin
        };
        
        next();
    } catch (error) {
        res.status(401).json({ error: 'Token inválido' });
        return;
    }
};

// Verifica se o usuario autenticado é um administrador
export const AdminMiddleware = (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (!req.user?.isAdmin) {
        res.status(403).json({ error: 'Acesso negado.' });
        return;
    }
    next();
};
import { Request, Response } from "express";
import { inject, injectable } from "tsyringe";
import { UsuarioRepository } from "../repositories/UsuarioRepository";
import { Usuario } from "../models";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import * as yup from 'yup';


@injectable()
export class AuthController {
    constructor(
        @inject('UsuarioRepository')
        private usuarioRepository: UsuarioRepository
    ) {}

    async login(req: Request, res: Response) {
        try {
            const { nome, senha } = req.body;

            if (!nome || !senha){
                return res.status(400).json({
                    error: 'Nome e senha são obrigatórios'
                })
            }

            const usuario = await this.usuarioRepository.findByNome(nome);
            if (!usuario) {
                return res.status(401).json({
                    error: 'Credenciais inválidas'
                });
            }

            const pass = await bcrypt.compare(senha, usuario.senha);
            if (!pass) {
                return res.status(401).json({
                    error: 'Credenciais inválidas'
                });
            }

            const isAdmin = await this.usuarioRepository.isAdmin(usuario.id_usuario);

            const token = jwt.sign(
                {
                    id: usuario.id_usuario,
                    nome: usuario.nome,
                    isAdmin
                },
                process.env.JWT_SECRET || 'key',
                { expiresIn: '24h' }
            );

            return res.json({
                message: 'Login realizado com sucesso',
                token,
                user: {
                    id: usuario.id_usuario,
                    nome: usuario.nome,
                    isAdmin
                }
            });
        } catch (error) {
            if (error instanceof yup.ValidationError) {
                return res.status(400).json({
                    error: 'Dados inválidos',
                    details: error.errors
                });
            }

            console.error('Erro ao realizar login:', error);
            return res.status(500).json({
                error: 'Erro interno do servidor'
            });
        }
    }

    async logout(req: Request, res: Response) {
        try {
            return res.json({
                message: 'Logout realizado com sucesso'
            })
        } catch (error) {
            console.error('Erro ao realizar logout:', error);
            return res.status(500).json({
                error: 'Erro interno do servidor'
            });
        }
    }   
}
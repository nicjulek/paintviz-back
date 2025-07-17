import { Request, Response } from "express";
import { inject, injectable } from "tsyringe";
import { UsuarioRepository } from "../repositories/UsuarioRepository";

@injectable()
export class UsuarioController {
    constructor(
        @inject('UsuarioRepository')
        private usuarioRepository: UsuarioRepository
    ) {}

    async createUsuario(req: Request, res: Response) {
        try {
            const { nome, senha, isAdmin = false } = req.body;

            if (!nome || !senha) {
                return res.status(400).json({
                    error: 'Nome e senha são obrigatórios'
                });
            }

            // Verificar se usuário já existe
            const usuarioExists = await this.usuarioRepository.checkUsuarioExists(nome);
            if (usuarioExists) {
                return res.status(409).json({
                    error: 'Usuário já existe'
                });
            }

            // Criar usuário na tabela Usuario
            const novoUsuario = await this.usuarioRepository.createusuario({
                nome,
                senha
            });

            // Se isAdmin for true, criar registro na tabela Administrador
            if (isAdmin) {
                await this.usuarioRepository.createAdmin(novoUsuario.id_usuario!);
            }

            return res.status(201).json({
                message: 'Usuário criado com sucesso',
                usuario: {
                    id_usuario: novoUsuario.id_usuario,
                    nome: novoUsuario.nome,
                    isAdmin
                }
            });

        } catch (error) {
            console.error('Erro ao criar usuário:', error);
            return res.status(500).json({
                error: 'Erro interno do servidor'
            });
        }
    }

    async deleteUsuario(req: Request, res: Response) {
        try {
            const { id } = req.params;

            // Verificar se usuário existe
            const usuario = await this.usuarioRepository.findById(Number(id));
            if (!usuario) {
                return res.status(404).json({
                    error: 'Usuário não encontrado'
                });
            }

            // O DELETE CASCADE do banco já remove da tabela Administrador
            await this.usuarioRepository.deleteUsuario(Number(id));

            return res.status(200).json({
                message: 'Usuário deletado com sucesso'
            });

        } catch (error) {
            console.error('Erro ao deletar usuário:', error);
            return res.status(500).json({
                error: 'Erro interno do servidor'
            });
        }
    }

    async listUsuarios(req: Request, res: Response) {
        try {
            const usuarios = await this.usuarioRepository.listUsuarios();

            // Para cada usuário, verificar se é admin consultando a tabela Administrador
            const usuariosComAdmin = await Promise.all(
                usuarios.map(async (usuario) => {
                    const isAdmin = await this.usuarioRepository.isAdmin(usuario.id_usuario!);
                    return {
                        id_usuario: usuario.id_usuario,
                        nome: usuario.nome,
                        isAdmin
                    };
                })
            );

            return res.status(200).json(usuariosComAdmin);

        } catch (error) {
            console.error('Erro ao listar usuários:', error);
            return res.status(500).json({
                error: 'Erro interno do servidor'
            });
        }
    }

    async getUsuarioById(req: Request, res: Response) {
        try {
            const { id } = req.params;

            const usuario = await this.usuarioRepository.findById(Number(id));

            if (!usuario) {
                return res.status(404).json({
                    error: 'Usuário não encontrado'
                });
            }

            // Verificar se é admin consultando a tabela Administrador
            const isAdmin = await this.usuarioRepository.isAdmin(usuario.id_usuario!);

            return res.status(200).json({
                id_usuario: usuario.id_usuario,
                nome: usuario.nome,
                isAdmin
            });

        } catch (error) {
            console.error('Erro ao buscar usuário:', error);
            return res.status(500).json({
                error: 'Erro interno do servidor'
            });
        }
    }

    async updateUsuario(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const { nome, senha, isAdmin } = req.body;

            // Verificar se usuário existe
            const usuario = await this.usuarioRepository.findById(Number(id));
            if (!usuario) {
                return res.status(404).json({
                    error: 'Usuário não encontrado'
                });
            }

            // Atualizar dados básicos na tabela Usuario
            const updateData: any = {};
            if (nome) updateData.nome = nome;
            if (senha) updateData.senha = senha;

            if (Object.keys(updateData).length > 0) {
                await this.usuarioRepository.updateUsuario(Number(id), updateData);
            }

            // Gerenciar status de admin na tabela Administrador
            if (typeof isAdmin === 'boolean') {
                const currentlyAdmin = await this.usuarioRepository.isAdmin(Number(id));
                
                if (isAdmin && !currentlyAdmin) {
                    // Adicionar à tabela Administrador
                    await this.usuarioRepository.createAdmin(Number(id));
                } else if (!isAdmin && currentlyAdmin) {
                    // Remover da tabela Administrador
                    await this.usuarioRepository.removeAdminStatus(Number(id));
                }
            }

            return res.status(200).json({
                message: 'Usuário atualizado com sucesso'
            });

        } catch (error) {
            console.error('Erro ao atualizar usuário:', error);
            return res.status(500).json({
                error: 'Erro interno do servidor'
            });
        }
    }
}
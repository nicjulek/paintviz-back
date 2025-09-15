import { Request, Response } from "express";
import { inject, injectable } from "tsyringe";
import { UsuarioRepository } from "../repositories/UsuarioRepository";

@injectable()
export class UsuarioController {
    constructor(
        @inject('UsuarioRepository')
        private usuarioRepository: UsuarioRepository
    ) { }

    async createUsuario(req: Request, res: Response) {
        try {
            const { nome, senha, isAdmin = false } = req.body;

            if (!nome || !senha) {
                return res.status(400).json({
                    error: 'Nome e senha são obrigatórios'
                });
            }

            if (senha.length < 6 || !/[a-zA-Z]/.test(senha)) {
                return res.status(400).json({
                    error: 'A senha deve ter no mínimo 6 caracteres e conter pelo menos uma letra.'
                });
            }

            const usuarioExists = await this.usuarioRepository.checkUsuarioExists(nome);
            if (usuarioExists) {
                return res.status(409).json({
                    error: 'Usuário já existe'
                });
            }

            const novoUsuario = await this.usuarioRepository.createusuario({
                nome,
                senha
            });

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

            const usuario = await this.usuarioRepository.findById(Number(id));
            if (!usuario) {
                return res.status(404).json({
                    error: 'Usuário não encontrado'
                });
            }

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

            const usuario = await this.usuarioRepository.findById(Number(id));
            if (!usuario) {
                return res.status(404).json({
                    error: 'Usuário não encontrado'
                });
            }

            const updateData: any = {};
            if (nome) updateData.nome = nome;
            if (senha) updateData.senha = senha;

            if (Object.keys(updateData).length > 0) {
                await this.usuarioRepository.updateUsuario(Number(id), updateData);
            }

            if (typeof isAdmin === 'boolean') {
                const currentlyAdmin = await this.usuarioRepository.isAdmin(Number(id));

                if (isAdmin && !currentlyAdmin) {
                    await this.usuarioRepository.createAdmin(Number(id));
                } else if (!isAdmin && currentlyAdmin) {
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
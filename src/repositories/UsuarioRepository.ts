import { injectable } from "tsyringe";
import { Usuario } from "../models";
import { dbConnection } from "../config/database";
import bcrypt from 'bcryptjs';

@injectable()
export class UsuarioRepository {
    private db = dbConnection.getConnection();

    async createusuario(usuario: Omit<Usuario, 'id_usuario'>): Promise<Usuario> {
        try {
            // Hash da senha
            const saltRounds = 10;
            const hashedPassword = await bcrypt.hash(usuario.senha, saltRounds);
            
            const [id] = await this.db('Usuario').insert({
                nome: usuario.nome,
                senha: hashedPassword
            });

            return {
                id_usuario: id,
                nome: usuario.nome,
                senha: hashedPassword
            };
        } catch (error) {
            console.error('Erro ao criar usuário:', error);
            throw new Error('Erro ao criar usuário');
        }
    }

    async deleteUsuario(id_usuario: number): Promise<void> {
        try {
            await this.db('Usuario')
                .where('id_usuario', id_usuario)
                .del();
        } catch (error) {
            console.error('Erro ao deletar usuário:', error);
            throw new Error('Erro ao deletar usuário');
        }
    }

    async updateUsuario(id_usuario: number, usuario: Partial<Usuario>): Promise<Usuario | undefined> {
        try {
            const updateData: any = {};
            
            if (usuario.nome) {
                updateData.nome = usuario.nome;
            }
            
            if (usuario.senha) {
                const saltRounds = 10;
                updateData.senha = await bcrypt.hash(usuario.senha, saltRounds);
            }

            await this.db('Usuario')
                .where('id_usuario', id_usuario)
                .update(updateData);

            return await this.findById(id_usuario);
        } catch (error) {
            console.error('Erro ao atualizar usuário:', error);
            throw new Error('Erro ao atualizar usuário');
        }
    }

    async findById(id_usuario: number): Promise<Usuario | undefined> {
        try {
            return await this.db('Usuario')
                .where('id_usuario', id_usuario)
                .first();
        } catch (error) {
            console.error('Erro ao buscar usuário por ID:', error);
            throw new Error('Erro ao buscar usuário');
        }
    }

    async findByNome(nome: string): Promise<Usuario | undefined> {
        try {
            return await this.db('Usuario')
                .where('nome', nome)
                .first();
        } catch (error) {
            console.error('Erro ao buscar usuário por nome:', error);
            throw new Error('Erro ao buscar usuário');
        }
    }

    async listUsuarios(): Promise<Usuario[]> {
        try {
            return await this.db('Usuario').select('*');
        } catch (error) {
            console.error('Erro ao listar usuários:', error);
            throw new Error('Erro ao listar usuários');
        }
    }

    async isAdmin(id_usuario: number): Promise<boolean> {
        try {
            const admin = await this.db('Administrador')
                .where('id_usuario', id_usuario)
                .first();
            
            return !!admin;
        } catch (error) {
            console.error('Erro ao verificar se usuário é admin:', error);
            return false;
        }
    }

    async createAdmin(id_usuario: number): Promise<void> {
        try {
            await this.db('Administrador').insert({
                id_usuario
            });
        } catch (error) {
            console.error('Erro ao criar administrador:', error);
            throw new Error('Erro ao criar administrador');
        }
    }

    async removeAdminStatus(id_usuario: number): Promise<boolean> {
        try {
            const deleted = await this.db('Administrador')
                .where('id_usuario', id_usuario)
                .del();
            
            return deleted > 0;
        } catch (error) {
            console.error('Erro ao remover status de admin:', error);
            throw new Error('Erro ao remover status de admin');
        }
    }

    async checkUsuarioExists(nome: string): Promise<boolean> {
        try {
            const usuario = await this.db('Usuario')
                .where('nome', nome)
                .first();
            
            return !!usuario;
        } catch (error) {
            console.error('Erro ao verificar se usuário existe:', error);
            throw new Error('Erro ao verificar usuário');
        }
    }

    async getUserWithAdminStatus(nome: string): Promise<{
        usuario: Usuario;
        isAdmin: boolean;
    } | null> {
        try {
            const usuario = await this.findByNome(nome);
            if (!usuario) {
                return null;
            }

            const isAdmin = await this.isAdmin(usuario.id_usuario!);
            
            return {
                usuario,
                isAdmin
            };
        } catch (error) {
            console.error('Erro ao buscar usuário com status admin:', error);
            throw new Error('Erro ao buscar dados do usuário');
        }
    }
}
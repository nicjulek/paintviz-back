import { injectable } from "tsyringe";
import { dbConnection } from "../config/database";
import { Cliente, Fisico, Juridico } from "../models";
import bcrypt from 'bcryptjs';

@injectable()
export class ClienteRepository {
    private db = dbConnection.getConnection();

    async createCliente(cliente: Omit<Cliente, 'id_cliente'>): Promise<Cliente> {
        const trx = await this.db.transaction();// Utiliza-se o trx para garantir a transação 
        try {
            const [id] = await trx('Cliente').insert({ 
                celular: cliente.celular,
                email: cliente.email,
            });

            if (cliente.pessoa_juridica) {
                await trx("Juridico").insert({
                    id_cliente: id,
                    empresa: cliente.pessoa_juridica.empresa,
                    cnpj: cliente.pessoa_juridica.cnpj,
                    razao_social: cliente.pessoa_juridica.razao_social,
                });
            }

            if (cliente.pessoa_fisica) {
                await trx("Fisico").insert({
                    id_cliente: id,
                    cpf: cliente.pessoa_fisica.cpf,
                    nome: cliente.pessoa_fisica.nome
                });
            }

            await trx.commit();

            return {
                id_cliente: id,
                celular: cliente.celular,
                email: cliente.email,
                pessoa_juridica: cliente.pessoa_juridica || null,
                pessoa_fisica: cliente.pessoa_fisica || null
            };
        } catch (error) {
            await trx.rollback();
            console.error("Error creating cliente:", error);
            throw new Error("Error creating cliente");
        }
    }

    async deleteCliente(id_cliente: number): Promise<void> {
        try {
            await this.db('Cliente') // CASCADE
                .where('id_cliente', id_cliente)
                .del();
        } catch (error) {
            console.error("Erro ao deletar cliente:", error);
            throw new Error("Erro ao deletar cliente");
        }
    }

    async listClientes(): Promise<Cliente[]> {
        try {
            const clientes = await this.db('Cliente').select('*');

            const clientesCompletos = await Promise.all(
                clientes.map(async (cliente) => {
                    const pessoa_fisica = await this.db('Fisico')
                        .where('id_cliente', cliente.id_cliente)
                        .first();

                    const pessoa_juridica = await this.db('Juridico')
                        .where('id_cliente', cliente.id_cliente)
                        .first();
                    
                    return {
                        ...cliente, //Copia as propriedades do cliente para o novo objeto
                        pessoa_fisica: pessoa_fisica || null,
                        pessoa_juridica: pessoa_juridica || null
                    } as Cliente;
                })
            );
            return clientesCompletos;
        } catch (error) {
            console.error("Erro ao listar clientes:", error);
            throw new Error("Erro ao listar clientes");
        }   
    }

    async findClienteById(id_cliente: number): Promise<Cliente | undefined> {
        try {
            const cliente = await this.db('Cliente')
                .where('id_cliente', id_cliente)
                .first();

            if (!cliente) {
                return undefined;
            }

            const pessoa_fisica = await this.db('Fisico')
                .where('id_cliente', id_cliente)
                .first();

            const pessoa_juridica = await this.db('Juridico')
                .where('id_cliente', id_cliente)
                .first();

            return {
                ...cliente,
                pessoa_fisica: pessoa_fisica || null,
                pessoa_juridica: pessoa_juridica || null
            } as Cliente;
        } catch (error) {
            console.error("Erro ao buscar cliente por ID:", error);
            throw new Error("Erro ao buscar cliente por ID");
        }
    }

    async updateCliente(id_cliente: number, cliente: Partial<Cliente>): Promise<Cliente | undefined> {
        const trx = await this.db.transaction();

        try {
            const updateData: any = {};

            if (cliente.celular) {
                updateData.celular = cliente.celular;
            }
            if (cliente.email) {
                updateData.email = cliente.email;
            }

            if (Object.keys(updateData).length > 0) {
                await trx('Cliente')
                    .where('id_cliente', id_cliente)
                    .update(updateData);
            }

            if (cliente.pessoa_fisica) {
                const fisicaExists = await trx('Fisico')
                    .where('id_cliente', id_cliente)
                    .first();
                
                if (fisicaExists) {
                    await trx('Fisico')
                        .where('id_cliente', id_cliente)
                        .update({
                            nome: cliente.pessoa_fisica.nome,
                            cpf: cliente.pessoa_fisica.cpf
                        });
                } else {
                    await trx('Fisico').insert({
                        id_cliente,
                        nome: cliente.pessoa_fisica.nome,
                        cpf: cliente.pessoa_fisica.cpf
                    });
                }
            }

            if (cliente.pessoa_juridica) {
                const juridicaExists = await trx('Juridico')
                    .where('id_cliente', id_cliente)
                    .first();
                
                if (juridicaExists) {
                    await trx('Juridico')
                        .where('id_cliente', id_cliente)
                        .update({
                            empresa: cliente.pessoa_juridica.empresa,
                            cnpj: cliente.pessoa_juridica.cnpj,
                            razao_social: cliente.pessoa_juridica.razao_social
                        });
                } else {
                    await trx('Juridico').insert({
                        id_cliente,
                        empresa: cliente.pessoa_juridica.empresa,
                        cnpj: cliente.pessoa_juridica.cnpj,
                        razao_social: cliente.pessoa_juridica.razao_social
                    });
                }
            }
            await trx.commit();
            return await this.findClienteById(id_cliente);
        } catch (error) {
            await trx.rollback();
            console.error("Erro ao atualizar cliente:", error);
            throw new Error("Erro ao atualizar cliente");
        }
    }
}
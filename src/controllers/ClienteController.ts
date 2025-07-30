import { Request, Response } from "express";
import { ClienteRepository } from "repositories/ClienteRepository";
import { inject, injectable } from "tsyringe";

@injectable()
export class ClienteController {
   constructor(
           @inject('ClienteRepository')
           private clienteRepository: ClienteRepository
       ) {}
    
    async createCliente(req: Request, res: Response) {
        try {
            const { celular, email, pessoa_juridica, pessoa_fisica } = req.body;

            if (!celular || !email ) {
                return res.status(400).json({
                    error: 'Celular e email são obrigatórios'
                });
            }

            if (!pessoa_juridica && !pessoa_fisica) {
                return res.status(400).json({
                    error: 'Deve ser informado se é pessoa jurídica ou física'
                });
            }

            const cliente = await this.clienteRepository.createCliente({
                celular,
                email,
                ...(pessoa_juridica && { pessoa_juridica }),
                ...(pessoa_fisica && { pessoa_fisica })
            });
        } catch (error) {
            console.log('Erro ao criar cliente:', error);
            return res.status(500).json({ error: 'Erro interno do servidor' });
        }
        
    }

    async deleteCliente(req: Request, res: Response) {
        try {
            const { id } = req.params;

            if (!id) {
                return res.status(400).json({ error: 'ID do cliente é obrigatório' });
            }

            await this.clienteRepository.deleteCliente(Number(id));

            return res.status(200).json({ 
                message: 'Cliente deletado com sucesso' 
            });
        } catch (error) {
            console.log('Erro ao deletar cliente:', error);
            return res.status(500).json({ error: 'Erro interno do servidor' });
        }
    }

    async listClientes(req: Request, res: Response) {
        try {
            const clientes = await this.clienteRepository.listClientes();
            return res.status(200).json(clientes);
        } catch (error) {
            console.log('Erro ao listar clientes:', error);
            return res.status(500).json({ error: 'Erro interno do servidor' });
        }
    }

    async findClienteById(req: Request, res: Response) {
        try {
            const { id } = req.params;

            if (!id) {
                return res.status(400).json({ error: 'ID do cliente é obrigatório' });
            }

            const cliente = await this.clienteRepository.findClienteById(Number(id));

            if (!cliente) {
                return res.status(404).json({ error: 'Cliente não encontrado' });
            }

            return res.status(200).json(cliente);
        } catch (error) {
            console.log('Erro ao buscar cliente:', error);
            return res.status(500).json({ error: 'Erro interno do servidor' });
        }
    }

    async updateCliente(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const { celular, email, pessoa_juridica, pessoa_fisica } = req.body;
        
            if (!id) {
                return res.status(400).json({ error: 'ID do cliente é obrigatório' });
            }

            const clienteExiste = await this.clienteRepository.findClienteById(Number(id));
            if (!clienteExiste) {
                return res.status(404).json({ error: 'Cliente não encontrado' });
            }

            const cliente = await this.clienteRepository.updateCliente(Number(id), {
                celular,
                email,
                ...(pessoa_juridica && { pessoa_juridica }),
                ...(pessoa_fisica && { pessoa_fisica })
            });

            return res.status(200).json(cliente);
        } catch (error) {
            console.log('Erro ao atualizar cliente:', error);
            return res.status(500).json({ error: 'Erro interno do servidor' });
        }
    }
}
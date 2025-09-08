import { Request, Response } from "express";
import { ClienteRepository } from "repositories/ClienteRepository";
import { inject, injectable } from "tsyringe";

function validarCPF(cpf: string) {
    return /^\d{11}$/.test(cpf.replace(/\D/g, ""));
}

function validarCNPJ(cnpj: string) {
    return /^\d{14}$/.test(cnpj.replace(/\D/g, ""));
}

function validarEmail(email: string) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function validarTelefone(telefone: string) {
    return /^\d{10,11}$/.test(telefone.replace(/\D/g, ""));
}


@injectable()
export class ClienteController {
    constructor(
        @inject('ClienteRepository')
        private clienteRepository: ClienteRepository
    ) { }

    async createCliente(req: Request, res: Response) {
        try {
            const { pessoa_fisica, pessoa_juridica, celular, email } = req.body;

            if (!celular || !validarTelefone(celular)) {
                return res.status(400).json({ error: "Telefone inválido" });
            }
            if (!email || !validarEmail(email)) {
                return res.status(400).json({ error: "E-mail inválido" });
            }

            if (pessoa_fisica) {
                if (!pessoa_fisica.nome || !pessoa_fisica.cpf || !validarCPF(pessoa_fisica.cpf)) {
                    return res.status(400).json({ error: "CPF inválido ou nome ausente" });
                }
            } else if (pessoa_juridica) {
                if (!pessoa_juridica.empresa || !pessoa_juridica.razao_social || !pessoa_juridica.cnpj || !validarCNPJ(pessoa_juridica.cnpj)) {
                    return res.status(400).json({ error: "CNPJ inválido ou dados ausentes" });
                }
            } else {
                return res.status(400).json({ error: "Tipo de cliente não informado" });
            }
            const novoCliente = await this.clienteRepository.createCliente(req.body);
            return res.status(201).json(novoCliente);
        } catch (error) {
            return res.status(500).json({ error: "Erro interno do servidor" });
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
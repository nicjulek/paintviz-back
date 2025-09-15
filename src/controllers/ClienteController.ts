import { Request, Response } from "express";
import { ClienteRepository } from "repositories/ClienteRepository";
import { inject, injectable } from "tsyringe";

function validarCPF(cpf: string) {
    cpf = cpf.replace(/\D/g, "");
    if (cpf.length !== 11 || /^(\d)\1+$/.test(cpf)) return false;

    let soma = 0;
    for (let i = 0; i < 9; i++) soma += Number(cpf[i]) * (10 - i);
    let resto = (soma * 10) % 11;
    if (resto === 10) resto = 0;
    if (resto !== Number(cpf[9])) return false;

    soma = 0;
    for (let i = 0; i < 10; i++) soma += Number(cpf[i]) * (11 - i);
    resto = (soma * 10) % 11;
    if (resto === 10) resto = 0;
    return resto === Number(cpf[10]);
}

function validarCNPJ(cnpj: string) {
    cnpj = cnpj.replace(/\D/g, "");
    if (cnpj.length !== 14 || /^(\d)\1+$/.test(cnpj)) return false;

    let tamanho = cnpj.length - 2;
    let numeros = cnpj.substring(0, tamanho);
    let digitos = cnpj.substring(tamanho);
    let soma = 0;
    let pos = tamanho - 7;
    for (let i = tamanho; i >= 1; i--) {
        soma += Number(numeros[tamanho - i]) * pos--;
        if (pos < 2) pos = 9;
    }
    let resultado = soma % 11 < 2 ? 0 : 11 - (soma % 11);
    if (resultado !== Number(digitos[0])) return false;

    tamanho += 1;
    numeros = cnpj.substring(0, tamanho);
    soma = 0;
    pos = tamanho - 7;
    for (let i = tamanho; i >= 1; i--) {
        soma += Number(numeros[tamanho - i]) * pos--;
        if (pos < 2) pos = 9;
    }
    resultado = soma % 11 < 2 ? 0 : 11 - (soma % 11);
    return resultado === Number(digitos[1]);
}

function validarEmail(email: string) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function validarTelefone(telefone: string) {
    telefone = telefone.replace(/\D/g, "");
    return (
        (telefone.length === 10 || telefone.length === 11) &&
        !/^(\d)\1+$/.test(telefone)
    );
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
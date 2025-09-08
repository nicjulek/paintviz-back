import { Request, Response } from "express";
import { OrdemDeServicoRepository } from "repositories/OrdemDeServicoRepository";
import { inject, injectable } from "tsyringe";
import { ClienteRepository } from "repositories/ClienteRepository";
import { PinturaRepository } from "../repositories/PinturaRepository";
import { StatusRepository } from "../repositories/StatusRepository";

export let cadastroOrdemBloqueado = true;

export function setCadastroOrdemBloqueado(valor: boolean) {
    cadastroOrdemBloqueado = valor;
}

@injectable()
export class OrdemDeServicoController {
    constructor(
        @inject('OrdemDeServicoRepository')
        private ordemDeServicoRepository: OrdemDeServicoRepository,
        @inject('ClienteRepository')
        private clienteRepository: ClienteRepository,
        @inject('PinturaRepository')
        private pinturaRepository: PinturaRepository,
        @inject('StatusRepository')
        private statusRepository: StatusRepository
    ) { }

    private STATUS = {  //para teste com enum
        PRE_ORDEM: 0,
        ORDEM_ABERTA: 2,
        EM_PRODUCAO: 3,
        FINALIZADA: 4,
        CANCELADA: 5
    } as const;

    async createOrdemDeServico(req: Request, res: Response) {
        try {
            if (cadastroOrdemBloqueado) {
                return res.status(403).json({ error: "Cadastre uma pintura antes de criar a ordem de serviço." });
            }

            const { identificacao_veiculo, data_emissao, data_entrega, data_programada, modelo_veiculo, placa_veiculo, numero_box, id_cliente, id_usuario_responsavel, id_status, id_pintura, data_ultima_modificacao } = req.body;

            if (!data_emissao || !modelo_veiculo || !id_cliente || !id_usuario_responsavel || !id_status || !id_pintura || !data_ultima_modificacao) {
                return res.status(400).json({
                    error: 'data_emissao, modelo_veiculo, id_cliente, id_usuario_responsavel, id_status, id_pintura, data_ultima_modificacao são obrigatórios.'
                });
            }
            //para pegar status do banco
            const status = await this.statusRepository.findById(id_status);  //Supondo q id_status 0 é pré ordem
            if (!status) {
                return res.status(400).json({ error: "Status inválido." });
            }

            if (status.id_status === 0 && (data_entrega || identificacao_veiculo || data_programada || placa_veiculo || numero_box)) {
                return res.status(400).json({ error: "Somente informações mínimas de pré-ordem são permitidas." });
            }

            if (status.id_status !== 0 && (!data_entrega || !identificacao_veiculo || !data_programada || !placa_veiculo)) {
                return res.status(400).json({ error: "Ordem de serviço necessita de todas as informações preenchidas." });
            }

            if (status.descricao === "em_produção" && !numero_box) {
                return res.status(400).json({ error: "Numero box é obrigatório para ordem em produção." });
            }

            if (status.descricao !== "em_produção" && numero_box) {
                return res.status(400).json({ error: "Numero box somente permitido em ordem em produção." });
            }

            const cliente = await this.clienteRepository.findClienteById(Number(id_cliente));
            if (!cliente) {
                return res.status(404).json({ error: "Cliente não encontrado." });
            }

            const pintura = await this.pinturaRepository.pinturaExists(Number(id_pintura));
            if (!pintura) {
                return res.status(404).json({ error: "Pintura não existe. " });
            }

            //Status com enum
            /* 
            if (Number(id_status) === this.STATUS.PRE_ORDEM && (data_entrega || identificacao_veiculo || data_programada || placa_veiculo || numero_box)) {
                return res.status(400).json({ error: "Somente informações mínimas de pré-ordem são permitidas." });
            }

            if (Number(id_status) !== this.STATUS.PRE_ORDEM && (!data_entrega || !identificacao_veiculo || !data_programada || !placa_veiculo)) {
                return res.status(400).json({ error: "Ordem de serviço necessita de todas as informações preenchidas." });
            }

            if (Number(id_status) === this.STATUS.EM_PRODUCAO && !numero_box) {
                return res.status(400).json({ error: "Numero box é obrigatório para ordem em produção." });
            }

            if (Number(id_status) !== this.STATUS.EM_PRODUCAO && numero_box) {
                return res.status(400).json({ error: "Numero box somente permitido em ordem em produção." });
            }*/

            const novaOrdem = await this.ordemDeServicoRepository.createOrdemDeServico({
                identificacao_veiculo,
                data_emissao,
                data_entrega,
                data_programada,
                modelo_veiculo,
                placa_veiculo,
                numero_box,
                id_cliente: Number(id_cliente),
                id_usuario_responsavel: Number(id_usuario_responsavel),
                id_status: Number(id_status),
                id_pintura: Number(id_pintura),
                data_ultima_modificacao,
            });

            cadastroOrdemBloqueado = true;

            return res.status(201).json({ ordem: novaOrdem, message: "Ordem criada. Cadastro bloqueado até nova pintura ser criada." });
        } catch (error) {
            console.error("Erro no controller ao criar ordem de serviço:", error);
            return res.status(500).json({ error: 'Erro ao criar ordem de serviço.' });
        }
    }

    async desbloquearCadastroOrdem() {
        cadastroOrdemBloqueado = false;
    }

    async deleteOrdemDeServico(req: Request, res: Response) {
        try {
            const id = parseInt(req.params.id);
            await this.ordemDeServicoRepository.deleteOrdemDeServico(id);
            return res.status(204).send();
        } catch (error) {
            console.error("Erro no controller ao deletar ordem de serviço:", error);
            return res.status(500).json({ error: "Erro ao deletar ordem de serviço" });
        }

    }

    async listOrdemDeServico(req: Request, res: Response) {
        try {
            const ordens = await this.ordemDeServicoRepository.listOrdemDeServico();
            return res.status(200).json(ordens);
        } catch (error) {
            console.log('Erro ao listar ordens de serviço:', error);
            return res.status(500).json({ error: 'Erro interno do servidor' });
        }
    }

    async findById(req: Request, res: Response) {
        try {
            const id = parseInt(req.params.id);
            const ordem = await this.ordemDeServicoRepository.findById(id);

            if (!ordem) {
                return res.status(404).json({ error: "Ordem de serviço não encontrada" });
            }

            return res.status(200).json(ordem);
        } catch (error) {
            console.error("Erro no controller ao buscar ordem de serviço por ID:", error);
            return res.status(500).json({ error: "Erro ao buscar ordem de serviço" });
        }

    }

    async findByCliente(req: Request, res: Response) {
        try {
            const id_cliente = parseInt(req.params.id_cliente);
            const ordem = await this.ordemDeServicoRepository.findByCliente(id_cliente);

            if (!ordem) {
                return res.status(404).json({ error: "Ordem de serviço não encontrada" });
            }

            return res.status(200).json(ordem);
        } catch (error) {
            console.error("Erro no controller ao buscar ordem de serviço por cliente:", error);
            return res.status(500).json({ error: "Erro ao buscar ordem de serviço" });
        }
    }

    async updateOrdemDeServico(req: Request, res: Response) {
        try {
            const id = parseInt(req.params.id);
            const dadosAtualizados = req.body;

            const ordemAtualizada = await this.ordemDeServicoRepository.updateOrdemDeServico(id, dadosAtualizados);

            if (!ordemAtualizada) {
                return res.status(404).json({ error: "Ordem não encontrada para atualização" });
            }

            return res.status(200).json(ordemAtualizada);
        } catch (error) {
            console.error("Erro no controller ao atualizar ordem de serviço:", error);
            return res.status(500).json({ error: "Erro ao atualizar ordem" });
        }

    }

    async alterarStatus(req: Request, res: Response) {
        try {
            const id = parseInt(req.params.id);
            const { id_status, numero_box, data_emissao, data_programada, data_entrega } = req.body;

            if (!id_status) {
                return res.status(400).json({ error: "id_status é obrigatório." });
            }

            // Se for em produção, precisa do numero_box
            let updateData: any = { id_status: Number(id_status) };
            if (Number(id_status) === 3) {
                if (!numero_box) {
                    return res.status(400).json({ error: "numero_box é obrigatório para status em produção." });
                }
                updateData.numero_box = numero_box;
            }
            // Se for pré-ordem, remova datas e box
            if (Number(id_status) === 0) {
                updateData = { id_status: 0, numero_box: null, data_entrega: null, data_programada: null, placa_veiculo: null, identificacao_veiculo: null };
            }

            if (data_emissao) updateData.data_emissao = data_emissao;
            if (data_programada) updateData.data_programada = data_programada;
            if (data_entrega) updateData.data_entrega = data_entrega;

            const ordemAtualizada = await this.ordemDeServicoRepository.updateOrdemDeServico(id, updateData);

            if (!ordemAtualizada) {
                return res.status(404).json({ error: "Ordem não encontrada para atualização de status." });
            }

            return res.status(200).json({ ordem: ordemAtualizada, message: "Status alterado com sucesso." });
        } catch (error) {
            console.error("Erro ao alterar status da ordem:", error);
            return res.status(500).json({ error: "Erro ao alterar status." });
        }
    }

    // Alterar prioridade (apenas data_entrega)
    async alterarPrioridade(req: Request, res: Response) {
        try {
            const id = parseInt(req.params.id);
            const { data_entrega } = req.body;

            if (!data_entrega) {
                return res.status(400).json({ error: "data_entrega é obrigatória." });
            }

            const ordemAtualizada = await this.ordemDeServicoRepository.updateOrdemDeServico(id, {
                data_entrega
            });

            if (!ordemAtualizada) {
                return res.status(404).json({ error: "Ordem não encontrada para atualização de prioridade." });
            }

            return res.status(200).json({ ordem: ordemAtualizada, message: "Prioridade (data de entrega) alterada com sucesso." });
        } catch (error) {
            console.error("Erro ao alterar prioridade da ordem:", error);
            return res.status(500).json({ error: "Erro ao alterar prioridade." });
        }
    }
}
import { injectable } from "tsyringe";
import { OrdemDeServico } from "../models";
import { dbConnection } from "../config/database";

@injectable()
export class OrdemDeServicoRepository {
    private db = dbConnection.getConnection();

    async createOrdemDeServico(ordemDeServico: Omit<OrdemDeServico, 'id_ordem_servico'>): Promise<OrdemDeServico>{
        try{
            const [id_ordem_servico] = await this.db('OrdemDeServico').insert({
                identificacao_veiculo: ordemDeServico.identificacao_veiculo,
                data_emissao: ordemDeServico.data_emissao,
                data_entrega: ordemDeServico.data_entrega,
                data_programada: ordemDeServico.data_programada,
                modelo_veiculo: ordemDeServico.modelo_veiculo,
                placa_veiculo: ordemDeServico.placa_veiculo,
                numero_box: ordemDeServico.numero_box,
                id_cliente: ordemDeServico.id_cliente,
                id_usuario_responsavel: ordemDeServico.id_usuario_responsavel,
                id_status: ordemDeServico.id_status,
                id_pintura: ordemDeServico.id_pintura,
                data_ultima_modificacao: ordemDeServico.data_ultima_modificacao,
            });

            return { ...ordemDeServico, id_ordem_servico: id_ordem_servico } as OrdemDeServico;
        } catch(error){
            console.error('Erro ao criar ordem de serviço:', error);
            throw new Error('Erro ao criar ordem de serviço');
        }
    }

    async deleteOrdemDeServico(id_ordem_servico: number): Promise<boolean> {
        try {
            const deleted = await this.db('OrdemDeServico')
                .where('id_ordem_servico', id_ordem_servico)
                .del();

            console.log(`Ordem de serviço ${id_ordem_servico} deletada do banco`);
            return deleted > 0;
        } catch (error) {
            console.error('Erro ao deletar ordem de serviço:', error);
            throw new Error('Erro ao deletar ordem');
        }
    }

    async listOrdemDeServico(): Promise<OrdemDeServico[]> {
        try {
            return await this.db('OrdemDeServico').select('*');
        } catch (error) {
            console.error('Erro ao listar ordens de servico:', error);
            throw new Error('Erro ao acessar banco de dados');
        }
    }

async listOrdensParaGaleria(filtros?: { status?: string; nomeCliente?: string; ordenarPorData?: 'recente' | 'antiga' }): Promise<any[]>  {
    try {
        const query = this.db('OrdemDeServico as os')
            .join('Cliente as c', 'os.id_cliente', '=', 'c.id_cliente')
            .join('Status as s', 'os.id_status', '=', 's.id_status')
            .join('Pintura as p', 'os.id_pintura', '=', 'p.id_pintura')
            .leftJoin('Fisico as f', 'c.id_cliente', '=', 'f.id_cliente')
            .leftJoin('Juridico as j', 'c.id_cliente', '=', 'j.id_cliente');

        if (filtros && filtros.status) {
            query.where('os.id_status', filtros.status);
        }

        if (filtros && filtros.nomeCliente) {
            query.where(builder => {
                builder.where('f.nome', 'like', `%${filtros.nomeCliente}%`)
                       .orWhere('j.empresa', 'like', `%${filtros.nomeCliente}%`);
            });
        }

        if (filtros && filtros.ordenarPorData) {
            const direcao = filtros.ordenarPorData === 'recente' ? 'desc' : 'asc';
            query.orderBy('os.data_programada', direcao);
        }

        const ordens = await query.select(
            'os.id_ordem_servico as idordem',
            's.descricao as status',
            this.db.raw('COALESCE(f.nome, j.empresa) as nome'),
            'os.data_programada as entrega',
            'p.pintura_svg_lateral as imgpintura'
        );

        return ordens;
    } catch (error) {
        console.error('Erro ao listar ordens para galeria:', error);
        throw new Error('Erro ao acessar banco de dados');
    }
}

    async findById(id_ordem_servico: number): Promise<OrdemDeServico | undefined> {
        try {
            return await this.db('OrdemDeServico').where('id_ordem_servico', id_ordem_servico).first();
        } catch (error) {
            console.error('Erro ao buscar ordem de serviço por id:', error);
            throw new Error('Erro ao buscar ordem por id');
        }
    }

    async findDetailedById(id_ordem_servico: number): Promise<any | undefined> {
        try {
            const ordem = await this.db('OrdemDeServico as os')
                .leftJoin('Cliente as c', 'os.id_cliente', '=', 'c.id_cliente')
                .leftJoin('Fisico as f', 'c.id_cliente', '=', 'f.id_cliente')
                .leftJoin('Juridico as j', 'c.id_cliente', '=', 'j.id_cliente')
                .leftJoin('Status as s', 'os.id_status', '=', 's.id_status')
                .leftJoin('Usuario as u', 'os.id_usuario_responsavel', '=', 'u.id_usuario')
                .leftJoin('Pintura as p', 'os.id_pintura', '=', 'p.id_pintura')
                .leftJoin('Carroceria as car', 'p.id_carroceria', '=', 'car.id_carroceria')
                .where('os.id_ordem_servico', id_ordem_servico)
                .select(
                    // Informações do Cliente
                    this.db.raw('COALESCE(f.nome, j.empresa) as cliente_nome'),
                    'f.cpf as cliente_cpf',
                    'j.cnpj as cliente_cnpj',
                    'c.email as cliente_email',
                    'c.celular as cliente_celular',
                    // Detalhes do Veículo
                    'os.modelo_veiculo',
                    'os.placa_veiculo',
                    'os.identificacao_veiculo',
                    // Datas e Status
                    'os.data_emissao',
                    'os.data_entrega',
                    'os.data_programada',
                    'u.nome as usuario_responsavel',
                    's.descricao as status_descricao',
                    'os.numero_box',
                    // Pintura e Carroceria
                    'car.nome_modelo as carroceria_nome',
                    'p.pintura_svg_lateral',
                    'p.pintura_svg_traseira',
                    'p.pintura_svg_diagonal'
                )
                .first(); // .first() para pegar apenas um resultado
            
            return ordem;
        } catch (error) {
            console.error('Erro ao buscar detalhes da ordem por id:', error);
            throw new Error('Erro ao buscar detalhes da ordem');
        }
    }

    async findByCliente(id_cliente: number): Promise<OrdemDeServico[] | undefined> {
        try {
            return await this.db('OrdemDeServico').where('id_cliente', id_cliente);
        } catch (error) {
            console.error('Erro ao buscar ordem de serviço por cliente:', error);
            throw new Error('Erro ao buscar ordem por cliente');
        }
    }

    async updateOrdemDeServico(id_ordem_servico: number, ordemDeServico: Partial<OrdemDeServico>): Promise<OrdemDeServico | undefined>{
        try{
            const updateData: any = {};
    
            if(ordemDeServico.identificacao_veiculo){
                updateData.identificacao_veiculo = ordemDeServico.identificacao_veiculo;
            }
    
            if(ordemDeServico.data_programada){
                updateData.data_programada = ordemDeServico.data_programada;
            }

            if(ordemDeServico.modelo_veiculo){
                updateData.modelo_veiculo = ordemDeServico.modelo_veiculo;
            }

            if(ordemDeServico.placa_veiculo){
                updateData.placa_veiculo = ordemDeServico.placa_veiculo;
            }

            if(ordemDeServico.numero_box){
                updateData.numero_box = ordemDeServico.numero_box;
            }

            if(ordemDeServico.id_cliente !== undefined){
                updateData.id_cliente = ordemDeServico.id_cliente;
            }

            if(ordemDeServico.id_usuario_responsavel !== undefined){
                updateData.id_usuario_responsavel = ordemDeServico.id_usuario_responsavel;
            }

            if(ordemDeServico.id_status !== undefined){
                updateData.id_status = ordemDeServico.id_status;
            }

            if(ordemDeServico.data_ultima_modificacao){
                updateData.data_ultima_modificacao = ordemDeServico.data_ultima_modificacao;
            }
    
            await this.db('OrdemDeServico')
                .where('id_ordem_servico', id_ordem_servico)
                .update(updateData);
    
            return await this.findById(id_ordem_servico);
    
        } catch(error){
            console.error('Erro ao atualizar ordem de serviço: ', error);
            throw new Error('Erro ao atualizar ordem');
        }
    }
    
}
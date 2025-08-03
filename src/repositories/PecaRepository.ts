import { injectable } from "tsyringe";
import { dbConnection } from "../config/database";
import {Peca} from "../models";

@injectable()
export class PecaRepository {
    private db = dbConnection.getConnection();

    async createPeca(peca: Omit<Peca, 'id_peca'>): Promise<Peca> {
        const trx = await this.db.transaction();

        try {
            const [id] = await trx('Peca').insert({
                nome_peca: peca.nome_peca,
                id_svg: peca.id_svg,
                id_carroceria: peca.id_carroceria,
                id_pintura: null,
                id_cor: null,
        });

            await trx.commit();

            return {
            id_peca: id,
            nome_peca: peca.nome_peca,
            id_svg: peca.id_svg,
            id_carroceria: peca.id_carroceria,
            id_pintura: null,
            id_cor: null,
            };

        } catch (error) {

            await trx.rollback();
            console.error('Erro ao criar peça:', error);
            throw new Error('Erro ao criar peça');
        }
}

    async deletePeca(id_peca: number): Promise<void>{
        try{
            await this.db('Peca')
                .where('id_peca', id_peca)
                .del()
        } catch (error){
            console.error("Erro ao deletar peça: ", error);
            throw new Error("Erro ao deletar peça");
        }
    }

    async listPecasPorModelo(id_carroceria: number): Promise<Peca[]> {
        try {
            const pecas = await this.db('Peca')
            .select('id_peca', 'nome_peca', 'id_svg', 'id_pintura', 'id_carroceria')
            .where('id_carroceria', id_carroceria);

            return pecas;

        } catch (error) {
            console.error("Erro ao listar peças por modelo de carroceria:", error);
            throw new Error("Erro ao listar peças");
        }
    }

    async findPecaById(id_peca: number): Promise<Peca | undefined> {
        try {
            const peca = await this.db('Peca')
                .select('id_peca', 'nome_peca', 'id_svg', 'id_pintura', 'id_carroceria', 'id_cor')
                .where({ id_peca })
                .first(); 

            return peca;

        } catch (error) {
            console.error("Erro ao buscar peça por ID:", error);
            throw new Error("Erro ao buscar peça");
        }
    }

    async updatePeca(id_peca: number, peca: Partial<Peca>): Promise<Peca | undefined>{
        try{
            const updateData: any = {};

            if(peca.nome_peca){
                updateData.nome_peca = peca.nome_peca;
            }

            if(peca.id_svg){
                updateData.id_svg = peca.id_svg;
            }

            await this.db('Peca')
                .where('id_peca', id_peca)
                .update(updateData);

            return await this.findPecaById(id_peca);

        } catch(error){
            console.error('Erro ao atualizar peça: ', error);
            throw new Error('Erro ao atualizar peça');
        }
    }


}
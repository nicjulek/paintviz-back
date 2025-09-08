import { injectable } from "tsyringe";
import { dbConnection } from "../config/database";
import { Cor } from "../models";

@injectable()
export class CorRepository {
    private db = dbConnection.getConnection();

    async createCor(cor: Omit<Cor, 'id_cor'>): Promise<Cor> {
        const trx = await this.db.transaction();

        try {
            const [id] = await trx('Cor').insert({
                nome_cor: cor.nome_cor,
                cod_cor: cor.cod_cor
            });

            await trx.commit();

            return {
                id_cor: id,
                nome_cor: cor.nome_cor,
                cod_cor: cor.cod_cor
            };

        } catch (error) {
            await trx.rollback();
            console.error('Erro ao criar cor:', error);
            throw new Error('Erro ao criar cor');
        }
    }

    async deleteCor(id_cor: number): Promise<void> {
        try {
            // Primeiro deletar associações na Paleta_Cor
            await this.db('Paleta_Cor').where('id_cor', id_cor).del();
            // Depois deletar a cor
            await this.db('Cor').where('id_cor', id_cor).del();
        } catch (error) {
            console.error("Erro ao deletar cor: ", error);
            throw new Error("Erro ao deletar cor");
        }
    }

    async listCores(): Promise<Cor[]> {
        try {
            return await this.db('Cor')
                .select('id_cor', 'nome_cor', 'cod_cor')
                .orderBy('nome_cor', 'asc');
        } catch (error) {
            console.error("Erro ao listar cores:", error);
            throw new Error("Erro ao listar cores");
        }
    }

    async findCorById(id_cor: number): Promise<Cor | undefined> {
        try {
            return await this.db('Cor')
                .select('id_cor', 'nome_cor', 'cod_cor')
                .where('id_cor', id_cor)
                .first();
        } catch (error) {
            console.error("Erro ao buscar cor por ID:", error);
            throw new Error("Erro ao buscar cor");
        }
    }

    async updateCor(id_cor: number, cor: Partial<Cor>): Promise<Cor | undefined> {
        try {
            const updateData: any = {};

            if (cor.nome_cor) {
                updateData.nome_cor = cor.nome_cor;
            }

            if (cor.cod_cor) {
                updateData.cod_cor = cor.cod_cor;
            }

            await this.db('Cor')
                .where('id_cor', id_cor)
                .update(updateData);

            return await this.findCorById(id_cor);

        } catch (error) {
            console.error('Erro ao atualizar cor: ', error);
            throw new Error('Erro ao atualizar cor');
        }
    }
}
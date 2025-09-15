import { injectable } from "tsyringe";
import { dbConnection } from "../config/database";
import { Peca } from "../models";

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
                id_pintura: peca.id_pintura || null,
                id_cor: peca.id_cor || null,
            });

            await trx.commit();

            return {
                id_peca: id,
                nome_peca: peca.nome_peca,
                id_svg: peca.id_svg,
                id_carroceria: peca.id_carroceria,
                id_pintura: peca.id_pintura || null,
                id_cor: peca.id_cor || null,
            };

        } catch (error) {
            await trx.rollback();
            console.error('Erro ao criar peça:', error);
            throw new Error('Erro ao criar peça');
        }
    }

    async deletePeca(id_peca: number): Promise<void> {
        try {
            await this.db('Peca')
                .where('id_peca', id_peca)
                .del();
        } catch (error) {
            console.error("Erro ao deletar peça: ", error);
            throw new Error("Erro ao deletar peça");
        }
    }

    async listPecasPorModelo(id_carroceria: number): Promise<Peca[]> {
        try {
            const pecas = await this.db('Peca')
                .select('id_peca', 'nome_peca', 'id_svg', 'id_pintura', 'id_carroceria', 'id_cor')
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

    async updatePeca(id_peca: number, peca: Partial<Peca>): Promise<Peca | undefined> {
        try {
            const updateData: any = {};

            if (peca.nome_peca) {
                updateData.nome_peca = peca.nome_peca;
            }

            if (peca.id_svg) {
                updateData.id_svg = peca.id_svg;
            }

            if (peca.id_cor !== undefined) {
                updateData.id_cor = peca.id_cor;
            }

            if (peca.id_pintura !== undefined) {
                updateData.id_pintura = peca.id_pintura;
            }

            await this.db('Peca')
                .where('id_peca', id_peca)
                .update(updateData);

            return await this.findPecaById(id_peca);

        } catch (error) {
            console.error('Erro ao atualizar peça: ', error);
            throw new Error('Erro ao atualizar peça');
        }
    }

    // Buscar cor por ID
    async findCorById(id_cor: number): Promise<any> {
        try {
            return await this.db('Cor')
                .select('id_cor', 'nome_cor', 'cod_cor')
                .where('id_cor', id_cor)
                .first();
        } catch (error) {
            console.error('Erro ao buscar cor:', error);
            throw new Error('Erro ao buscar cor');
        }
    }

    // Listar peças com suas cores
    async listPecasComCores(id_carroceria: number): Promise<any[]> {
        try {
            const pecasComCores = await this.db('Peca')
                .leftJoin('Cor', 'Peca.id_cor', 'Cor.id_cor')
                .select(
                    'Peca.id_peca',
                    'Peca.nome_peca',
                    'Peca.id_svg',
                    'Peca.id_carroceria',
                    'Peca.id_pintura',
                    'Peca.id_cor',
                    'Cor.nome_cor',
                    'Cor.cod_cor'
                )
                .where('Peca.id_carroceria', id_carroceria);

            return pecasComCores;
        } catch (error) {
            console.error("Erro ao listar peças com cores:", error);
            throw new Error("Erro ao listar peças com cores");
        }
    }

    async deletePecasPorCarroceria(id_carroceria: number): Promise<number> {
    try {
        return await this.db('Peca').where('id_carroceria', id_carroceria).del();
    } catch (error) {
        console.error('Erro ao deletar peças associadas:', error);
        return 0;
    }
}
}
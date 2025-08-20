import { injectable } from "tsyringe";
import { dbConnection } from "../config/database";
import { Paleta, Cor } from "../models";

@injectable()
export class PaletaRepository {
    private db = dbConnection.getConnection();

    async createPaleta(paleta: Omit<Paleta, 'id_paleta'>): Promise<Paleta> {
        const trx = await this.db.transaction();

        try {
            const [id] = await trx('Paleta').insert({
                nome_paleta: paleta.nome_paleta,
            });

            await trx.commit();

            return {
                id_paleta: id,
                nome_paleta: paleta.nome_paleta,
            };

        } catch (error) {
            await trx.rollback();
            console.error('Erro ao criar paleta:', error);
            throw new Error('Erro ao criar paleta');
        }
    }

    async deletePaleta(id_paleta: number): Promise<void> {
        try {
            // Primeiro deletar associações na Paleta_Cor
            await this.db('Paleta_Cor').where('id_paleta', id_paleta).del();
            // Depois deletar a paleta
            await this.db('Paleta').where('id_paleta', id_paleta).del();
        } catch (error) {
            console.error("Erro ao deletar paleta: ", error);
            throw new Error("Erro ao deletar paleta");
        }
    }

    async listPaletas(): Promise<Paleta[]> {
        try {
            // Buscar paletas com suas cores
            const paletas = await this.db('Paleta').select('*');
            
            const paletasComCores = await Promise.all(
                paletas.map(async (paleta: any) => {
                    const cores = await this.getCoresDaPaleta(paleta.id_paleta);
                    return {
                        ...paleta,
                        cores
                    };
                })
            );

            return paletasComCores;
        } catch (error) {
            console.error('Erro ao listar paletas:', error);
            throw new Error('Erro ao listar paletas');
        }
    }

    async findPaletaById(id_paleta: number): Promise<Paleta | undefined> {
        try {
            const paleta = await this.db('Paleta')
                .where('id_paleta', id_paleta)
                .first();

            if (paleta) {
                // Buscar cores da paleta
                const cores = await this.getCoresDaPaleta(id_paleta);
                return {
                    ...paleta,
                    cores
                };
            }

            return paleta;
        } catch (error) {
            console.error('Erro ao buscar paleta por ID:', error);
            throw new Error('Erro ao buscar paleta');
        }
    }

    async updatePaleta(id_paleta: number, paleta: Partial<Paleta>): Promise<Paleta | undefined> {
        try {
            const updateData: any = {};

            if (paleta.nome_paleta) {
                updateData.nome_paleta = paleta.nome_paleta;
            }

            await this.db('Paleta')
                .where('id_paleta', id_paleta)
                .update(updateData);

            return await this.findPaletaById(id_paleta);
        } catch (error) {
            console.error('Erro ao atualizar paleta: ', error);
            throw new Error('Erro ao atualizar paleta');
        }
    }

    async removeCorFromPaleta(id_paleta: number, id_cor: number): Promise<void> {
        try {
            await this.db('Paleta_Cor')
                .where('id_paleta', id_paleta)
                .where('id_cor', id_cor)
                .del();
        } catch (error) {
            console.error('Erro ao remover cor da paleta:', error);
            throw new Error('Erro ao remover cor da paleta');
        }
    }

    async getCoresDaPaleta(id_paleta: number): Promise<Cor[]> {
        try {
            return await this.db('Cor')
                .join('Paleta_Cor', 'Cor.id_cor', '=', 'Paleta_Cor.id_cor')
                .where('Paleta_Cor.id_paleta', id_paleta)
                .select('Cor.id_cor', 'Cor.nome_cor', 'Cor.cod_cor');
        } catch (error) {
            console.error('Erro ao buscar cores da paleta:', error);
            throw new Error('Erro ao buscar cores da paleta');
        }
    }

    async addCorToPaleta(id_paleta: number, id_cor: number): Promise<void> {
        try {
            // Verificar se já existe a associação
            const existeAssociacao = await this.db('Paleta_Cor')
                .where('id_paleta', id_paleta)
                .where('id_cor', id_cor)
                .first();

            if (existeAssociacao) {
                throw new Error('Cor já está associada a esta paleta');
            }

            await this.db('Paleta_Cor').insert({
                id_paleta,
                id_cor
            });
        } catch (error) {
            console.error('Erro ao adicionar cor à paleta:', error);
            throw new Error('Erro ao adicionar cor à paleta');
        }
    }
}
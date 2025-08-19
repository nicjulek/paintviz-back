import { injectable } from "tsyringe";
import { dbConnection } from "../config/database";
import {Paleta} from "../models";

@injectable()
export class PaletaRepository {
    private db = dbConnection.getConnection();

    async createPaleta(paleta: Omit<Paleta, 'id_paleta'>){
        const trx = await this.db.transaction();

        try{
            const [id] = await trx('Paleta').insert({
                nome_paleta: paleta.nome_paleta,
        });

            await trx.commit();

            return {
            id_paleta: id,
            nome_paleta: paleta.nome_paleta,
            };

        } catch(error){
            await trx.rollback();
            console.error('Erro ao criar paleta:', error);
            throw new Error('Erro ao criar paleta');
        }
    }

    async deletePaleta(id_paleta: number): Promise<void>{
        try{
            await this.db('Paleta')
                .where('id_paleta', id_paleta)
                .del()
        } catch(error){
            console.error("Erro ao deletar paleta: ", error);
            throw new Error("Erro ao deletar paleta");
        }
    }

    async listPaletas(): Promise<Paleta[]>{
        try{
            return await this.db('Paleta').select('*');
        } catch(error){
            console.error('Erro ao listar paletas:', error);
            throw new Error('Erro ao listar paletas');
        }
    }

    async findPaletaById(id_paleta: number): Promise<Paleta | undefined>{
        try{
            return await this.db('Paleta')
                .where('id_paleta', id_paleta)
                .first();
        } catch(error){
            console.error('Erro ao buscar paleta por ID:', error);
            throw new Error('Erro ao buscar paleta');
        }
    }

    async updatePaleta(id_paleta: number, paleta: Partial<Paleta>): Promise<Paleta | undefined>{
        try{
            const updateData: any = {};

            if(paleta.nome_paleta){
                updateData.nome_paleta = paleta.nome_paleta;
            }

            await this.db('Paleta')
                .where('id_paleta', id_paleta)
                .update(updateData);

            return await this.findPaletaById(id_paleta);
        } catch(error){
            console.error('Erro ao atualizar paleta: ', error);
            throw new Error('Erro ao atualizar paleta');
        }
    }
}
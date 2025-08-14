import { injectable } from "tsyringe";
import { dbConnection } from "../config/database";
import { Carroceria } from "../models/index"; 

@injectable()
export class CarroceriaRepository {
    private db = dbConnection.getConnection();

    async createCarroceria(carroceria: Omit<Carroceria, 'id_carroceria' | 'data_criacao'>): Promise<Carroceria> {
        try {
            const [id] = await this.db('Carroceria').insert({
                nome_modelo: carroceria.nome_modelo,
                lateral_svg: carroceria.lateral_svg,
                traseira_svg: carroceria.traseira_svg,
                diagonal_svg: carroceria.diagonal_svg
            });

            const novaCarroceria = await this.findById(id);
            return novaCarroceria!;
        } catch (error) {
            console.error("Erro ao criar carroceria:", error);
            throw new Error("Erro ao criar carroceria");
        }
    }

    async deleteCarroceria(id: number): Promise<void> {
        try {
            await this.db('Carroceria') // CASCADE
                .where('id_carroceria', id)
                .del();
        } catch (error) {
            console.error("Erro ao deletar carroceria:", error);
            throw new Error("Erro ao deletar carroceria");
        }
    }

    async updateCarroceria(id: number, carroceria: Partial<Carroceria>): Promise<boolean> {
        try{
            const updateData: any = {};

            if(carroceria.nome_modelo){
                updateData.nome_modelo = carroceria.nome_modelo;
            }

            if(carroceria.lateral_svg){
                updateData.lateral_svg = carroceria.lateral_svg;
            }

            if(carroceria.traseira_svg){
                updateData.traseira_svg = carroceria.traseira_svg;
            }

            if(carroceria.diagonal_svg){
                updateData.diagonal_svg = carroceria.diagonal_svg;
            }

            const rowsUpdated = await this.db('Carroceria')
                .where('id_carroceria', id)
                .update(updateData);

            return rowsUpdated > 0;

        } catch(error){
            console.error('Erro ao atualizar carroceria: ', error);
            throw new Error('Erro ao atualizar carroceria');
        }
    }

    async findById(id: number): Promise<Carroceria | undefined> {
        try {
            return await this.db('Carroceria')
                .where('id_carroceria', id)
                .first();
        } catch (error) {
            console.error("Erro ao buscar carroceria por ID:", error);
            throw new Error("Erro ao buscar carroceria");
        }
    }

    async findByNome(nome_modelo: string): Promise<Carroceria | undefined> {
        try {
            return await this.db('Carroceria')
                .where('nome_modelo', nome_modelo)
                .first();
        } catch (error) {
            console.error("Erro ao buscar carroceria por nome:", error);
            throw new Error("Erro ao buscar carroceria");
        }
    }

    async listCarrocerias(): Promise<Carroceria[]> {
        try {
            return await this.db('Carroceria').select('*');
        } catch (error) {
            console.error('Erro ao listar carrocerias:', error);
            throw new Error('Erro ao listar carrocerias');
        }
    }
 }


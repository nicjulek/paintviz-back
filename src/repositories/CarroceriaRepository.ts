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

    async deleteCarroceria(id_carroceria: number): Promise<boolean> {
        try {
            const deleted = await this.db('Carroceria')
                .where('id_carroceria', id_carroceria)
                .del();
            return deleted > 0;
        } catch (error) {
            console.error('Erro ao deletar carroceria:', error);
            return false;
        }
    }

    async updateCarroceria(id_carroceria: number, dados: Partial<Carroceria>): Promise<Carroceria | undefined> {
        try {
            await this.db('Carroceria')
                .where('id_carroceria', id_carroceria)
                .update(dados);
            return await this.findById(id_carroceria);
        } catch (error) {
            console.error('Erro ao atualizar carroceria:', error);
            throw new Error('Erro ao atualizar carroceria');
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

    async salvarSvgPintado(id_carroceria: number, tipo: 'lateral' | 'traseira' | 'diagonal', svg_pintado: string): Promise<boolean> {
        try {
            const coluna = `${tipo}_svg`;
            const updated = await this.db('Carroceria')
                .where('id_carroceria', id_carroceria)
                .update({ [coluna]: svg_pintado });
            return updated > 0;
        } catch (error) {
            console.error('Erro ao salvar SVG pintado da carroceria:', error);
            return false;
        }
    }
}
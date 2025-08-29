import { injectable } from "tsyringe";
import { Status } from "../models";
import { dbConnection } from "../config/database";

@injectable()
export class StatusRepository {
    private db = dbConnection.getConnection();

    async findById(id_status: number): Promise<Status | undefined> {
        try {
            return await this.db('Status').where('id_status', id_status).first();
        } catch (error) {
            console.error('Erro ao buscar status:', error);
            throw new Error('Erro ao buscar status');
        }
    }

    async listStatus(): Promise<Status[]> {
            try {
                return await this.db('Status').select('*');
            } catch (error) {
                console.error('Erro ao listar status:', error);
                throw new Error('Erro ao acessar banco de dados');
            }
        }
}
import { injectable } from "tsyringe";
import { Status } from "../models";
import { dbConnection } from "../config/database";

@injectable()
export class StatusRepository {
    private db = dbConnection.getConnection();

    async createStatus(status: Omit<Status, 'id_status'>): Promise<Status> {
        try {
            const [id_status] = await this.db('Status').insert(status);
            return { id_status, ...status };
        } catch (error) {
            console.error('Erro ao criar status:', error);
            throw new Error('Erro ao criar status');
        }
    }

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
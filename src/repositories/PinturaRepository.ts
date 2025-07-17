import { injectable } from "tsyringe";
import { Pintura } from "../models";
import { dbConnection } from "../config/database";

@injectable()
export class PinturaRepository {
    private db = dbConnection.getConnection();

    async createPintura(pintura: Omit<Pintura, 'id_pintura'>): Promise<Pintura> {
        try {
            const [id] = await this.db('Pintura').insert({
                pintura_svg_lateral: pintura.pintura_svg_lateral,
                pintura_svg_traseira: pintura.pintura_svg_traseira,
                pintura_svg_diagonal: pintura.pintura_svg_diagonal,
                id_carroceria: pintura.id_carroceria,
                id_usuario: pintura.id_usuario
            });

            return { ...pintura, id_pintura: id } as Pintura;
        } catch (error) {
            console.error('Erro ao criar pintura:', error);
            throw new Error('Erro ao criar pintura');
        }
    }

    async deletePintura(id_pintura: number): Promise<boolean> {
        try {
            const deleted = await this.db('Pintura')
                .where('id_pintura', id_pintura)
                .del();

            console.log(`🗑️ Pintura ${id_pintura} deletada do banco`);
            return deleted > 0;
        } catch (error) {
            console.error('Erro ao deletar pintura do banco:', error);
            throw new Error('Erro ao deletar pintura');
        }
    }

    async listPinturas(): Promise<Pintura[]> {
        try {
            return await this.db('Pintura').select('*');
        } catch (error) {
            console.error('Erro ao listar pinturas:', error);
            throw new Error('Erro ao acessar banco de dados');
        }
    }

    async findById(id: number): Promise<Pintura | undefined> {
        try {
            return await this.db('Pintura').where('id_pintura', id).first();
        } catch (error) {
            console.error('Erro ao buscar pintura:', error);
            throw new Error('Erro ao buscar pintura');
        }
    }

    async getSvgByTipo(id_pintura: number, tipo: 'lateral' | 'traseira' | 'diagonal'): Promise<string | null> {
        try {
            const coluna = `pintura_svg_${tipo}`;

            const result = await this.db('Pintura')
                .where('id_pintura', id_pintura)
                .select(coluna)
                .first();

            if (!result) {
                return null;
            }

            return result[coluna];
        } catch (error) {
            console.error(`Erro ao buscar SVG ${tipo} do banco:`, error);
            throw new Error(`Erro ao buscar SVG ${tipo}`);
        }
    }

    async getAllSvgs(id_pintura: number): Promise<any[]> {
        try {
            const pintura = await this.db('Pintura')
                .where('id_pintura', id_pintura)
                .select('id_pintura', 'pintura_svg_lateral', 'pintura_svg_traseira', 'pintura_svg_diagonal')
                .first();

            if (!pintura) {
                return [];
            }

            return [
                {
                    id_pintura: pintura.id_pintura,
                    tipo: 'lateral',
                    svg: pintura.pintura_svg_lateral
                },
                {
                    id_pintura: pintura.id_pintura,
                    tipo: 'traseira',
                    svg: pintura.pintura_svg_traseira
                },
                {
                    id_pintura: pintura.id_pintura,
                    tipo: 'diagonal',
                    svg: pintura.pintura_svg_diagonal
                }
            ];
        } catch (error) {
            console.error('Erro ao buscar todos os SVGs do banco:', error);
            throw new Error('Erro ao buscar SVGs');
        }
    }

    async updateSvg(id_pintura: number, tipo: 'lateral' | 'traseira' | 'diagonal', svg: string): Promise<boolean> {
        try {
            const coluna = `pintura_svg_${tipo}`;

            const updated = await this.db('Pintura')
                .where('id_pintura', id_pintura)
                .update({ [coluna]: svg });

            console.log(`✅ SVG ${tipo} da pintura ${id_pintura} atualizado no banco`);
            return updated > 0;
        } catch (error) {
            console.error(`Erro ao atualizar SVG ${tipo} no banco:`, error);
            throw new Error(`Erro ao atualizar SVG ${tipo}`);
        }
    }

    async pinturaExists(id_pintura: number): Promise<boolean> {
        try {
            const exists = await this.db.schema.hasTable('Pintura') &&
                await this.db('Pintura')
                    .where('id_pintura', id_pintura)
                    .select(1)
                    .limit(1)
                    .then(rows => rows.length > 0);

            return exists;
        } catch (error) {
            console.error('Erro ao verificar existência da pintura:', error);
            return false;
        }
    }

    async getPinturaWithCarroceria(id_pintura: number): Promise<any> {
        try {
            return await this.db('Pintura')
                .join('Carroceria', 'Pintura.id_carroceria', 'Carroceria.id_carroceria')
                .join('Usuario', 'Pintura.id_usuario', 'Usuario.id_usuario')
                .where('Pintura.id_pintura', id_pintura)
                .select(
                    'Pintura.id_pintura',
                    'Pintura.pintura_svg_lateral',
                    'Pintura.pintura_svg_traseira',
                    'Pintura.pintura_svg_diagonal',
                    'Carroceria.nome_modelo',
                    'Carroceria.lateral_svg as carroceria_lateral',
                    'Carroceria.traseira_svg as carroceria_traseira',
                    'Carroceria.diagonal_svg as carroceria_diagonal',
                    'Usuario.nome as criado_por'
                )
                .first();
        } catch (error) {
            console.error('Erro ao buscar pintura com carroceria:', error);
            throw new Error('Erro ao buscar dados');
        }
    }
}
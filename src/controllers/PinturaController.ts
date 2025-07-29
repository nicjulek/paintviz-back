import { Request, Response } from "express";
import { PinturaRepository } from "../repositories/PinturaRepository";
import { inject, injectable } from "tsyringe";

@injectable()
export class PinturaController {
    constructor(
        @inject('PinturaRepository')
        private pinturaRepository: PinturaRepository
    ) { }

    async createPintura(req: Request, res: Response) {
        try {
            const { pintura_svg_lateral, pintura_svg_traseira, pintura_svg_diagonal, id_carroceria, id_usuario } = req.body;

            if (!pintura_svg_lateral || !pintura_svg_traseira || !pintura_svg_diagonal || !id_carroceria || !id_usuario) {
                return res.status(400).json({
                    error: 'Todos os campos são obrigatórios: pintura_svg_lateral, pintura_svg_traseira, pintura_svg_diagonal, id_carroceria, id_usuario'
                });
            }

            const novaPintura = await this.pinturaRepository.createPintura({
                pintura_svg_lateral,
                pintura_svg_traseira,
                pintura_svg_diagonal,
                id_carroceria: Number(id_carroceria),
                id_usuario: Number(id_usuario)
            });

            return res.status(201).json(novaPintura);
        } catch (error) {
            console.error('Erro no controller:', error);
            return res.status(500).json({ error: 'Erro interno do servidor' });
        }
    }


    async deletePintura(req: Request, res: Response) {
        try {
            const { id } = req.params;

            // Verificar se pintura existe
            const pinturaExists = await this.pinturaRepository.pinturaExists(Number(id));
            if (!pinturaExists) {
                return res.status(404).json({ error: 'Pintura não encontrada' });
            }

            const deleted = await this.pinturaRepository.deletePintura(Number(id));

            if (!deleted) {
                return res.status(500).json({ error: 'Erro ao deletar pintura' });
            }

            return res.status(200).json({
                message: 'Pintura deletada com sucesso'
            });
        } catch (error) {
            console.error('Erro no controller:', error);
            return res.status(500).json({ error: 'Erro interno do servidor' });
        }
    }

    async listPinturas(req: Request, res: Response) {
        try {
            const pinturas = await this.pinturaRepository.listPinturas();
            return res.status(200).json(pinturas);
        } catch (error) {
            console.error('Erro no controller:', error);
            return res.status(500).json({ error: 'Erro interno do servidor' });
        }
    }

    async getPinturaById(req: Request, res: Response) {
        try {
            const { id } = req.params;

            const pintura = await this.pinturaRepository.findById(Number(id));

            if (!pintura) {
                return res.status(404).json({ error: 'Pintura não encontrada' });
            }

            return res.status(200).json(pintura);
        } catch (error) {
            console.error('Erro no controller:', error);
            return res.status(500).json({ error: 'Erro interno do servidor' });
        }
    }

    async getSvgByTipo(req: Request, res: Response) {
        try {
            const { id, tipo } = req.params;

            if (!['lateral', 'traseira', 'diagonal'].includes(tipo)) {
                return res.status(400).json({
                    error: 'Tipo inválido. Use: lateral, traseira ou diagonal'
                });
            }

            const svg = await this.pinturaRepository.getSvgByTipo(
                Number(id),
                tipo as 'lateral' | 'traseira' | 'diagonal'
            );

            if (!svg) {
                return res.status(404).json({ error: 'SVG não encontrado' });
            }

            const format = req.query.format as string;
            if (format === 'svg') {
                return res.set('Content-Type', 'image/svg+xml').send(svg);
            }

            return res.status(200).json({
                id_pintura: Number(id),
                tipo,
                svg
            });
        } catch (error) {
            console.error('Erro ao buscar SVG:', error);
            return res.status(500).json({ error: 'Erro interno do servidor' });
        }
    }

    async getAllSvgs(req: Request, res: Response) {
        try {
            const { id } = req.params;

            const svgs = await this.pinturaRepository.getAllSvgs(Number(id));

            if (svgs.length === 0) {
                return res.status(404).json({ error: 'Pintura não encontrada' });
            }

            return res.status(200).json(svgs);
        } catch (error) {
            console.error('Erro no controller:', error);
            return res.status(500).json({ error: 'Erro interno do servidor' });
        }
    }

    async updateSvg(req: Request, res: Response) {
        try {
            const { id, tipo } = req.params;
            const { svg } = req.body;

            if (!['lateral', 'traseira', 'diagonal'].includes(tipo)) {
                return res.status(400).json({
                    error: 'Tipo inválido. Use: lateral, traseira ou diagonal'
                });
            }

            if (!svg) {
                return res.status(400).json({ error: 'SVG é obrigatório' });
            }

            const pinturaExists = await this.pinturaRepository.pinturaExists(Number(id));
            if (!pinturaExists) {
                return res.status(404).json({ error: 'Pintura não encontrada' });
            }

            const updated = await this.pinturaRepository.updateSvg(
                Number(id),
                tipo as 'lateral' | 'traseira' | 'diagonal',
                svg
            );

            if (!updated) {
                return res.status(500).json({ error: 'Erro ao atualizar SVG' });
            }

            return res.status(200).json({
                message: `SVG ${tipo} atualizado com sucesso`
            });
        } catch (error) {
            console.error('Erro no controller:', error);
            return res.status(500).json({ error: 'Erro interno do servidor' });
        }
    }

}
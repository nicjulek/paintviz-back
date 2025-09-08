import { Request, Response } from "express";
import { PecaRepository } from "repositories/PecaRepository";
import { inject, injectable } from "tsyringe";

@injectable()
export class PecaController {
    constructor(
        @inject('PecaRepository')
        private pecaRepository: PecaRepository
    ) { }

    async createPeca(req: Request, res: Response): Promise<Response> {
        try {
            const { nome_peca, id_svg, id_carroceria, id_cor, id_pintura } = req.body;

            if (!nome_peca || !id_svg || !id_carroceria) {
                return res.status(400).json({
                    error: 'Os campos são obrigatórios.'
                });
            }

            const novaPeca = await this.pecaRepository.createPeca({
                nome_peca,
                id_svg,
                id_carroceria,
                id_pintura,
                id_cor
            });

            return res.status(201).json({
                message: 'Peça criada com sucesso',
                peca: novaPeca
            });
        } catch (error) {
            console.error("Erro ao criar peça:", error);
            return res.status(500).json({ error: 'Erro ao criar peça.' });
        }
    }

    async aplicarCorNaPeca(req: Request, res: Response) {
        try {
            const { id_peca } = req.params;
            const { id_cor, cod_cor, svg_carroceria } = req.body;

            if ((!id_cor && !cod_cor) || !svg_carroceria) {
                return res.status(400).json({
                    error: 'id_cor ou cod_cor e svg_carroceria são obrigatórios'
                });
            }

            const peca = await this.pecaRepository.findPecaById(Number(id_peca));
            if (!peca) {
                return res.status(404).json({ error: 'Peça não encontrada' });
            }

            let cor;
            let corParaAplicar;

            if (id_cor) {
                cor = await this.pecaRepository.findCorById(id_cor);
                if (!cor) {
                    return res.status(404).json({ error: 'Cor não encontrada' });
                }
                corParaAplicar = cor.cod_cor;
                // Atualiza a cor da peça no banco
                await this.pecaRepository.updatePeca(Number(id_peca), { id_cor });
            } else {
                corParaAplicar = cod_cor;
                // Se quiser, pode salvar cod_cor em outro campo, ou ignorar
                await this.pecaRepository.updatePeca(Number(id_peca), { id_cor: null });
            }

            // Aplica a cor no SVG
            const svgAtualizado = aplicarCorNoSvg(svg_carroceria, peca.id_svg, corParaAplicar);

            return res.status(200).json({
                message: 'Cor aplicada com sucesso',
                svg_atualizado: svgAtualizado,
                peca_atualizada: {
                    ...peca,
                    id_cor: id_cor || null,
                    cor_aplicada: corParaAplicar
                }
            });

        } catch (error) {

        }
    }

    async listPecas(req: Request, res: Response) {
        try {
            const id_carroceria = parseInt(req.query.id_carroceria as string);
            if (isNaN(id_carroceria)) {
                return res.status(400).json({ error: "id_carroceria é obrigatório" });
            }

            const pecas = await this.pecaRepository.listPecasPorModelo(id_carroceria);
            return res.status(200).json(pecas);
        } catch (error) {
            console.error("Erro no controller ao listar peças:", error);
            return res.status(500).json({ error: "Erro ao listar peças" });
        }
    }

    async findPecaById(req: Request, res: Response) {
        try {
            const id = parseInt(req.params.id);
            const peca = await this.pecaRepository.findPecaById(id);

            if (!peca) {
                return res.status(404).json({ error: "Peça não encontrada" });
            }

            return res.status(200).json(peca);
        } catch (error) {
            console.error("Erro no controller ao buscar peça por ID:", error);
            return res.status(500).json({ error: "Erro ao buscar peça" });
        }
    }

    async updatePeca(req: Request, res: Response) {
        try {
            const id = parseInt(req.params.id);
            const dadosAtualizados = req.body;

            const pecaAtualizada = await this.pecaRepository.updatePeca(id, dadosAtualizados);

            if (!pecaAtualizada) {
                return res.status(404).json({ error: "Peça não encontrada para atualização" });
            }

            return res.status(200).json(pecaAtualizada);
        } catch (error) {
            console.error("Erro no controller ao atualizar peça:", error);
            return res.status(500).json({ error: "Erro ao atualizar peça" });
        }
    }
}

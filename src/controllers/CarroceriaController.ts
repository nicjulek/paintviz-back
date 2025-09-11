import { Request, Response } from "express";
import { inject, injectable } from "tsyringe";
import { CarroceriaRepository } from "../repositories/CarroceriaRepository";
import { PecaRepository } from "../repositories/PecaRepository";
import { AuthRequest } from "../models";

@injectable()
export class CarroceriaController {
    constructor(
        @inject('CarroceriaRepository')
        private carroceriaRepository: CarroceriaRepository,
        @inject('PecaRepository')
        private pecaRepository: PecaRepository
    ) { }

    async createCarroceria(req: AuthRequest, res: Response) {
        try {
            const { nome_modelo, lateral_svg, traseira_svg, diagonal_svg } = req.body;

            if (!nome_modelo || nome_modelo.trim().length === 0) {
                return res.status(400).json({ error: 'Nome do modelo é obrigatório' });
            }
            if (!lateral_svg || !traseira_svg || !diagonal_svg) {
                return res.status(400).json({ error: 'Todos os arquivos SVG são obrigatórios.' });
            }

            const carroceriaExistente = await this.carroceriaRepository.findByNome(nome_modelo);
            if (carroceriaExistente) {
                return res.status(400).json({ error: 'Carroceria já existe' });
            }

            const novaCarroceria = await this.carroceriaRepository.createCarroceria({
                nome_modelo: nome_modelo.trim(),
                lateral_svg,
                traseira_svg,
                diagonal_svg
            });

            return res.status(201).json({
                message: 'Carroceria criada com sucesso',
                carroceria: novaCarroceria
            });
        } catch (error) {
            console.error('Erro ao criar carroceria:', error);
            return res.status(500).json({
                error: 'Erro interno do servidor'
            });
        }
    }

    // Aplica múltiplas cores no SVG da carroceria e retorna as peças pintadas (apenas id e cor)
    async aplicarCoresNaCarroceria(req: Request, res: Response) {
        try {
            const { svg_carroceria, cores_pecas, id_carroceria } = req.body;

            if (!svg_carroceria || !Array.isArray(cores_pecas) || !id_carroceria) {
                return res.status(400).json({
                    error: 'svg_carroceria, cores_pecas (array) e id_carroceria são obrigatórios'
                });
            }

            // Buscar peças cadastradas para a carroceria
            const pecas = await this.pecaRepository.listPecasPorModelo(id_carroceria);
            const idsValidos = pecas.map(p => p.id_svg);

            // Pintar SVG da carroceria (apenas peças cadastradas)
            let svgCarroceriaPintado = svg_carroceria;
            for (const corPeca of cores_pecas) {
                if (idsValidos.includes(corPeca.id_svg)) {
                    svgCarroceriaPintado = aplicarCorNoSvg(svgCarroceriaPintado, corPeca.id_svg, corPeca.cod_cor);
                }
            }

            // Retorna apenas id_peca, id_svg e cor aplicada
            const pecasPintadas = [];
            for (const peca of pecas) {
                const corPeca = cores_pecas.find(cp => cp.id_svg === peca.id_svg);
                if (corPeca) {
                    pecasPintadas.push({
                        id_peca: peca.id_peca,
                        id_svg: peca.id_svg,
                        cor_aplicada: corPeca.cod_cor
                    });
                }
            }

            return res.status(200).json({
                message: 'Cores aplicadas nas peças e carroceria',
                svg_carroceria_pintado: svgCarroceriaPintado,
                pecas_pintadas: pecasPintadas
            });

        } catch (error) {
            console.error('Erro ao aplicar cores na carroceria:', error);
            return res.status(500).json({ error: 'Erro interno do servidor' });
        }
    }

    async deleteCarroceria(req: Request, res: Response) {
        try {
            const { id } = req.params;

            if (!id) {
                return res.status(400).json({ error: 'ID da carroceria é obrigatório' });
            }

            await this.carroceriaRepository.deleteCarroceria(Number(id));

            return res.status(200).json({
                message: 'Carroceria deletada com sucesso'
            });
        } catch (error) {
            console.log('Erro ao deletar carroceria:', error);
            return res.status(500).json({ error: 'Erro interno do servidor' });
        }
    }

    async updateCarroceria(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const { nome_modelo, lateral_svg, traseira_svg, diagonal_svg } = req.body;

            if (!id) {
                return res.status(400).json({ error: 'ID da carroceria é obrigatório' });
            }

            // Verifica se existe
            const carroceriaExistente = await this.carroceriaRepository.findById(Number(id));
            if (!carroceriaExistente) {
                return res.status(404).json({ error: 'Carroceria não encontrada' });
            }

            // Atualiza
            const sucesso = await this.carroceriaRepository.updateCarroceria(Number(id), {
                nome_modelo: nome_modelo?.trim(),
                lateral_svg,
                traseira_svg,
                diagonal_svg
            });

            if (!sucesso) {
                return res.status(500).json({ error: 'Falha ao atualizar a carroceria' });
            }

            return res.status(200).json({ message: 'Carroceria atualizada com sucesso' });

        } catch (error) {
            console.error('Erro ao atualizar carroceria:', error);
            return res.status(500).json({ error: 'Erro interno do servidor' });
        }
    }

    async listPecasPorCarroceria(req: Request, res: Response) {
        try {
            const { id } = req.params;
            if (!id) {
                return res.status(400).json({ error: 'ID da carroceria é obrigatório' });
            }

            const pecas = await this.pecaRepository.listPecasPorModelo(Number(id));
            return res.status(200).json(pecas);
        } catch (error) {
            console.error('Erro ao listar peças da carroceria:', error);
            return res.status(500).json({ error: 'Erro interno do servidor' });
        }
    }

    async findById(req: Request, res: Response) {
        try {
            const { id } = req.params;

            if (!id) {
                return res.status(400).json({ error: 'ID do cliente é obrigatório' });
            }

            const carroceria = await this.carroceriaRepository.findById(Number(id));

            if (!carroceria) {
                return res.status(404).json({ error: 'Carroceria não encontrada' });
            }

            return res.status(200).json(carroceria);
        } catch (error) {
            console.log('Erro ao buscar carroceria:', error);
            return res.status(500).json({ error: 'Erro interno do servidor' });
        }
    }

    async findByNome(req: Request, res: Response) {
        try {
            const { nome_modelo } = req.params;

            if (!nome_modelo) {
                return res.status(400).json({ error: 'Nome do modelo é obrigatório' });
            }

            const carroceria = await this.carroceriaRepository.findByNome(String(nome_modelo));

            if (!carroceria) {
                return res.status(404).json({ error: 'Carroceria não encontrada' });
            }

            return res.status(200).json(carroceria);
        } catch (error) {
            console.log('Erro ao buscar carroceria:', error);
            return res.status(500).json({ error: 'Erro interno do servidor' });
        }
    }

    async listCarrocerias(req: Request, res: Response) {
        try {
            const carrocerias = await this.carroceriaRepository.listCarrocerias();
            return res.status(200).json(carrocerias);
        } catch (error) {
            console.log('Erro ao listar carrocerias:', error);
            return res.status(500).json({ error: 'Erro interno do servidor' });
        }
    }
}

// Função utilitária para aplicar cor no SVG
function aplicarCorNoSvg(svgOriginal: string, idPeca: string, codCor: string): string {
    try {
        const regex = new RegExp(`(<[^>]+id="${idPeca}"[^>]*)(fill="[^"]*")?([^>]*>)`, 'gi');
        return svgOriginal.replace(regex, (match, before, fillAttr, after) => {
            let novo = before.replace(/fill="[^"]*"/gi, '');
            return `${novo} fill="${codCor}"${after}`;
        });
    } catch (error) {
        console.error('Erro ao aplicar cor no SVG:', error);
        return svgOriginal;
    }
}


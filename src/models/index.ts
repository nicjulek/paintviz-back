// ========= USUARIO =========
export interface Usuario {
  id_usuario?: number;
  nome: string;
  senha: string;
}

export interface Administrador {
  id_usuario: number;
}

// ========= PALETA =========
export interface Paleta {
  id_paleta?: number;
  nome_paleta: string;
}

export interface Cor {
  id_cor?: number;
  nome_cor: string;
  cod_cor: string;
  id_paleta: number;
}

export interface PaletaCor {
  id_paleta: number;
  id_cor: number;
}

// ========= CLIENTE =========
export interface Cliente {
  id_cliente?: number;
  celular: string;
  email: string;
  //Adicionado para suportar pessoa física e jurídica
  pessoa_fisica?: Fisico | null;
  pessoa_juridica?: Juridico | null;
}

export interface Fisico {
  id_cliente: number;
  nome: string;
  cpf: string;
}

export interface Juridico {
  id_cliente: number;
  empresa: string;
  razao_social?: string;
  cnpj: string;
}

// ========= CARROCERIA =========
export interface Carroceria {
  id_carroceria?: number;
  nome_modelo: string;
  lateral_svg?: string;
  traseira_svg?: string;
  diagonal_svg?: string;
  data_criacao?: Date;
}

// ========= PINTURA =========
export interface Pintura {
  id_pintura?: number;
  pintura_svg_lateral: string;
  pintura_svg_traseira: string;
  pintura_svg_diagonal: string;
  id_carroceria: number;
  id_usuario: number;
}

// ========= PECA =========
export interface Peca {
  id_peca?: number;
  nome_peca: string;
  id_svg: string;
  id_cor?: number;
  id_pintura: number;
  id_carroceria: number;
}

// ========= ORDEM DE SERVICO =========
export interface Status {
  id_status?: number;
  descricao: string;
  data_definicao_status: Date;
}

export interface OrdemDeServico {
  id_ordem_servico?: number;
  identificacao_veiculo: string;
  data_emissao: Date;
  data_entrega?: Date;
  data_programada?: Date;
  modelo_veiculo: string;
  placa_veiculo: string;
  numero_box?: string;
  id_cliente: number;
  id_usuario_responsavel: number;
  id_status: number;
  id_pintura?: number;
  data_ultima_modificacao?: Date;
}
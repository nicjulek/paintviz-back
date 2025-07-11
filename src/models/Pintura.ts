export interface Pintura {
  id_pintura?: number
  pintura_svg_lateral: string
  pintura_svg_traseira: string
  pintura_svg_diagonal: string
  id_carroceria: number
  id_usuario: number
}

export interface PinturaSvg {
  id_pintura: number
  tipo: 'lateral' | 'traseira' | 'diagonal'
  svg: string
}
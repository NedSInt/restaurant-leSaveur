import Categoria from "../categoria/categoria.ts";

export default class Produto {
    
    public id: number = 0;
    public descricao: string = '';
    public codigo: string = '';
    public preco: Number = 0.00;
    public categoria: Categoria|null;

    constructor(id: number = 0,
        descricao: string = '',
        codigo: string = '',
        preco: number = 0.00,
        categoria: Categoria|null
    ){
        this.id = id;
        this.descricao = descricao;
        this.codigo = codigo;
        this.preco = preco;
        this.categoria = categoria;
    }
}
export default class Categoria {
    
    public id: number = 0;
    public nome: string = '';

    constructor(id: number = 0,
        nome: string = ''
    ){
        this.id = id;
        this.nome = nome;
    }
}
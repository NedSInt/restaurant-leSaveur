export default class Cliente {
    public id: number;
    public nome: string;
    public telefoneCelular: string;

    constructor ( id: number, nome: string, telefoneCelular: string = '' ) {
        this.id = id;
        this.nome = nome;
        this.telefoneCelular = telefoneCelular;
    }
}
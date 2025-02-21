export default class Funcionario {
    
    public id: number = 0;
    public nome: string = '';
    public login: string = '';

    constructor(id: number = 0,
        nome: string = '',
        login: string = '',
    ){
        this.id = id;
        this.nome = nome;
        this.login = login;
    }
}
export default class UtilLocalStorage {

    static obterFuncionario(){
        const dadosFuncionario = localStorage.getItem("dadosFuncionario");
        return dadosFuncionario ? JSON.parse(dadosFuncionario) : null;
    }

    static obterIdFuncionario(){
        const funcionarioLogado = localStorage.getItem('dadosFuncionario');
        const funcionario = funcionarioLogado ? JSON.parse(funcionarioLogado) : {};

        return parseInt(funcionario.id ?? 0);
    }

    static salvarFuncionario(dadosFuncionario){
        localStorage.setItem('dadosFuncionario', JSON.stringify(dadosFuncionario));
    }

    static removerFuncionario(){
        localStorage.removeItem('dadosFuncionario');
    }

}
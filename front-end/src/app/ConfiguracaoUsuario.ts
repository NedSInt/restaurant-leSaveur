import LoginControladora from './login/login-controladora';
import UtilLocalStorage from './UtilLocalStorage';

export function configurarPermissoes(): void {
    const usuarioLogado = UtilLocalStorage.obterFuncionario();

    if (usuarioLogado?.cargo !== 'GERENTE') {
        const relatoriosVendasMenu = document.querySelector('[data-relatorio-vendas]');

        if (relatoriosVendasMenu) {
            relatoriosVendasMenu.remove();
        }
    }
}

export function exibirNomeUsuarioLogado(): void {
    const usuarioLogado = UtilLocalStorage.obterFuncionario();

    const usuarioLogadoElemento = document.getElementById('usuario-logado');

    if (usuarioLogado && usuarioLogadoElemento) {
        usuarioLogadoElemento.textContent = usuarioLogado.nome || 'Usuário Desconhecido';
    }
}

export function adicionaEventoLogout () {
    document.getElementById('logout-button')!.addEventListener("click", (e) => {
        e.preventDefault();
        const loginControladora = new LoginControladora( this );
        loginControladora.logout();
    });
}

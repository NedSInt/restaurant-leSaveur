import './routes.ts';
import { configurarPermissoes, exibirNomeUsuarioLogado, adicionaEventoLogout } from './app/ConfiguracaoUsuario.ts';

document.addEventListener('DOMContentLoaded', () => {
    configurarPermissoes();
    exibirNomeUsuarioLogado();
    adicionaEventoLogout();
});

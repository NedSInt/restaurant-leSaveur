
// import Funcionario from '../funcionario/funcionario.ts';
import Requisicao from '../requisicao.ts';
import UtilLocalStorage from '../UtilLocalStorage.ts';
// import UtilReservaData from '../UtilDataReserva.ts';

const ROTA = 'login';
const ROTA_LOGOUT = 'logout'

export class LoginGestor {

    async login (login: string, senha: string) {
        const dadosLogin = await Requisicao.post(ROTA, { login: login, senha: senha });

        if (dadosLogin) {
            const { id, login, nome, cargo } = dadosLogin;
            UtilLocalStorage.salvarFuncionario({ id, login, nome, cargo });
        }

        return dadosLogin;
    }

    async logout () {
        const dadosLogout = await Requisicao.post(ROTA_LOGOUT, {});

        return dadosLogout;
    }
    
}
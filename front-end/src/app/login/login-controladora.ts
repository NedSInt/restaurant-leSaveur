// import DadosNaoEncontradosError from "../error/dados-nao-encontrados-error.ts";
// import DataInvalidaParaSolicitarReservaError from "../error/error-with-data.ts";
// import RequisicaoError from "../error/requisicao-error.ts";
import { LoginGestor } from "./login-gestor.ts";
import { LoginVisao } from "./login-visao.ts";

export default class LoginControladora {

    public loginGestor: LoginGestor;
    public loginVisao: LoginVisao;

    constructor(loginVisao: LoginVisao) {
        this.loginGestor = new LoginGestor();
        this.loginVisao = loginVisao;
    }

    async login() {
        try{

            const { login, senha } = this.loginVisao.dadosLogin();

            const response = await this.loginGestor.login(login, senha)

            if(! response )  {
                this.loginVisao.renderizarMensagemErro("Login e senha incorretos");

                return ;
            }
            
            window.location.href = "/";
        } catch( e ){
            this.loginVisao.renderizarMensagemErro(e.message);
        }
    }

    async logout() {
        try{
            await this.loginGestor.logout()

            window.location.href = "/login";
        } catch( e ){
            console.log(e)
            this.loginVisao.renderizarMensagemErro(e.message);
        }
    }
}
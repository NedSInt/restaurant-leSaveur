import Toastify from 'toastify-js';
import 'toastify-js/src/toastify.css';
import { Visao } from "../views/visao.ts";
import LoginControladora from "./login-controladora.ts";
import UtilLocalStorage from '../UtilLocalStorage.ts';

const TITULO_LOGIN = 'Login do funcionário'
export class LoginVisao {

    private loginControladora: LoginControladora;


    constructor(){
        this.loginControladora = new LoginControladora(this);
    }

    public iniciarLogin(): void {
        this.renderizaTemplateLogin();

        UtilLocalStorage.removerFuncionario();

        Visao.atualizaTitulo(TITULO_LOGIN);
    }

    public dadosLogin() {
        const login = (document.getElementById('login') as HTMLInputElement).value;
        const senha = (document.getElementById('senha') as HTMLInputElement).value;

        return {login: login, senha: senha};
    }


    public renderizaTemplateLogin(): void {

        Visao.renderizar(`
            <div class="container d-flex justify-content-center align-items-center vh-100">
                <div class="card shadow-sm p-4" style="max-width: 400px; width: 100%;">
                    <h2 class="text-center mb-4">Login</h2>
                    <form id="loginForm">
                        <div class="mb-3">
                            <label for="login" class="form-label">Usuário</label>
                            <div class="input-group">
                                <span class="input-group-text"><i class="bi bi-person"></i></span>
                                <input type="text" id="login" class="form-control" placeholder="Digite seu usuário" required />
                            </div>
                        </div>
                        <div class="mb-3">
                            <label for="senha" class="form-label">Senha</label>
                            <div class="input-group">
                                <span class="input-group-text"><i class="bi bi-lock"></i></span>
                                <input type="password" id="senha" class="form-control" placeholder="Digite sua senha" required />
                            </div>
                        </div>
                        <button type="submit" id="botaoLogar" class="btn btn-primary w-100">Entrar</button>
                    </form>
                    <div id="mensagem" class="mt-3 text-center"></div>
                </div>
            </div>
        `, true);
        

        document.getElementById('loginForm')?.addEventListener("submit", (e) => {
            e.preventDefault();
            this.loginControladora.login();
        });
        
    }

    public renderizarMensagemErro(mensagem: string){
        Toastify({
            text: mensagem,
            duration: 2000,
            close: true,
            gravity: "top",
            position: "right",
            backgroundColor: " #ff5f6d",
            stopOnFocus: true
        }).showToast();
    }
}
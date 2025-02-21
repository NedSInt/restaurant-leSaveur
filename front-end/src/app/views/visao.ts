import { PaginaInicialVisao } from "./pagina-inicial-visao.ts";
import Toastify from 'toastify-js';
import 'toastify-js/src/toastify.css';


export class Visao{

    public static atualizaTitulo(titulo: string): void{
        document.title = titulo;
    }

    public static renderizar(conteudo: string, isLogin: boolean = false): void{
        const app = document.getElementById( 'app' );

        if(isLogin) this.renderizarSemTemplate(conteudo);

        if (app) app.innerHTML = conteudo;
    }

    public static renderizarSemTemplate(conteudo: string) {
        const body = document.querySelector('body')!;
        body.innerHTML = '';
        body.innerHTML = conteudo;
    }

    public static paginaNaoEncontrada(): void {
        new PaginaInicialVisao().iniciar();

        Toastify({
            text: "Página não encontrada.",
            duration: 2000,
            close: true,
            gravity: "top",
            position: "right",
            backgroundColor: " #ff5f6d",
            stopOnFocus: true
        }).showToast();
    
        window.history.pushState("", "", "/");
    }
    
}
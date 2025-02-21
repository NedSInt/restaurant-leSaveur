import RequisicaoError from "./error/requisicao-error.ts";
import RequisicaoInvalidaError from "./error/requisicao-invalida-error.ts";
import DadosNaoEncontradosError from "./error/dados-nao-encontrados-error.ts";

const URL_SERVIDOR = 'http://localhost:8080/';

const STATUS_SEM_CONTEUDO = 204;

export default class Requisicao{

    static async post(rota: string, dadosPost: object){
        const response = await fetch(URL_SERVIDOR + rota, {
            method: 'POST',
            body: JSON.stringify(dadosPost),
            credentials: 'include'
        });

        const dados = await response.json();

        if( ! response.ok ){
            throw new RequisicaoError(dados.mensagem ?? '', dados.problemas ?? []);
        }

        return dados;
    }

    static async put(rota: string, dadosPut: object){
        const response = await fetch(URL_SERVIDOR + rota, {
            method: 'PUT',
            body: JSON.stringify(dadosPut),
            credentials: 'include'
        });

        const dados = await response.json();

        if( ! response.ok ){
            throw new RequisicaoError(dados.mensagem ?? '', dados.problemas ?? []);
        }

        return dados;
    }

    static async get(rota: string, parametros: object|never = {}){

        let parametrosQueryArray = [];
        let parametrosQuery: string = '';
        if( typeof parametros == 'object' ){
            for (const key in parametros) {
                const valor = parametros[key];
                parametrosQueryArray.push( key + "=" + valor );
            }
            parametrosQuery = '?' + parametrosQueryArray.join('&');
        }

        const response = await fetch(URL_SERVIDOR + rota + parametrosQuery, {credentials: 'include'});

        if(response.status == STATUS_SEM_CONTEUDO){
            throw new DadosNaoEncontradosError('Dados não encontrados.');
        }

        const dados = await response.json();

        if( ! response.ok ){
            throw new RequisicaoError(dados.mensagem ?? '', dados.problemas ?? []);
        }

        return dados;
    }

    static async patch(rota: string, dadosPatch: object){
        try {
            const response = await fetch(URL_SERVIDOR + rota, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(dadosPatch),
                credentials: 'include'
            });

            const dados = await response.json();

            if ( ! response.ok ) {
                throw new RequisicaoError(dados.mensagem ?? '', dados.problemas ?? []);
            }

            return response;

        } catch (error) {
            console.error('Erro na requisição:', error.message);
        }
    }

}
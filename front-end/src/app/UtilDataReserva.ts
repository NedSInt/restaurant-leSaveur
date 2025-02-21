export default class UtilReservaData {

    static formatarDataParaRequisicao(data: Date){

        let dia = data.getDate().toString().padStart(2, '0');

        let mes = (data.getMonth()+1).toString().padStart(2, '0');

        let ano = data.getFullYear();
        let hora = data.getHours().toString().padStart(2, '0');
        let minutos = data.getMinutes().toString().padStart(2, '0');
        let segundos = data.getSeconds().toString().padStart(2, '0');

        return `${ano}-${mes}-${dia} ${hora}:${minutos}:${segundos}`;
    }
}
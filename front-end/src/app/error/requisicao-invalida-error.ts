import ErrorWithData from './error-with-data.ts';

export default class RequisicaoInvalidaError extends ErrorWithData {

    constructor(message: string, data: any = ''){
        super(message, data);
    }

}
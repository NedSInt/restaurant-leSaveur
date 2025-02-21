import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ReservaVisao } from '../src/app/reserva/reserva-visao.ts';


describe('ReservaVisao', () => {
  let reservaVisao: ReservaVisao;

  beforeEach(() => {
    reservaVisao = new ReservaVisao();
  });

  it('deve inicializar corretamente', () => {
    expect(reservaVisao).toBeDefined();
  });

  it('deve desabilitar o envio do formulário corretamente', () => {
    document.body.innerHTML = `<button type="submit" class="btn btn-primary">Reservar</button>`;
    const botao = document.querySelector('button[type=submit]')!;
    reservaVisao.desabilitarEnvioFormulario();
    expect(botao.getAttribute('disabled')).toBe('disabled');
  });

  
  it('deve habilitar o envio do formulário corretamente', () => {
    document.body.innerHTML = `<button type="submit" class="btn btn-primary">Reservar</button>`;
    const botao = document.querySelector('button[type=submit]')!;
    reservaVisao.habilitarEnvioFormulario();
    expect(botao.hasAttribute('disabled')).toBe(false);
  });

  it('deve retornar a data do dia seguinte', () => {
    const dataInicial = new Date('2024-12-01T10:00:00Z');

    const dataEsperada = new Date(2024, 11, 2);
    const resultado = reservaVisao.criarDataSemHoras(dataInicial);

    expect(resultado.getFullYear()).toEqual(dataEsperada.getFullYear());
    expect(resultado.getMonth()).toEqual(dataEsperada.getMonth());
    expect(resultado.getDate()).toEqual(dataEsperada.getDate());

    expect(resultado.getHours()).toEqual(0);
    expect(resultado.getMinutes()).toEqual(0);
    expect(resultado.getSeconds()).toEqual(0);
    expect(resultado.getMilliseconds()).toEqual(0);
  });

  it('deve retornar as datas mínima e máxima corretas para o mês atual', () => {
    const resultado = reservaVisao.defineDataPadrao();

    const hoje = new Date();
    const esperadoDataMinima = new Date(hoje.getFullYear(), hoje.getMonth(), 1);
    const esperadoDataMaxima = new Date(hoje.getFullYear(), hoje.getMonth() + 1, 0);

    expect(resultado.dataMinima).toEqual(esperadoDataMinima);

    expect(resultado.dataMaxima).toEqual(esperadoDataMaxima);
  });
});

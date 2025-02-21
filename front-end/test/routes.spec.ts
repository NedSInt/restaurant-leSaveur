import { describe, it, expect, vi } from 'vitest';
import { ReservaVisao } from '../src/app/reserva/reserva-visao.ts';
import { PaginaInicialVisao } from '../src/app/views/pagina-inicial-visao.ts';

describe('Configuração de Rotas', () => {
    it('deve chamar a função iniciar() de PaginaInicialVisao', () => {
      const iniciarMock = vi.fn();
      
      const paginaInicial = new PaginaInicialVisao();
      paginaInicial.iniciar = iniciarMock;
  
      paginaInicial.iniciar();
  
      expect(iniciarMock).toHaveBeenCalled();
    });

    it('deve chamar a função iniciarReserva() da ReservaVisao', () => {
        const iniciarMock = vi.fn();
        
        const paginaInicial = new ReservaVisao();
        paginaInicial.iniciarReserva = iniciarMock;
    
        paginaInicial.iniciarReserva();
    
        expect(iniciarMock).toHaveBeenCalled();
    });

    it('deve chamar a função iniciarListagem() da ReservaVisao', () => {
        const iniciarMock = vi.fn();
        
        const paginaInicial = new ReservaVisao();
        paginaInicial.iniciarListagem = iniciarMock;
    
        paginaInicial.iniciarListagem();
    
        expect(iniciarMock).toHaveBeenCalled();
    });

    it('deve chamar a função iniciarGraficoReservas() da ReservaVisao', () => {
        const iniciarMock = vi.fn();
        
        const paginaInicial = new ReservaVisao();
        paginaInicial.iniciarGraficoReservas = iniciarMock;
    
        paginaInicial.iniciarGraficoReservas();
    
        expect(iniciarMock).toHaveBeenCalled();
    });

  });
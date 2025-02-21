import { describe, it, expect, vi } from 'vitest';
import MesaVisao from '../src/app/mesa/mesa-visao';
import Mesa from '../src/app/mesa/mesa.ts';

describe('MesaVisao', () => {

  it('deve chamar listarOptions da mesaControladora ao iniciarOptions', () => {
    const mesaVisao = new MesaVisao();
    const data = new Date();
    
    vi.spyOn(mesaVisao['mesaControladora'], 'listarOptions');
    
    mesaVisao.iniciarOptions(data);
    
    expect(mesaVisao['mesaControladora'].listarOptions).toHaveBeenCalledWith(data, false);
  });

  it('deve adicionar opções ao select quando mesas forem passadas', () => {
    const mesaVisao = new MesaVisao();
    const mesas: Mesa[] = [
      { id: 1, nome: 'Mesa 1' },
      { id: 2, nome: 'Mesa 2' }
    ];
    
    document.body.innerHTML = '<select id="mesa"></select>';
    
    mesaVisao.desenharOptionsMesas(mesas);
    
    const selectMesa = document.getElementById('mesa');
    
    expect(selectMesa?.children.length).toBe(3);
    expect(selectMesa?.children[1].innerText).toBe('Mesa 1');
    expect(selectMesa?.children[2].innerText).toBe('Mesa 2');
  });
  
  it('deve adicionar a opção "Sem mesas disponíveis..." quando não houver mesas', () => {
    const mesaVisao = new MesaVisao();
    const mesas: Mesa[] = [];
    
    // Espiando o DOM
    document.body.innerHTML = '<select id="mesa"></select>';
    
    mesaVisao.desenharOptionsMesas(mesas);
    
    const selectMesa = document.getElementById('mesa');
    
    // Verificando se a opção "Sem mesas disponíveis..." foi adicionada
    expect(selectMesa?.children[0].innerText).toBe('Sem mesas disponíveis...');
  });

  it('deve remover as opções do select', () => {
    const mesaVisao = new MesaVisao();
    
    document.body.innerHTML = '<select id="mesa"><option value="1">Mesa 1</option></select>';
    
    mesaVisao.removerOptions();
    
    const selectMesa = document.getElementById('mesa');
    
    expect(selectMesa?.children.length).toBe(0);
  });

  it('deve adicionar a opção "Carregando mesas" ao select', () => {
    const mesaVisao = new MesaVisao();
    
    document.body.innerHTML = '<select id="mesa"></select>';
    
    mesaVisao.informarCarregamentoMesas();
    
    const selectMesa = document.getElementById('mesa');
    
    expect(selectMesa?.children[0].innerText).toBe('Carregando mesas');
  });

});

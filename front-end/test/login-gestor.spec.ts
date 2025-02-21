import { describe, it, expect, vi } from 'vitest';
import { LoginGestor } from '../src/app/login/login-gestor';
import Requisicao from '../src/app/requisicao';
import UtilLocalStorage from '../src/app/UtilLocalStorage';

describe('LoginGestor', () => {
  
  it('deve realizar login com sucesso e salvar os dados do funcionário', async () => {
    const loginGestor = new LoginGestor();
    const login = 'usuario';
    const senha = 'senha123';
    
    const dadosLogin = { id: 1, login: 'usuario', nome: 'Usuário Teste', cargo: 'Gestor' };
    vi.spyOn(Requisicao, 'post').mockResolvedValue(dadosLogin);
    
    const salvarFuncionarioSpy = vi.spyOn(UtilLocalStorage, 'salvarFuncionario');
    
    const resultado = await loginGestor.login(login, senha);

    expect(Requisicao.post).toHaveBeenCalledWith('login', { login, senha });
    expect(salvarFuncionarioSpy).toHaveBeenCalledWith(dadosLogin);
    expect(resultado).toEqual(dadosLogin);
  });
  
  it('deve retornar null quando o login falhar', async () => {
    const loginGestor = new LoginGestor();
    const login = 'usuario';
    const senha = 'senha123';
    
    vi.spyOn(Requisicao, 'post').mockResolvedValue(null);
    
    const resultado = await loginGestor.login(login, senha);

    expect(Requisicao.post).toHaveBeenCalledWith('login', { login, senha });
    expect(resultado).toBeNull();
  });

  it('deve realizar logout com sucesso', async () => {
    const loginGestor = new LoginGestor();
    
    const dadosLogout = { sucesso: true };
    vi.spyOn(Requisicao, 'post').mockResolvedValue(dadosLogout);
    
    const resultado = await loginGestor.logout();
    
    expect(Requisicao.post).toHaveBeenCalledWith('logout', {});
    expect(resultado).toEqual(dadosLogout);
  });

});

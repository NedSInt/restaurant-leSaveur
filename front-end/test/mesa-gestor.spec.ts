import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import MesaGestor from '../src/app/mesa/mesa-gestor.ts';
import Requisicao from '../src/app/requisicao.ts';
import UtilReservaData from '../src/app/UtilDataReserva.ts';
import Mesa from '../src/app/mesa/mesa.ts';

vi.mock('../requisicao');
vi.mock('../valida-data-para-solicitar-reserva');
vi.mock('../UtilDataReserva');

describe('MesaGestor', () => {
  let gestor: MesaGestor;
  let mockMesas: Mesa[];

  beforeEach(() => {
    mockMesas = [
      new Mesa(1, 'Mesa 1'),
      new Mesa(2, 'Mesa 2'),
      new Mesa(3, 'Mesa 3'),
    ];
    gestor = new MesaGestor(mockMesas);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('consultarMesas', () => {
    it('deve chamar o método get no back com a rota correta e retornar as mesas', async () => {
      vi.spyOn(Requisicao, 'get').mockResolvedValue(mockMesas);

      const result = await gestor.consultarMesas();

      expect(Requisicao.get).toHaveBeenCalledWith('mesas');
      expect(result).toEqual(mockMesas);
    });
  });
describe('consultarMesasDisponiveisParaData', () => {
  it('deve tratar erro caso Requisicao.get falhe', async () => {
    const mockData = new Date(2024, 11, 25);
    const formattedData = '2024-12-25';

    vi.spyOn(UtilReservaData, 'formatarDataParaRequisicao').mockReturnValue(formattedData);
    vi.spyOn(Requisicao, 'get').mockRejectedValue(new Error('Erro para solicitar reserva nesta data.'));

    await expect(gestor.consultarMesasDisponiveisParaData(mockData)).rejects.toThrow('Erro para solicitar reserva nesta data.');
  });
});

});
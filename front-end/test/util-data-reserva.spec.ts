import { describe, it, expect } from 'vitest';
import UtilReservaData from '../src/app/UtilDataReserva.ts';

describe('UtilReservaData', () => {
  it('deve formatar a data corretamente', () => {
    const data = new Date(2023, 11, 25, 15, 30, 45); // 25 de dezembro de 2023 às 15:30:45
    const resultado = UtilReservaData.formatarDataParaRequisicao(data);
    expect(resultado).toBe('2023-12-25 15:30:45');
  });
});

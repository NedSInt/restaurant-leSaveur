import {
  Chart,
  ChartConfiguration,
  BarController,
  BarElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
} from 'chart.js';

Chart.register(BarController, BarElement, CategoryScale, LinearScale, Title, Tooltip);

export function criaGraficoVendasDia(ctx: any, vendas: any) {

  const labels = vendas.map((item) => item.dia);
  const data = vendas.map((item) => item.totalVendas);

  const config: ChartConfiguration = {
    type: 'bar',
    data: {
      labels,
      datasets: [
        {
          label: 'Valor total vendido',
          data,
          backgroundColor: [
            'rgba(255, 87, 51, 0.2)',
            'rgba(0, 184, 148, 0.2)',
            'rgba(9, 132, 227, 0.2)',
            'rgba(255, 234, 167, 0.2)',
            'rgba(214, 48, 49, 0.2)'
          ],
          borderColor: [
            'rgba(255, 87, 51, 1)',
            'rgba(0, 184, 148, 1)',
            'rgba(9, 132, 227, 1)',
            'rgba(255, 234, 167, 1)',
            'rgba(214, 48, 49, 1)'
          ],
          borderWidth: 1,
        },
      ],
    },
    options: {
      responsive: true,
      scales: {
        x: {
          title: {
            display: true,
            text: 'Datas com vendas',
          },
        },
        y: {
          title: {
            display: true,
            text: 'Valor total vendido',
          },
          beginAtZero: true,
          ticks: {
            stepSize: 5,
          }
        },
      },
    },
  };

  destroyChartVendasDia(ctx);

  ctx.chart = new Chart(ctx, config);
}

export function destroyChartVendasDia(ctx: any){
  if(ctx.chart)
    ctx.chart.destroy();
}


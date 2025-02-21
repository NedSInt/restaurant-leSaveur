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

export function criaGraficoReservas(ctx: any, reservas: any) {

  const labels = reservas.map((item) => item.dataReserva);
  const data = reservas.map((item) => item.totalReservas);

  const config: ChartConfiguration = {
    type: 'bar',
    data: {
      labels,
      datasets: [
        {
          label: 'Número de Reservas',
          data,
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          borderColor: 'rgba(75, 192, 192, 1)',
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
            text: 'Datas com reserva',
          },
        },
        y: {
          title: {
            display: true,
            text: 'Número de Reservas',
          },
          beginAtZero: true,
          ticks: {
            stepSize: 5,
          }
        },
      },
    },
  };

  destroyChart(ctx);

  ctx.chart = new Chart(ctx, config);
}

export function destroyChart(ctx: any){
  if(ctx.chart)
    ctx.chart.destroy();
}


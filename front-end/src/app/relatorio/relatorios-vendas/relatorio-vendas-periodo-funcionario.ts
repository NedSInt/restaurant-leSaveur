import {
    Chart,
    ChartConfiguration,
    PieController,
    ArcElement,
    Tooltip,
    Title,
    Legend,
  } from 'chart.js';
  
  Chart.register(PieController, ArcElement, Tooltip, Title, Legend);
  
  export function criaGraficoVendasFuncionario(ctx: any, vendas: any) {

    const labels = vendas.map((item) => item.funcionario);
    const data = vendas.map((item) => Number(item.totalVendas));
    
    const totalVendido = data.reduce((acc, valor) => acc + valor, 0);
  
    const config: ChartConfiguration = {
      type: 'pie',
      data: {
        labels,
        datasets: [
          {
            label: 'Percentual de Vendas',
            data,
            backgroundColor: [
              'rgba(255, 99, 132, 0.2)',
              'rgba(54, 162, 235, 0.2)',
              'rgba(255, 206, 86, 0.2)',
              'rgba(75, 192, 192, 0.2)',
              'rgba(153, 102, 255, 0.2)',
            ],
            borderColor: [
              'rgba(255, 99, 132, 1)',
              'rgba(54, 162, 235, 1)',
              'rgba(255, 206, 86, 1)',
              'rgba(75, 192, 192, 1)',
              'rgba(153, 102, 255, 1)',
            ],
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          tooltip: {
            callbacks: {
              label: (context) => {
                const value = context.raw as number;
                const percentual = ((value / totalVendido) * 100).toFixed(2);
                return `${context.label}: R$${value.toFixed(2)} (${percentual}%)`;
              },
            },
          },
          title: {
            display: true,
            text: `Vendas por Funcionário (Total: R$${totalVendido.toFixed(2)})`,
          },
          legend: {
            position: 'bottom',
          },
        },
      },
    };
  
    destroyChartVendasFuncionario(ctx);
  
    ctx.chart = new Chart(ctx, config);
  }
  
  export function destroyChartVendasFuncionario(ctx: any) {
    if (ctx.chart) ctx.chart.destroy();
  }
  
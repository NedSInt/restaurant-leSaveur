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
  
  export function criaGraficoVendasCategoria(ctx: any, vendas: any) {
    const labels = vendas.map((item) => item.categoria);
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
            text: `Vendas por Categoria (Total: R$${totalVendido.toFixed(2)})`,
          },
          legend: {
            position: 'bottom',
          },
        },
      },
    };
  
    destroyChartVendasCategoria(ctx);
  
    ctx.chart = new Chart(ctx, config);
  }
  
  export function destroyChartVendasCategoria(ctx: any) {
    if (ctx.chart) ctx.chart.destroy();
  }
  
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
  
  export function criaGraficoVendasFormaPagamento(ctx: any, vendas: any) {
    const labels = vendas.map((item) => item.formaPagamento);
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
              'rgba(255, 159, 64, 0.2)',
              'rgba(75, 192, 192, 0.2)',
              'rgba(153, 102, 255, 0.2)',
              'rgba(201, 203, 207, 0.2)',
              'rgba(255, 205, 86, 0.2)'
            ],
            borderColor: [
              'rgba(255, 159, 64, 1)',
              'rgba(75, 192, 192, 1)',
              'rgba(153, 102, 255, 1)',
              'rgba(201, 203, 207, 1)', 
              'rgba(255, 205, 86, 1)'
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
            text: `Vendas por Forma de Pagamento (Total: R$${totalVendido.toFixed(2)})`,
          },
          legend: {
            position: 'bottom',
          },
        },
      },
    };
  
    destroyChartVendasFormaPagamento(ctx);
  
    ctx.chart = new Chart(ctx, config);
  }
  
  export function destroyChartVendasFormaPagamento(ctx: any) {
    if (ctx.chart) ctx.chart.destroy();
  }
  
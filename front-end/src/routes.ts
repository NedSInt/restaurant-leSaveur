import page from 'page';
import UtilLocalStorage from './app/UtilLocalStorage.ts';

// Middleware para verificar login
page("*", (ctx, next) => {
    const usuarioLogado = UtilLocalStorage.obterFuncionario();

    if (!usuarioLogado && ctx.path !== "/login") {
        page.redirect("/login");
    } else {
        next();
    }
});

page("*", (ctx, next) => {
    const usuarioLogado = UtilLocalStorage.obterFuncionario();

    if (ctx.path.startsWith("/relatorio-vendas")) {
        if (usuarioLogado) {
            if (usuarioLogado.cargo === "GERENTE") {
                next();
            } else {
                page.redirect("/");
            }
        } else {
            page.redirect("/login");
        }
    } else {
        next();
    }
});

page("/", async () => {
    const { PaginaInicialVisao } = await import("./app/views/pagina-inicial-visao.ts");
    new PaginaInicialVisao().iniciar();
});

page("/login", async () => {
    const { LoginVisao } = await import("./app/login/login-visao.ts");
    new LoginVisao().iniciarLogin();
});

page('/reserva', async () => {
    const { ReservaVisao } = await import('./app/reserva/reserva-visao.ts');
    new ReservaVisao().iniciarReserva();
});

page('/listagem-reservas', async () => {
    const { ReservaVisao } = await import('./app/reserva/reserva-visao.ts');
    new ReservaVisao().iniciarListagem();
});

page('/abrir-conta', async () => {
    const { ContaVisao } = await import('./app/conta/conta-visao.ts');
    new ContaVisao().iniciarConta();
});

page('/listagem-contas', async () => {
    const { ContaVisao } = await import('./app/conta/conta-visao.ts');
    new ContaVisao().iniciarListagem();
});

page('/relatorio-reservas', async () => {
    const { ReservaVisao } = await import('./app/reserva/reserva-visao.ts');
    new ReservaVisao().iniciarGraficoReservas();
});

page('/relatorio-vendas/forma-pagamento', async () => {
    const { RelatorioVendasVisao } = await import('./app/relatorio/relatorios-vendas/relatorio-vendas-visao.ts');
    new RelatorioVendasVisao().iniciarRelatorio('formaPagamento');
});

page('/relatorio-vendas/funcionario', async () => {
    const { RelatorioVendasVisao } = await import('./app/relatorio/relatorios-vendas/relatorio-vendas-visao.ts');
    new RelatorioVendasVisao().iniciarRelatorio('funcionario');
});

page('/relatorio-vendas/categoria', async () => {
    const { RelatorioVendasVisao } = await import('./app/relatorio/relatorios-vendas/relatorio-vendas-visao.ts');
    new RelatorioVendasVisao().iniciarRelatorio('categoria');
});

page('/relatorio-vendas/diario', async () => {
    const { RelatorioVendasVisao } = await import('./app/relatorio/relatorios-vendas/relatorio-vendas-visao.ts');
    new RelatorioVendasVisao().iniciarRelatorio('vendas');
});

page('*', async () => {
    const {Visao} = await import('./app/views/visao.ts');
    Visao.paginaNaoEncontrada();
});

page();

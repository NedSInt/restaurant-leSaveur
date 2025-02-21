import { LoginVisao } from '../login/login-visao.ts';
import { Visao } from './visao.ts';


export class PaginaInicialVisao {

    private titulo = 'Restaurante La Saveur'; 
     private loginVisao: LoginVisao;

    constructor() {
        this.loginVisao = new LoginVisao();
    }

    public iniciar(): void {
        this.renderizaTemplate();

        Visao.atualizaTitulo(this.titulo);
    }

    public renderizaTemplate(): void {
        Visao.renderizar( `
            <div class="container-fluid p-0">
                <header class="bg-dark text-white text-center py-1">
                    <h1 class="display-4 fs-1">Sistema de Gerenciamento de Restaurantes</h1>
                    <p class="lead">Bem-vindo ao Restaurante La Saveur!</p>
                </header>

                <section class="py-5">
                    <div class="container">
                        <div class="row g-4">

                            <div class="col-md-4">
                                <div class="card border-0 shadow-sm">
                                    <div class="card-body text-center">
                                        <i class="bi bi-calendar-plus display-3 text-primary mb-3"></i>
                                        <h5 class="card-title">Gerenciar Reservas</h5>
                                        <p class="card-text">Faça reservas, liste ou visualize relatórios detalhados de reservas.</p>
                                        <a href="/reserva" class="btn btn-primary w-100">Cadastrar Reservas</a>
                                    </div>
                                </div>
                            </div>

                            <div class="col-md-4">
                                <div class="card border-0 shadow-sm">
                                    <div class="card-body text-center">
                                        <i class="bi bi-wallet2 display-3 text-secondary mb-3"></i>
                                        <h5 class="card-title">Gerenciar Contas</h5>
                                        <p class="card-text">Abra, gerencie e visualize as contas do restaurante.</p>
                                        <a href="/abrir-conta" class="btn btn-secondary w-100">Cadastrar Contas</a>
                                    </div>
                                </div>
                            </div>

                            <div class="col-md-4">
                                <div class="card border-0 shadow-sm">
                                    <div class="card-body text-center">
                                        <i class="bi bi-bar-chart-line-fill display-3 text-info mb-3"></i>
                                        <h5 class="card-title">Relatórios</h5>
                                        <p class="card-text">Veja relatórios completos sobre reservas em diferentes dias.</p>
                                        <a href="/relatorio-reservas" class="btn btn-info text-white w-100">Acessar Relatórios</a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <section class="py-5 bg-light">
                    <div class="container">
                        <h3 class="text-center text-dark mb-5">Outras Funcionalidades</h3>
                        <div class="row g-4">

                            <div class="col-md-6">
                                <a href="/listagem-reservas" class="btn btn-outline-dark w-100 shadow-sm py-3">
                                    <i class="bi bi-cash-coin me-2"></i> Listagem de Reservas
                                </a>
                            </div>

                            <div class="col-md-6">
                                <a href="/listagem-contas" class="btn btn-outline-dark w-100 shadow-sm py-3">
                                    <i class="bi bi-people-fill me-2"></i> Contas em Atendimento
                                </a>
                            </div>

                        </div>
                    </div>
                </section>

                <footer class="bg-dark text-white text-center py-3">
                    <p class="mb-0">© 2025 Restaurante La Saveur. Todos os direitos reservados.</p>
                </footer>
            </div>

        `);
    }
}

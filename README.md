# g2

## Autores

- Jhonatan da Silva Pacheco
- Lucas Amaral da Silva

---

## Comandos

### Frontend
1. Navegue até o diretório `frontend`.
2. Execute o comando para instalar as dependências:

   ```bash
   pnpm install
   ```
3. Para iniciar a aplicação, use:

   ```bash
   pnpm run dev
   ```

#### Testes
- Testes End-to-End (E2E):

  ```bash
  pnpm e2e
  ```

- Testes Unitários:

  ```bash
  pnpm test
  ```

- Gerar relatório de cobertura de testes:

  ```bash
  pnpm coverage ./test
  ```

### Backend
1. Navegue até o diretório `backend`.
2. Instale as dependências com:

   ```bash
   composer install
   ```
3. Configure os bancos de dados no MySQL:
   - Crie os bancos de dados `g2` e `g2_teste`.
   - Execute os scripts a seguir para configurar a estrutura e os dados iniciais:

     ```sql
     db/estrutura.sql
     db/dados-basicos.sql
     ```

4. Para rodar os testes, utilize:

   ```bash
   composer test
   ```
5. Para verificar o código com PHPStan, execute:

   ```bash
   composer check
   ```

---

## Referências Bibliográficas

- **CSS e Estilos**: [Bootstrap](https://getbootstrap.com/)
- **Imagens**: [Unsplash](https://unsplash.com/)
- **Documentação de ferramentas**:
  - [pnpm](https://pnpm.io/)
  - [Vitest](https://vitest.dev/)
  - [PHPStan](https://phpstan.org/)
  - [Bootstrap](https://getbootstrap.com/docs/5.3/)
  - [Chartjs](https://www.chartjs.org/docs/latest/)
  - [Composer](https://getcomposer.org/)
  - [ideapedia](https://www.ideapedia.com.br/SiteRefTec/Bootstrap/04-ALERTAS.HTML)
  - [Router](https://github.com/thiagodp/router)
  - [TDateTime](https://github.com/thiagodp/TDateTime/blob/master/lib/TDateTime.php)
  - [Sweetalert2](https://github.com/sweetalert2/sweetalert2)
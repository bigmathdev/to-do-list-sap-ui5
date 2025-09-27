# Copilot Instructions for to-do-list-sap-ui5

## Visão Geral
Este projeto é uma aplicação SAP Fiori (UI5) gerada pelo SAP Fiori Application Generator. O código está organizado no padrão MVC do UI5, com separação clara entre controllers, views, modelos e recursos de internacionalização.

## Estrutura Principal
- `webapp/`: Diretório raiz da aplicação UI5.
  - `controller/`: Lógica dos controllers (ex: `App.controller.js`, `todo.controller.js`).
  - `view/`: Views XML (ex: `App.view.xml`, `todo.view.xml`).
  - `model/`: Modelos JS para dados e manipulação (`models.js`).
  - `i18n/`: Arquivos de internacionalização.
  - `css/`: Estilos customizados.
  - `test/`: Testes unitários e de integração (QUnit/OPA5).

## Fluxo de Dados e Componentes
- O componente principal é definido em `Component.js`.
- Controllers manipulam eventos das views e atualizam modelos.
- Não há backend configurado (Service Type: None), todos os dados são locais.

## Convenções e Padrões
- Segue o padrão SAPUI5: controllers JS, views XML, internacionalização via `i18n.properties`.
- Não utiliza TypeScript nem ESLint.
- Testes automatizados estão em `webapp/test/unit` (unitários) e `webapp/test/integration` (integração/OPA5).
- Para adicionar funcionalidades, crie/edite controllers e views correspondentes.

## Workflows Essenciais
- **Iniciar app local:**
  ```powershell
  npm start
  ```
- **Executar testes unitários:**
  Abra `webapp/test/unit/unitTests.qunit.html` em um navegador.
- **Executar testes de integração:**
  Abra `webapp/test/integration/opaTests.qunit.html` em um navegador.

## Dependências e Integrações
- UI5 versão 1.140.0 (definido no `manifest.json` e `ui5.yaml`).
- Não há integração com serviços externos ou backend.

## Exemplos de Padrões
- Eventos de UI são tratados nos controllers e atualizam modelos.
- Internacionalização via `this.getView().getModel("i18n")`.
- Testes OPA5 simulam navegação e interações reais.

## Recomendações para Agentes
- Priorize alterações nos arquivos de controller e view para lógica e UI.
- Siga o padrão de nomenclatura e estrutura do SAPUI5.
- Consulte `README.md` para detalhes de build e execução.
- Use os arquivos de teste para validar novas funcionalidades.

---

Seções incompletas ou dúvidas sobre fluxos específicos? Solicite exemplos ou esclarecimentos ao usuário.

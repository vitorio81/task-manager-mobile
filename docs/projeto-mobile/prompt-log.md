# Log de Uso de Ferramentas de IA

Este documento registra o uso de modelos de linguagem de grande escala (LLM) como suporte no desenvolvimento do projeto "Task Manager Mobile", conforme as diretrizes de transparência.

## 1. Estratégia de Uso
A inteligência artificial foi utilizada de forma assistiva, focada em três frentes:
- **Refatoração de Componentes:** Melhoria na lógica de componentes pré-existentes.
- **Configuração de Ambiente:** Auxílio na configuração de ferramentas de testes (Jest/TypeScript).
- **Estruturação de Documentação:** Apoio na organização dos templates de relatório e planos de teste.

## 2. Log de Interações

### Contexto: Refatoração de UI e UX
- **Problema:** O componente de Swipeable não fechava automaticamente após clicar nos botões de ação e o Modalize apresentava comportamento inconsistente com o teclado.
- **Uso da IA:** Solicitação de boas práticas para manipulação de `useRef` com o componente `Swipeable` e configurações de `KeyboardAvoidingView` para garantir que o formulário ficasse visível durante a digitação.
- **Resultado:** Implementação de um fechamento programático via refs, garantindo fluidez na navegação.

### Contexto: Lógica de Estado (Context API)
- **Problema:** Necessidade de integrar a função de edição (Update) de forma que os dados fossem persistidos no `AsyncStorage` e refletidos instantaneamente na lista.
- **Uso da IA:** Brainstorming sobre a melhor forma de atualizar um item dentro de um array de objetos no estado global, mantendo a imutabilidade do React.
- **Resultado:** Implementação de uma lógica eficiente no `AuthProviderList` que gerencia tanto a criação quanto a edição.

### Contexto: Garantia de Qualidade (Testes)
- **Problema:** Erros de transpilação (SyntaxError) ao tentar rodar o Jest em um ambiente TypeScript/ESM.
- **Uso da IA:** Depuração de logs de erro do terminal relacionados ao `ts-jest` e auxílio na criação de um arquivo `jest.config.js` funcional para o ambiente Expo.
- **Resultado:** Configuração bem-sucedida do Pilar 3, com testes de regras de negócio rodando via comando único.

### Contexto: Documentação Técnica
- **Uso da IA:** Apoio na estruturação dos arquivos Markdown para garantir que todos os pilares (1 a 4) estivessem devidamente descritos conforme o checklist do projeto.

## 3. Considerações Éticas
Toda a lógica de negócio, a estrutura de rotas e a identidade visual do aplicativo foram concebidas pelo desenvolvedor. A IA serviu como um revisor técnico e facilitador para solução de bugs específicos de biblioteca (bugs de terceiros) e configuração de infraestrutura de testes.
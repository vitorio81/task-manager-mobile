# Plano de Testes - Task Manager Mobile

Este documento descreve a estratégia, os cenários e os critérios de aceitação para garantir o funcionamento correto do aplicativo de gerenciamento de tarefas.

## 1. Estratégia de Testes
A estratégia baseia-se em garantir que as principais regras de negócio (Validações) e o fluxo principal do usuário (CRUD) estejam operacionais.
- **Testes Unitários:** Focados em funções puras de validação.
- **Testes de Integração:** Focados no fluxo de persistência de dados no estado global (Context API).

## 2. Cenários de Teste (Casos de Teste)

### CT01: Validação de Título Obrigatório
- **Objetivo:** Garantir que o usuário não salve tarefas sem nome.
- **Passos:** 1. Abrir o modal de criação.
  2. Deixar o campo "Título" vazio.
  3. Clicar no botão de salvar (Check).
- **Resultado Esperado:** O sistema deve exibir uma borda vermelha no campo e a mensagem "Campo obrigatório". O modal não deve fechar.

### CT02: Persistência de Dados (Criar Tarefa)
- **Objetivo:** Verificar se a tarefa criada aparece na listagem principal.
- **Passos:** 1. Preencher título, descrição e prioridade "Alta".
  2. Salvar a tarefa.
- **Resultado Esperado:** O modal deve fechar, um indicador de "Loading" deve aparecer brevemente, e a nova tarefa deve aparecer no topo da lista com a cor vermelha.

### CT03: Edição de Tarefa Existente
- **Objetivo:** Validar se a edição altera o item correto sem criar duplicatas.
- **Passos:** 1. Deslizar uma tarefa para a direita e clicar em "Editar".
  2. Alterar o título da tarefa.
  3. Salvar.
- **Resultado Esperado:** A tarefa original deve ser atualizada na lista com o novo título, mantendo o mesmo ID.

### CT04: Fluxo de Exclusão (Swipe to Delete)
- **Objetivo:** Verificar a remoção física da tarefa.
- **Passos:** 1. Deslizar a tarefa para a esquerda.
  2. Clicar no ícone de lixeira (Excluir).
- **Resultado Esperado:** A tarefa deve desaparecer imediatamente da lista e do armazenamento local.

## 3. Comandos de Execução
Os testes automatizados foram desenvolvidos utilizando **Jest**.
Para executar o conjunto de testes, utilize o comando:
```bash
npm run test
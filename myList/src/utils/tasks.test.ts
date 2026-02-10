import { validateTaskTitle, isFutureDate, validateDescription } from "./tasks";


describe("Pilar 3 - Testes de Regras de Negócio da Task", () => {
  // Teste 1: Validação de Título (Regra de Negócio)
  test("Não deve aceitar título com menos de 3 caracteres", () => {
    expect(validateTaskTitle("Ab")).toBe(false);
    expect(validateTaskTitle("Estudar Jest")).toBe(true);
  });

  // Teste 2: Validação de Data (Regra de Negócio)
  test("Deve validar se a data limite é maior que a data atual", () => {
    const pastDate = new Date();
    pastDate.setFullYear(2020);

    const futureDate = new Date();
    futureDate.setFullYear(2030);

    expect(isFutureDate(pastDate)).toBe(false);
    expect(isFutureDate(futureDate)).toBe(true);
  });

  // Teste 3: Fluxo de Integração Simples (Simulado)
  test("Deve garantir que a descrição não ultrapasse o limite de caracteres", () => {
    const longDesc = "a".repeat(251);
    const shortDesc = "Tarefa simples";

    expect(validateDescription(longDesc)).toBe(false);
    expect(validateDescription(shortDesc)).toBe(true);
  });
});

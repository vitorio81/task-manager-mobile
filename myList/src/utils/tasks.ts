// Funções que validam as regras do seu formulário
export const validateTaskTitle = (title: string): boolean => {
  return title.trim().length >= 3;
};

export const validateDescription = (desc: string): boolean => {
  return desc.length <= 250; // Exemplo de regra: max 250 caracteres
};

export const isFutureDate = (date: Date): boolean => {
  const now = new Date();
  return date > now;
};

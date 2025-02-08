import { z } from "zod";

// Expressões regulares para validação
const cpfRegex = /^\d{3}\.\d{3}\.\d{3}-\d{2}$/;
const cnpjRegex = /^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/;
const rgRegex = /^\d{2}\.\d{3}\.\d{3}-\d{1}$/; // Exemplo de RG

// Funções de validação numérica para CPF/CNPJ
const validarCpf = (cpf: string) => {
  const cpfLimpo = cpf.replace(/\D/g, ""); // Remove caracteres não numéricos
  if (cpfLimpo.length !== 11) return false;

  let soma = 0, resto;
  for (let i = 1; i <= 9; i++) soma += parseInt(cpfLimpo[i - 1]) * (11 - i);
  resto = (soma * 10) % 11;
  if (resto === 10 || resto === 11) resto = 0;
  if (resto !== parseInt(cpfLimpo[9])) return false;

  soma = 0;
  for (let i = 1; i <= 10; i++) soma += parseInt(cpfLimpo[i - 1]) * (12 - i);
  resto = (soma * 10) % 11;
  if (resto === 10 || resto === 11) resto = 0;
  return resto === parseInt(cpfLimpo[10]);
};

const validarCnpj = (cnpj: string) => {
  const cnpjLimpo = cnpj.replace(/\D/g, ""); // Remove caracteres não numéricos
  if (cnpjLimpo.length !== 14) return false;

  let tamanho = cnpjLimpo.length - 2;
  let numeros = cnpjLimpo.substring(0, tamanho);
  let digitos = cnpjLimpo.substring(tamanho);
  let soma = 0;
  let pos = tamanho - 7;
  
  for (let i = tamanho; i >= 1; i--) {
    soma += parseInt(numeros[tamanho - i]) * pos--;
    if (pos < 2) pos = 9;
  }

  let resultado = soma % 11 < 2 ? 0 : 11 - (soma % 11);
  if (resultado !== parseInt(digitos[0])) return false;

  tamanho = tamanho + 1;
  numeros = cnpjLimpo.substring(0, tamanho);
  soma = 0;
  pos = tamanho - 7;

  for (let i = tamanho; i >= 1; i--) {
    soma += parseInt(numeros[tamanho - i]) * pos--;
    if (pos < 2) pos = 9;
  }

  resultado = soma % 11 < 2 ? 0 : 11 - (soma % 11);
  return resultado === parseInt(digitos[1]);
};

// Esquemas do Zod
export const cpfSchema = z.string().refine(validarCpf, {
  message: "CPF inválido",
});

export const cnpjSchema = z.string().refine(validarCnpj, {
  message: "CNPJ inválido",
});

export const rgSchema = z.string().refine((rg) => rgRegex.test(rg), {
  message: "RG inválido. Use o formato 00.000.000-0",
});

// Schema para validar dados brasileiros completos
export const pessoaSchema = z.object({
  nome: z.string().min(3, "Nome deve ter pelo menos 3 caracteres"),
  cpf: cpfSchema,
  cnpj: cnpjSchema.optional(),
  rg: rgSchema.optional(),
});

export default { cpfSchema, cnpjSchema, rgSchema, pessoaSchema };

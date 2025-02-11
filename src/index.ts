import { z } from "zod";

// Expressões regulares para validação
const cpfRegex = /^\d{3}\.\d{3}\.\d{3}-\d{2}$/;
const cnpjRegex = /^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/;
const rgRegex = /^\d{2}\.\d{3}\.\d{3}-\d{1}$/; // Exemplo de RG

const numerosRepetidosRegex = /^(\d)\1*$/;
//apesar que a conta matematicamente dê certo, a Receita Federal 
// não permite CPFs e CNPJs feita só com numeros repetidos


// Funções de validação numérica para CPF/CNPJ
const validarCpf = (cpf: string) => {
  const cpfLimpo = cpf.replace(/\D/g, ""); // Remove caracteres não numéricos
  if (cpfLimpo.length !== 11 || numerosRepetidosRegex.test(cpfLimpo)) return false;

  for (let TamanhoParaValidar = 9; TamanhoParaValidar < 11; TamanhoParaValidar++){
    let soma = 0;
    let peso = TamanhoParaValidar + 1;

    for (let i = 0; i < TamanhoParaValidar; i++) 
      soma += parseInt(cpfLimpo[i]) * peso--;

    // o if (resto === 10 || resto === 11) resto = 0; pode ser facilmente trocada pelo % 10
    let resto = ((soma * 10) % 11) % 10;
    if (resto !== parseInt(cpfLimpo[TamanhoParaValidar])) 
      return false;
  }
  return true;
};

//as duas funções são bem parecidas mas não sei se compensa abstrair mais para
//seguir de fato o método DRY kkk 

const validarCnpj = (cnpj: string) => {
  const cnpjLimpo = cnpj.replace(/\D/g, ""); // Remove caracteres não numéricos
  if (cnpjLimpo.length !== 14 || numerosRepetidosRegex.test(cnpjLimpo)) return false;

  for (let TamanhoParaValidar = 12; TamanhoParaValidar < 14; TamanhoParaValidar++){
    let soma = 0;
    let peso = TamanhoParaValidar - 7

    for (let i = 0; i < TamanhoParaValidar; i++) {
      soma += parseInt(cnpjLimpo[i]) * peso--;
      if (peso < 2) peso = 9;
    }

    let resto = ((soma * 10) % 11) % 10;
    if (resto !== parseInt(cnpjLimpo[TamanhoParaValidar]))
      return false;
  }
  return true;
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

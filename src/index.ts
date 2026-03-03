import { z } from "zod";

// ─────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────

const numerosRepetidosRegex = /^(\d)\1*$/;
// A Receita Federal não permite CPFs e CNPJs compostos apenas por dígitos repetidos.

const soNumeros = (valor: string) => valor.replace(/\D/g, "");

// ─────────────────────────────────────────────
// CPF
// ─────────────────────────────────────────────

export const validarCpf = (cpf: string): boolean => {
  const cpfLimpo = soNumeros(cpf);
  if (cpfLimpo.length !== 11 || numerosRepetidosRegex.test(cpfLimpo)) return false;

  for (let t = 9; t < 11; t++) {
    let soma = 0;
    let peso = t + 1;
    for (let i = 0; i < t; i++) soma += parseInt(cpfLimpo[i]) * peso--;
    const resto = ((soma * 10) % 11) % 10;
    if (resto !== parseInt(cpfLimpo[t])) return false;
  }
  return true;
};

export const cpfSchema = z.string().refine(validarCpf, {
  message: "CPF inválido",
});

// ─────────────────────────────────────────────
// CNPJ
// ─────────────────────────────────────────────

export const validarCnpj = (cnpj: string): boolean => {
  const cnpjLimpo = soNumeros(cnpj);
  if (cnpjLimpo.length !== 14 || numerosRepetidosRegex.test(cnpjLimpo)) return false;

  for (let t = 12; t < 14; t++) {
    let soma = 0;
    let peso = t - 7;
    for (let i = 0; i < t; i++) {
      soma += parseInt(cnpjLimpo[i]) * peso--;
      if (peso < 2) peso = 9;
    }
    const resto = ((soma * 10) % 11) % 10;
    if (resto !== parseInt(cnpjLimpo[t])) return false;
  }
  return true;
};

export const cnpjSchema = z.string().refine(validarCnpj, {
  message: "CNPJ inválido",
});

// ─────────────────────────────────────────────
// CPF ou CNPJ (aceita qualquer um)
// ─────────────────────────────────────────────

export const cpfCnpjSchema = z.string().refine(
  (valor) => validarCpf(valor) || validarCnpj(valor),
  { message: "CPF ou CNPJ inválido" },
);

// ─────────────────────────────────────────────
// RG – formato XX.XXX.XXX-X (validação de formato)
// ─────────────────────────────────────────────

const rgRegex = /^\d{2}\.\d{3}\.\d{3}-[\dXx]$/;

export const validarRg = (rg: string): boolean => rgRegex.test(rg);

export const rgSchema = z.string().refine(validarRg, {
  message: "RG inválido. Use o formato 00.000.000-0",
});

// ─────────────────────────────────────────────
// CEP – formato 00000-000 ou 00000000
// ─────────────────────────────────────────────

const cepRegex = /^\d{5}-?\d{3}$/;

export const validarCep = (cep: string): boolean => cepRegex.test(cep);

export const cepSchema = z.string().refine(validarCep, {
  message: "CEP inválido. Use o formato 00000-000 ou 00000000",
});

// ─────────────────────────────────────────────
// PIS / PASEP / NIS / NIT
// ─────────────────────────────────────────────

export const validarPis = (pis: string): boolean => {
  const pisLimpo = soNumeros(pis);
  if (pisLimpo.length !== 11 || numerosRepetidosRegex.test(pisLimpo)) return false;

  const pesos = [3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
  let soma = 0;
  for (let i = 0; i < 10; i++) soma += parseInt(pisLimpo[i]) * pesos[i];

  const resto = soma % 11;
  const digito = resto < 2 ? 0 : 11 - resto;
  return digito === parseInt(pisLimpo[10]);
};

export const pisSchema = z.string().refine(validarPis, {
  message: "PIS/PASEP/NIS/NIT inválido",
});

// ─────────────────────────────────────────────
// Título de Eleitor
// ─────────────────────────────────────────────

export const validarTituloEleitor = (titulo: string): boolean => {
  const tituloLimpo = soNumeros(titulo);
  if (tituloLimpo.length !== 12) return false;

  // Código do estado (posições 8 e 9 — índices 8..9)
  const codigoEstado = parseInt(tituloLimpo.substring(8, 10));
  if (codigoEstado < 1 || codigoEstado > 29) return false;

  // Primeiro dígito verificador (sobre os 8 primeiros dígitos)
  const pesos1 = [2, 3, 4, 5, 6, 7, 8, 9];
  let soma = 0;
  for (let i = 0; i < 8; i++) soma += parseInt(tituloLimpo[i]) * pesos1[i];
  let resto = soma % 11;
  if (resto > 1) {
    resto = 11 - resto;
  } else if (codigoEstado === 1 || codigoEstado === 2) {
    // SP e MG: quando resto é 0 ou 1, dígito é 1
    resto = 1;
  } else {
    resto = 0;
  }
  if (resto !== parseInt(tituloLimpo[10])) return false;

  // Segundo dígito verificador (sobre posições 8, 9 e 10)
  const pesos2 = [7, 8, 9];
  let soma2 = 0;
  for (let i = 0; i < 3; i++) soma2 += parseInt(tituloLimpo[8 + i]) * pesos2[i];
  let resto2 = soma2 % 11;
  if (resto2 > 1) {
    resto2 = 11 - resto2;
  } else if (codigoEstado === 1 || codigoEstado === 2) {
    resto2 = 1;
  } else {
    resto2 = 0;
  }
  if (resto2 !== parseInt(tituloLimpo[11])) return false;

  return true;
};

export const tituloEleitorSchema = z.string().refine(validarTituloEleitor, {
  message: "Título de Eleitor inválido",
});

// ─────────────────────────────────────────────
// CNH – Carteira Nacional de Habilitação
// ─────────────────────────────────────────────

export const validarCnh = (cnh: string): boolean => {
  const cnhLimpa = soNumeros(cnh);
  if (cnhLimpa.length !== 11 || numerosRepetidosRegex.test(cnhLimpa)) return false;

  let soma1 = 0;
  let soma2 = 0;
  for (let i = 0; i < 9; i++) {
    soma1 += parseInt(cnhLimpa[i]) * (9 - i);
    soma2 += parseInt(cnhLimpa[i]) * (1 + i);
  }

  let resto1 = soma1 % 11;
  let resto2 = soma2 % 11;

  const dsc = resto1 >= 10 ? -2 : 0;
  const digito1 = resto1 >= 10 ? 0 : resto1;

  resto2 += dsc;
  const digito2 = resto2 >= 10 ? 0 : (resto2 < 0 ? resto2 + 11 : resto2);

  return digito1 === parseInt(cnhLimpa[9]) && digito2 === parseInt(cnhLimpa[10]);
};

export const cnhSchema = z.string().refine(validarCnh, {
  message: "CNH inválida",
});

// ─────────────────────────────────────────────
// Telefone Brasileiro (fixo e celular) com DDD
// Formatos: (11) 91234-5678 / (11) 1234-5678 / 11912345678
// ─────────────────────────────────────────────

const telefoneRegex = /^(?:\+55\s?)?(?:\(?\d{2}\)?[\s-]?)?(?:9\d{4}|\d{4})[-\s]?\d{4}$/;

export const validarTelefone = (telefone: string): boolean => {
  const limpo = soNumeros(telefone);
  // Sem DDI: 10 (fixo) ou 11 (celular). Com DDI (+55): 12 ou 13
  if (![10, 11, 12, 13].includes(limpo.length)) return false;

  // Valida o DDD (2 dígitos, 11-99)
  const offset = limpo.length > 11 ? 2 : 0; // pula "55" se DDI presente
  const ddd = parseInt(limpo.substring(offset, offset + 2));
  if (ddd < 11 || ddd > 99) return false;

  return telefoneRegex.test(telefone);
};

export const telefoneSchema = z.string().refine(validarTelefone, {
  message: "Telefone inválido. Use formato com DDD, ex: (11) 91234-5678",
});

// ─────────────────────────────────────────────
// Placa de Veículo (padrão antigo e Mercosul)
// Antigo: ABC-1234
// Mercosul: ABC1D23
// ─────────────────────────────────────────────

const placaAntigaRegex = /^[A-Z]{3}-?\d{4}$/i;
const placaMercosulRegex = /^[A-Z]{3}\d[A-Z]\d{2}$/i;

export const validarPlaca = (placa: string): boolean => {
  const placaLimpa = placa.replace(/[-\s]/g, "").toUpperCase();
  return placaAntigaRegex.test(placaLimpa) || placaMercosulRegex.test(placaLimpa);
};

export const placaVeiculoSchema = z.string().refine(validarPlaca, {
  message: "Placa de veículo inválida. Use ABC-1234 ou ABC1D23 (Mercosul)",
});

// ─────────────────────────────────────────────
// RENAVAM
// ─────────────────────────────────────────────

export const validarRenavam = (renavam: string): boolean => {
  const renavamLimpo = soNumeros(renavam).padStart(11, "0");
  if (renavamLimpo.length !== 11 || numerosRepetidosRegex.test(renavamLimpo)) return false;

  const pesos = [3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
  let soma = 0;
  for (let i = 0; i < 10; i++) soma += parseInt(renavamLimpo[i]) * pesos[i];

  const digito = ((soma * 10) % 11) % 10;
  return digito === parseInt(renavamLimpo[10]);
};

export const renavamSchema = z.string().refine(validarRenavam, {
  message: "RENAVAM inválido",
});

// ─────────────────────────────────────────────
// Certidão (nascimento, casamento, óbito)
// 32 dígitos no formato: XXXXXX XX XX XXXX X XXXXX XXX XXXXXXX XX
// ─────────────────────────────────────────────

export const validarCertidao = (certidao: string): boolean => {
  const limpo = soNumeros(certidao);
  if (limpo.length !== 32) return false;

  // Dígitos verificadores nas posições 30 e 31
  const base = limpo.substring(0, 30);
  let resto = 0;
  for (let i = 0; i < 30; i++) {
    resto = (resto * 10 + parseInt(base[i])) % 11;
  }
  const dv1 = resto > 9 ? 1 : resto;

  // Segundo dígito: base(30) + dv1
  let resto2 = 0;
  const base2 = base + dv1.toString();
  for (let i = 0; i < 31; i++) {
    resto2 = (resto2 * 10 + parseInt(base2[i])) % 11;
  }
  const dv2 = resto2 > 9 ? 1 : resto2;

  return dv1 === parseInt(limpo[30]) && dv2 === parseInt(limpo[31]);
};

export const certidaoSchema = z.string().refine(validarCertidao, {
  message: "Número de certidão inválido",
});

// ─────────────────────────────────────────────
// Inscrição Estadual (validação genérica de formato)
// Aceita apenas dígitos, com 7 a 14 caracteres
// ─────────────────────────────────────────────

export const validarInscricaoEstadual = (ie: string): boolean => {
  const ieLimpa = soNumeros(ie);
  return ieLimpa.length >= 7 && ieLimpa.length <= 14;
};

export const inscricaoEstadualSchema = z.string().refine(validarInscricaoEstadual, {
  message: "Inscrição Estadual inválida (deve ter entre 7 e 14 dígitos)",
});

// ─────────────────────────────────────────────
// Schema composto: Pessoa
// ─────────────────────────────────────────────

export const pessoaSchema = z.object({
  nome: z.string().min(3, "Nome deve ter pelo menos 3 caracteres"),
  cpf: cpfSchema,
  cnpj: cnpjSchema.optional(),
  rg: rgSchema.optional(),
});

// ─────────────────────────────────────────────
// Exports
// ─────────────────────────────────────────────

export default {
  // Schemas
  cpfSchema,
  cnpjSchema,
  cpfCnpjSchema,
  rgSchema,
  cepSchema,
  pisSchema,
  tituloEleitorSchema,
  cnhSchema,
  telefoneSchema,
  placaVeiculoSchema,
  renavamSchema,
  certidaoSchema,
  inscricaoEstadualSchema,
  pessoaSchema,
  // Funções de validação
  validarCpf,
  validarCnpj,
  validarRg,
  validarCep,
  validarPis,
  validarTituloEleitor,
  validarCnh,
  validarTelefone,
  validarPlaca,
  validarRenavam,
  validarCertidao,
  validarInscricaoEstadual,
};

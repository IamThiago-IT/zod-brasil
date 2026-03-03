import { describe, it, expect } from "vitest";
import { pessoaSchema } from "../src";

describe("pessoaSchema", () => {
  it("deve aceitar pessoa com todos os campos válidos", () => {
    const result = pessoaSchema.safeParse({
      nome: "Maria da Silva",
      cpf: "806.462.500-94",
      cnpj: "09.172.999/0001-20",
      rg: "12.345.678-9",
    });
    expect(result.success).toBe(true);
  });

  it("deve aceitar pessoa sem CNPJ e RG (opcionais)", () => {
    const result = pessoaSchema.safeParse({
      nome: "Carlos Oliveira",
      cpf: "806.462.500-94",
    });
    expect(result.success).toBe(true);
  });

  it("deve aceitar CPF sem formatação", () => {
    const result = pessoaSchema.safeParse({
      nome: "Rafael Costa",
      cpf: "80646250094",
    });
    expect(result.success).toBe(true);
  });

  it("deve rejeitar nome muito curto", () => {
    const result = pessoaSchema.safeParse({
      nome: "Lu",
      cpf: "806.462.500-94",
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe("Nome deve ter pelo menos 3 caracteres");
    }
  });

  it("deve rejeitar nome vazio", () => {
    const result = pessoaSchema.safeParse({
      nome: "",
      cpf: "806.462.500-94",
    });
    expect(result.success).toBe(false);
  });

  it("deve rejeitar CPF inválido", () => {
    const result = pessoaSchema.safeParse({
      nome: "João Souza",
      cpf: "111.111.111-11",
    });
    expect(result.success).toBe(false);
  });

  it("deve rejeitar CNPJ inválido quando fornecido", () => {
    const result = pessoaSchema.safeParse({
      nome: "Empresa X",
      cpf: "806.462.500-94",
      cnpj: "99.999.999/9999-99",
    });
    expect(result.success).toBe(false);
  });

  it("deve rejeitar RG em formato inválido quando fornecido", () => {
    const result = pessoaSchema.safeParse({
      nome: "Bruno Lima",
      cpf: "806.462.500-94",
      rg: "123456789",
    });
    expect(result.success).toBe(false);
  });

  it("deve rejeitar quando CPF não é informado", () => {
    const result = pessoaSchema.safeParse({
      nome: "Sem CPF",
    });
    expect(result.success).toBe(false);
  });

  it("deve rejeitar campos completamente inválidos", () => {
    const result = pessoaSchema.safeParse({
      nome: "",
      cpf: "abc.def.ghi-jk",
      cnpj: "xyz.xyz.xyz/abcd-ef",
      rg: "000000000",
    });
    expect(result.success).toBe(false);
  });
});

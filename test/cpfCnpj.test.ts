import { describe, it, expect } from "vitest";
import { cpfCnpjSchema, validarCpf, validarCnpj } from "../src";

describe("CPF ou CNPJ", () => {
  it("deve aceitar CPF válido", () => {
    expect(cpfCnpjSchema.safeParse("806.462.500-94").success).toBe(true);
    expect(cpfCnpjSchema.safeParse("80646250094").success).toBe(true);
  });

  it("deve aceitar CNPJ válido", () => {
    expect(cpfCnpjSchema.safeParse("09.172.999/0001-20").success).toBe(true);
    expect(cpfCnpjSchema.safeParse("09172999000120").success).toBe(true);
  });

  it("deve rejeitar texto inválido", () => {
    expect(cpfCnpjSchema.safeParse("12345").success).toBe(false);
    expect(cpfCnpjSchema.safeParse("111.111.111-11").success).toBe(false);
    expect(cpfCnpjSchema.safeParse("").success).toBe(false);
  });

  it("deve retornar mensagem correta em caso de erro", () => {
    const result = cpfCnpjSchema.safeParse("invalido");
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe("CPF ou CNPJ inválido");
    }
  });
});

import { describe, it, expect } from "vitest";
import { certidaoSchema, validarCertidao } from "../src";

describe("Certidão (nascimento, casamento, óbito)", () => {
  it("deve rejeitar certidão com menos de 32 dígitos", () => {
    expect(validarCertidao("1234567890")).toBe(false);
  });

  it("deve rejeitar certidão com mais de 32 dígitos", () => {
    expect(validarCertidao("1".repeat(33))).toBe(false);
  });

  it("deve rejeitar certidão vazia", () => {
    expect(validarCertidao("")).toBe(false);
    expect(certidaoSchema.safeParse("").success).toBe(false);
  });

  it("deve rejeitar certidão com letras", () => {
    expect(validarCertidao("ABCDEFGHIJKLMNOPQRSTUVWXYZ123456")).toBe(false);
  });

  it("deve validar certidão com dígitos verificadores corretos", () => {
    // Computa uma certidão válida de teste:
    // Base: 30 dígitos "000000000000000000000000000000"
    // resto = 0 para cada posição, dv1 = 0
    // base2 = base + "0", dv2 = 0
    // Portanto "00000000000000000000000000000000" deve ser válido
    expect(validarCertidao("00000000000000000000000000000000")).toBe(true);
    expect(certidaoSchema.safeParse("00000000000000000000000000000000").success).toBe(true);
  });

  it("deve rejeitar certidão com dígitos verificadores incorretos", () => {
    expect(validarCertidao("00000000000000000000000000000001")).toBe(false);
    expect(validarCertidao("00000000000000000000000000000010")).toBe(false);
  });
});

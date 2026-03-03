import { describe, it, expect } from "vitest";
import { cnhSchema, validarCnh } from "../src";

describe("CNH", () => {
  describe("CNHs válidas", () => {
    // Calculadas com algoritmo: pesos (9-i) e (1+i) para i=0..8
    const cnhsValidas = [
      "12345678900",   // digito1=0, digito2=0
      "98765432109",   // digito1=0 (dsc=-2), digito2=9
      "10000000091",   // digito1=9, digito2=1
    ];

    it.each(cnhsValidas)("deve aceitar CNH válida: %s", (cnh) => {
      expect(validarCnh(cnh)).toBe(true);
      expect(cnhSchema.safeParse(cnh).success).toBe(true);
    });
  });

  describe("CNHs inválidas", () => {
    const cnhsInvalidas = [
      { cnh: "00000000000", motivo: "dígitos repetidos (000)" },
      { cnh: "11111111111", motivo: "dígitos repetidos (111)" },
      { cnh: "12345678901", motivo: "dígito verificador incorreto" },
      { cnh: "1234567890", motivo: "só 10 dígitos" },
      { cnh: "123456789012", motivo: "12 dígitos" },
      { cnh: "ABCDEFGHIJK", motivo: "letras" },
      { cnh: "", motivo: "vazio" },
    ];

    it.each(cnhsInvalidas)("deve rejeitar CNH: $motivo ($cnh)", ({ cnh }) => {
      expect(validarCnh(cnh)).toBe(false);
      expect(cnhSchema.safeParse(cnh).success).toBe(false);
    });
  });

  describe("mensagem de erro", () => {
    it("deve retornar mensagem 'CNH inválida'", () => {
      const result = cnhSchema.safeParse("00000000000");
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe("CNH inválida");
      }
    });
  });
});

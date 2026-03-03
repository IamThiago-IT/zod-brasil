import { describe, it, expect } from "vitest";
import { pisSchema, validarPis } from "../src";

describe("PIS/PASEP/NIS/NIT", () => {
  describe("PIS válidos", () => {
    // Calculados com pesos [3,2,9,8,7,6,5,4,3,2], resto%11, dígito = resto<2?0:11-resto
    const pisValidos = [
      "10000000008",       // dígito = 8
      "12300000000",       // dígito = 0
      "51025168481",       // dígito = 1
    ];

    it.each(pisValidos)("deve aceitar PIS válido: %s", (pis) => {
      expect(validarPis(pis)).toBe(true);
      expect(pisSchema.safeParse(pis).success).toBe(true);
    });
  });

  describe("PIS inválidos", () => {
    const pisInvalidos = [
      { pis: "11111111111", motivo: "dígitos repetidos" },
      { pis: "00000000000", motivo: "todos zeros" },
      { pis: "12345678901", motivo: "dígito verificador incorreto" },
      { pis: "1234567890", motivo: "10 dígitos" },
      { pis: "123456789012", motivo: "12 dígitos" },
      { pis: "", motivo: "vazio" },
    ];

    it.each(pisInvalidos)("deve rejeitar PIS: $motivo ($pis)", ({ pis }) => {
      expect(validarPis(pis)).toBe(false);
      expect(pisSchema.safeParse(pis).success).toBe(false);
    });
  });
});

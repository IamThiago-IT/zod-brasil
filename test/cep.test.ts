import { describe, it, expect } from "vitest";
import { cepSchema, validarCep } from "../src";

describe("CEP", () => {
  describe("CEPs válidos", () => {
    const cepsValidos = [
      "01001-000",    // São Paulo – Praça da Sé
      "20040-020",    // Rio de Janeiro
      "30130-000",    // Belo Horizonte
      "01001000",     // sem hífen
      "69900-000",    // Acre
      "99999-999",    // limite superior
      "00000-000",    // limite inferior
    ];

    it.each(cepsValidos)("deve aceitar CEP válido: %s", (cep) => {
      expect(validarCep(cep)).toBe(true);
      expect(cepSchema.safeParse(cep).success).toBe(true);
    });
  });

  describe("CEPs inválidos", () => {
    const cepsInvalidos = [
      { cep: "1234-567", motivo: "4 dígitos antes do hífen" },
      { cep: "123456", motivo: "só 6 dígitos" },
      { cep: "123456789", motivo: "9 dígitos" },
      { cep: "ABCDE-FGH", motivo: "letras" },
      { cep: "01001 000", motivo: "espaço ao invés de hífen" },
      { cep: "", motivo: "vazio" },
    ];

    it.each(cepsInvalidos)("deve rejeitar CEP: $motivo ($cep)", ({ cep }) => {
      expect(validarCep(cep)).toBe(false);
      expect(cepSchema.safeParse(cep).success).toBe(false);
    });
  });

  describe("mensagem de erro", () => {
    it("deve retornar mensagem adequada", () => {
      const result = cepSchema.safeParse("invalido");
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toContain("CEP inválido");
      }
    });
  });
});

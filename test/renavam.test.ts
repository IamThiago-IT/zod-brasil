import { describe, it, expect } from "vitest";
import { renavamSchema, validarRenavam } from "../src";

describe("RENAVAM", () => {
  describe("RENAVAMs válidos", () => {
    // Calculados manualmente com o algoritmo: pesos [3,2,9,8,7,6,5,4,3,2], dígito = ((soma*10)%11)%10
    const renavamsValidos = [
      "01234567897",  // dígito = 7
      "00000000018",  // dígito = 8
    ];

    it.each(renavamsValidos)("deve aceitar RENAVAM válido: %s", (r) => {
      expect(validarRenavam(r)).toBe(true);
      expect(renavamSchema.safeParse(r).success).toBe(true);
    });
  });

  describe("RENAVAMs inválidos", () => {
    const renavamsInvalidos = [
      { renavam: "01234567890", motivo: "dígito verificador errado" },
      { renavam: "1234567890", motivo: "só 10 dígitos" },
      { renavam: "123456789012", motivo: "12 dígitos" },
      { renavam: "ABCDEFGHIJK", motivo: "letras" },
      { renavam: "", motivo: "vazio" },
    ];

    it.each(renavamsInvalidos)("deve rejeitar RENAVAM: $motivo ($renavam)", ({ renavam }) => {
      expect(validarRenavam(renavam)).toBe(false);
      expect(renavamSchema.safeParse(renavam).success).toBe(false);
    });
  });

  it("deve aceitar RENAVAM com padding de zeros à esquerda", () => {
    // "1234567897" (10 dígitos) deve ser padded para "01234567897"
    expect(validarRenavam("1234567897")).toBe(true);
  });
});

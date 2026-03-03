import { describe, it, expect } from "vitest";
import { tituloEleitorSchema, validarTituloEleitor } from "../src";

describe("Título de Eleitor", () => {
  describe("títulos válidos", () => {
    const titulosValidos = [
      "000000001508",    // estado 15 (PA), dv1=0, dv2=8
      "000000000115",    // estado 01 (SP), dv1=1, dv2=5
      "000000000218",    // estado 02 (MG), dv1=1, dv2=8
      "123456781521",    // estado 15, dv1=2, dv2=1
    ];

    it.each(titulosValidos)("deve aceitar título válido: %s", (titulo) => {
      expect(validarTituloEleitor(titulo)).toBe(true);
      expect(tituloEleitorSchema.safeParse(titulo).success).toBe(true);
    });
  });

  describe("títulos inválidos", () => {
    const titulosInvalidos = [
      { titulo: "12345678901", motivo: "só 11 dígitos" },
      { titulo: "1234567890123", motivo: "13 dígitos" },
      { titulo: "ABCDEFGHIJKL", motivo: "letras" },
      { titulo: "", motivo: "vazio" },
      { titulo: "000000003012", motivo: "código de estado 30 (>29)" },
    ];

    it.each(titulosInvalidos)("deve rejeitar título: $motivo ($titulo)", ({ titulo }) => {
      expect(validarTituloEleitor(titulo)).toBe(false);
      expect(tituloEleitorSchema.safeParse(titulo).success).toBe(false);
    });
  });

  it("deve rejeitar título com código de estado inválido (00)", () => {
    expect(validarTituloEleitor("123456780012")).toBe(false);
  });

  it("deve ter 12 dígitos exatos", () => {
    expect(validarTituloEleitor("1234")).toBe(false);
    expect(validarTituloEleitor("12345678901234")).toBe(false);
  });
});

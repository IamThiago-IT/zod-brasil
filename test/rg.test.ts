import { describe, it, expect } from "vitest";
import { rgSchema, validarRg } from "../src";

describe("RG", () => {
  describe("RGs válidos", () => {
    const rgsValidos = [
      "12.345.678-9",
      "00.000.000-0",
      "99.999.999-9",
      "12.345.678-X",   // RG pode ter X no dígito
      "12.345.678-x",   // minúsculo também
    ];

    it.each(rgsValidos)("deve aceitar RG válido: %s", (rg) => {
      expect(validarRg(rg)).toBe(true);
      expect(rgSchema.safeParse(rg).success).toBe(true);
    });
  });

  describe("RGs inválidos", () => {
    const rgsInvalidos = [
      { rg: "123456789", motivo: "sem formatação" },
      { rg: "12345678", motivo: "dígitos insuficientes" },
      { rg: "12.345.67", motivo: "incompleto" },
      { rg: "12.345.678-99", motivo: "dois dígitos verificadores" },
      { rg: "AB.CDE.FGH-I", motivo: "letras no corpo" },
      { rg: "", motivo: "vazio" },
    ];

    it.each(rgsInvalidos)("deve rejeitar RG: $motivo ($rg)", ({ rg }) => {
      expect(validarRg(rg)).toBe(false);
      expect(rgSchema.safeParse(rg).success).toBe(false);
    });
  });
});

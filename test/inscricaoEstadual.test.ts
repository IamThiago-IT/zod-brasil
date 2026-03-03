import { describe, it, expect } from "vitest";
import { inscricaoEstadualSchema, validarInscricaoEstadual } from "../src";

describe("Inscrição Estadual", () => {
  describe("IEs válidas", () => {
    const iesValidas = [
      "1234567",        // 7 dígitos (mínimo)
      "12345678901234", // 14 dígitos (máximo)
      "110.042.490.114", // com formatação (12 dígitos)
      "123456789",       // 9 dígitos
    ];

    it.each(iesValidas)("deve aceitar IE válida: %s", (ie) => {
      expect(validarInscricaoEstadual(ie)).toBe(true);
      expect(inscricaoEstadualSchema.safeParse(ie).success).toBe(true);
    });
  });

  describe("IEs inválidas", () => {
    const iesInvalidas = [
      { ie: "123456", motivo: "6 dígitos (abaixo do mínimo)" },
      { ie: "123456789012345", motivo: "15 dígitos (acima do máximo)" },
      { ie: "", motivo: "vazio" },
      { ie: "ABCDEFG", motivo: "só letras" },
      { ie: "12345", motivo: "5 dígitos" },
    ];

    it.each(iesInvalidas)("deve rejeitar IE: $motivo ($ie)", ({ ie }) => {
      expect(validarInscricaoEstadual(ie)).toBe(false);
      expect(inscricaoEstadualSchema.safeParse(ie).success).toBe(false);
    });
  });
});

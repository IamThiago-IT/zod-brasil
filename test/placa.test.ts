import { describe, it, expect } from "vitest";
import { placaVeiculoSchema, validarPlaca } from "../src";

describe("Placa de Veículo", () => {
  describe("placas válidas", () => {
    const placasValidas = [
      "ABC-1234",     // padrão antigo com hífen
      "ABC1234",      // padrão antigo sem hífen
      "abc-1234",     // minúsculo
      "BRA2E19",      // Mercosul
      "ABC1D23",      // Mercosul
      "bra2e19",      // Mercosul minúsculo
    ];

    it.each(placasValidas)("deve aceitar placa válida: %s", (placa) => {
      expect(validarPlaca(placa)).toBe(true);
      expect(placaVeiculoSchema.safeParse(placa).success).toBe(true);
    });
  });

  describe("placas inválidas", () => {
    const placasInvalidas = [
      { placa: "1234-ABC", motivo: "números antes das letras" },
      { placa: "ABCD-123", motivo: "4 letras" },
      { placa: "AB-12345", motivo: "formato incorreto" },
      { placa: "123-4567", motivo: "só números" },
      { placa: "ABC-DEFG", motivo: "só letras" },
      { placa: "", motivo: "vazio" },
      { placa: "A1", motivo: "muito curto" },
    ];

    it.each(placasInvalidas)("deve rejeitar placa: $motivo ($placa)", ({ placa }) => {
      expect(validarPlaca(placa)).toBe(false);
      expect(placaVeiculoSchema.safeParse(placa).success).toBe(false);
    });
  });
});

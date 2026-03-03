import { describe, it, expect } from "vitest";
import { cnpjSchema, validarCnpj } from "../src";

describe("CNPJ", () => {
  describe("CNPJs válidos", () => {
    const cnpjsValidos = [
      "09.172.999/0001-20",
      "11.222.333/0001-81",
      "11.444.777/0001-61",
      "09172999000120",       // sem formatação
      "11222333000181",
      "11444777000161",
    ];

    it.each(cnpjsValidos)("deve aceitar CNPJ válido: %s", (cnpj) => {
      expect(validarCnpj(cnpj)).toBe(true);
      expect(cnpjSchema.safeParse(cnpj).success).toBe(true);
    });
  });

  describe("CNPJs inválidos", () => {
    const cnpjsInvalidos = [
      { cnpj: "11.111.111/1111-11", motivo: "dígitos repetidos" },
      { cnpj: "00.000.000/0000-00", motivo: "todos zeros" },
      { cnpj: "99.999.999/9999-99", motivo: "todos noves" },
      { cnpj: "09.172.99A/0001-20", motivo: "contém letras" },
      { cnpj: "09.172.999/0001-21", motivo: "dígito verificador errado" },
      { cnpj: "123456789012", motivo: "só 12 dígitos" },
      { cnpj: "123456789012345", motivo: "15 dígitos (excesso)" },
      { cnpj: "", motivo: "vazio" },
      { cnpj: "xyz.xyz.xyz/abcd-ef", motivo: "só letras" },
    ];

    it.each(cnpjsInvalidos)("deve rejeitar CNPJ: $motivo ($cnpj)", ({ cnpj }) => {
      expect(validarCnpj(cnpj)).toBe(false);
      expect(cnpjSchema.safeParse(cnpj).success).toBe(false);
    });
  });

  describe("mensagem de erro", () => {
    it("deve retornar mensagem 'CNPJ inválido'", () => {
      const result = cnpjSchema.safeParse("00.000.000/0000-00");
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe("CNPJ inválido");
      }
    });
  });
});

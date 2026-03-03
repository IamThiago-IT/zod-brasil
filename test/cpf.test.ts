import { describe, it, expect } from "vitest";
import { cpfSchema, validarCpf } from "../src";

describe("CPF", () => {
  describe("CPFs válidos", () => {
    const cpfsValidos = [
      "529.982.247-25",
      "123.456.789-09",
      "52998224725",       // sem formatação
      "12345678909",
      "806.462.500-94",
    ];

    it.each(cpfsValidos)("deve aceitar CPF válido: %s", (cpf) => {
      expect(validarCpf(cpf)).toBe(true);
      expect(cpfSchema.safeParse(cpf).success).toBe(true);
    });
  });

  describe("CPFs inválidos", () => {
    const cpfsInvalidos = [
      { cpf: "111.111.111-11", motivo: "dígitos repetidos (111)" },
      { cpf: "222.222.222-22", motivo: "dígitos repetidos (222)" },
      { cpf: "000.000.000-00", motivo: "dígitos repetidos (000)" },
      { cpf: "999.999.999-99", motivo: "dígitos repetidos (999)" },
      { cpf: "123.456.789-00", motivo: "dígito verificador errado" },
      { cpf: "806.462.500-95", motivo: "segundo dígito verificador errado" },
      { cpf: "806.462.A00-94", motivo: "contém letras" },
      { cpf: "abc.def.ghi-jk", motivo: "só letras" },
      { cpf: "123.456.789", motivo: "incompleto" },
      { cpf: "1234567890", motivo: "só 10 dígitos" },
      { cpf: "123456789012", motivo: "12 dígitos (excesso)" },
      { cpf: "", motivo: "vazio" },
    ];

    it.each(cpfsInvalidos)("deve rejeitar CPF: $motivo ($cpf)", ({ cpf }) => {
      expect(validarCpf(cpf)).toBe(false);
      expect(cpfSchema.safeParse(cpf).success).toBe(false);
    });
  });

  describe("mensagem de erro", () => {
    it("deve retornar mensagem 'CPF inválido'", () => {
      const result = cpfSchema.safeParse("000.000.000-00");
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe("CPF inválido");
      }
    });
  });
});

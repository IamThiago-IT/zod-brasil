import { describe, it, expect } from "vitest";
import { telefoneSchema, validarTelefone } from "../src";

describe("Telefone Brasileiro", () => {
  describe("telefones válidos", () => {
    const telefonesValidos = [
      "(11) 91234-5678",    // celular SP
      "(21) 91234-5678",    // celular RJ
      "(11) 1234-5678",     // fixo SP
      "11912345678",         // celular sem formatação
      "1112345678",          // fixo sem formatação
      "+55 11 91234-5678",  // com DDI
      "+5511912345678",      // com DDI sem formatação
    ];

    it.each(telefonesValidos)("deve aceitar telefone válido: %s", (tel) => {
      expect(validarTelefone(tel)).toBe(true);
      expect(telefoneSchema.safeParse(tel).success).toBe(true);
    });
  });

  describe("telefones inválidos", () => {
    const telefonesInvalidos = [
      { tel: "1234-5678", motivo: "sem DDD" },
      { tel: "912345678", motivo: "só 9 dígitos" },
      { tel: "(00) 91234-5678", motivo: "DDD 00 inválido" },
      { tel: "ABCDEFGHIJ", motivo: "só letras" },
      { tel: "", motivo: "vazio" },
      { tel: "12345", motivo: "muito curto" },
    ];

    it.each(telefonesInvalidos)("deve rejeitar telefone: $motivo ($tel)", ({ tel }) => {
      expect(validarTelefone(tel)).toBe(false);
      expect(telefoneSchema.safeParse(tel).success).toBe(false);
    });
  });
});

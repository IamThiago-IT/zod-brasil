import { pessoaSchema } from "../src/";

const casosDeTeste = [
    {
      descricao: "✅ Todos os campos válidos",
      dados: {
          nome: "Maria da Silva",
          cpf: "806.462.500-94", // CPF válido
          cnpj: "09.172.999/0001-20", // CNPJ válido
          rg: "12.345.678-9",
      },
      esperado: true,
    },
    {
      descricao: "❌ CPF inválido",
      dados: {
          nome: "João Souza",
          cpf: "111.111.111-11", // CPF inválido (sequência repetida)
          cnpj: "09.172.999/0001-20",
          rg: "12.345.678-9",
      },
      esperado: false,
    },
    {
      descricao: "❌ CNPJ inválido",
      dados: {
          nome: "Empresa X",
          cpf: "806.462.500-94",
          cnpj: "99.999.999/9999-99", // CNPJ inválido
          rg: "12.345.678-9",
      },
      esperado: false,
    },
    {
      descricao: "✅ CPF válido sem CNPJ",
      dados: {
          nome: "Carlos Oliveira",
          cpf: "806.462.500-94", // CPF válido
          rg: "12.345.678-9",
      },
      esperado: true,
    },
    {
      descricao: "❌ Nome muito curto",
      dados: {
          nome: "Lu",
          cpf: "806.462.500-94",
          rg: "12.345.678-9",
      },
      esperado: false,
    },
    {
      descricao: "❌ RG em formato inválido",
      dados: {
          nome: "Bruno Lima",
          cpf: "806.462.500-94",
          rg: "123456789", // Falta a formatação correta
      },
      esperado: false,
    },
    {
      descricao: "❌ Campos completamente errados",
      dados: {
          nome: "",
          cpf: "abc.def.ghi-jk",
          cnpj: "xyz.xyz.xyz/abcd-ef",
          rg: "000000000",
      },
      esperado: false,
    },
    {
      descricao: "✅ Todos os campos válidos - CPF e CNPJ com formatação correta",
      dados: {
        nome: "Ana Paula",
        cpf: "806.462.500-94", // CPF válido
        cnpj: "09.172.999/0001-20", // CNPJ válido
        rg: "12.345.678-9",       // RG no formato correto
      },
      esperado: true,
    },
    {
      descricao: "✅ CPF e CNPJ sem formatação (mas matematicamente válidos)",
      dados: {
        nome: "Rafael Costa",
        cpf: "80646250094",      // CPF sem pontos e traço
        cnpj: "09172999000120",   // CNPJ sem formatação
        rg: "12.345.678-9",       // RG com formatação correta
      },
      esperado: true,
    },
    {
      descricao: "❌ CPF com letras intercaladas",
      dados: {
        nome: "Mariana Lima",
        cpf: "806.462.A00-94",   // CPF contém letra (inválido)
        cnpj: "09.172.999/0001-20",
        rg: "12.345.678-9",
      },
      esperado: false,
    },
    {
      descricao: "❌ CNPJ com letras",
      dados: {
        nome: "Empresa Y",
        cpf: "806.462.500-94",
        cnpj: "09.172.99A/0001-20", // CNPJ contém letra (inválido)
        rg: "12.345.678-9",
      },
      esperado: false,
    },
    {
      descricao: "❌ Nome vazio",
      dados: {
        nome: "",                  // Nome vazio
        cpf: "806.462.500-94",
        cnpj: "09.172.999/0001-20",
        rg: "12.345.678-9",
      },
      esperado: false,
    },
    {
      descricao: "❌ RG com formatação incorreta",
      dados: {
        nome: "Carlos Mendes",
        cpf: "806.462.500-94",
        cnpj: "09.172.999/0001-20",
        rg: "12345678",            // RG sem pontos e traço
      },
      esperado: false,
    },
    {
      descricao: "✅ Apenas nome e CPF válidos (CNPJ e RG opcionais)",
      dados: {
        nome: "Fabiana Torres",
        cpf: "806.462.500-94",
        // CNPJ e RG não informados (são opcionais)
      },
      esperado: true,
    },
    {
      descricao: "❌ CPF inválido (todos dígitos iguais)",
      dados: {
        nome: "Roberto Silva",
        cpf: "111.111.111-11",     // CPF com dígitos repetidos
        cnpj: "09.172.999/0001-20",
        rg: "12.345.678-9",
      },
      esperado: false,
    },
    {
      descricao: "❌ CNPJ inválido (todos dígitos iguais)",
      dados: {
        nome: "Empresa Z",
        cpf: "806.462.500-94",
        cnpj: "11.111.111/1111-11", // CNPJ com dígitos repetidos
        rg: "12.345.678-9",
      },
      esperado: false,
    },
    {
      descricao: "❌ RG inválido (número insuficiente de dígitos)",
      dados: {
        nome: "Luciana Alves",
        cpf: "806.462.500-94",
        cnpj: "09.172.999/0001-20",
        rg: "12.345.67",           // RG incompleto (formato incorreto)
      },
      esperado: false,
    },
  ];

// Executando os testes
casosDeTeste.forEach(({ descricao, dados, esperado }, index) => {
  const resultado = pessoaSchema.safeParse(dados);
  const passou = resultado.success === esperado;

  console.log(
    `${passou ? "✅" : "❌"} [${index + 1}] ${descricao} → ${
      resultado.success ? "Passou" : "Falhou"
    }`
  );

  if (!resultado.success) {
    console.error("Erros:", resultado.error.format());
  }
});

# zod-brasil

**zod-brasil** é uma biblioteca que fornece esquemas de validação para dados brasileiros, como CPF, CNPJ e RG, utilizando a poderosa biblioteca [Zod](https://github.com/colinhacks/zod).

## Recursos

- **Validação de CPF**: Verifica se o CPF é válido, incluindo a checagem dos dígitos verificadores.
- **Validação de CNPJ**: Verifica se o CNPJ é válido, incluindo a checagem dos dígitos verificadores.
- **Validação de RG**: Valida o formato do RG conforme padrões comuns.

## Instalação

Instale o pacote via npm:

```bash
npm install zod-brasil
```

Ou via yarn:

```bash
yarn add zod-brasil
```

## Uso

Importe os esquemas de validação necessários e utilize-os em seu projeto:

```typescript
import { cpfSchema, cnpjSchema, rgSchema, pessoaSchema } from 'zod-brasil';

// Exemplo de validação de CPF
const cpfResult = cpfSchema.safeParse('123.456.789-09');
if (!cpfResult.success) {
  console.error(cpfResult.error.format());
} else {
  console.log('CPF válido:', cpfResult.data);
}

// Exemplo de validação de CNPJ
const cnpjResult = cnpjSchema.safeParse('12.345.678/0001-95');
if (!cnpjResult.success) {
  console.error(cnpjResult.error.format());
} else {
  console.log('CNPJ válido:', cnpjResult.data);
}

// Exemplo de validação de uma pessoa
const pessoaResult = pessoaSchema.safeParse({
  nome: 'João Silva',
  cpf: '123.456.789-09',
  cnpj: '12.345.678/0001-95',
  rg: '12.345.678-9',
});

if (!pessoaResult.success) {
  console.error(pessoaResult.error.format());
} else {
  console.log('Dados válidos:', pessoaResult.data);
}
```

## Esquemas Disponíveis

- `cpfSchema`: Valida strings no formato de CPF (`000.000.000-00`).
- `cnpjSchema`: Valida strings no formato de CNPJ (`00.000.000/0000-00`).
- `rgSchema`: Valida strings no formato de RG (`00.000.000-0`).
- `pessoaSchema`: Valida um objeto que contém `nome`, `cpf`, `cnpj` (opcional) e `rg` (opcional).

## Contribuição

Contribuições são bem-vindas! Sinta-se à vontade para abrir issues e pull requests no [repositório do GitHub](https://github.com/seu-usuario/zod-brasil).

## Licença

Este projeto está licenciado sob a [MIT License](LICENSE).

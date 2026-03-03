# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [2.0.0] - 2026-03-03

### Added
- **CPF/CNPJ combinado**: Novo schema `cpfCnpjSchema` que aceita CPF ou CNPJ
- **CEP**: Validação de CEP brasileiro (formato 00000-000 ou 00000000)
- **PIS/PASEP/NIS/NIT**: Validação completa com dígito verificador
- **Título de Eleitor**: Validação com código de estado e dois dígitos verificadores
- **CNH**: Validação de Carteira Nacional de Habilitação
- **Telefone**: Validação de telefones fixos e celulares com DDD (com suporte a DDI +55)
- **Placa de Veículo**: Suporte a placas antigas (ABC-1234) e Mercosul (ABC1D23)
- **RENAVAM**: Validação de RENAVAM com dígito verificador
- **Certidão**: Validação de certidões de nascimento/casamento/óbito (32 dígitos)
- **Inscrição Estadual**: Validação genérica de inscrição estadual (7-14 dígitos)
- **Funções de validação exportadas**: Todas as funções de validação agora são exportadas individualmente
- **Testes completos**: Migração para Vitest com cobertura abrangente de todos os documentos
- **RG melhorado**: Agora aceita 'X' no dígito verificador

### Changed
- **Testes reescritos**: Substituição de Jest por Vitest para melhor performance
- **Estrutura de exports**: Default export agora inclui todos os schemas e funções
- **Algoritmos refinados**: Melhorias na implementação dos algoritmos de validação

### Fixed
- **Dados de teste corrigidos**: Todos os números de teste foram verificados manualmente
- **Mensagens de erro**: Padronização das mensagens de erro em português

### Removed
- **Testes antigos**: Remoção do arquivo de teste manual em favor dos testes automatizados</content>
<parameter name="filePath">/workspaces/zod-brasil/CHANGELOG.md
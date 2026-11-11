# Gerador de Termo de Responsabilidade - Workplace

Aplicação web para preenchimento ágil e geração de **Termos de Responsabilidade de Equipamentos em PDF** com coordenadas milimétricas calibradas sobre o documento oficial.

## 🚀 Funcionalidades

- **Assistente Interativo**: Formulário guiado em etapas para evitar erros de preenchimento.
- **Regras de Negócio Automáticas**:
  - *Entrega de Equipamento*: Oculta e anula automaticamente o bloco de recolhimento.
  - *Devolução de Equipamento*: Oculta e anula o bloco de entrega.
  - *Incidente*: Permite registrar saída e entrada simultaneamente.
- **Mapeamento Vetorial Calibrado**:
  - Contato com DDD posicionado automaticamente dentro dos parênteses `( )`.
  - Nome do Gestor Direto perfeitamente alinhado acima da linha de assinatura.
  - Datas separadas em campos de **Dia**, **Mês** e **Ano** entre as barras `/` e `/` (Data de Abertura no cabeçalho e Data de Entrega no rodapé).
  - Suporte a quebra em múltiplas linhas para o campo de Observações.
  - Preenchimento simultâneo da folha de rosto e do verso (Controle Interno/Estoque).
- **Execução 100% no Navegador**: Processamento de PDF seguro e rápido usando `pdf-lib` via cliente, sem envio de dados confidenciais para servidores externos.

## 💻 Como Executar Localmente com Node.js

1. Clone o repositório ou baixe os arquivos.
2. Inicie o servidor local:
```bash
node server.js
```
3. Abra no navegador:
```
http://localhost:3000
```

## 🌐 Publicação Web via GitHub Pages

Como o processamento é feito inteiramente no navegador via JavaScript (client-side), o projeto pode ser publicado gratuitamente pelo **GitHub Pages**:

1. Crie um repositório no seu GitHub (ex: `termo-responsabilidade`).
2. Faça o push dos arquivos deste repositório para o branch `main`.
3. No GitHub, acesse:
   **Settings** > **Pages** > em **Branch**, selecione `main` e a pasta `/ (root)`.
4. Clique em **Save**. Em instantes o site estará acessível publicamente no endereço:
   `https://<seu-usuario>.github.io/termo-responsabilidade/`

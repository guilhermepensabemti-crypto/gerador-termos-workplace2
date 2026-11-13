const PDF_MAP = {
  // --- SERVIÇO REALIZADO (CHECKBOXES PÁGINA 1) ---
  tipoAtendimento: {
    onboarding: { x: 35.9, y: 751.4, width: 11.8, height: 11.8, pagina: 0 },
    entrega: { x: 165.6, y: 751.4, width: 11.8, height: 11.8, pagina: 0 },
    devolucao: { x: 329.8, y: 751.4, width: 11.8, height: 11.8, pagina: 0 },
    incidente: { x: 492.3, y: 751.5, width: 11.8, height: 11.8, pagina: 0 }
  },

  // --- DADOS DO CHAMADO (PÁGINA 1) ---
  chamado: { x: 76, y: 717, width: 105, height: 10, pagina: 0 },
  tecnico: { x: 233, y: 717, width: 190, height: 10, pagina: 0 },
  
  // Data de Abertura do Chamado (em cima - entre as barras / /)
  dataAbertura: {
    dia: { x: 471.0, y: 717, width: 16, height: 10, pagina: 0 },
    mes: { x: 506.5, y: 717, width: 16, height: 10, pagina: 0 },
    ano: { x: 535.0, y: 717, width: 25, height: 10, pagina: 0 }
  },

  // --- DADOS DO COLABORADOR (PÁGINA 1) ---
  colaborador: {
    nome: { x: 59, y: 676, width: 285, height: 10, pagina: 0 },
    // Contato: DDD dentro dos parênteses e número após os parênteses
    contato: {
      ddd: { x: 418.0, y: 676, width: 14, height: 10, pagina: 0 },
      numero: { x: 442.0, y: 676, width: 105, height: 10, pagina: 0 }
    },
    site: { x: 52, y: 658, width: 290, height: 10, pagina: 0 },
    matricula: { x: 413, y: 658, width: 132, height: 10, pagina: 0 },
    // Gestor Direto: posicionado acima da linha (linha está em y: 642.2)
    gestor: { x: 92, y: 646.0, width: 250, height: 10, pagina: 0 }
  },

  // --- DADOS DO EQUIPAMENTO RECOLHIDO (PÁGINA 1) ---
  recolhido: {
    blocoYStart: 615,
    blocoYEnd: 430,
    equipamentos: {
      notebookPadrao: { x: 26.9, y: 589.1, width: 10.1, height: 10.1, pagina: 0 },
      ultrabook: { x: 115.3, y: 589.2, width: 10.1, height: 10.1, pagina: 0 },
      desktopPadrao: { x: 166.9, y: 589.2, width: 10.1, height: 10.1, pagina: 0 },
      desktopPlus: { x: 252.0, y: 589.2, width: 10.1, height: 10.1, pagina: 0 },
      macbook: { x: 26.8, y: 569.3, width: 10.1, height: 10.1, pagina: 0 },
      celular: { x: 115.3, y: 568.4, width: 10.1, height: 10.1, pagina: 0 },
      desktopAvancado: { x: 166.9, y: 569.3, width: 10.1, height: 10.1, pagina: 0 },
      monitor: { x: 252.0, y: 569.3, width: 10.1, height: 10.1, pagina: 0 },
      notebookAvancado: { x: 26.8, y: 548.9, width: 10.1, height: 10.1, pagina: 0 },
      notebookPlus: { x: 115.3, y: 548.9, width: 10.1, height: 10.1, pagina: 0 },
      ipadTablet: { x: 252.0, y: 548.9, width: 10.1, height: 10.1, pagina: 0 }
    },
    perifericos: {
      adaptadorUsbc: { x: 326.0, y: 589.3, width: 10.1, height: 10.1, pagina: 0 },
      dockstation: { x: 410.2, y: 589.3, width: 10.1, height: 10.1, pagina: 0 },
      mochila: { x: 471.7, y: 589.3, width: 10.1, height: 10.1, pagina: 0 },
      teclado: { x: 522.3, y: 589.3, width: 10.1, height: 10.1, pagina: 0 },
      cadeadoTrava: { x: 326.0, y: 569.4, width: 10.1, height: 10.1, pagina: 0 },
      fone: { x: 410.2, y: 569.5, width: 10.1, height: 10.1, pagina: 0 },
      mouse: { x: 471.7, y: 568.7, width: 10.1, height: 10.1, pagina: 0 },
      outros: { x: 326.0, y: 549.2, width: 10.1, height: 10.1, pagina: 0 }
    },
    outrosDescricao: { x: 370, y: 551.5, maxWidth: 185, pagina: 0 },
    campos: {
      ativo: { x: 55, y: 528, width: 240, height: 10, pagina: 0 },
      serviceTag: { x: 135, y: 511, width: 160, height: 10, pagina: 0 },
      modelo: { x: 66, y: 494, width: 230, height: 10, pagina: 0 },
      monitor: { x: 69, y: 477, width: 228, height: 10, pagina: 0 },
      imei: { x: 93, y: 458, width: 204, height: 10, pagina: 0 },
      linhaMovil: { x: 82, y: 440, width: 215, height: 10, pagina: 0 }
    },
    avaliacoes: {
      sim: { x: 339, y: 462.5, width: 8, height: 8, pagina: 0 },
      nao: { x: 367, y: 462.5, width: 8, height: 8, pagina: 0 },
      restauracao: { x: 339, y: 462.5, width: 8, height: 8, pagina: 0 },
      perfeitasCondicoes: { x: 339, y: 462.5, width: 8, height: 8, pagina: 0 }
    }
  },

  // --- DADOS DO EQUIPAMENTO ENTREGUE (PÁGINA 1) ---
  entregue: {
    blocoYStart: 415,
    blocoYEnd: 230,
    equipamentos: {
      notebookPadrao: { x: 26.9, y: 390.3, width: 10.1, height: 10.1, pagina: 0 },
      ultrabook: { x: 115.3, y: 390.4, width: 10.1, height: 10.1, pagina: 0 },
      desktopPadrao: { x: 167.0, y: 390.4, width: 10.1, height: 10.1, pagina: 0 },
      desktopPlus: { x: 252.0, y: 390.4, width: 10.1, height: 10.1, pagina: 0 },
      macbook: { x: 26.8, y: 370.5, width: 10.1, height: 10.1, pagina: 0 },
      celular: { x: 115.3, y: 369.6, width: 10.1, height: 10.1, pagina: 0 },
      desktopAvancado: { x: 167.0, y: 370.5, width: 10.1, height: 10.1, pagina: 0 },
      monitor: { x: 252.0, y: 370.5, width: 10.1, height: 10.1, pagina: 0 },
      notebookAvancado: { x: 26.8, y: 350.1, width: 10.1, height: 10.1, pagina: 0 },
      notebookPlus: { x: 115.3, y: 350.4, width: 10.1, height: 10.1, pagina: 0 },
      ipadTablet: { x: 251.8, y: 350.4, width: 10.1, height: 10.1, pagina: 0 }
    },
    perifericos: {
      adaptadorUsbc: { x: 325.6, y: 390.5, width: 10.1, height: 10.1, pagina: 0 },
      dockstation: { x: 409.9, y: 390.5, width: 10.1, height: 10.1, pagina: 0 },
      mochila: { x: 471.4, y: 390.5, width: 10.1, height: 10.1, pagina: 0 },
      teclado: { x: 522.0, y: 390.5, width: 10.1, height: 10.1, pagina: 0 },
      cadeadoTrava: { x: 325.6, y: 370.6, width: 10.1, height: 10.1, pagina: 0 },
      fone: { x: 409.9, y: 370.7, width: 10.1, height: 10.1, pagina: 0 },
      mouse: { x: 471.4, y: 369.9, width: 10.1, height: 10.1, pagina: 0 },
      outros: { x: 325.6, y: 350.4, width: 10.1, height: 10.1, pagina: 0 }
    },
    outrosDescricao: { x: 370, y: 352.7, maxWidth: 185, pagina: 0 },
    campos: {
      ativo: { x: 55, y: 329, width: 240, height: 10, pagina: 0 },
      serviceTag: { x: 136, y: 310, width: 160, height: 10, pagina: 0 },
      modelo: { x: 66, y: 294, width: 230, height: 10, pagina: 0 },
      monitor: { x: 69, y: 277, width: 228, height: 10, pagina: 0 },
      imei: { x: 93, y: 258, width: 204, height: 10, pagina: 0 },
      linhaMovil: { x: 82, y: 240, width: 215, height: 10, pagina: 0 }
    },
    avarias: {
      sim: { x: 366.3, y: 326.9, width: 8.3, height: 8.3, pagina: 0 },
      nao: { x: 395.8, y: 326.9, width: 8.3, height: 8.3, pagina: 0 }
    },
    observacoesLinhas: [
      { x: 328, y: 310, width: 228, height: 10, pagina: 0 },
      { x: 328, y: 293, width: 228, height: 10, pagina: 0 },
      { x: 328, y: 276, width: 228, height: 10, pagina: 0 },
      { x: 328, y: 257, width: 228, height: 10, pagina: 0 }
    ]
  },

  // --- DATA DE ENTREGA (NO FINAL DA FOLHA / RODAPÉ - ENTRE AS BARRAS / /) ---
  dataEntrega: {
    dia: { x: 468.5, y: 35.0, width: 16, height: 10, pagina: 0 },
    mes: { x: 504.0, y: 35.0, width: 16, height: 10, pagina: 0 },
    ano: { x: 532.0, y: 35.0, width: 25, height: 10, pagina: 0 }
  },

  // --- PÁGINA 2: CONTROLE INTERNO / ESTOQUE ---
  pagina2: {
    chamado: { x: 75, y: 759, width: 230, height: 10, pagina: 1 },
    data: { x: 345, y: 759, width: 100, height: 10, pagina: 1 },
    entregue: {
      ativo: { x: 55, y: 717, width: 250, height: 10, pagina: 1 },
      dataRetirada: { x: 395, y: 717, width: 100, height: 10, pagina: 1 },
      serviceTag: { x: 136, y: 696, width: 170, height: 10, pagina: 1 },
      modelo: { x: 65, y: 677, width: 240, height: 10, pagina: 1 },
      monitor: { x: 65, y: 659, width: 240, height: 10, pagina: 1 },
      imei: { x: 88, y: 637, width: 220, height: 10, pagina: 1 },
      tecnico: { x: 412, y: 637, width: 140, height: 10, pagina: 1 },
      linhaMovil: { x: 82, y: 615, width: 220, height: 10, pagina: 1 }
    },
    recolhido: {
      ativo: { x: 55, y: 565, width: 250, height: 10, pagina: 1 },
      serviceTag: { x: 136, y: 544, width: 170, height: 10, pagina: 1 },
      modelo: { x: 65, y: 525, width: 240, height: 10, pagina: 1 },
      monitor: { x: 65, y: 506, width: 240, height: 10, pagina: 1 },
      imei: { x: 88, y: 485, width: 220, height: 10, pagina: 1 },
      tecnico: { x: 412, y: 485, width: 140, height: 10, pagina: 1 },
      linhaMovil: { x: 82, y: 463, width: 220, height: 10, pagina: 1 },
      dataEntrega: { x: 102, y: 437, width: 100, height: 10, pagina: 1 }
    }
  }
};

function splitDate(dateStr) {
    if (!dateStr) return { dia: '', mes: '', ano: '' };
    const str = String(dateStr).trim();
    let parts = [];
    if (str.includes('-')) {
        const p = str.split('-');
        if (p.length === 3) {
            parts = [p[2], p[1], p[0]]; // [DD, MM, YYYY]
        }
    } else if (str.includes('/')) {
        parts = str.split('/');
    }
    if (parts.length === 3) {
        return {
            dia: parts[0].padStart(2, '0'),
            mes: parts[1].padStart(2, '0'),
            ano: parts[2]
        };
    }
    return { dia: '', mes: '', ano: '' };
}

function parseContato(contato) {
    if (!contato) return { ddd: '', numero: '' };
    const str = String(contato).trim();
    const digits = str.replace(/\D/g, '');

    // Número completo de telefone brasileiro com DDD
    if (digits.length >= 10) {
        const cleanDigits = (digits.startsWith('55') && digits.length > 11) ? digits.slice(2) : digits;
        const ddd = cleanDigits.slice(0, 2);
        const rest = cleanDigits.slice(2);
        const formattedRest = rest.length === 9 
            ? `${rest.slice(0, 5)}-${rest.slice(5)}`
            : (rest.length === 8 ? `${rest.slice(0, 4)}-${rest.slice(4)}` : rest);
        return { ddd, numero: formattedRest };
    }

    // Tenta formato com regex (ex: (11) 98765-4321 ou 11 98765-4321)
    const match = str.match(/^\(?\s*(\d{2})\s*\)?[\s\.-]*(.+)$/);
    if (match) {
        return { ddd: match[1], numero: match[2].trim() };
    }

    return { ddd: '', numero: str };
}

async function generatePdfTerm(data) {
    let templateBytes;
    try {
        const res = await fetch(encodeURI('TERMO 2026.pdf'));
        if (!res.ok) throw new Error();
        templateBytes = await res.arrayBuffer();
    } catch (e) {
        try {
            const res = await fetch(encodeURIComponent('Termo de Responsabilidade frente e verso.pdf'));
            if (!res.ok) throw new Error();
            templateBytes = await res.arrayBuffer();
        } catch (err2) {
            throw new Error('Não foi possível carregar o arquivo template TERMO 2026.pdf. Verifique se o arquivo está na pasta do projeto.');
        }
    }

    const pdfDoc = await PDFLib.PDFDocument.load(templateBytes);
    const pages = pdfDoc.getPages();
    const page1 = pages[0];
    const page2 = pages.length > 1 ? pages[1] : null;

    const font = await pdfDoc.embedFont(PDFLib.StandardFonts.Helvetica);
    const fontBold = await pdfDoc.embedFont(PDFLib.StandardFonts.HelveticaBold);

    const drawTextOn = (targetPage, text, x, y, size = 9, isBold = false) => {
        if (!text || !targetPage) return;
        targetPage.drawText(String(text), {
            x,
            y,
            size,
            font: isBold ? fontBold : font,
            color: PDFLib.rgb(0, 0, 0),
        });
    };

    const drawText = (text, x, y, size = 9, isBold = false) => {
        drawTextOn(page1, text, x, y, size, isBold);
    };

    const drawCheck = (coord) => {
        if (!coord) return;
        page1.drawText('X', {
            x: coord.x + 1.8,
            y: coord.y + 1.8,
            size: 8,
            font: fontBold,
            color: PDFLib.rgb(0, 0, 0),
        });
    };

    const drawStrikeLine = (yStart) => {
        page1.drawLine({
            start: { x: 26, y: yStart },
            end: { x: 570, y: yStart },
            thickness: 1.2,
            color: PDFLib.rgb(0.7, 0.1, 0.1),
        });
    };

    // ==========================================
    // 1. TIPO DE ATENDIMENTO (PÁGINA 1)
    // ==========================================
    if (data.tipoAtendimento === 'Entrega') {
        drawCheck(PDF_MAP.tipoAtendimento.entrega);
    } else if (data.tipoAtendimento === 'Devolucao') {
        drawCheck(PDF_MAP.tipoAtendimento.devolucao);
    } else if (data.tipoAtendimento === 'Incidente') {
        drawCheck(PDF_MAP.tipoAtendimento.incidente);
    }

    // ==========================================
    // 2. DADOS DO CHAMADO (PÁGINA 1)
    // ==========================================
    drawText(data.chamado, PDF_MAP.chamado.x, PDF_MAP.chamado.y, 9);
    drawText(data.tecnico, PDF_MAP.tecnico.x, PDF_MAP.tecnico.y, 9);

    // Data de Abertura do Chamado (separada em Dia, Mês e Ano entre as barras / /)
    const dataAberturaRaw = data.dataAbertura || data.data;
    const dataAberturaObj = splitDate(dataAberturaRaw);
    if (dataAberturaObj.dia) drawText(dataAberturaObj.dia, PDF_MAP.dataAbertura.dia.x, PDF_MAP.dataAbertura.dia.y, 9);
    if (dataAberturaObj.mes) drawText(dataAberturaObj.mes, PDF_MAP.dataAbertura.mes.x, PDF_MAP.dataAbertura.mes.y, 9);
    if (dataAberturaObj.ano) drawText(dataAberturaObj.ano, PDF_MAP.dataAbertura.ano.x, PDF_MAP.dataAbertura.ano.y, 9);

    // ==========================================
    // 3. DADOS DO COLABORADOR (PÁGINA 1)
    // ==========================================
    drawText(data.colaborador.nome, PDF_MAP.colaborador.nome.x, PDF_MAP.colaborador.nome.y, 9);

    // Contato: DDD dentro dos parênteses e restante na linha
    const contatoParsed = parseContato(data.colaborador.contato);
    if (contatoParsed.ddd) {
        drawText(contatoParsed.ddd, PDF_MAP.colaborador.contato.ddd.x, PDF_MAP.colaborador.contato.ddd.y, 9);
        drawText(contatoParsed.numero, PDF_MAP.colaborador.contato.numero.x, PDF_MAP.colaborador.contato.numero.y, 9);
    } else {
        drawText(data.colaborador.contato, PDF_MAP.colaborador.contato.numero.x, PDF_MAP.colaborador.contato.numero.y, 9);
    }

    drawText(data.colaborador.site, PDF_MAP.colaborador.site.x, PDF_MAP.colaborador.site.y, 9);
    drawText(data.colaborador.matricula, PDF_MAP.colaborador.matricula.x, PDF_MAP.colaborador.matricula.y, 9);
    
    // Gestor Direto: posicionado acima da linha de preenchimento (y: 646.0)
    drawText(data.colaborador.gestor, PDF_MAP.colaborador.gestor.x, PDF_MAP.colaborador.gestor.y, 9);

    // ==========================================
    // 4. EQUIPAMENTO RECOLHIDO (DEVOLUÇÃO / INCIDENTE)
    // ==========================================
    if (data.tipoAtendimento === 'Devolucao' || data.tipoAtendimento === 'Incidente') {
        if (data.recolhido?.ativos) {
            data.recolhido.ativos.forEach(eq => {
                if (PDF_MAP.recolhido.equipamentos[eq]) {
                    drawCheck(PDF_MAP.recolhido.equipamentos[eq]);
                }
            });
        }
        if (data.recolhido?.perifericos) {
            data.recolhido.perifericos.forEach(per => {
                if (PDF_MAP.recolhido.perifericos[per]) {
                    drawCheck(PDF_MAP.recolhido.perifericos[per]);
                }
            });
        }
        drawText(data.recolhido.ativo, PDF_MAP.recolhido.campos.ativo.x, PDF_MAP.recolhido.campos.ativo.y, 9);
        drawText(data.recolhido.serviceTag, PDF_MAP.recolhido.campos.serviceTag.x, PDF_MAP.recolhido.campos.serviceTag.y, 9);
        drawText(data.recolhido.modelo, PDF_MAP.recolhido.campos.modelo.x, PDF_MAP.recolhido.campos.modelo.y, 9);
        drawText(data.recolhido.monitor, PDF_MAP.recolhido.campos.monitor.x, PDF_MAP.recolhido.campos.monitor.y, 9);
        drawText(data.recolhido.imei, PDF_MAP.recolhido.campos.imei.x, PDF_MAP.recolhido.campos.imei.y, 9);
        drawText(data.recolhido.linhaMovil, PDF_MAP.recolhido.campos.linhaMovil.x, PDF_MAP.recolhido.campos.linhaMovil.y, 9);

        // Avaliações
        if (data.recolhido.perfeitas) {
            drawCheck(PDF_MAP.recolhido.avaliacoes.sim);
        } else if (data.recolhido.restauracao) {
            drawCheck(PDF_MAP.recolhido.avaliacoes.sim);
        }
    }

    if (data.tipoAtendimento === 'Entrega') {
        drawStrikeLine(594);
        drawStrikeLine(574);
        drawStrikeLine(554);
        drawStrikeLine(480);
    }

    // ==========================================
    // 5. EQUIPAMENTO ENTREGUE (ENTREGA / INCIDENTE)
    // ==========================================
    if (data.tipoAtendimento === 'Entrega' || data.tipoAtendimento === 'Incidente') {
        if (data.entregue?.ativos) {
            data.entregue.ativos.forEach(eq => {
                if (PDF_MAP.entregue.equipamentos[eq]) {
                    drawCheck(PDF_MAP.entregue.equipamentos[eq]);
                }
            });
        }
        if (data.entregue?.perifericos) {
            data.entregue.perifericos.forEach(per => {
                if (PDF_MAP.entregue.perifericos[per]) {
                    drawCheck(PDF_MAP.entregue.perifericos[per]);
                }
            });
        }
        drawText(data.entregue.ativo, PDF_MAP.entregue.campos.ativo.x, PDF_MAP.entregue.campos.ativo.y, 9);
        drawText(data.entregue.serviceTag, PDF_MAP.entregue.campos.serviceTag.x, PDF_MAP.entregue.campos.serviceTag.y, 9);
        drawText(data.entregue.modelo, PDF_MAP.entregue.campos.modelo.x, PDF_MAP.entregue.campos.modelo.y, 9);
        drawText(data.entregue.monitor, PDF_MAP.entregue.campos.monitor.x, PDF_MAP.entregue.campos.monitor.y, 9);
        drawText(data.entregue.imei, PDF_MAP.entregue.campos.imei.x, PDF_MAP.entregue.campos.imei.y, 9);
        drawText(data.entregue.linhaMovil, PDF_MAP.entregue.campos.linhaMovil.x, PDF_MAP.entregue.campos.linhaMovil.y, 9);

        // Avarias
        if (data.entregue.avarias === 'Sim') {
            drawCheck(PDF_MAP.entregue.avarias.sim);
        } else {
            drawCheck(PDF_MAP.entregue.avarias.nao);
        }

        // Observações em múltiplas linhas
        if (data.entregue.observacoes) {
            const obsText = data.entregue.observacoes.trim();
            const maxCharsPerLine = 55;
            const words = obsText.split(/\s+/);
            const lines = [];
            let currentLine = '';

            words.forEach(w => {
                if ((currentLine + ' ' + w).trim().length <= maxCharsPerLine) {
                    currentLine = (currentLine + ' ' + w).trim();
                } else {
                    lines.push(currentLine);
                    currentLine = w;
                }
            });
            if (currentLine) lines.push(currentLine);

            PDF_MAP.entregue.observacoesLinhas.forEach((lineSlot, i) => {
                if (lines[i]) {
                    drawText(lines[i], lineSlot.x, lineSlot.y, 8);
                }
            });
        }
    }

    if (data.tipoAtendimento === 'Devolucao') {
        drawStrikeLine(395);
        drawStrikeLine(375);
        drawStrikeLine(355);
        drawStrikeLine(285);
    }

    // ==========================================
    // DATA DE ENTREGA (NO FINAL DA FOLHA / RODAPÉ - ENTRE AS BARRAS / /)
    // ==========================================
    const dataEntregaRaw = data.dataEntrega || data.dataAbertura || data.data;
    const dataEntregaObj = splitDate(dataEntregaRaw);
    if (dataEntregaObj.dia) drawText(dataEntregaObj.dia, PDF_MAP.dataEntrega.dia.x, PDF_MAP.dataEntrega.dia.y, 9);
    if (dataEntregaObj.mes) drawText(dataEntregaObj.mes, PDF_MAP.dataEntrega.mes.x, PDF_MAP.dataEntrega.mes.y, 9);
    if (dataEntregaObj.ano) drawText(dataEntregaObj.ano, PDF_MAP.dataEntrega.ano.x, PDF_MAP.dataEntrega.ano.y, 9);

    // ==========================================
    // 6. PÁGINA 2 (ESTOQUE)
    // ==========================================
    if (page2 && PDF_MAP.pagina2) {
        const dataAberturaFmt = dataAberturaObj.dia ? `${dataAberturaObj.dia}/${dataAberturaObj.mes}/${dataAberturaObj.ano}` : '';
        const dataEntregaFmt = dataEntregaObj.dia ? `${dataEntregaObj.dia}/${dataEntregaObj.mes}/${dataEntregaObj.ano}` : '';

        drawTextOn(page2, data.chamado, PDF_MAP.pagina2.chamado.x, PDF_MAP.pagina2.chamado.y, 9);
        drawTextOn(page2, dataAberturaFmt, PDF_MAP.pagina2.data.x, PDF_MAP.pagina2.data.y, 9);

        if (data.tipoAtendimento === 'Entrega' || data.tipoAtendimento === 'Incidente') {
            const p2Ent = PDF_MAP.pagina2.entregue;
            drawTextOn(page2, data.entregue.ativo, p2Ent.ativo.x, p2Ent.ativo.y, 9);
            drawTextOn(page2, dataEntregaFmt, p2Ent.dataRetirada.x, p2Ent.dataRetirada.y, 9);
            drawTextOn(page2, data.entregue.serviceTag, p2Ent.serviceTag.x, p2Ent.serviceTag.y, 9);
            drawTextOn(page2, data.entregue.modelo, p2Ent.modelo.x, p2Ent.modelo.y, 9);
            drawTextOn(page2, data.entregue.monitor, p2Ent.monitor.x, p2Ent.monitor.y, 9);
            drawTextOn(page2, data.entregue.imei, p2Ent.imei.x, p2Ent.imei.y, 9);
            drawTextOn(page2, data.tecnico, p2Ent.tecnico.x, p2Ent.tecnico.y, 9);
            drawTextOn(page2, data.entregue.linhaMovil, p2Ent.linhaMovil.x, p2Ent.linhaMovil.y, 9);
        }

        if (data.tipoAtendimento === 'Devolucao' || data.tipoAtendimento === 'Incidente') {
            const p2Rec = PDF_MAP.pagina2.recolhido;
            drawTextOn(page2, data.recolhido.ativo, p2Rec.ativo.x, p2Rec.ativo.y, 9);
            drawTextOn(page2, data.recolhido.serviceTag, p2Rec.serviceTag.x, p2Rec.serviceTag.y, 9);
            drawTextOn(page2, data.recolhido.modelo, p2Rec.modelo.x, p2Rec.modelo.y, 9);
            drawTextOn(page2, data.recolhido.monitor, p2Rec.monitor.x, p2Rec.monitor.y, 9);
            drawTextOn(page2, data.recolhido.imei, p2Rec.imei.x, p2Rec.imei.y, 9);
            drawTextOn(page2, data.tecnico, p2Rec.tecnico.x, p2Rec.tecnico.y, 9);
            drawTextOn(page2, data.recolhido.linhaMovil, p2Rec.linhaMovil.x, p2Rec.linhaMovil.y, 9);
            drawTextOn(page2, dataEntregaFmt, p2Rec.dataEntrega.x, p2Rec.dataEntrega.y, 9);
        }
    }

    // Salva e dispara o download do PDF preenchido
    const pdfBytes = await pdfDoc.save();
    const blob = new Blob([pdfBytes], { type: 'application/pdf' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `TERMO_${data.chamado || 'ATENDIMENTO'}_${data.colaborador.nome || 'COLABORADOR'}.pdf`.replace(/\s+/g, '_');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

let currentStep = 1;
const totalSteps = 6;

function showStep(step) {
    document.querySelectorAll('.form-step').forEach(el => el.classList.remove('active'));
    const target = document.getElementById(`step-${step}`);
    if (target) {
        target.classList.add('active');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
}

function getSelectedTipo() {
    const radio = document.querySelector('input[name="tipoAtendimento"]:checked');
    return radio ? radio.value : null;
}

function nextStep() {
    if (!validateStep(currentStep)) return;

    const tipo = getSelectedTipo();

    if (currentStep === 1) {
        applyBusinessRules();
        currentStep = 2;
    } else if (currentStep === 2) {
        currentStep = 3;
    } else if (currentStep === 3) {
        if (tipo === 'Devolucao') {
            currentStep = 5; // Pula Equipamento Entregue
        } else {
            currentStep = 4;
        }
    } else if (currentStep === 4) {
        if (tipo === 'Entrega') {
            currentStep = 6; // Pula Equipamento Recolhido e vai direto para Resumo
        } else {
            currentStep = 5;
        }
    } else if (currentStep === 5) {
        currentStep = 6;
    }

    if (currentStep === 6) {
        buildResumo();
    }

    showStep(currentStep);
}

function prevStep() {
    const tipo = getSelectedTipo();

    if (currentStep === 6) {
        if (tipo === 'Entrega') {
            currentStep = 4;
        } else {
            currentStep = 5;
        }
    } else if (currentStep === 5) {
        if (tipo === 'Devolucao') {
            currentStep = 3;
        } else {
            currentStep = 4;
        }
    } else if (currentStep > 1) {
        currentStep--;
    }

    showStep(currentStep);
}

function validateStep(step) {
    const currentSection = document.getElementById(`step-${step}`);
    if (!currentSection) return true;

    if (step === 1) {
        const selectedType = getSelectedTipo();
        if (!selectedType) {
            alert('Por favor, selecione o tipo de atendimento.');
            return false;
        }
        return true;
    }

    const requiredInputs = currentSection.querySelectorAll('input[required]:not(:disabled), select[required]:not(:disabled), textarea[required]:not(:disabled)');
    for (let input of requiredInputs) {
        if (!input.value.trim()) {
            alert('Por favor, preencha todos os campos obrigatórios antes de continuar.');
            input.focus();
            return false;
        }
    }
    return true;
}

function applyBusinessRules() {
    const tipo = getSelectedTipo();
    const fieldsetEntregue = document.getElementById('fieldset-entregue');
    const fieldsetRecolhido = document.getElementById('fieldset-recolhido');

    if (!fieldsetEntregue || !fieldsetRecolhido) return;

    // Reset states
    fieldsetEntregue.classList.remove('disabled-section');
    fieldsetRecolhido.classList.remove('disabled-section');
    toggleInputs(fieldsetEntregue, false);
    toggleInputs(fieldsetRecolhido, false);

    if (tipo === 'Entrega') {
        fieldsetRecolhido.classList.add('disabled-section');
        toggleInputs(fieldsetRecolhido, true);
    } else if (tipo === 'Devolucao') {
        fieldsetEntregue.classList.add('disabled-section');
        toggleInputs(fieldsetEntregue, true);
    }
}

function toggleInputs(fieldset, disable) {
    const inputs = fieldset.querySelectorAll('input, textarea, select');
    inputs.forEach(input => {
        input.disabled = disable;
    });
}

// Atualiza regras se o usuário trocar a opção no Step 1
document.querySelectorAll('input[name="tipoAtendimento"]').forEach(radio => {
    radio.addEventListener('change', applyBusinessRules);
});

function formatField(label, value) {
    if (!value) return '';
    return `<div><strong>${label}:</strong> ${value}</div>`;
}

function formatList(label, items) {
    if (!items || items.length === 0) return '';
    return `<div><strong>${label}:</strong> ${items.join(', ')}</div>`;
}

function buildResumo() {
    const tipo = getSelectedTipo() || 'Não selecionado';
    const chamado = document.getElementById('chamado')?.value || '';
    const tecnico = document.getElementById('tecnico')?.value || '';
    
    const dataAberturaRaw = document.getElementById('dataAbertura')?.value || document.getElementById('data')?.value || '';
    const dataAberturaFmt = dataAberturaRaw.includes('-') ? dataAberturaRaw.split('-').reverse().join('/') : dataAberturaRaw;

    const dataEntregaRaw = document.getElementById('dataEntrega')?.value || dataAberturaRaw;
    const dataEntregaFmt = dataEntregaRaw.includes('-') ? dataEntregaRaw.split('-').reverse().join('/') : dataEntregaRaw;

    const nome = document.getElementById('colabNome')?.value || '';
    const contato = document.getElementById('colabContato')?.value || '';
    const site = document.getElementById('colabSite')?.value || '';
    const matricula = document.getElementById('colabMatricula')?.value || '';
    const gestor = document.getElementById('colabGestor')?.value || '';

    const getCheckedLabels = (name) => {
        const checked = document.querySelectorAll(`input[name="${name}"]:checked`);
        return Array.from(checked).map(el => el.parentElement.textContent.trim());
    };

    let html = `
        <div style="margin-bottom: 12px; padding-bottom: 8px; border-bottom: 1px solid #ddd;">
            <h3 style="color: #0056b3; margin-bottom: 6px;">1. Atendimento</h3>
            <div><strong>Tipo:</strong> ${tipo}</div>
            <div><strong>Chamado:</strong> ${chamado} | <strong>Técnico:</strong> ${tecnico}</div>
            <div><strong>Data de Abertura:</strong> ${dataAberturaFmt || 'Não informada'} | <strong>Data de Entrega:</strong> ${dataEntregaFmt || 'Não informada'}</div>
        </div>

        <div style="margin-bottom: 12px; padding-bottom: 8px; border-bottom: 1px solid #ddd;">
            <h3 style="color: #0056b3; margin-bottom: 6px;">2. Colaborador</h3>
            <div><strong>Nome:</strong> ${nome} (Matrícula: ${matricula})</div>
            <div><strong>Contato:</strong> ${contato} | <strong>Site:</strong> ${site} | <strong>Gestor:</strong> ${gestor}</div>
        </div>
    `;

    if (tipo !== 'Devolucao') {
        const eqEntregues = getCheckedLabels('entregueEq');
        const perEntregues = getCheckedLabels('entreguePer');
        const ativo = document.getElementById('entregueAtivo')?.value;
        const tag = document.getElementById('entregueServiceTag')?.value;
        const mod = document.getElementById('entregueModelo')?.value;
        const mon = document.getElementById('entregueMonitor')?.value;
        const imei = document.getElementById('entregueImei')?.value;
        const linha = document.getElementById('entregueLinha')?.value;
        const avarias = document.querySelector('input[name="entregueAvarias"]:checked')?.value || 'Não';
        const obs = document.getElementById('entregueObs')?.value;

        html += `
            <div style="margin-bottom: 12px; padding-bottom: 8px; border-bottom: 1px solid #ddd;">
                <h3 style="color: #0056b3; margin-bottom: 6px;">3. Equipamento Entregue</h3>
                ${formatList('Equipamentos', eqEntregues)}
                ${formatList('Periféricos', perEntregues)}
                ${formatField('Ativo', ativo)}
                ${formatField('Service Tag', tag)}
                ${formatField('Modelo', mod)}
                ${formatField('Monitor', mon)}
                ${formatField('IMEI', imei)}
                ${formatField('Linha Móvel', linha)}
                <div><strong>Avarias:</strong> ${avarias}</div>
                ${formatField('Observações', obs)}
            </div>
        `;
    }

    if (tipo !== 'Entrega') {
        const eqRecolhidos = getCheckedLabels('recolhidoEq');
        const perRecolhidos = getCheckedLabels('recolhidoPer');
        const ativo = document.getElementById('recolhidoAtivo')?.value;
        const tag = document.getElementById('recolhidoServiceTag')?.value;
        const mod = document.getElementById('recolhidoModelo')?.value;
        const mon = document.getElementById('recolhidoMonitor')?.value;
        const imei = document.getElementById('recolhidoImei')?.value;
        const linha = document.getElementById('recolhidoLinha')?.value;
        const rest = document.querySelector('input[name="recolhidoRestauracao"]:checked') ? 'Sim' : 'Não';
        const perf = document.querySelector('input[name="recolhidoPerfeitas"]:checked') ? 'Sim' : 'Não';

        html += `
            <div style="margin-bottom: 12px;">
                <h3 style="color: #0056b3; margin-bottom: 6px;">4. Equipamento Recolhido</h3>
                ${formatList('Equipamentos', eqRecolhidos)}
                ${formatList('Periféricos', perRecolhidos)}
                ${formatField('Ativo', ativo)}
                ${formatField('Service Tag', tag)}
                ${formatField('Modelo', mod)}
                ${formatField('Monitor', mon)}
                ${formatField('IMEI', imei)}
                ${formatField('Linha Móvel', linha)}
                <div><strong>Restaurou iCloud/Google:</strong> ${rest}</div>
                <div><strong>Perfeitas Condições:</strong> ${perf}</div>
            </div>
        `;
    }

    const resumoEl = document.getElementById('resumoConteudo');
    if (resumoEl) {
        resumoEl.innerHTML = html;
    }
}

function collectFormData() {
    const tipo = getSelectedTipo();
    
    const getCheckedValues = (name) => {
        const checked = document.querySelectorAll(`input[name="${name}"]:checked`);
        return Array.from(checked).map(el => el.value);
    };

    const dataAbertura = document.getElementById('dataAbertura')?.value || document.getElementById('data')?.value || '';
    const dataEntrega = document.getElementById('dataEntrega')?.value || dataAbertura;

    return {
        tipoAtendimento: tipo,
        chamado: document.getElementById('chamado')?.value || '',
        tecnico: document.getElementById('tecnico')?.value || '',
        dataAbertura: dataAbertura,
        dataEntrega: dataEntrega,
        data: dataAbertura, // compatibilidade
        colaborador: {
            nome: document.getElementById('colabNome')?.value || '',
            contato: document.getElementById('colabContato')?.value || '',
            site: document.getElementById('colabSite')?.value || '',
            matricula: document.getElementById('colabMatricula')?.value || '',
            gestor: document.getElementById('colabGestor')?.value || ''
        },
        entregue: {
            ativos: getCheckedValues('entregueEq'),
            perifericos: getCheckedValues('entreguePer'),
            ativo: document.getElementById('entregueAtivo')?.value || '',
            serviceTag: document.getElementById('entregueServiceTag')?.value || '',
            modelo: document.getElementById('entregueModelo')?.value || '',
            monitor: document.getElementById('entregueMonitor')?.value || '',
            imei: document.getElementById('entregueImei')?.value || '',
            linhaMovil: document.getElementById('entregueLinha')?.value || '',
            avarias: document.querySelector('input[name="entregueAvarias"]:checked')?.value || 'Nao',
            observacoes: document.getElementById('entregueObs')?.value || ''
        },
        recolhido: {
            ativos: getCheckedValues('recolhidoEq'),
            perifericos: getCheckedValues('recolhidoPer'),
            ativo: document.getElementById('recolhidoAtivo')?.value || '',
            serviceTag: document.getElementById('recolhidoServiceTag')?.value || '',
            modelo: document.getElementById('recolhidoModelo')?.value || '',
            monitor: document.getElementById('recolhidoMonitor')?.value || '',
            imei: document.getElementById('recolhidoImei')?.value || '',
            linhaMovil: document.getElementById('recolhidoLinha')?.value || '',
            restauracao: document.querySelector('input[name="recolhidoRestauracao"]:checked') ? true : false,
            perfeitas: document.querySelector('input[name="recolhidoPerfeitas"]:checked') ? true : false
        }
    };
}

// Preenche datas com a data atual por padrão
window.addEventListener('DOMContentLoaded', () => {
    const today = new Date().toISOString().split('T')[0];
    const dataAberturaInput = document.getElementById('dataAbertura');
    const dataEntregaInput = document.getElementById('dataEntrega');
    if (dataAberturaInput && !dataAberturaInput.value) dataAberturaInput.value = today;
    if (dataEntregaInput && !dataEntregaInput.value) dataEntregaInput.value = today;
});

const btnGerarPdf = document.getElementById('btnGerarPdf');
if (btnGerarPdf) {
    btnGerarPdf.addEventListener('click', async () => {
        const originalText = btnGerarPdf.textContent;
        try {
            btnGerarPdf.disabled = true;
            btnGerarPdf.textContent = 'Gerando PDF...';

            const formData = collectFormData();
            await generatePdfTerm(formData);
            
            btnGerarPdf.textContent = 'PDF Gerado com Sucesso!';
            setTimeout(() => {
                btnGerarPdf.textContent = originalText;
                btnGerarPdf.disabled = false;
            }, 3000);
        } catch (error) {
            console.error(error);
            alert('Erro ao gerar o PDF: ' + error.message);
            btnGerarPdf.textContent = originalText;
            btnGerarPdf.disabled = false;
        }
    });
}

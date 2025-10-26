async function getAbsences() {
    try {
        const absences = JSON.parse(localStorage.getItem('absences')) || [];
        console.log('Absences carregadas:', absences);
        return absences;
    } catch (error) {
        console.error('Erro ao obter faltas:', error);
        return [];
    }
}

async function getSchedules() {
    try {
        const schedules = JSON.parse(localStorage.getItem('schedules')) || [];
        console.log('Schedules carregadas:', schedules);
        return schedules;
    } catch (error) {
        console.error('Erro ao obter horários:', error);
        return [];
    }
}

function filterByPeriod(data, period) {
    const today = new Date();
    return data.filter(item => {
        const itemDate = new Date(item.date);
        if (period === 'daily') {
            return itemDate.toDateString() === today.toDateString();
        } else if (period === 'weekly') {
            const oneWeekAgo = new Date(today);
            oneWeekAgo.setDate(today.getDate() - 7);
            return itemDate >= oneWeekAgo && itemDate <= today;
        } else if (period === 'monthly') {
            const oneMonthAgo = new Date(today);
            oneMonthAgo.setMonth(today.getMonth() - 1);
            return itemDate >= oneMonthAgo && itemDate <= today;
        }
        return true;
    });
}

function generateAbsencesPDF(period) {
    const { jsPDF } = window.jspdf;
    if (!jsPDF) {
        console.error('jsPDF não está carregado. Verifique os scripts no HTML.');
        alert('Erro: Biblioteca jsPDF não encontrada. Recarregue a página.');
        return;
    }

    const doc = new jsPDF();
    const absences = filterByPeriod(await getAbsences(), period);

    if (absences.length === 0) {
        console.warn(`Nenhum registro de faltas encontrado para o período ${period}.`);
        doc.text('Centro de Excelência Miguel das Graças - Relatório de Faltas', 10, 10);
        doc.text('Nenhum dado disponível.', 10, 20);
    } else {
        doc.text('Centro de Excelência Miguel das Graças - Relatório de Faltas', 10, 10);
        doc.autoTable({
            head: [['Aluno', 'Série', 'Data', 'Motivo']],
            body: absences.map(item => [item.name || '', item.grade || '', item.date || '', item.reason || '']),
            startY: 20,
        });
    }
    try {
        doc.save(`relatorio_faltas_${period}.pdf`);
        console.log(`PDF de faltas (${period}) gerado com sucesso.`);
    } catch (error) {
        console.error('Erro ao salvar o PDF:', error);
        alert('Erro ao gerar o PDF. Verifique o console para detalhes.');
    }
}

function generateSchedulesPDF(period) {
    const { jsPDF } = window.jspdf;
    if (!jsPDF) {
        console.error('jsPDF não está carregado. Verifique os scripts no HTML.');
        alert('Erro: Biblioteca jsPDF não encontrada. Recarregue a página.');
        return;
    }

    const doc = new jsPDF();
    const schedules = filterByPeriod(await getSchedules(), period);

    if (schedules.length === 0) {
        console.warn(`Nenhum registro de horários encontrado para o período ${period}.`);
        doc.text('Centro de Excelência Miguel das Graças - Relatório de Horários', 10, 10);
        doc.text('Nenhum dado disponível.', 10, 20);
    } else {
        doc.text('Centro de Excelência Miguel das Graças - Relatório de Horários', 10, 10);
        doc.autoTable({
            head: [['Monitor', 'Data', 'Entrada', 'Saída']],
            body: schedules.map(item => [item.monitorName || '', item.date || '', item.entry || '', item.exit || '']),
            startY: 20,
        });
    }
    try {
        doc.save(`relatorio_horarios_${period}.pdf`);
        console.log(`PDF de horários (${period}) gerado com sucesso.`);
    } catch (error) {
        console.error('Erro ao salvar o PDF:', error);
        alert('Erro ao gerar o PDF. Verifique o console para detalhes.');
    }
    }

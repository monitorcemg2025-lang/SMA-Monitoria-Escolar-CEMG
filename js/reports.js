async function getAbsences() {
    try {
        return JSON.parse(localStorage.getItem('absences')) || [];
    } catch (error) {
        console.error('Erro ao obter faltas:', error);
        return [];
    }
}

async function getSchedules() {
    try {
        return JSON.parse(localStorage.getItem('schedules')) || [];
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
    const doc = new jsPDF();
    const absences = filterByPeriod(await getAbsences(), period);

    doc.text('Centro de Excelência Miguel das Graças - Relatório de Faltas', 10, 10);
    doc.autoTable({
        head: [['Aluno', 'Série', 'Data', 'Motivo']],
        body: absences.map(item => [item.name, item.grade, item.date, item.reason]),
        startY: 20,
    });
    doc.save(`relatorio_faltas_${period}.pdf`);
}

function generateSchedulesPDF(period) {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    const schedules = filterByPeriod(await getSchedules(), period);

    doc.text('Centro de Excelência Miguel das Graças - Relatório de Horários', 10, 10);
    doc.autoTable({
        head: [['Monitor', 'Data', 'Entrada', 'Saída']],
        body: schedules.map(item => [item.monitorName, item.date, item.entry, item.exit]),
        startY: 20,
    });
    doc.save(`relatorio_horarios_${period}.pdf`);
}

$(document).ready(function () {
    const url = 'https://dpg.gg/test/calendar.json';
    const weeksToShow = 50;

    function getContributionData() {
        return $.ajax({
            url: url,
            dataType: 'json',
        });
    }

    function formatDateToString(inputDate) {
        const [year, day, month] = inputDate.split('-');
        const date = new Date(year, month - 1, day);

        const options = {
            weekday: 'long',
            month: 'long',
            day: 'numeric',
            year: 'numeric'
        };

        return date.toLocaleDateString('ru-RU', options);
    }

    function getPreviousMondayFromDate(date) {
        const dayOfWeek = date.getDay();
        const daysUntilMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
        const previousMonday = new Date(date);
        previousMonday.setDate(date.getDate() - daysUntilMonday);
        return previousMonday;
    }

    function convertDate(inputDate) {
        const [year, day, month] = inputDate.split('-').map(item => parseInt(item, 10));
        const formattedDay = String(day).padStart(2, '0');
        const formattedMonth = String(month).padStart(2, '0');
        return `${year}-${formattedMonth}-${formattedDay}`;
    }

    function createGraph(contributionData) {
        const today = new Date();
        const endDate = getPreviousMondayFromDate(today);
        endDate.setDate(today.getDate() - weeksToShow * 7);
        let currentDate = getPreviousMondayFromDate(endDate);


        let monthTitle = `<div class="month">${getMonthAsText(currentDate)}</div>`;
        let currentMonth = getMonthAsText(currentDate);

        let graph = '';

        const daysOfWeek = ['Пн', '&nbsp;', 'Ср', '&nbsp;', 'Пт', '&nbsp;', '&nbsp;'];

        // Добавляем столбец с днями недели
        for (let col = 0; col < 7; col++) {
            graph += `<div class="contribution-block">${daysOfWeek[col]}</div>`;
        }
        //основоной график
        for (let row = 0; row < weeksToShow + 1; row++) {
            
            for (let col = 0; col < 7; col++) {

                const dateString = currentDate.toLocaleDateString().split('/').reverse().join('-');
                const contributions = contributionData[convertDate(dateString)] || 0;

                let colorClass = 'white';
                if (contributions >= 1 && contributions <= 9) {
                    colorClass = 'light-gray';
                } else if (contributions >= 10 && contributions <= 19) {
                    colorClass = 'gray';
                } else if (contributions >= 20 && contributions <= 29) {
                    colorClass = 'dark-gray';
                } else if (contributions >= 30) {
                    colorClass = 'black';
                }

                graph += `<div class="contribution-block tooltip ${colorClass}">
        <div class="top-title">${contributions} контрибуций<br>
        <div class="top-date">${formatDateToString(dateString)}</div></div>
      </div>
      `;
                currentDate.setDate(currentDate.getDate() + 1);
            }
            
            if  (currentMonth !== getMonthAsText(currentDate)){
                currentMonth = getMonthAsText(currentDate);
                monthTitle += `<div class="month">${currentMonth}</div>`;
            }
        }

        $('.monthTitle').html(monthTitle);
        $('.contribution-graph').html(graph);
    }

    getContributionData()
        .done(function (data) {
            createGraph(data);
        })
        .fail(function () {
            $('.contribution-graph').text('Failed to load data.');
        });

    function getMonthAsText(inputDate) {
        const months = [
            'Янв.', 'Февр.', 'Март', 'Апр.', 'Май', 'Июнь', 'Июль', 'Авг.', 'Сент.', 'Окт.', 'Нояб.', 'Дек.'
        ];
        const monthIndex = inputDate.getMonth();
        return months[monthIndex];
    }
});
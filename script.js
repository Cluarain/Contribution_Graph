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
        const [year, month, day] = inputDate.split('-');
        const date = new Date(year, month - 1, day); // Месяцы в JavaScript идут с 0 до 11, поэтому уменьшаем на 1
      
        const options = {
          weekday: 'long',
          month: 'long',
          day: 'numeric',
          year: 'numeric'
        };
      
        return date.toLocaleDateString('ru-RU', options);
      }
      
    function createGraph(contributionData) {
        const today = new Date();
        const endDate = new Date(today);
        endDate.setDate(today.getDate() - weeksToShow * 7);

        let currentDate = new Date(endDate);
        let graph = '';

        for (let row = 0; row < 7; row++) {
            for (let col = 0; col < 51; col++) {
                const dateString = currentDate.toLocaleDateString().split('/').reverse().join('-');

                const contributions = contributionData[dateString] || 0;

                let colorClass = 'white';
                let textContributions = 'Нет контрибуций';

                if (contributions >= 1 && contributions <= 9) {
                    colorClass = 'light-gray';
                    textContributions = '1-9 контрибуций';
                } else if (contributions >= 10 && contributions <= 19) {
                    colorClass = 'gray';
                    textContributions = '10-19 контрибуций';
                } else if (contributions >= 20 && contributions <= 29) {
                    colorClass = 'dark-gray';
                    textContributions = '20-29 контрибуций';
                } else if (contributions >= 30) {
                    colorClass = 'black';
                    textContributions = '30+ контрибуций';
                }


                graph += `<div class="contribution-block tooltip ${colorClass}">
            <div class="top-title">${textContributions}<br>
            <div class="top-date">${formatDateToString(dateString)}</div></div>
          </div>
          `;


                currentDate.setDate(currentDate.getDate() + 1);
            }
        }

        $('.contribution-graph').html(graph);
    }

    getContributionData()
        .done(function (data) {
            createGraph(data);
        })
        .fail(function () {
            $('.contribution-graph').text('Failed to load data.');
        });

        
});



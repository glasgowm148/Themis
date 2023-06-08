fetch('data.json')
.then(response => response.json())
.then(chartData => {
  const consensusButtonsContainer = document.getElementById('consensus-buttons');
  const platformButtonsContainer = document.getElementById('platform-buttons');
  const featuresButtonsContainer = document.getElementById('features-buttons');
  const chartsContainer = document.getElementById('charts-container');

  const colors = [
    'rgba(255, 99, 132, 0.6)',
    'rgba(54, 162, 235, 0.6)',
    'rgba(255, 206, 86, 0.6)',
    'rgba(75, 192, 192, 0.6)',
    'rgba(153, 102, 255, 0.6)',
    'rgba(255, 159, 64, 0.6)',
    'rgba(255, 99, 132, 0.6)',
    'rgba(54, 162, 235, 0.6)',
    'rgba(255, 206, 86, 0.6)'
  ];

  const consensusTags = new Set();
  const platformTags = new Set();
  const featuresTags = new Set();

  chartData.forEach(chart => {
    if (chart.tags) {
      chart.tags.forEach(tag => {
        if (tag.startsWith('Consensus:')) {
          consensusTags.add(tag.replace('Consensus:', ''));
        } else if (tag.startsWith('Platform:')) {
          platformTags.add(tag.replace('Platform:', ''));
        } else if (tag.startsWith('Features:')) {
          featuresTags.add(tag.replace('Features:', ''));
        }
      });
    }
  });

  const createFilterButtons = (container, tags) => {
    tags.forEach(tag => {
      const button = document.createElement('a');
      button.classList.add('waves-effect', 'waves-light', 'btn-small', 'filter-button');
      button.innerHTML = `<i class="material-icons left">check</i>${tag}`;
      button.dataset.label = tag;
      container.appendChild(button);
    });
  };

  createFilterButtons(consensusButtonsContainer, consensusTags);
  createFilterButtons(platformButtonsContainer, platformTags);
  createFilterButtons(featuresButtonsContainer, featuresTags);

  const filterCharts = () => {
    const activeFilters = Array.from(document.querySelectorAll('.filter-button.green'))
      .map(button => button.dataset.label);

    const filteredCharts = chartData.filter(chart => {
      if (!chart.tags) {
        return false;
      }
      return activeFilters.every(tag => chart.tags.includes(tag));
    });

    chartsContainer.innerHTML = '';

    filteredCharts.forEach((chart, i) => {
      const chartContainer = document.createElement('div');
      chartContainer.classList.add('chart-container');
      chartsContainer.appendChild(chartContainer);

      const card = document.createElement('div');
      card.classList.add('card');
      chartContainer.appendChild(card);

      const chartContent = document.createElement('div');
      chartContent.classList.add('card-content', 'chart-container');
      card.appendChild(chartContent);

      const canvas = document.createElement('canvas');
      canvas.id = 'chart' + i;
      chartContent.appendChild(canvas);

      const ctx = canvas.getContext('2d');
      const myChart = new Chart(ctx, {
        type: 'pie',
        data: {
          labels: chart.labels,
          datasets: [{
            label: chart.name,
            data: chart.data,
            backgroundColor: colors.slice(0, chart.data.length),
            borderColor: colors.slice(0, chart.data.length),
            borderWidth: 1
          }]
        },
        options: {
          responsive: true,
          plugins: {
            legend: {
              display: false
            },
            title: {
              display: true,
              text: chart.name
            },
            tooltip: {
              callbacks: {
                label: function (context) {
                  var index = context.dataIndex;
                  var value = context.dataset.data[index];
                  return value + '%';
                }
              }
            }
          }
        }
      });

      const chartText = document.createElement('p');
      chartText.classList.add('chart-text');
      chartText.textContent = chart.text;
      chartContainer.appendChild(chartText);

      const readMore = document.createElement('a');
      readMore.classList.add('read-more');
      readMore.href = `https://github.com/glasgowm148/Themis/info/${chart.name}.md`;
      readMore.target = '_blank';
      readMore.innerHTML = `Read More <i class="material-icons right">arrow_forward</i>`;
      chartContainer.appendChild(readMore);
    });
  };

  const filterButtons = document.querySelectorAll('.filter-button');

  filterButtons.forEach(button => {
    button.addEventListener('click', () => {
      button.classList.toggle('grey');
      button.classList.toggle('green');
      const icon = button.querySelector('i');
      icon.innerText = (icon.innerText === 'check') ? 'clear' : 'check';
      filterCharts();
    });
  });

  filterCharts();
});
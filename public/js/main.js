const ctxTimeline = document.getElementById('graphTimeline');
let collapsables = [];

const labels = [
	'January',
	'February',
	'March',
	'April',
	'May',
	'June',
];

const timeline = new Chart(ctxTimeline, {
  type: 'line',
  data: {
		labels: labels,
		datasets: [{
			label: 'Timeline',
			data: [0, 0, 0, 0, 0, 0, 0],
			fill: false,
			borderColor: 'rgb(75, 192, 192)',
			tension: 0.1
		}]
	}
});

function updateCollapse(id) {
	for (let i = 0; i < collapsables.length; ++i) {
		if (i == id) {
			collapsables[i].button.classList.remove('collapsed');
			collapsables[i].body.show();
		} else {
			collapsables[i].button.classList.add('collapsed');
			collapsables[i].body.hide();
		}
	}
}

function refresh () {
	const starting_value = document.getElementById('starting-value').value || 0;
	let values = [];
	for (let i = 0; i < 7; ++i) {
		values.push(starting_value + i);
	}
	timeline.data.datasets[0].data = values;
	console.log(timeline.data.datasets[0].data);
	timeline.update();
};

for (let i = 0; i < 3; ++i) {
	collapsables.push({
		button: document.getElementById('collapse' + (i + 1) + '-button'),
		body: new bootstrap.Collapse(document.getElementById('collapse' + (i + 1) + '-body'), { toggle: (i == 0) })
	});
}

updateCollapse(0);
refresh();
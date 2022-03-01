const ctxTimeline = document.getElementById('graphTimeline');
let collapsables = [];

const timeline = new Chart(ctxTimeline, {
  type: 'line',
  data: {
		labels: [0, 1, 2, 3, 4, 5, 6],
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
			collapsables[i].selected = true;
		} else {
			collapsables[i].button.classList.add('collapsed');
			collapsables[i].body.hide();
			collapsables[i].selected = false;
		}
	}
}

function refresh () {
	const starting_value = document.getElementById('starting-value').value || 0;
	let values = [];
	if (collapsables[2].selected) {
		const quantity = document.getElementById('invest3-quantity').value || 0;
		const duration = document.getElementById('invest3-duration').value || 0;
		const duration_type = document.getElementById('invest3-duration-label').value || 1;
		let labels = [];
		for (let i = 0; i < duration; ++i) {
			labels.push(i);
			values.push(starting_value + (quantity * i));
		}
		timeline.data.labels = labels;
	} else {
		for (let i = 0; i < 7; ++i) {
			values.push(starting_value + i);
		}
	}
	timeline.data.datasets[0].data = values;
	timeline.update();
};

for (let i = 0; i < 3; ++i) {
	collapsables.push({
		button: document.getElementById('collapse' + (i + 1) + '-button'),
		body: new bootstrap.Collapse(document.getElementById('collapse' + (i + 1) + '-body'), { toggle: (i == 0) }),
		selected: (i == 0)
	});
}

updateCollapse(0);
refresh();
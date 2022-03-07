const ctxTimeline = document.getElementById('graphTimeline');
let collapsables = [];
let checkboxes = [true, true, true];

const timeline = new Chart(ctxTimeline, {
  type: 'line',
  data: {
		labels: [],
		datasets: [{
			label: 'Money (EUR €)',
			data: [],
			fill: false,
			borderColor: document.getElementById('colorpicker').value || '#563d7c',
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

function updateCheckbox(id) {
	checkboxes[id] = !checkboxes[id];
	document.getElementById(id == 0 ? "invest2-insurance" : id == 1 ? "invest2-gas" : "invest2-maintenance").disabled = !checkboxes[id];
}

function refresh () {
	const starting_value = document.getElementById('starting-value').value || 0;
	let labels = [];
	let values = [];
	if (collapsables[0].selected) {
		const inscost = parseInt(document.getElementById('invest1-inscost').value) || 0;
		const ancost = parseInt(document.getElementById('invest1-ancost').value) || 0;
		const duration = parseInt(document.getElementById('invest1-duration').value) || 1;
		let tmp = inscost;
		
		for (let i = 0; i <= duration; ++i) {
			labels.push('Year ' + i);
			if (i > 0)
				tmp = tmp + 28716 + ancost;
			values.push(tmp);
		}
		document.getElementById("Result").innerHTML = ('<div id="Result"></div>');
		document.getElementById("Result").innerHTML += ('<h1>Result:</h1>');
		document.getElementById("Result").innerHTML += ('<p>Total cost = '+tmp+'</p>');
		document.getElementById("Result").innerHTML += ('<p>Total administrative cost (Fixed cost) = '+ (inscost + (ancost * duration)) +'</p>');
		document.getElementById("Result").innerHTML += ('<p>Total student life cost (Variable cost) = '+ (28716 * duration) +'</p>');

	} else if (collapsables[1].selected) {
		const price = Number(document.getElementById('invest2-price').value || 0);
		const insurance = Number(checkboxes[0] ? document.getElementById('invest2-insurance').value || 0 : 0);
		const gas = Number(checkboxes[1] ? document.getElementById('invest2-gas').value || 0 : 0);
		const maintenance = Number(checkboxes[2] ? document.getElementById('invest2-maintenance').value || 0 : 0);
		const duration = document.getElementById('invest2-duration').value || 0;
		const duration_type = document.getElementById('invest2-duration-label').value || 1;
		const years = Math.floor(duration_type == 2 ? duration : duration / 12);
		const months = (duration_type == 2 ? (duration - years) * 12 : duration % 12);
		let tmp = Number(starting_value - price);
		if (years === 0) {
			labels.push('Month 0');
			values.push(tmp);
			for (let i = 1; i <= months; ++i) {
				labels.push('Month ' + i);
				tmp -= insurance + gas + maintenance;
				values.push(tmp);
			}
		} else {
			for (let i = 0; i <= years; ++i) {
				labels.push('Year ' + i);
				values.push(tmp);
				tmp -= (insurance + gas + maintenance) * 12;
			}
		}
		console.log(labels);
		console.log(values);
	} else if (collapsables[2].selected) {
		const quantity = document.getElementById('invest3-quantity').value || 0;
		const interest_rate = (document.getElementById('invest3-interest-rate').value || 0) / 100 + 1;
		const duration = document.getElementById('invest3-duration').value || 0;
		const duration_type = document.getElementById('invest3-duration-label').value || 1;
		const years = Math.floor(duration_type == 2 ? duration : duration / 12);
		const months = (duration_type == 2 ? (duration - years) * 12 : duration % 12);
		let tmp = Number(starting_value);
		if (years === 0) {
			labels.push('Month 0');
			values.push(tmp);
			for (let i = 1; i <= months; ++i) {
				labels.push('Month ' + i);
				tmp += Number(quantity);
				values.push(tmp);
			}
		} else {
			for (let i = 0; i <= years; ++i) {
				labels.push('Year ' + i);
				values.push(tmp);
				tmp = (tmp + (quantity * 12)) * interest_rate;
			}
		}
	} else {
		for (let i = 0; i < 7; ++i) {
			values.push(starting_value + i);
		}
	}
	timeline.data.labels = labels;
	timeline.data.datasets[0].data = values;
	timeline.data.datasets[0].borderColor = document.getElementById('colorpicker').value;
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
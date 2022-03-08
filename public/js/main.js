const ctxTimeline = document.getElementById('graphTimeline');
let collapsables = [];
let checkboxes = [true, true, true, true, true];

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
	if (id == 1) {
		document.getElementById("invest1-expected-salary").disabled = !checkboxes[id];
		document.getElementById("invest1-expected-duration").disabled = !checkboxes[id];
		document.getElementById("invest1-expected-duration-label").disabled = !checkboxes[id];
	} else {
		document.getElementById(id == 2 ? "invest2-insurance" : id == 3 ? "invest2-gas" : id == 4 ? "invest2-maintenance" : "invest1-living-cost").disabled = !checkboxes[id];
	}
}

function updateDurationType() {
	const type = Number(document.getElementById('duration-label').value);
	document.getElementById("invest1-expected-duration-label").innerHTML = (type == 2 ? "years" : "months");
}

function refresh () {
	let labels = [];
	let values = [];
	const starting_value = document.getElementById('starting-value').value || 0;
	const duration = document.getElementById('duration').value || 0;
	const duration_type = document.getElementById('duration-label').value || 1;
	const years = Math.floor(duration_type == 2 ? duration : duration / 12);
	const months = (duration_type == 2 ? (duration - years) * 12 : duration % 12);
	if (collapsables[0].selected) {
		const initial_cost = Number(document.getElementById('invest1-initial-cost').value || 0);
		const annual_cost = Number(document.getElementById('invest1-annual-cost').value || 0);
		const living_cost = Number(checkboxes[0] ? document.getElementById('invest1-living-cost').value || 0 : 0);
		const expected_salary = Number(checkboxes[1] ? document.getElementById('invest1-expected-salary').value || 0 : 0);
		const expected_duration = Number(checkboxes[1] ? document.getElementById('invest1-expected-duration').value || 0 : 0);
		const expected_years = Math.floor(duration_type == 2 ? expected_duration : expected_duration / 12);
		const expected_months = (duration_type == 2 ? (expected_duration - expected_years) * 12 : expected_duration % 12);
		let tmp = starting_value - initial_cost;
		if (years === 0) {
			labels.push('Month 0');
			tmp -= annual_cost;
			values.push(tmp);
			let i = 1;
			for (; i <= months; ++i) {
				labels.push('Month ' + i);
				tmp -= living_cost;
				values.push(tmp);
			}
			if (expected_salary != 0) {
				for (; i <= months + expected_months; ++i) {
					labels.push('Month ' + i);
					tmp += expected_salary - living_cost;
					values.push(tmp);
				}
			}
		} else {
			let i = 1;
			labels.push('Year 0');
			values.push(tmp);
			for (; i <= years; ++i) {
				labels.push('Year ' + i);
				tmp -= annual_cost + (living_cost * 12);
				values.push(tmp);
			}
			if (expected_salary != 0) {
				for (; i <= years + expected_years; ++i) {
					labels.push('Year ' + i);
					tmp += ((expected_salary + living_cost) * 12);
					values.push(tmp);
				}
			}
		}
		document.getElementById("Result").innerHTML = ('<div id="Result"></div>');
		document.getElementById("Result").innerHTML += ('<h1>Result:</h1>');
		if (years === 0)
			document.getElementById("Result").innerHTML += ('<p>Total cost = '+ (starting_value - initial_cost - annual_cost - (living_cost * months))+'</p>');
		else
			document.getElementById("Result").innerHTML += ('<p>Total cost = '+ (starting_value - initial_cost - (annual_cost * years) - ((living_cost * 12) * years))+'</p>');
		document.getElementById("Result").innerHTML += ('<p>Total administrative cost (Fixed cost) = '+ (initial_cost + (annual_cost * duration)) +'</p>');
		if (years === 0)
			document.getElementById("Result").innerHTML += ('<p>Total student life cost (Variable cost) = '+ (living_cost * months) +'</p>');
		else
			document.getElementById("Result").innerHTML += ('<p>Total student life cost (Variable cost) = '+ ((living_cost * 12) * years) +'</p>');

	} else if (collapsables[1].selected) {
		const price = Number(document.getElementById('invest2-price').value || 0);
		const insurance = Number(checkboxes[2] ? document.getElementById('invest2-insurance').value || 0 : 0);
		const gas = Number(checkboxes[3] ? document.getElementById('invest2-gas').value || 0 : 0);
		const maintenance = Number(checkboxes[4] ? document.getElementById('invest2-maintenance').value || 0 : 0);
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
		document.getElementById("Result").innerHTML = ('<div id="Result"></div>');
		document.getElementById("Result").innerHTML += ('<h1>Result:</h1>');
		if (years === 0) {
			document.getElementById("Result").innerHTML += ('<p>Total cost = '+ (Number(starting_value - price) - ((insurance + gas + maintenance) * months))+'</p>');
		} else {
			document.getElementById("Result").innerHTML += ('<p>Total cost = '+ (Number(starting_value - price) - (((insurance + gas + maintenance) * 12) * years)) +'</p>');
		}
		document.getElementById("Result").innerHTML += ('<p>Total direct cost (Fixed cost) = '+ Number(starting_value - price) +'</p>');
		if (years === 0) {
			document.getElementById("Result").innerHTML += ('<p>Total usage cost (Variable cost) = '+ (-(insurance + gas + maintenance) * months)+'</p>');
		} else {
			document.getElementById("Result").innerHTML += ('<p>Total usage cost (Variable cost) = '+ ((-(insurance + gas + maintenance) * 12) * years) +'</p>');
		}

	} else if (collapsables[2].selected) {
		const quantity = document.getElementById('invest3-quantity').value || 0;
		const interest_rate = (document.getElementById('invest3-interest-rate').value || 0) / 100 + 1;
		let tmp = Number(starting_value);
		const result = [];
		if (years === 0) {
			labels.push('Month 0');
			values.push(tmp);
			for (let i = 1; i <= months; ++i) {
				labels.push('Month ' + i);
				tmp += Number(quantity) + ((tmp * interest_rate - tmp) / 12);
				result[i] = tmp;
				values.push(tmp);
			}
		} else {
			for (let i = 0; i <= years; ++i) {
				labels.push('Year ' + i);
				values.push(tmp);
				result[i] = tmp;
				tmp = (tmp + (quantity * 12)) * interest_rate;
			}
		}
		document.getElementById("Result").innerHTML = ('<div id="Result"></div>');
		document.getElementById("Result").innerHTML += ('<h1>Result:</h1>');
		if (years === 0) {
			document.getElementById("Result").innerHTML += ('<p>Profit = '+ result[result.length - 1] +'</p>');
		} else
			document.getElementById("Result").innerHTML += ('<p>Profit = '+ result[result.length - 1] +'</p>');

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
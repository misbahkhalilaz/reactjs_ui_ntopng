import React from "react";

class UI extends React.Component {
	constructor() {
		super();
		this.state = {
			user: {
				name: "",
				ip: "",
				pkg: "",
				pre_dues: "",
				current_bill: "",
				bill_status: "",
			},

			usage: {
				uptime: "",
				data: "",
				speed: "",
			},
			error: "",
		};
	}

	componentDidMount() {}

	showData = (e) => {
		if (this.state.error.length > 0) {
			this.setState({ error: "" });
		}

		if (e.target.value.length >= 13) {
			this.load();
		}
	};

	load = () => {
		var requestOptions = {
			method: "GET",
			redirect: "follow",
		};
		if (document.getElementById("input").value.length >= 13) {
			fetch(
				"http://10.1.10.254:5000/" +
					document
						.getElementById("input")
						.value.replace("-", "")
						.replace("-", ""),
				requestOptions
			)
				.then((response) => response.text())
				.then((result) => this.setState(JSON.parse(result)))
				.catch((error) => console.log("error", error));
		}
	};

	render() {
		let per = Number.parseFloat(this.state.usage.speed.split(" "));
		let val = this.state.usage.speed.includes("k")
			? this.state.user.pkg[0] * 1000
			: this.state.usage.speed.includes("M")
			? this.state.user.pkg[0]
			: this.state.user.pkg[0] * 1000 * 1000;
		per = Math.floor((per / val) * 100 * 100) / 100;
		let data = Number.parseFloat(this.state.usage.data.substr(0, 4));
		let total = this.state.user.pkg.substr(5, 7);
		let bill =
			Number.parseInt(this.state.user.pre_dues) +
			Number.parseInt(this.state.user.current_bill);
		total = Math.floor((Number.parseFloat(total) - data) * 100) / 100;
		return (
			<fieldset>
				<legend>
					<label>NIC#</label>
					<input type="text" onChange={this.showData} id="input"></input>
					<button onClick={this.load}>Refresh</button>
				</legend>
				<br></br>
				<label style={{ color: "red" }}>{this.state.error}</label>
				<fieldset>
					<legend>
						<h3>User Info</h3>
					</legend>
					<div>Name: {this.state.user.name}</div>
					<div>Current Package: {this.state.user.pkg}</div>
				</fieldset>
				<fieldset>
					<legend>
						<h3>Usage</h3>
					</legend>
					<h3>Up Time: {this.state.usage.uptime}</h3>
					<h3>
						Remaining Data:{" "}
						{isNaN(total) ? (
							""
						) : total < 0 ? (
							<span style={{ color: "red" }}>Over Used</span>
						) : (
							<span style={{ color: "blue" }}>{total} GB</span>
						)}
					</h3>
					<h2>
						<u>
							Total Data Used:{" "}
							<span style={{ color: "red" }}>
								{isNaN(data) ? "" : data + " GB"}
							</span>
						</u>
					</h2>
					<h2>
						<u>
							Current Speed Usage: <b>{this.state.usage.speed}</b>
							{isNaN(per) ? (
								""
							) : per <= 50 ? (
								<span style={{ color: "blue" }}>
									<i>{"( " + per + "% )"}</i>
								</span>
							) : per <= 75 ? (
								<span style={{ color: "orange" }}>
									<i>{"( " + per + "% )"}</i>
								</span>
							) : (
								<span style={{ color: "red" }}>
									<i>
										<b>{"( " + per + "% )"}</b>
									</i>
								</span>
							)}
						</u>
					</h2>
				</fieldset>
				<fieldset>
					<legend>
						<h3>Billing</h3>
					</legend>
					<h3>Current Bill: {this.state.user.current_bill + " Rs."}</h3>
					<h3>Previous Dues: {this.state.user.pre_dues + " Rs."}</h3>
					<h2>
						<u>
							Total:{" "}
							{isNaN(bill) ? (
								""
							) : (
								<span style={{ color: "green" }}>{bill} Rs.</span>
							)}
						</u>
					</h2>
					<h2>
						Status:{" "}
						{this.state.user.bill_status.toLowerCase() === "paid" ? (
							<span style={{ color: "blue" }}>Paid.</span>
						) : (
							<span style={{ color: "red" }}>
								{this.state.user.bill_status}
							</span>
						)}
					</h2>
				</fieldset>
				<div>
					<i>For any support contact: 03162593688</i>
				</div>
			</fieldset>
		);
	}
}

export default UI;

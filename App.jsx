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

			host: { ip: "", mac: "" },
			data: { upload: "", download: "" },
			bandwidth: "",
			active_time: "",
			error: "",
		};
		this.nic = React.createRef();
	}

	componentDidMount() {}

	showData = (e) => {
		if (this.state.error.length > 0) {
			this.setState({ error: "" });
		}
		var requestOptions = {
			method: "GET",
			redirect: "follow",
		};
		if (e.target.value.length >= 13) {
			fetch(
				"http://10.1.10.254:5000/" +
					e.target.value.replace("-", "").replace("-", ""),
				requestOptions
			)
				.then((response) => response.text())
				.then((result) => this.setState(JSON.parse(result)))
				.catch((error) => console.log("error", error));
		}
	};

	render() {
		let data =
			Math.floor(
				((this.state.data.download + this.state.data.upload) /
					1024 /
					1024 /
					1024) *
					100
			) / 100;
		let total = this.state.user.pkg.substr(5, 7);
		let bill =
			Number.parseInt(this.state.user.pre_dues) +
			Number.parseInt(this.state.user.current_bill);
		total = Math.floor((Number.parseInt(total) - data) * 100) / 100;
		return (
			<fieldset>
				<legend>
					<label>NIC#</label>
					<input type="text" onChange={this.showData} ref={this.nic}></input>
				</legend>
				<br></br>
				<label style={{ color: "red" }}>{this.state.error}</label>
				<fieldset>
					<legend>
						<h3>User Info</h3>
					</legend>
					<div>Name: {this.state.user.name}</div>
					<div>Device MAC: {this.state.host.mac}</div>
					<div>Current Package: {this.state.user.pkg}</div>
				</fieldset>
				<fieldset>
					<legend>
						<h3>Stats</h3>
					</legend>
					<h3>Active Time: {this.state.active_time}</h3>
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
								{data === 0 ? "" : data + " GB"}
							</span>
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

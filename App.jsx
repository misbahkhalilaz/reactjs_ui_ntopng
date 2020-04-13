import React from "react";
import {
	Button,
	Card,
	InputGroup,
	FormControl,
	Row,
	Col,
	Form,
} from "react-bootstrap";

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
			<Card>
				<Card.Header>
					<InputGroup className="mb-3">
						<InputGroup.Prepend>
							<InputGroup.Text>NIC:</InputGroup.Text>
						</InputGroup.Prepend>
						<FormControl
							type="text"
							as="input"
							placeholder="Enter NIC#"
							onChange={this.showData}
							id="input"
						/>
						<InputGroup.Append>
							<Button variant="outline-secondary" onClick={this.load}>
								<svg
									class="bi bi-arrow-repeat"
									width="1em"
									height="1em"
									viewBox="0 0 16 16"
									fill="currentColor"
									xmlns="http://www.w3.org/2000/svg"
								>
									<path
										fill-rule="evenodd"
										d="M2.854 7.146a.5.5 0 00-.708 0l-2 2a.5.5 0 10.708.708L2.5 8.207l1.646 1.647a.5.5 0 00.708-.708l-2-2zm13-1a.5.5 0 00-.708 0L13.5 7.793l-1.646-1.647a.5.5 0 00-.708.708l2 2a.5.5 0 00.708 0l2-2a.5.5 0 000-.708z"
										clip-rule="evenodd"
									/>
									<path
										fill-rule="evenodd"
										d="M8 3a4.995 4.995 0 00-4.192 2.273.5.5 0 01-.837-.546A6 6 0 0114 8a.5.5 0 01-1.001 0 5 5 0 00-5-5zM2.5 7.5A.5.5 0 013 8a5 5 0 009.192 2.727.5.5 0 11.837.546A6 6 0 012 8a.5.5 0 01.501-.5z"
										clip-rule="evenodd"
									/>
								</svg>
							</Button>
						</InputGroup.Append>
					</InputGroup>
				</Card.Header>
				<Form.Label style={{ color: "red" }}>{this.state.error}</Form.Label>
				<Card>
					<Card.Header>User Info</Card.Header>
					<Card.Body>
						<Card.Text>
							<Row>
								<Col>Name:</Col>
								<Col>{this.state.user.name}</Col>
							</Row>
							<Row>
								<Col>Current Package:</Col>
								<Col>{this.state.user.pkg}</Col>
							</Row>
						</Card.Text>
					</Card.Body>
				</Card>
				<Card>
					<Card.Header>Usage</Card.Header>
					<Card.Body>
						<Card.Text>
							<Row>
								<Col>Up Time:</Col>
								<Col>{this.state.usage.uptime}</Col>
							</Row>
							<Row>
								<Col>Remaining Data:</Col>
								<Col>
									{isNaN(total) ? (
										""
									) : total < 0 ? (
										<span style={{ color: "red" }}>Over Used</span>
									) : (
										<span style={{ color: "blue" }}>{total} GB</span>
									)}
								</Col>
							</Row>
							<Row>
								<Col>
									<b>Total Data Used:</b>
								</Col>
								<Col style={{ color: "red" }}>
									<b>{isNaN(data) ? "" : data + " GB"}</b>
								</Col>
							</Row>
							<Row>
								<Col>
									<b>Current Speed Usage:</b>
								</Col>
								<Col>
									<b>{this.state.usage.speed}</b>
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
								</Col>
							</Row>
						</Card.Text>
					</Card.Body>
				</Card>
				<Card>
					<Card.Header>Billing</Card.Header>
					<Card.Body>
						<Card.Text>
							<Row>
								<Col>Current Bill:</Col>
								<Col>{this.state.user.current_bill + " Rs."}</Col>
							</Row>
							<Row>
								<Col>Previous Dues:</Col>
								<Col>{this.state.user.pre_dues + " Rs."}</Col>
							</Row>
							<Row>
								<Col>
									<b>Total:</b>
								</Col>
								<Col>
									<b style={{ color: "green" }}>
										{isNaN(bill) ? "" : <span>{bill}</span>}Rs.
									</b>
								</Col>
							</Row>
							<Row>
								<Col>
									<b>Status:</b>
								</Col>
								<Col>
									<b>
										{this.state.user.bill_status.toLowerCase() === "paid" ? (
											<span style={{ color: "blue" }}>Paid.</span>
										) : (
											<span style={{ color: "red" }}>
												{this.state.user.bill_status}
											</span>
										)}
									</b>
								</Col>
							</Row>
						</Card.Text>
					</Card.Body>
				</Card>
				<footer className="text-muted">
					<i>For any support contact: 03162593688</i>
				</footer>
			</Card>
		);
	}
}

export default UI;

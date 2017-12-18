import React from 'react';
import { NavLink } from 'react-router-dom';
import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';

export default class InformationDropdown extends React.Component {
	constructor(props) {
		super(props);

		this.toggle = this.toggle.bind(this);
		this.state = {
			dropdownOpen: false,
		};
	}

	toggle() {
		this.setState({
			dropdownOpen: !this.state.dropdownOpen,
		});
	}

	render() {
		// TODO: Change the DropDownToggle on new item selection
		return (
			<Dropdown isOpen={this.state.dropdownOpen} toggle={this.toggle}>
				<DropdownToggle caret>Evolution</DropdownToggle>
				<DropdownMenu>
					<NavLink replace to="/">
						<DropdownItem>Capacity</DropdownItem>
					</NavLink>
					<DropdownItem divider />
					<NavLink replace to="/information/generation">
						<DropdownItem>Generation</DropdownItem>
					</NavLink>
				</DropdownMenu>
			</Dropdown>
		);
	}
}

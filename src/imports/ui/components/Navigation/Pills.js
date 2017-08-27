import React from 'react';
import {
  Nav,
  NavItem,
  NavDropdown,
  DropdownItem,
  DropdownToggle,
  DropdownMenu,
  NavLink,
} from 'reactstrap';

export default class Example extends React.Component {
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
    return (
      <div className="pills-right">
        <Nav pills>
          <NavItem>
            <NavLink href="#" active>
              Link
            </NavLink>
          </NavItem>
          <NavDropdown isOpen={this.state.dropdownOpen} toggle={this.toggle}>
            <DropdownToggle nav caret>
              Dropdown
            </DropdownToggle>
            <DropdownMenu>
              <DropdownItem header>Header</DropdownItem>
              <DropdownItem disabled>Action</DropdownItem>
              <DropdownItem>Another Action</DropdownItem>
              <DropdownItem divider />
              <DropdownItem>Another Action</DropdownItem>
            </DropdownMenu>
          </NavDropdown>
          <NavItem>
            <NavLink href="/capacity">Capacity</NavLink>
          </NavItem>
          <NavItem>
            <NavLink href="#">Load Zones</NavLink>
          </NavItem>
          <NavItem>
            <NavLink disabled href="#">
              Energy Evolution
            </NavLink>
          </NavItem>
        </Nav>
      </div>
    );
  }
}

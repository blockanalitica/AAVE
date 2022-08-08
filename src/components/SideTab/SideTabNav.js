import React from "react";
import { Nav, NavItem, NavLink } from "reactstrap";
import classnames from "classnames";
import PropTypes from "prop-types";
import styles from "./SideTabNav.module.scss";

function SideTabNav(props) {
  const { toggleTab, activeTab, tabs } = props;

  return (
    <Nav tabs vertical className="mb-4">
      {tabs.map((tab) => (
        <NavItem key={tab.id}>
          <NavLink
            className={classnames({ active: activeTab === tab.id })}
            cssModule={styles}
            onClick={() => {
              toggleTab(tab.id);
            }}
          >
            {tab.text}
          </NavLink>
        </NavItem>
      ))}
    </Nav>
  );
}

SideTabNav.propTypes = {
  activeTab: PropTypes.string.isRequired,
  toggleTab: PropTypes.func.isRequired,
  tabs: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      text: PropTypes.string.isRequired,
    })
  ).isRequired,
};

export default SideTabNav;

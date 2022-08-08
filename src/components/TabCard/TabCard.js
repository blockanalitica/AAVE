import classnames from "classnames";
import PropTypes from "prop-types";
import React, { useState } from "react";
import { Nav, NavItem, NavLink, TabContent, TabPane } from "reactstrap";
import styles from "./TabCard.module.scss";

function TabCard(props) {
  const { className, fullHeight, tabs, ...rest } = props;

  const [activeTab, setActiveTab] = useState(0);
  const toggleTab = (tab) => {
    if (activeTab !== tab) {
      setActiveTab(tab);
    }
  };

  const [navItems, tabPanes] = tabs.reduce(
    ([navs, panes], item, index) => {
      navs.push(
        <NavItem key={`tab-${index}`}>
          <NavLink
            className={classnames(styles.navLink, {
              [styles.active]: activeTab === index,
            })}
            onClick={() => {
              toggleTab(index);
            }}
          >
            {item.title}
          </NavLink>
        </NavItem>
      );
      panes.push(
        <TabPane key={`pane-${index}`} tabId={index}>
          {activeTab === index ? item.content : null}
        </TabPane>
      );
      return [navs, panes];
    },
    [[], []]
  );

  return (
    <div
      className={classnames(className, styles.wrapper, { "h-100": fullHeight })}
      {...rest}
    >
      <Nav tabs>{navItems}</Nav>
      <TabContent className={styles.tabContent} activeTab={activeTab}>
        {tabPanes}
      </TabContent>
    </div>
  );
}

TabCard.propTypes = {
  tabs: PropTypes.array.isRequired,
  fullHeight: PropTypes.bool.isRequired,
};

TabCard.defaultProps = {
  fullHeight: false,
};

export default TabCard;

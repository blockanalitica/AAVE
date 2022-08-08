import React from "react";
import { TabContent, TabPane } from "reactstrap";
import PropTypes from "prop-types";
import styles from "./SideTabContent.module.scss";

function SideTabContent(props) {
  const { activeTab, tabs } = props;

  return (
    <TabContent activeTab={activeTab} className={styles.tabContent}>
      {tabs.map((tab) => (
        <TabPane key={tab.id} tabId={tab.id}>
          {activeTab === tab.id ? tab.content : null}
        </TabPane>
      ))}
    </TabContent>
  );
}

SideTabContent.propTypes = {
  activeTab: PropTypes.string.isRequired,
  tabs: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      content: PropTypes.object.isRequired,
    })
  ).isRequired,
};

export default SideTabContent;

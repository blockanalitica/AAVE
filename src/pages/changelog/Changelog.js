import React from "react";
import { withErrorBoundary } from "../../hoc.js";
import styles from "./Changelog.module.scss";

// Split changes by following sections:
// - "Added" for new features
// - "Changed" for changes in existing functionality
// - "Deprecated" for soon-to-be removed features
// - "Removed" for now removed features
// - "Fixed" for any bug fixes
// - "Security" in case of vulnerabilities

function Changelog(props) {
  return (
    <>
      <h1 className="h3 mb-4">changelog</h1>
      <div className={styles.section}>
        <h3 className={styles.date}>October 2022</h3>
        <h4 className={styles.changeSection}>Added</h4>
        <ul className={styles.changes}>
          <li>New changelog page for tracking notable changes to this project</li>
        </ul>
      </div>
    </>
  );
}

export default withErrorBoundary(Changelog);

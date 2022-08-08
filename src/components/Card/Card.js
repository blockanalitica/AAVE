import classnames from "classnames";
import PropTypes from "prop-types";
import React from "react";
import { Card as StrapCard, CardBody, CardTitle } from "reactstrap";
import slugify from "slugify";
import styles from "./Card.module.scss";

function Card(props) {
  const { className, title, children, fullHeight, id, bgColorNum, ...rest } = props;
  let anchorId;
  if (id || typeof title === "string") {
    anchorId = slugify(id || title).toLowerCase();
  }
  return (
    <StrapCard
      id={anchorId}
      className={classnames(className, styles.roundBorder, {
        "h-100": bgColorNum ? false : fullHeight,
        [styles.bg1]: bgColorNum === 1,
        [styles.bg2]: bgColorNum === 2,
        [styles.bg3]: bgColorNum === 3,
        [styles.bg4]: bgColorNum === 4,
      })}
      {...rest}
    >
      {title ? (
        <CardTitle tag="h6" className={classnames("text-content", styles.title)}>
          {title}
        </CardTitle>
      ) : null}
      <CardBody>{children}</CardBody>
    </StrapCard>
  );
}

Card.propTypes = {
  title: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
  id: PropTypes.string,
  children: PropTypes.any,
  className: PropTypes.string,
  fullHeight: PropTypes.bool,
  bgColorNum: PropTypes.number,
};

Card.defaultProps = {
  fullHeight: false,
};

export default Card;

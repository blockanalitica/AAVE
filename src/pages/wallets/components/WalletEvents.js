import classnames from "classnames";
import React from "react";
import { CardBody } from "reactstrap";
import Card from "../../../components/Card/Card.js";
import CryptoIcon from "../../../components/CryptoIcon/CryptoIcon.js";
import DateTimeAgo from "../../../components/DateTime/DateTimeAgo.js";
import Loader from "../../../components/Loader/Loader.js";
import Value from "../../../components/Value/Value.js";
import { withErrorBoundary } from "../../../hoc.js";
import { useFetch } from "../../../hooks";
import { parseUTCDateTime } from "../../../utils/datetime.js";
import styles from "./WalletEvents.module.scss";

function WalletEvents(props) {
  const { address } = props;
  const pageSize = 5;

  const { data, isLoading, isError, ErrorFallbackComponent } = useFetch(
    `aave/wallets/${address}/events/`,
    {
      p: 1,
      p_size: pageSize,
    }
  );
  if (isLoading) {
    return <Loader />;
  } else if (isError) {
    return <ErrorFallbackComponent />;
  }
  return (
    <>
      <Card>
        <CardBody>
          <h3 className={styles.line}>Events</h3>
          <div>
            {data &&
              data.results.map((event) => (
                <div className={classnames(styles.itemTimeline)}>
                  <div className={classnames(styles.tMetaDate)}>
                    <p>
                      <DateTimeAgo dateTime={parseUTCDateTime(event.datetime)} />
                    </p>
                  </div>
                  {event.event === "LiquidationCall" ? (
                    <>
                      <div className={classnames(styles.tDotLiquidation)}>
                        <div className="d-flex flex-column">
                          <CryptoIcon name={event.symbol} size="2em" className="mb-1" />
                          <CryptoIcon name={event.debt_symbol} size="2em" />
                        </div>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className={classnames(styles.tDot)}>
                        <CryptoIcon name={event.symbol} size="2em" />
                      </div>
                    </>
                  )}

                  <div className={classnames(styles.tText)}>
                    <p>
                      <>
                        {event.event === "LiquidationCall" ? (
                          <>
                            {event.event} <br></br>
                            <small>{"Coll: "}</small>
                            <Value value={event.amount} compact /> {event.symbol}{" "}
                            <br></br>
                            <small>{"Debt: "}</small>
                            <Value value={event.debt_repayed} compact />{" "}
                            {event.debt_symbol}{" "}
                          </>
                        ) : (
                          <>
                            {event.event} <br></br>
                            <Value value={event.amount} compact /> {event.symbol}{" "}
                          </>
                        )}
                      </>
                    </p>
                  </div>
                </div>
              ))}
          </div>
        </CardBody>
      </Card>
    </>
  );
}

export default withErrorBoundary(WalletEvents);

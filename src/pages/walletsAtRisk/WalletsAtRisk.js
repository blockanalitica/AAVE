import React, { useState } from "react";
import { Col, FormGroup, Label, Input } from "reactstrap";
import { usePageTitle } from "../../hooks";
import InfoCard from "./components/InfoCard.js";
import WalletsTable from "./components/WalletsTable.js";

function WalletsAtRisk(props) {
  usePageTitle("Wallets at risk");

  const [drop, setDrop] = useState(5);

  const onDropChange = (drop) => {
    if (drop < 0) {
      drop = 0;
    } else if (drop > 99) {
      drop = 99;
    }
    setDrop(drop);
  };
  return (
    <>
      <h3 className="mb-4">wallets at risk</h3>
      <p className="gray">
        simulation of markets price drop (all assets fall for x% at the same time,
        excluding stable coins). When wallet reach health rate under 1, 50% or max 5M of
        debt position is liquidated.
      </p>
      <FormGroup row className="mb-4">
        <Label xl={2} for="drop">
          markets price drop:
        </Label>
        <Col xl={6} className="d-flex align-items-center">
          <Input
            id="drop"
            min={0}
            max={99}
            type="number"
            value={drop}
            className="me-2"
            style={{ width: "5rem" }}
            onChange={(e) => onDropChange(e.target.value)}
          />
          %
        </Col>
      </FormGroup>
      <InfoCard drop={drop} />
      <WalletsTable drop={drop} />
    </>
  );
}

export default WalletsAtRisk;

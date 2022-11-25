import { withErrorBoundary } from "../../../../hoc.js";
import { Col, Row } from "reactstrap";
import LinkTable from "../../../../components/Table/LinkTable.js";
import Value from "../../../../components/Value/Value.js";
import { useNavigate } from "react-router-dom";
import { shorten } from "../../../../utils/address.js";

function Top5(props) {
  const navigate = useNavigate();

  const { keyField, data } = props;

  const onOwnerClick = (e, url) => {
    navigate(url);
    e.stopPropagation();
  };

  const title = keyField === "supply" ? "Supply" : "Borrow";

  return (
    <Row>
      <h4>Top five wallets by {title}</h4>
      <Col className="mb-4">
        <LinkTable
          keyField={keyField}
          data={data}
          defaultSorted={[
            {
              dataField: "total_borrow",
              order: "desc",
            },
          ]}
          columns={[
            {
              dataField: "wallet_address",
              text: "owner address",

              formatter: (cell, row) => (
                <>
                  {cell ? (
                    <span
                      role="button"
                      className="link"
                      onClick={(e) => onOwnerClick(e, `/wallets/${cell}/`)}
                    >
                      {row.owner_name ||
                        (row.owner_ens && row.owner_ens.length < 25
                          ? row.owner_ens
                          : null) ||
                        shorten(cell)}
                    </span>
                  ) : (
                    "-"
                  )}
                </>
              ),
              headerAlign: "center",
              align: "center",
            },
            {
              dataField: "supply",
              text: "Supply",
              formatter: (cell, row) => <Value value={cell} decimals={2} />,
              sort: true,
              headerAlign: "right",
              align: "right",
            },
            {
              dataField: "total_borrow",
              text: "borrow",
              formatter: (cell, row) => <Value value={cell} decimals={2} />,
              sort: true,
              headerAlign: "right",
              align: "right",
            },
            {
              dataField: "account_liquidity",
              text: "Account Liquidity",
              formatter: (cell, row) => <Value value={cell} decimals={2} />,
              sort: true,
              headerAlign: "right",
              align: "right",
            },
          ]}
        />
      </Col>
    </Row>
  );
}

export default withErrorBoundary(Top5);

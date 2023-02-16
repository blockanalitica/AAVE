import classnames from "classnames";
import makeBlockie from "ethereum-blockies-base64";
import { Col, Row } from "reactstrap";
import Address from "../../../../components/Address/Address.js";
import LinkTable from "../../../../components/Table/LinkTable.js";
import Value from "../../../../components/Value/Value.js";
import { withErrorBoundary } from "../../../../hoc.js";
import { useSmartNavigate } from "../../../../hooks";
import styles from "./../MarketWallets.module.scss";
function Top5(props) {
  const navigate = useSmartNavigate();

  const { keyField, data, price } = props;

  const onRowClick = (row) => {
    navigate(`wallets/${row.wallet_address}/`);
  };

  const title = keyField === "supply" ? "suppliers" : "borrowers";
  const field = keyField === "supply" ? "supply" : "total_borrow";
  const fieldText = keyField === "supply" ? "Supply" : "Borrow";
  const fieldTextUSD = keyField === "supply" ? "Supply USD" : "Borrow USD";

  return (
    <Row>
      <h4>top five {title}</h4>
      <Col className="mb-4">
        <LinkTable
          onRowClick={onRowClick}
          keyField={keyField}
          data={data}
          defaultSorted={[
            {
              dataField: field,
              order: "desc",
            },
          ]}
          columns={[
            {
              dataField: "wallet_address",
              text: "",
              formatter: (cell, row) => {
                const blockie = makeBlockie(cell);
                return (
                  <>
                    <img
                      className={classnames(
                        styles.roundedCircle,
                        styles.walletLogo,
                        "me-3"
                      )}
                      src={blockie}
                      alt={cell}
                    />
                  </>
                );
              },
            },
            {
              dataField: "wallet_address",
              text: "owner address",
              formatter: (cell) => <Address value={cell} short />,
              headerAlign: "left",
              align: "left",
            },
            {
              dataField: field,
              text: fieldText,
              formatter: (cell, row) => (
                <Value value={parseFloat(cell.toFixed(2))} decimals={2} compact />
              ),
              sort: true,
              headerAlign: "right",
              align: "right",
            },
            {
              dataField: field,
              text: fieldTextUSD,
              formatter: (cell, row) => (
                <Value value={cell * price} decimals={2} prefix="$" compact />
              ),
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

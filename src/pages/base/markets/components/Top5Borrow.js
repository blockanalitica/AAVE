import { withErrorBoundary } from "../../../../hoc.js";
import { useFetch } from "../../../../hooks";
import { Col, Row } from "reactstrap";
import LinkTable from "../../../../components/Table/LinkTable.js";
import Value from "../../../../components/Value/Value.js";
import Loader from "../../../../components/Loader/Loader.js";
import { useNavigate } from "react-router-dom";
import { shorten } from "../../../../utils/address.js";

function Top5(props) {
  const navigate = useNavigate();

  const { symbol } = props;

  const { data, isLoading, isError, ErrorFallbackComponent } = useFetch(
    `markets/${symbol}/wallets/top5`
  );

  const onOwnerClick = (e, url) => {
    navigate(url);
    e.stopPropagation();
  };

  if (isLoading) {
    return <Loader />;
  } else if (isError) {
    return <ErrorFallbackComponent />;
  }

  const { borrow } = data[0];

  const top5borrow = (
    <Row>
      <h4>Top five wallets by borrow</h4>
      <Col className="mb-4">
        <LinkTable
          keyField="total_borrow"
          data={borrow}
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

  return top5borrow;
}

export default withErrorBoundary(Top5);

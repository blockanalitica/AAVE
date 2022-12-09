import { Col, Row } from "reactstrap";
import Loader from "../../../components/Loader/Loader.js";
import { withErrorBoundary } from "../../../hoc";
import { useFetch } from "../../../hooks";
import Top5Wallets from "./components/Top5Wallets";

function Top5(props) {
  const { symbol, ...rest } = props;
  const { data, isLoading, isError, ErrorFallbackComponent } = useFetch(
    `markets/${symbol}/wallets/top5/`
  );

  if (isLoading) {
    return <Loader />;
  } else if (isError) {
    return <ErrorFallbackComponent />;
  }
  const { supply, borrow, price } = data;

  return (
    <div {...rest}>
      <Row>
        <Col>
          <Top5Wallets data={supply} keyField="supply" price={price} />
        </Col>
        <Col>
          {borrow.length > 0 && (
            <Top5Wallets data={borrow} keyField="total_borrow" price={price} />
          )}
        </Col>
      </Row>
    </div>
  );
}

export default withErrorBoundary(Top5);

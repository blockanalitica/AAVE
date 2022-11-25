import { useFetch } from "../../../hooks";
import Loader from "../../../components/Loader/Loader.js";
import { withErrorBoundary } from "../../../hoc";
import Top5Wallets from "./components/Top5Wallets";

function Top5(props) {
  const { symbol } = props;
  const { data, isLoading, isError, ErrorFallbackComponent } = useFetch(
    `markets/${symbol}/wallets/top5`
  );

  if (isLoading) {
    return <Loader />;
  } else if (isError) {
    return <ErrorFallbackComponent />;
  }
  const { supply, borrow } = data[0];

  return (
    <>
      <div>
        <div className="row">
          <div className="col-xs-6">
            <Top5Wallets data={supply} keyField="supply" />
          </div>
          <div className="col-xs-6">
            <Top5Wallets data={borrow} keyField="total_borrow" />
          </div>
        </div>
      </div>
    </>
  );
}

export default withErrorBoundary(Top5);

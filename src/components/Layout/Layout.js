import React, { useState } from "react";
import { Route, Routes } from "react-router";
import { Link, useLocation } from "react-router-dom";
import {
  Collapse,
  Container,
  Nav,
  Navbar,
  NavbarBrand,
  NavbarToggler,
  NavItem,
  NavLink,
} from "reactstrap";
import { smartLocationPrefix } from "../../utils/url.js";
import logoAave from "../../images/aave-logo.svg";
import baLogo from "../../images/logo-light.svg";
import Activity from "../../pages/activity/Activity";
import LiquidationsBase from "../../pages/base/liquidations/Liquidations.js";
import LiquidatorBase from "../../pages/base/liquidations/Liquidator.js";
import LiquidatorsBase from "../../pages/base/liquidations/Liquidators.js";
import MarketBase from "../../pages/base/markets/Market.js";
import MarketsBase from "../../pages/base/markets/Markets.js";
import MarketWalletsBase from "../../pages/base/markets/MarketWallets.js";
import Top5Base from "../../pages/base/markets/Top5.js";
import WalletBase from "../../pages/base/wallets/Wallet.js";
import WalletsBase from "../../pages/base/wallets/Wallets.js";
import Changelog from "../../pages/changelog/Changelog";
import Ecosystem from "../../pages/ecosystem/Ecosystem";
import ErrorPage from "../../pages/error/ErrorPage.js";
import Homepage from "../../pages/homepage/Homepage.js";
import Liquidations from "../../pages/liquidations/Liquidations.js";
import Liquidator from "../../pages/liquidations/Liquidator.js";
import Liquidators from "../../pages/liquidations/Liquidators.js";
import Markets from "../../pages/markets/Markets";
import OracleHistoricStats from "../../pages/oracles/OracleHistoricStats.js";
import Oracles from "../../pages/oracles/Oracles.js";
import Token from "../../pages/token/Token.js";
import TokenWallets from "../../pages/token/TokenWallets.js";
import Wallet from "../../pages/wallets/Wallet.js";
import Wallets from "../../pages/wallets/Wallets.js";
import WalletsAtRisk from "../../pages/walletsAtRisk/WalletsAtRisk";
import BreadcrumbHistory from "../BreadcrumbHistory/BreadcrumbHistory.js";
import NetworkSelector from "../NetworkSelector/NetworkSelector.js";
import ActivityBase from "../../pages/base/activity/Activity.js";
import AtRiskBase from "../../pages/base/atRisk/AtRisk.js";
import styles from "./Layout.module.scss";

function Layout(props) {
  const [isNavbarOpen, setIsNavbarOpen] = useState(false);
  const toggleNavbar = () => setIsNavbarOpen(!isNavbarOpen);

  const location = useLocation();
  const locationPrefix = smartLocationPrefix(location);

  const v2EthereumRoutes = [
    { path: "markets/", element: <MarketsBase /> },
    { path: "markets/:symbol/", element: <MarketBase /> },
    { path: "markets/:symbol/wallets/", element: <MarketWalletsBase /> },
    { path: "markets/:symbol/wallets/top5/", element: <Top5Base /> },
    { path: "wallets/", element: <WalletsBase /> },
    { path: "wallets/:address/", element: <WalletBase /> },
    { path: "liquidations/", element: <LiquidationsBase /> },
    { path: "wallets-at-risk/", element: <AtRiskBase /> },
    { path: "liquidations/liquidators/:address/", element: <LiquidatorBase /> },
    { path: "liquidations/liquidator/:address/", element: <LiquidatorBase /> },
    { path: "liquidations/liquidators/", element: <LiquidatorsBase /> },
    { path: "activity/", element: <ActivityBase /> },
  ];

  const v3OptimismRoutes = [
    { path: "markets/", element: <MarketsBase /> },
    { path: "markets/:symbol/", element: <MarketBase /> },
    { path: "markets/:symbol/wallets/", element: <MarketWalletsBase /> },
    { path: "wallets/", element: <WalletsBase /> },
    { path: "wallets/:address/", element: <WalletBase /> },
    { path: "liquidations/", element: <LiquidationsBase /> },
    { path: "liquidations/liquidator/:address/", element: <LiquidatorBase /> },
    { path: "liquidations/liquidators/:address/", element: <LiquidatorBase /> },
    { path: "liquidations/liquidators/", element: <LiquidatorsBase /> },
    { path: "wallets-at-risk/", element: <AtRiskBase /> },
    { path: "activity/", element: <ActivityBase /> },
  ];

  const prefix = locationPrefix.length > 0 ? locationPrefix : "/";
  console.log(prefix.includes("optimism"));
  return (
    <>
      <Container>
        <header className="mb-4">
          <Navbar expand="md" className="fw-bolder" dark container={false}>
            <NavbarBrand className={styles.navbarBrand} tag={Link} to="/">
              <img className={styles.logo} src={logoAave} alt="Aave" />
            </NavbarBrand>
            {locationPrefix.length > 0 ? <NetworkSelector /> : null}
            <NavbarToggler onClick={toggleNavbar} />
            <Collapse isOpen={isNavbarOpen} navbar>
              <Nav className="flex-grow-1 justify-content-end" navbar>
                <NavItem>
                  <NavLink tag={Link} to={`${prefix}markets/`}>
                    Markets
                  </NavLink>
                </NavItem>
                <NavItem>
                  <NavLink tag={Link} to={`${prefix}liquidations/`}>
                    Liquidations
                  </NavLink>
                </NavItem>
                <NavItem>
                  <NavLink tag={Link} to={`${prefix}wallets/`}>
                    Wallets
                  </NavLink>
                </NavItem>
                <NavItem>
                  <NavLink tag={Link} to={`${prefix}wallets-at-risk/`}>
                    Wallets at Risk
                  </NavLink>
                </NavItem>
                {prefix.includes("optimism") ? null : (
                  <NavItem>
                    <NavLink tag={Link} to={`${prefix}ecosystem/`}>
                      Ecosystem
                    </NavLink>
                  </NavItem>
                )}
                <NavItem>
                  <NavLink tag={Link} to={`${prefix}activity/`}>
                    Activity
                  </NavLink>
                </NavItem>
                {locationPrefix.length > 0 ? null : (
                  <NavItem>
                    <NavLink tag={Link} to={`${prefix}oracles/`}>
                      Oracles
                    </NavLink>
                  </NavItem>
                )}
              </Nav>
            </Collapse>
          </Navbar>
        </header>

        <main>
          <BreadcrumbHistory />
          <Routes>
            <Route index element={<Homepage />} />
            <Route path="markets/" element={<Markets />} />
            <Route path="markets/:symbol/" element={<Token />} />
            <Route path="markets/:symbol/wallets/" element={<TokenWallets />} />
            <Route path="wallets/" element={<Wallets />} />
            <Route path="wallets/:address/" element={<Wallet />} />
            <Route path="wallets-at-risk/" element={<WalletsAtRisk />} />
            <Route path="liquidations/" element={<Liquidations />} />
            <Route path="liquidations/liquidators/" element={<Liquidators />} />
            <Route path="liquidations/liquidator/:address/" element={<Liquidator />} />
            <Route path="liquidations/liquidators/:address/" element={<Liquidator />} />
            <Route path="ecosystem/" element={<Ecosystem />} />
            <Route path="activity/" element={<Activity />} />
            <Route path="changelog/" element={<Changelog />} />
            <Route path="oracles/" element={<Oracles />} />
            <Route path="oracles/:symbol/" element={<OracleHistoricStats />} />
            {/* V2 Ethereum */}
            {v2EthereumRoutes.map((route) => {
              const path = `v2/ethereum/${route.path}`;
              return <Route key={path} path={path} element={route.element} />;
            })}
            {/* V3 Optimism */}
            {v3OptimismRoutes.map((route) => {
              const path = `v3/optimism/${route.path}`;
              return <Route key={path} path={path} element={route.element} />;
            })}
            {/* Catch all */}
            <Route path="*" element={<ErrorPage />} />
          </Routes>
        </main>
      </Container>

      <footer className="mt-4 text-center p-3">
        <div className="d-flex justify-content-center align-items-baseline gray small mb-1">
          <img src={baLogo} alt="blockanalitica" className={styles.footerLogo} />
          &copy;2022
        </div>
        <Link to="changelog/" className="gray small">
          changelog
        </Link>
      </footer>
    </>
  );
}

export default Layout;

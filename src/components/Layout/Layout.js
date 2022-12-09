import React, { useState } from "react";
import { Route, Routes } from "react-router";
import { Link, useLocation, Navigate } from "react-router-dom";
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
import logoAave from "../../images/aave-logo.svg";
import baLogo from "../../images/logo-light.svg";
import SimpleRedirect from "../../components/SimpleRedirect/SimpleRedirect.js";
import ActivityBase from "../../pages/base/activity/Activity.js";
import AtRiskBase from "../../pages/base/atRisk/AtRisk.js";
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
import ErrorPage from "../../pages/error/ErrorPage.js";
import HomepageBase from "../../pages/base/homepage/Homepage.js";
import { smartLocationPrefix } from "../../utils/url.js";
import BreadcrumbHistory from "../BreadcrumbHistory/BreadcrumbHistory.js";
import NetworkSelector from "../NetworkSelector/NetworkSelector.js";
import styles from "./Layout.module.scss";

function Layout(props) {
  const [isNavbarOpen, setIsNavbarOpen] = useState(false);
  const toggleNavbar = () => setIsNavbarOpen(!isNavbarOpen);

  const location = useLocation();
  const locationPrefix = smartLocationPrefix(location);

  const v2EthereumRoutes = [
    { path: "/", element: <HomepageBase /> },
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
    { path: "/", element: <HomepageBase /> },
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

  const oldRedirects = [
    "markets/",
    "markets/:symbol/",
    "markets/:symbol/wallets/",
    "wallets/",
    "wallets/:address/",
    "wallets-at-risk/",
    "liquidations/",
    "liquidations/liquidators/",
    "liquidations/liquidator/:address/",
    "liquidations/liquidators/:address/",
    "ecosystem/",
    "activity/",
    "oracles/",
    "oracles/:symbol/",
  ];

  const prefix = locationPrefix.length > 0 ? locationPrefix : "/";
  return (
    <>
      <Container>
        <header className="mb-4">
          <Navbar expand="md" className="fw-bolder" dark container={false}>
            <NavbarBrand className={styles.navbarBrand} tag={Link} to={`${prefix}`}>
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
            <Route index element={<Navigate replace to="/v2/ethereum/" />} />

            {/* old redirects */}
            {oldRedirects.map((path) => {
              return (
                <Route
                  key={path}
                  path={path}
                  element={<SimpleRedirect replace to={`/v2/ethereum/${path}`} />}
                />
              );
            })}

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

            <Route path="changelog/" element={<Changelog />} />
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

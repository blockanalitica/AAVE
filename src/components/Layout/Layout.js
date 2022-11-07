import React, { useState } from "react";
import { Route, Routes } from "react-router";
import { Link } from "react-router-dom";
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
import baLogo from "../../images/logo-light.svg";
import logoAave from "../../images/aave-logo.svg";
import ErrorPage from "../../pages/error/ErrorPage.js";
import Homepage from "../../pages/homepage/Homepage.js";
import Liquidations from "../../pages/liquidations/Liquidations.js";
import Liquidator from "../../pages/liquidations/Liquidator.js";
import Liquidators from "../../pages/liquidations/Liquidators.js";
import Token from "../../pages/token/Token.js";
import TokenWallets from "../../pages/token/TokenWallets.js";
import WalletsAtRisk from "../../pages/walletsAtRisk/WalletsAtRisk";
import Wallet from "../../pages/wallets/Wallet.js";
import Wallets from "../../pages/wallets/Wallets.js";
import BreadcrumbHistory from "../BreadcrumbHistory/BreadcrumbHistory.js";
import styles from "./Layout.module.scss";
import Ecosystem from "../../pages/ecosystem/Ecosystem";
import Activity from "../../pages/activity/Activity";
import Markets from "../../pages/markets/Markets";
import Changelog from "../../pages/changelog/Changelog";
import MarketsV2 from "../../pages/v2/markets/Markets.js";
import MarketV2 from "../../pages/v2/markets/Market.js";

function Layout(props) {
  const [isNavbarOpen, setIsNavbarOpen] = useState(false);
  const toggleNavbar = () => setIsNavbarOpen(!isNavbarOpen);

  return (
    <>
      <Container>
        <header className="mb-4">
          <Navbar expand="md" className="fw-bolder" dark container={false}>
            <NavbarBrand className={styles.navbarBrand} tag={Link} to="/">
              <img className={styles.logo} src={logoAave} alt="Aave" />
            </NavbarBrand>
            <NavbarToggler onClick={toggleNavbar} />
            <Collapse isOpen={isNavbarOpen} navbar>
              <Nav className="flex-grow-1 justify-content-end" navbar>
                <NavItem>
                  <NavLink tag={Link} to="/markets/">
                    Markets
                  </NavLink>
                </NavItem>
                <NavItem>
                  <NavLink tag={Link} to="/liquidations/">
                    Liquidations
                  </NavLink>
                </NavItem>
                <NavItem>
                  <NavLink tag={Link} to="/wallets/">
                    Wallets
                  </NavLink>
                </NavItem>
                <NavItem>
                  <NavLink tag={Link} to="/wallets-at-risk/">
                    Wallets at Risk
                  </NavLink>
                </NavItem>
                <NavItem>
                  <NavLink tag={Link} to="/ecosystem/">
                    Ecosystem
                  </NavLink>
                </NavItem>
                <NavItem>
                  <NavLink tag={Link} to="/activity/">
                    Activity
                  </NavLink>
                </NavItem>

                {/*<NavItem>
                  <NavLink tag={Link} to="/">
                    Assets
                  </NavLink>
                </NavItem>*/}
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
            <Route path="v2/mainnet/markets/" element={<MarketsV2 />} />
            <Route path="v2/mainnet/markets/:symbol/" element={<MarketV2 />} />
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

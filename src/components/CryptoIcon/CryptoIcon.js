import PropTypes from "prop-types";
import React from "react";
import { useLocation } from "react-router-dom";
import oneinchIcon from "../../images/crypto/color/1inch.svg";
import aaveIcon from "../../images/crypto/color/aave.svg";
import amplIcon from "../../images/crypto/color/ampl.svg";
import arbitrumIcon from "../../images/crypto/color/arbitrum.svg";
import avaxIcon from "../../images/crypto/color/avax.svg";
import balIcon from "../../images/crypto/color/bal.svg";
import batIcon from "../../images/crypto/color/bat.svg";
import bnbIcon from "../../images/crypto/color/bnb.svg";
import btcIcon from "../../images/crypto/color/btc.svg";
import cbethIcon from "../../images/crypto/color/cbeth.svg";
import compIcon from "../../images/crypto/color/comp.svg";
import crvIcon from "../../images/crypto/color/crv.svg";
import cvxIcon from "../../images/crypto/color/cvx.svg";
import daiIcon from "../../images/crypto/color/dai.svg";
import dpiIcon from "../../images/crypto/color/dpi.svg";
import enjIcon from "../../images/crypto/color/enj.svg";
import ensIcon from "../../images/crypto/color/ens.svg";
import ethIcon from "../../images/crypto/color/eth.svg";
import eursIcon from "../../images/crypto/color/eurs.svg";
import feiIcon from "../../images/crypto/color/fei.svg";
import filIcon from "../../images/crypto/color/fil.svg";
import fraxIcon from "../../images/crypto/color/frax.svg";
import gusdIcon from "../../images/crypto/color/gusd.svg";
import kncIcon from "../../images/crypto/color/knc.svg";
import linkIcon from "../../images/crypto/color/link.svg";
import lusdIcon from "../../images/crypto/color/lusd.svg";
import maiIcon from "../../images/crypto/color/mai.svg";
import manaIcon from "../../images/crypto/color/mana.svg";
import maticIcon from "../../images/crypto/color/matic.svg";
import mkrIcon from "../../images/crypto/color/mkr.svg";
import optimismIcon from "../../images/crypto/color/optimism.svg";
import paxIcon from "../../images/crypto/color/pax.svg";
import raiIcon from "../../images/crypto/color/rai.svg";
import renIcon from "../../images/crypto/color/ren.svg";
import rethIcon from "../../images/crypto/color/reth.svg";
import savaxIcon from "../../images/crypto/color/savax.svg";
import snxIcon from "../../images/crypto/color/snx.svg";
import stEthIcon from "../../images/crypto/color/steth.svg";
import stkAaveIcon from "../../images/crypto/color/stkaave.svg";
import susdIcon from "../../images/crypto/color/susd.svg";
import sushiIcon from "../../images/crypto/color/sushi.svg";
import tusdIcon from "../../images/crypto/color/tusd.svg";
import uniIcon from "../../images/crypto/color/uni.svg";
import usdcIcon from "../../images/crypto/color/usdc.svg";
import usdtIcon from "../../images/crypto/color/usdt.svg";
import ustIcon from "../../images/crypto/color/ust.svg";
import wbtcIcon from "../../images/crypto/color/wbtc.svg";
import yfiIcon from "../../images/crypto/color/yfi.svg";
import zrxIcon from "../../images/crypto/color/zrx.svg";
import { smartEtherscanUrl } from "../../utils/url.js";

function CryptoIcon(props) {
  const location = useLocation();
  const { name, size, address, ...rest } = props;
  const mapping = {
    OP: optimismIcon,
    EURS: eursIcon,
    AAVE: aaveIcon,
    "AAVE.e": aaveIcon,
    AMPL: amplIcon,
    BAT: batIcon,
    BAL: balIcon,
    BUSD: bnbIcon,
    COMP: compIcon,
    CRV: crvIcon,
    DAI: daiIcon,
    "DAI.e": daiIcon,
    ETH: ethIcon,
    ENJ: enjIcon,
    GUSD: gusdIcon,
    LINK: linkIcon,
    "LINK.e": linkIcon,
    MKR: mkrIcon,
    PAX: paxIcon,
    SUSHI: sushiIcon,
    xSUSHI: sushiIcon,
    KNC: kncIcon,
    SNX: snxIcon,
    TUSD: tusdIcon,
    UNI: uniIcon,
    USDC: usdcIcon,
    "USDC.e": usdcIcon,
    USDP: paxIcon,
    USDT: usdtIcon,
    USDt: usdtIcon,
    WBTC: wbtcIcon,
    "WBTC.e": wbtcIcon,
    "BTC.b": wbtcIcon,
    WETH: ethIcon,
    "WETH.e": ethIcon,
    stETH: stEthIcon,
    wstETH: stEthIcon,
    MANA: manaIcon,
    renFIL: filIcon,
    YFI: yfiIcon,
    ZRX: zrxIcon,
    FEI: feiIcon,
    BTC: btcIcon,
    FRAX: fraxIcon,
    sUSD: susdIcon,
    DPI: dpiIcon,
    REN: renIcon,
    RAI: raiIcon,
    ENS: ensIcon,
    UST: ustIcon,
    rETH: rethIcon,
    cbETH: cbethIcon,
    stkAAVE: stkAaveIcon,
    WAVAX: avaxIcon,
    sAVAX: savaxIcon,
    CVX: cvxIcon,
    MAI: maiIcon,
    "1INCH": oneinchIcon,
    LUSD: lusdIcon,
    MATIC: maticIcon,
    polygon: maticIcon,
    ethereum: ethIcon,
    AVAX: avaxIcon,
    arbitrum: arbitrumIcon,
    avalanche: avaxIcon,
    optimism: optimismIcon,
  };
  const icon = mapping[name];
  if (!icon) {
    return null;
  }
  let component;
  if (address) {
    const etherscanUrl = smartEtherscanUrl(location);
    const link = `${etherscanUrl}address/${address}`;
    component = (
      <a href={link}>
        <img {...rest} src={icon} alt={name} style={{ width: size, height: size }} />
      </a>
    );
  } else {
    component = (
      <img {...rest} src={icon} alt={name} style={{ width: size, height: size }} />
    );
  }
  return component;
}

CryptoIcon.propTypes = {
  name: PropTypes.string.isRequired,
  size: PropTypes.string,
};

CryptoIcon.defaultProps = {
  size: "1rem",
};

export default CryptoIcon;

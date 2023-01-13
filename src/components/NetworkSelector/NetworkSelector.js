import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Dropdown, DropdownItem, DropdownMenu, DropdownToggle } from "reactstrap";
import { SLASH_REGEX } from "../../utils/url.js";
import CryptoIcon from "../CryptoIcon/CryptoIcon.js";
import styles from "./NetworkSelector.module.scss";

function NetworkSelector(props) {
  const location = useLocation();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const pathname = location.pathname.replace(SLASH_REGEX, "");
  const paths = pathname.split("/");

  const options = {
    v2: [
      {
        value: "ethereum",
        text: "ethereum",
      },
    ],
    v3: [
      {
        value: "optimism",
        text: "optimism",
      },
      {
        value: "arbitrum",
        text: "arbitrum",
      },
    ],
  };

  const currentVersion = paths[0];
  const currentNetwork = options[paths[0]].find(
    (network) => network.value === paths[1]
  );

  const toggle = () => setDropdownOpen((prevState) => !prevState);

  const onItemClick = (version, network) => {
    let url = `/${version}/${network.value}/`;
    const path = paths.slice(2).join("/");
    if (path.length > 0) {
      url = url + path + "/";
    }

    navigate(url);
  };

  return (
    <div>
      <Dropdown isOpen={dropdownOpen} toggle={toggle}>
        <DropdownToggle caret tag="span" className={styles.dropdownToggle}>
          <CryptoIcon size="1.5rem" className="me-2" name={currentNetwork.value} />
        </DropdownToggle>
        <DropdownMenu>
          <DropdownItem header className="text-center">
            v2
          </DropdownItem>
          {options.v2.map((network) => (
            <DropdownItem
              key={`v2-${network.value}`}
              active={currentVersion === "v2" && currentNetwork.value === network.value}
              onClick={() => {
                onItemClick("v2", network);
              }}
            >
              <CryptoIcon size="1.5rem" className="me-2" name={network.value} />
              {network.text}
            </DropdownItem>
          ))}
          <DropdownItem divider />
          <DropdownItem header className="text-center">
            v3
          </DropdownItem>

          {options.v3.map((network) =>
            network.value !== "arbitrum" ? (
              <DropdownItem
                key={`v3-${network.value}`}
                active={
                  currentVersion === "v3" && currentNetwork.value === network.value
                }
                onClick={() => {
                  onItemClick("v3", network);
                }}
              >
                <CryptoIcon size="1.5rem" className="me-2" name={network.value} />
                {network.text}
              </DropdownItem>
            ) : null
          )}
        </DropdownMenu>
      </Dropdown>
    </div>
  );
}

export default NetworkSelector;

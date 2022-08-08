import React, { useState } from "react";
import PropTypes from "prop-types";
import { InputGroup, Button, Input } from "reactstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";

function SearchInput(props) {
  const { placeholder, onSearch, initialSearchText } = props;
  const [enabled, setEnabled] = useState(false);
  const [text, setText] = useState(initialSearchText || "");

  const search = () => {
    onSearch(text);
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      onSearch(text);
    }
  };

  const btnEnabled = enabled || text;
  return (
    <InputGroup>
      <Input
        placeholder={placeholder}
        onFocus={() => setEnabled(true)}
        onBlur={() => setEnabled(false)}
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={handleKeyDown}
      />
      <Button color={btnEnabled ? "primary" : "secondary"} onClick={() => search()}>
        <FontAwesomeIcon icon={faSearch} style={{ fontSize: "1rem" }} />
      </Button>
    </InputGroup>
  );
}

SearchInput.propTypes = {
  placeholder: PropTypes.string,
  onSearch: PropTypes.func.isRequired,
  initialSearchText: PropTypes.string,
};

export default SearchInput;

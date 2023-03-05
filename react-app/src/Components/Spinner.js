import React from 'react';
import { useState, CSSProperties } from "react";
import HashLoader from "react-spinners/HashLoader";

export default function Spinner(props) {
  // let [loading, setLoading] = useState(false);
  const override: CSSProperties = {
    display: "block",
    margin: "0 auto",
    borderColor: "red",
  };

  return (
    <div>
      <HashLoader
        color="red"
        loading={props.loading}
        cssOverride={override}
        size={150}
      />
    </div>
  )
}

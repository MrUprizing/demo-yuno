import React from "react";

export function YunoIframe({ url, width = "100%", height = "600px" }) {
  return (
    <iframe
      src={url}
      style={{
        width,
        height,
        border: "none",
        borderRadius: "8px",
      }}
      title="Yuno Checkout"
      allow="payment"
    />
  );
}

export default YunoIframe;

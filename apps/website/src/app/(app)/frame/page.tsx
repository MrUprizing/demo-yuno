"use client";

import IFrame from "react-iframe";

export default function FramePage() {
  return (
    <div>
      <IFrame url="http://localhost:3000/test" width="100%" height="600px" />
    </div>
  );
}

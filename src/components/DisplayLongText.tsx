import React, { memo } from "react";

// Extracted to separate components for better performance
const DisplayLongText = memo(({ text }: { text: string }) => (
  <span className="tracking-wide leading-relaxed">
    {text.split('\n').map((line, index) => (
      <React.Fragment key={index}>
        {line}
        <br />
      </React.Fragment>
    ))}
  </span>
));

export default DisplayLongText;
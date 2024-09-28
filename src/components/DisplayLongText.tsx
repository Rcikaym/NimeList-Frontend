import React, { memo } from "react";

// Extracted to separate components for better performance
const DisplayLongText = memo(({ text }: { text: string }) => (
  <div className="tracking-wide leading-relaxed">
    {text.split('\n').map((line, index) => (
      <React.Fragment key={index}>
        {line}
        <br />
      </React.Fragment>
    ))}
  </div>
));

export default DisplayLongText;
import React, { memo } from "react";

// Extracted to separate components for better performance
const DisplayLongText = memo(({ text }: { text: string }) => (
  <div className="text-gray-600 tracking-wide leading-relaxed">
    {text.split(/(?:\r\n|\r|\n)/g).map((line, index) => (
      <React.Fragment key={index}>
        {line}
        <br />
      </React.Fragment>
    ))}
  </div>
));

export default DisplayLongText;
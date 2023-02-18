import React from 'react';

function HtP(props: React.HTMLProps<any>) {
  return (
    <p {...props} className="mt-2">
      {props.children}
    </p>
  );
}

export default HtP;

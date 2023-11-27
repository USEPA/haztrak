import happyRobot from '/static/robot-bad-sign.jpg';
import React from 'react';

export function Error404() {
  return (
    <>
      <img src={happyRobot} alt="happy robot" width={200} height={'auto'} />
      <h1 className="display-1 d-flex justify-content-center">404</h1>
      <h4>Resource not found</h4>
    </>
  );
}

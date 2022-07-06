import React from 'react';

const HtCard = ({children}) => {
  let subComponentList = Object.keys(HtCard);

  let subComponents = subComponentList.map((key) => {
    return React.Children.map(children, (child) =>
      child.type.name === key ? child : null
    );
  });

  return (
    <>
      <div className="card shadow-lg border-0 my-4">
        {subComponents.map((component) => component)}
      </div>
    </>
  );
};

const Header = props => {
  return (
    <div
      className={`${props.color ? props.color : 'bg-primary'} card-header text-light`}>
      {props.children}
    </div>
  )
}
HtCard.Header = Header;

const Body = props => {
  return (
    <div className="bg-white card-body">
      {props.children}
    </div>
  )
}
HtCard.Body = Body;

const Footer = props => {
  return (
    <div className="bg-light card-footer">
      {props.children}
    </div>
  )
}
HtCard.Footer = Footer;

export default HtCard;


import { ErrorBoundary } from 'components/Error';
import { HtSpinner } from 'components/UI';
import React, { ReactElement } from 'react';
import { Card, CardHeaderProps, CardProps, Container } from 'react-bootstrap';

interface HeaderProps extends CardHeaderProps {
  title?: string;
  size?: string;
}

interface SpinnerProps extends CardProps {
  message?: string;
}

/**
 * Card with haztrak styling, yeah baby
 * @example
 * <HtCard>
 *   <HtCard.Header title="Card Title!">{top right dropdown button}<HtCard.Header>
 *   <HtCard.Body>Hello World!<HtCard.Body>
 *   <HtCard.Footer>submit button here<HtCard.Footer>
 * </HtCard>
 */
export function HtCard({ className, title, children, ...props }: CardProps): ReactElement {
  const classAttributes = `card shadow-lg bg-white rounded px-0 border-0 ${
    className ? className : ''
  }`;
  return (
    <div {...props} className={classAttributes}>
      {title ? (
        <div className="row d-flex justify-content-start m-1 mb-0">
          <h3 className="mb-0">{title}</h3>
        </div>
      ) : (
        <></>
      )}
      {children}
    </div>
  );
}

/**
 * Card header with Haztrak styling
 * @param {{title: String, children: ReactElement}} props react props
 * @constructor
 * @example
 * <HtCard>
 *   <HtCard.Header title="Card Title!">{top right dropdown button}<HtCard.Header>
 * </HtCard>
 */
HtCard.Header = function ({ children, className, title }: HeaderProps): ReactElement {
  // If the title prop is passed, we use a consistent styling. else,
  // the children/content, and it will be distributed evenly in the header.
  const content = title ? (
    <>
      <p className={`mb-0 fs-5`}>{title}</p>
      {children}
    </>
  ) : (
    <>{children}</>
  );
  return (
    <Card.Header className={`bg-primary text-white rounded-top ${className}`}>
      <div className="d-flex justify-content-between p-1 pt-2">{content}</div>
    </Card.Header>
  );
};

/**
 * Card footer with Haztrak styling
 * @param {{children: ReactElement}} props react props
 * @constructor
 * @example
 * <HtCard>
 *   <HtCard.Footer>Put button here!<HtCard.Footer>
 * </HtCard>
 */
HtCard.Footer = function (props: CardProps): ReactElement {
  return (
    <Card.Footer className={`p-2 bg-light ${props.className}`}>
      <div className="d-flex justify-content-start gap-2">{props.children}</div>
    </Card.Footer>
  );
};

/**
 * Card body with Haztrak styling
 * @example
 * <HtCard>
 *   <HtCard.Body>Hello World!<HtCard.Body>
 * </HtCard>
 */
HtCard.Body = function ({ className, children, ...props }: CardProps): ReactElement {
  return (
    <Card.Body className={className ? `${className}` : ''} {...props}>
      <ErrorBoundary>
        <Container>{children}</Container>
      </ErrorBoundary>
    </Card.Body>
  );
};

/**
 * Card spinner to use while asynchronous promise is in pending state
 * @param {{message: String}} message string to render next to spinner
 * @param {{classname: String}} string class attributes to pass
 * @constructor
 * @example
 * <HtCard.Body>
 *   <HtCard.Spinner message="loading..."/>
 * </HtCard.Body>
 */
HtCard.Spinner = function ({ message, className }: SpinnerProps): ReactElement {
  return <HtSpinner message={message} className={className} />;
};

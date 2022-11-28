import React, { ReactElement } from 'react';
import { Dropdown } from 'react-bootstrap';

interface Props {
  keyName?: string;
  links: {
    name: string;
    path: string;
  }[];
}

/**
 * Simple dropdown menu that takes a list of objects, each with name and path
 * @param links {Object[]} array of link object {name: string, path: string}
 * @param keyName { string } suffix added to a key to ensure uniqueness
 * @constructor
 * @returns {ReactElement}
 * @example
 * <HtDropdown
 * keyName="mySitesDropdown"
 * links={[
 *              { name: 'hello', path: '#/hello' },
 *              { name: 'blah', path: '#/blah' },
 *            ]}
 * />
 */
function HtDropdown({ keyName, links }: Props): ReactElement {
  return (
    <Dropdown>
      <Dropdown.Toggle className="bg-transparent ht-ellipsis shadow-none">
        <i className="fas fa-ellipsis-v fa-sm fa-fw h5 mb-0"></i>
      </Dropdown.Toggle>
      <Dropdown.Menu>
        {links.map((link, index) => {
          return (
            <Dropdown.Item key={index.toString() + keyName} href={link.path}>
              {link.name}
            </Dropdown.Item>
          );
        })}
      </Dropdown.Menu>
    </Dropdown>
  );
}

export default HtDropdown;

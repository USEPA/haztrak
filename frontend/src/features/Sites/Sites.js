import React, { useEffect } from 'react';
import HtCard from '../../components/HtCard';
import { Dropdown } from 'react-bootstrap';
import api from '../../services';
import { Link } from 'react-router-dom';

function Sites() {
  const [sites, setSites] = React.useState();

  useEffect(() => {
    api.get('trak/site', null).then((response) => {
      if (response.length > 0) {
        setSites(response);
      }
    });
  }, []);

  return (
    <>
      <HtCard>
        <HtCard.Header title="My Sites">
          <Dropdown>
            <Dropdown.Toggle className="bg-transparent ht-ellipsis shadow-none">
              <i className="fas fa-ellipsis-v fa-sm fa-fw h5 mb-0"></i>
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item href="#/action-1">Action</Dropdown.Item>
              <Dropdown.Item href="#/action-2">Another action</Dropdown.Item>
              <Dropdown.Item href="#/action-3">Something else</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </HtCard.Header>
        <HtCard.Body>
          {sites ? (
            <ul>
              {sites.map((site, i) => {
                return <li key={i}>{site.name}</li>;
              })}
            </ul>
          ) : (
            <div className="text-muted text-center">
              <p>No sites to display</p>
              <p>
                Add sites to your <Link to="/profile">Profile</Link>
              </p>
            </div>
          )}
        </HtCard.Body>
      </HtCard>
    </>
  );
}

export default Sites;

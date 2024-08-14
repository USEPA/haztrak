import logo from '/assets/img/haztrak-logos/haztrak-logo-zip-file/svg/logo-no-background.svg';
import { faArrowRightFromBracket, faBars, faGear, faUser } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useContext } from 'react';
import { Dropdown } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { NavContext, NavContextProps } from '~/components/Layout/Root';
import { OrgSelect } from '~/components/Org/OrgSelect';
import { useLogoutMutation } from '~/store';

export function TopNav() {
  const { showSidebar, setShowSidebar } = useContext<NavContextProps>(NavContext);
  const [logout] = useLogoutMutation();

  const handleLogout = () => {
    logout();
  };

  const toggleSidebar = () => {
    setShowSidebar(!showSidebar);
  };

  return (
    <nav className="tw-flex tw-items-center tw-justify-between tw-bg-primary tw-px-4">
      <div className="tw-flex tw-items-center">
        <button
          aria-label="toggleSidebarNavigation"
          aria-hidden={false}
          id="sidebarToggle"
          onClick={toggleSidebar}
          className="hover:bg-gray-700 tw-rounded-full tw-border-none tw-bg-transparent tw-text-white"
        >
          <FontAwesomeIcon icon={faBars} />
        </button>
        <Link to="/" className="tw-px-3">
          <img
            src={logo}
            alt="haztrak logo, hazardous waste tracking made easy."
            width={125}
            height={'auto'}
            className="tw-my-3"
          />
        </Link>
      </div>
      <div className="tw-hidden tw-max-w-64 tw-grow md:tw-block">
        <OrgSelect />
      </div>
      <ul className="tw-flex tw-items-center tw-space-x-4">
        <li className="tw-relative">
          <Dropdown>
            <Dropdown.Toggle
              aria-label="userProfileDropDown"
              aria-hidden={false}
              id="navbarDropdown"
              className="tw-border-none tw-bg-transparent tw-text-white"
            >
              <FontAwesomeIcon icon={faUser} />
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item as={Link} to="settings/">
                <FontAwesomeIcon icon={faGear} className="tw-pe-2 tw-text-primary" />
                Settings
              </Dropdown.Item>
              <Dropdown.Item as={Link} to="profile/">
                <FontAwesomeIcon icon={faUser} className="tw-pe-2 tw-text-primary" />
                Profile
              </Dropdown.Item>
              <hr className="tw-border-gray-700" />
              <Dropdown.Item onClick={handleLogout}>
                <FontAwesomeIcon
                  icon={faArrowRightFromBracket}
                  className="tw-text-danger tw-pe-2"
                />
                Logout
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </li>
      </ul>
    </nav>
  );
}

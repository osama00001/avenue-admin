import { useContext } from 'react';
import { DigiContext } from '../../context/DigiContext';
import NavLink from '../router/NavLink';

const PagesPart = () => {
  const {
    pagesState,
    toggleMainPagesDropdown,
    toggleSubPagesDropdown,
    toggleAuthentication,
    toggleError,
    toggleUser,
    layoutPosition,
    dropdownOpen,
    mainPagesRef,
    isExpanded,
    isNavExpanded,
    isSmallScreen,
    toggleAdditional
  } = useContext(DigiContext);
  const { 
    isMainDropdownOpen, 
    isSubDropdownOpen, 
    authentication, 
    user, 
    error,
    additional 
  } = pagesState;
  const handleSubNavLinkClick = () => {
    if (!isSubDropdownOpen) {
      toggleSubPagesDropdown(); // Open the sub-dropdown
    }
  };
  return (
    <li className="sidebar-item" ref={isExpanded || isNavExpanded.isSmall || layoutPosition.horizontal || (layoutPosition.twoColumn && isExpanded) || (layoutPosition.twoColumn && isSmallScreen) ? mainPagesRef : null}>
      <a
        role="button"
        className={`sidebar-link-group-title has-sub ${isMainDropdownOpen ? 'show' : ''}`}
        onClick={toggleMainPagesDropdown}
      >
        Pages
      </a>
      <ul className={`sidebar-link-group ${layoutPosition.horizontal ? (dropdownOpen.pages ? 'd-block' : '') : (isMainDropdownOpen ? 'd-none' : '')}`}>       
        <li className="sidebar-dropdown-item">
          <a
            role="button"
            className={`sidebar-link has-sub ${authentication ? 'show' : ''}`}
            onClick={toggleAuthentication}
          >
            <span className="nav-icon">
              <i className="fa-light fa-user-cog"></i>
            </span>{' '}
            <span className="sidebar-txt">Authentication</span>
          </a>
          <ul className={`sidebar-dropdown-menu ${authentication ? 'd-block' : ''}`}>
            <li className="sidebar-dropdown-item">
              <NavLink href="/login" className="sidebar-link">
                Login 01
              </NavLink>
            </li>
            <li className="sidebar-dropdown-item">
              <NavLink href="/login2" className="sidebar-link">
                Login 02
              </NavLink>
            </li>
            <li className="sidebar-dropdown-item">
              <NavLink href="/login3" className="sidebar-link">
                Login 03
              </NavLink>
            </li>
            <li className="sidebar-dropdown-item">
              <NavLink href="/registration" className="sidebar-link">
                Registration 01
              </NavLink>
            </li>
            <li className="sidebar-dropdown-item">
              <NavLink href="/registration2" className="sidebar-link">
                Registration 02
              </NavLink>
            </li>
            <li className="sidebar-dropdown-item">
              <NavLink href="/resetPassword" className="sidebar-link">
                Reset Password
              </NavLink>
            </li>
            <li className="sidebar-dropdown-item">
              <NavLink href="/updatePassword" className="sidebar-link">
                Update Password
              </NavLink>
            </li>
            <li className="sidebar-dropdown-item">
              <NavLink href="/loginStatus" className="sidebar-link">
                Login Status
              </NavLink>
            </li>
          </ul>
        </li>
        <li className="sidebar-dropdown-item">
          <a
            role="button"
            className={`sidebar-link has-sub ${error ? 'show' : ''}`}
            onClick={toggleError}
          >
            <span className="nav-icon">
              <i className="fa-light fa-triangle-exclamation"></i>
            </span>{' '}
            <span className="sidebar-txt">Error</span>
          </a>
          <ul className={`sidebar-dropdown-menu ${error ? 'd-block' : ''}`}>
            <li className="sidebar-dropdown-item">
              <NavLink href="/error400" className="sidebar-link">
                Error 400
              </NavLink>
            </li>
            <li className="sidebar-dropdown-item">
              <NavLink href="/error403" className="sidebar-link">
                Error 403
              </NavLink>
            </li>
            <li className="sidebar-dropdown-item">
              <NavLink href="/error404" className="sidebar-link">
                Error 404
              </NavLink>
            </li>
            <li className="sidebar-dropdown-item">
              <NavLink href="/error408" className="sidebar-link">
                Error 408
              </NavLink>
            </li>
            <li className="sidebar-dropdown-item">
              <NavLink href="/error500" className="sidebar-link">
                Error 500
              </NavLink>
            </li>
            <li className="sidebar-dropdown-item">
              <NavLink href="/error503" className="sidebar-link">
                Error 503
              </NavLink>
            </li>
            <li className="sidebar-dropdown-item">
              <NavLink href="/error504" className="sidebar-link">
                Error 504
              </NavLink>
            </li>
          </ul>
        </li>
        <li className="sidebar-dropdown-item">
          <a
            role="button"
            className={`sidebar-link has-sub ${user ? 'show' : ''}`}
            onClick={toggleUser}
          >
            <span className="nav-icon">
              <i className="fa-light fa-user"></i>
            </span>{' '}
            <span className="sidebar-txt">User</span>
          </a>
          <ul className={`sidebar-dropdown-menu ${user ? 'd-block' : ''}`}>
            <li className="sidebar-dropdown-item">
              <NavLink href="/profile" className="sidebar-link" onClick={handleSubNavLinkClick}>
                View Profile
              </NavLink>
            </li>
            <li className="sidebar-dropdown-item">
              <NavLink href="/editProfile" className="sidebar-link" onClick={handleSubNavLinkClick}>
                Edit Profile
              </NavLink>
            </li>
          </ul>
        </li>
        <li className="sidebar-dropdown-item">
          <a
            role="button"
            className={`sidebar-link has-sub ${additional ? 'show' : ''}`}
            onClick={toggleAdditional}
          >
            <span className="nav-icon">
              <i className="fa-light fa-square-plus"></i>
            </span>{' '}
            <span className="sidebar-txt">Additional</span>
          </a>
          <ul className={`sidebar-dropdown-menu ${additional ? 'd-block' : ''}`}>
            <li className="sidebar-dropdown-item">
              <NavLink href="/comingSoon" className="sidebar-link">
              Coming Soon 01
              </NavLink>
            </li>
            <li className="sidebar-dropdown-item">
              <NavLink href="/comingSoon2" className="sidebar-link">
              Coming Soon 02
              </NavLink>
            </li>
            <li className="sidebar-dropdown-item">
              <NavLink href="/pricingTable" className="sidebar-link">
              Pricing Table 01
              </NavLink>
            </li>
            <li className="sidebar-dropdown-item">
              <NavLink href="/pricingTable2" className="sidebar-link">
              Pricing Table 02
              </NavLink>
            </li>
            <li className="sidebar-dropdown-item">
              <NavLink href="/underConstruction" className="sidebar-link">
              Under Construction
              </NavLink>
            </li>
          </ul>
        </li>
        <li className="sidebar-dropdown-item">
          <NavLink href="/utility" className="sidebar-link">
            <span className="nav-icon">
              <i className="fa-light fa-layer-group"></i>
            </span>{' '}
            <span className="sidebar-txt">Utility</span>
          </NavLink>
        </li>
      </ul>
    </li>
  );
};

export default PagesPart;

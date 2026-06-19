import React, { useContext} from 'react';
import { DigiContext } from '../../context/DigiContext';
import NavLink from '../router/NavLink';

const AppsPart = () => {
  const { 
    state, 
    toggleCrmDropdown, 
    toggleHrmDropdown, 
    toggleEcommerceDropdown, 
    toggleMainDropdown, 
    toggleSubDropdown,
    layoutPosition, 
    dropdownOpen,
    mainAppsDropdownRef,
    isExpanded,
    isNavExpanded,
    isSmallScreen
  } = useContext(DigiContext);
  const { 
    isMainDropdownOpen, 
    isCrmDropdownOpen, 
    isHrmDropdownOpen, 
    isEcommerceDropdownOpen, 
    isSubDropdownOpen 
  } = state;
  
  const handleSubNavLinkClick = () => {
    if (!isSubDropdownOpen) {
      toggleSubDropdown(); // Open the sub-dropdown
    }
  };
  return (
    <li className="sidebar-item" ref={isExpanded || isNavExpanded.isSmall || layoutPosition.horizontal || (layoutPosition.twoColumn && isExpanded) || (layoutPosition.twoColumn && isSmallScreen) ? mainAppsDropdownRef : null}>
      <a
        role="button"
        className={`sidebar-link-group-title has-sub ${isMainDropdownOpen ? 'show' : ''}`}
        onClick={toggleMainDropdown}
      >
        Apps
      </a>
      <ul className={`sidebar-link-group 
      ${layoutPosition.horizontal ? (dropdownOpen.apps ? 'd-block' : 'd-none') : (isMainDropdownOpen ? 'd-none' : '')}
      `}>       

        <li className="sidebar-dropdown-item" >
          <a
            role="button"
            className={`sidebar-link has-sub ${isCrmDropdownOpen ? 'show' : ''}`}
            onClick={toggleCrmDropdown}
          >
            <span className="nav-icon">
              <i className="fa-light fa-user-headset"></i>
            </span>{' '}
            <span className="sidebar-txt">CRM</span>
          </a>
          <ul
            className={`sidebar-dropdown-menu ${
              isCrmDropdownOpen && isSubDropdownOpen ? 'd-block' : ''
            }`}
            id="crmDropdown"
           
          >

            <li className="sidebar-dropdown-item">
              <NavLink href="/audience" className="sidebar-link" onClick={handleSubNavLinkClick}>
                Target Audience
              </NavLink>
            </li>
            <li className="sidebar-dropdown-item">
              <NavLink href="/company" className="sidebar-link" onClick={handleSubNavLinkClick}>
                Company
              </NavLink>
            </li>
            <li className="sidebar-dropdown-item">
              <NavLink href="/task" className="sidebar-link" onClick={handleSubNavLinkClick}>
                Task
              </NavLink>
            </li>
            <li className="sidebar-dropdown-item">
              <NavLink href="/leads" className="sidebar-link" onClick={handleSubNavLinkClick}>
                Leads
              </NavLink>
            </li>
            <li className="sidebar-dropdown-item">
              <NavLink href="/customer" className="sidebar-link" onClick={handleSubNavLinkClick}>
                Customer
              </NavLink>
            </li>
          </ul>
        </li>
        <li className="sidebar-dropdown-item">
          <a
            role="button"
            className={`sidebar-link has-sub ${isHrmDropdownOpen ? 'show' : ''}`}
            onClick={toggleHrmDropdown}
          >
            <span className="nav-icon">
              <i className="fa-light fa-user-tie"></i>
            </span>{' '}
            <span className="sidebar-txt">HRM</span>
          </a>
          <ul
            className={`sidebar-dropdown-menu ${
              isHrmDropdownOpen && isSubDropdownOpen ? 'd-block' : ''
            }`}
            id="hrmDropdown"
          >
            <li className="sidebar-dropdown-item">
              <NavLink href="/addEmployee" className="sidebar-link" onClick={handleSubNavLinkClick}>
                Add Employee
              </NavLink>
            </li>
            <li className="sidebar-dropdown-item">
              <NavLink href="/allEmployee" className="sidebar-link" onClick={handleSubNavLinkClick}>
                All Employee
              </NavLink>
            </li>
            <li className="sidebar-dropdown-item">
              <NavLink href="/attendance" className="sidebar-link" onClick={handleSubNavLinkClick}>
                Attendance
              </NavLink>
            </li>
          </ul>
        </li>
        <li className="sidebar-dropdown-item">
          <a
            role="button"
            className={`sidebar-link has-sub ${isEcommerceDropdownOpen ? 'show' : ''}`}
            onClick={toggleEcommerceDropdown}
          >
            <span className="nav-icon">
              <i className="fa-light fa-cart-shopping-fast"></i>
            </span>{' '}
            <span className="sidebar-txt">eCommerce</span>
          </a>
          <ul
            className={`sidebar-dropdown-menu ${
              isEcommerceDropdownOpen && isSubDropdownOpen ? 'd-block' :''
            }`}
            id="ecommerceDropdown"

          >
            <li className="sidebar-dropdown-item">
              <NavLink href="/allCustomer" className="sidebar-link" onClick={handleSubNavLinkClick}>
                All Customer
              </NavLink>
            </li>
            <li className="sidebar-dropdown-item">
              <NavLink href="/addNewProduct" className="sidebar-link" onClick={handleSubNavLinkClick}>
                Add Product
              </NavLink>
            </li>
            <li className="sidebar-dropdown-item">
              <NavLink href="/allProduct" className="sidebar-link" onClick={handleSubNavLinkClick}>
                All Product
              </NavLink>
            </li>
            <li className="sidebar-dropdown-item">
              <NavLink href="/category" className="sidebar-link" onClick={handleSubNavLinkClick}>
                Category
              </NavLink>
            </li>
            <li className="sidebar-dropdown-item">
              <NavLink href="/order" className="sidebar-link" onClick={handleSubNavLinkClick}>
                Order
              </NavLink>
            </li>
          </ul>
        </li>
        <li className="sidebar-dropdown-item">
          <NavLink href="/calendar" className="sidebar-link">
            <span className="nav-icon">
              <i className="fa-light fa-calendar"></i>
            </span>{' '}
            <span className="sidebar-txt">Calendar</span>
          </NavLink>
        </li>
        <li className="sidebar-dropdown-item">
          <NavLink href="/chat" className="sidebar-link">
            <span className="nav-icon">
              <i className="fa-light fa-messages"></i>
            </span>{' '}
            <span className="sidebar-txt">Chat</span>
          </NavLink>
        </li>
        <li className="sidebar-dropdown-item">
          <NavLink href="/email" className="sidebar-link">
            <span className="nav-icon">
              <i className="fa-light fa-envelope"></i>
            </span>{' '}
            <span className="sidebar-txt">Email</span>
          </NavLink>
        </li>
        <li className="sidebar-dropdown-item">
          <NavLink href="/invoices" className="sidebar-link">
            <span className="nav-icon">
              <i className="fa-light fa-file-invoice"></i>
            </span>{' '}
            <span className="sidebar-txt">Invoices</span>
          </NavLink>
        </li>
        <li className="sidebar-dropdown-item">
          <NavLink href="/contacts" className="sidebar-link">
            <span className="nav-icon">
              <i className="fa-light fa-user-plus"></i>
            </span>{' '}
            <span className="sidebar-txt">Contacts</span>
          </NavLink>
        </li>
      </ul>
    </li>
  );
};

export default AppsPart;

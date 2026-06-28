import { useContext, useEffect, useRef } from 'react';
import { DigiContext } from '../../context/DigiContext';
import Link from 'next/link';
import { useRouter } from 'next/router';

const HeaderProfile = () => {
    const router = useRouter();
    const {
      isProfileSidebarOpen, 
      handleProfileDropdownCheckboxChange, 
      handleProfileSidebarCheckboxChange
    } = useContext(DigiContext)
    const profileDropdownRef = useRef(null);

    const handleLogout = async (e) => {
      e.preventDefault();
      await fetch('/api/auth/logout', { method: 'POST' });
      router.push('/login');
    };

    // Effect to add event listener when the component mounts
    useEffect(() => {
      const handleClickOutside = (event) => {
        if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target)) {
          handleProfileDropdownCheckboxChange();
        }
      };
  
      if (isProfileSidebarOpen.dropdown) {
        document.addEventListener('mousedown', handleClickOutside);
      }
  
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }, [isProfileSidebarOpen.dropdown, handleProfileDropdownCheckboxChange]);
  return (
    <div className="header-btn-box" ref={profileDropdownRef}>
      <div className="profile-btn-wrapper">
        <button
          className={`profile-btn ${isProfileSidebarOpen.dropdown ? 'show' : ''}`}
          id="profileDropdown"
          onClick={
            isProfileSidebarOpen.sidebar
              ? handleProfileSidebarCheckboxChange
              : handleProfileDropdownCheckboxChange
          }
        >
          <img src="/assets/images/admin.png" alt="image" />
        </button>
        {isProfileSidebarOpen.dropdown && (
          <ul className={`dropdown-menu ${isProfileSidebarOpen.dropdown? 'show':''}`} aria-labelledby="profileDropdown">
            <li>
              <div className="dropdown-txt text-center">
                <p className="mb-0">John Doe</p>
                <span className="d-block">Web Developer</span>
                <div className="d-flex justify-content-center">
                  <div className="form-check pt-3">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id="seeProfileAsSidebar"
                        checked={isProfileSidebarOpen.sidebar}
                        onChange={handleProfileSidebarCheckboxChange}
                      />
                      <label className="form-check-label" htmlFor="seeProfileAsSidebar">See as sidebar</label>
                  </div>
                </div>
              </div>
            </li>
            <li>
              <Link className="dropdown-item" href="/profile">
                <span className="dropdown-icon"><i className="fa-regular fa-circle-user"></i></span> Profile
              </Link>
            </li>
            <li>
              <Link className="dropdown-item" href="/chat">
                <span className="dropdown-icon"><i className="fa-regular fa-message-lines"></i></span> Message
              </Link>
            </li>
            <li>
              <Link className="dropdown-item" href="/task">
                <span className="dropdown-icon"><i className="fa-regular fa-calendar-check"></i></span> Taskboard
              </Link>
            </li>
            <li>
              <Link className="dropdown-item" href="#">
                <span className="dropdown-icon"><i className="fa-regular fa-circle-question"></i></span> Help
              </Link>
            </li>
            <li>
              <hr className="dropdown-divider" />
            </li>
            <li>
              <Link className="dropdown-item" href="/editProfile">
                <span className="dropdown-icon"><i className="fa-regular fa-gear"></i></span> Settings
              </Link>
            </li>
            <li>
              <Link className="dropdown-item" href="/login" onClick={handleLogout}>
                <span className="dropdown-icon"><i className="fa-regular fa-arrow-right-from-bracket"></i></span> Logout
              </Link>
            </li>
          </ul>
        )}
      </div>
    </div>
  );
};

export default HeaderProfile;

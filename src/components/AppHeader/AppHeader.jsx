import React, { useContext } from "react";
import {
  Header,
  HeaderContainer,
  HeaderName,
  HeaderNavigation,
  HeaderMenu,
  HeaderMenuButton,
  HeaderMenuItem,
  HeaderGlobalBar,
  HeaderGlobalAction,
  SkipToContent,
  SideNav,
  SideNavItems,
  HeaderSideNavItems,
} from "@carbon/react";
import {
  Notification,
  Logout,
  Login,
} from "@carbon/icons-react";
import { Link } from "react-router-dom";

import authService from "../../modules/auth/auth.service";

import { GlobalContext } from "../../App.jsx";

const AppHeader = () => {
  const ctx = useContext(GlobalContext);

  const { user } = ctx;

  const handleLogoutClick = async (event) => {
    event.preventDefault();
    await authService.logout();
  };

  return (
    <HeaderContainer
      render={({ isSideNavExpanded, onClickSideNavExpand }) => (
        <Header aria-label="WePresto Admin">
          <SkipToContent />
          {user && (
            <HeaderMenuButton
              aria-label="Open menu"
              onClick={onClickSideNavExpand}
              isActive={isSideNavExpanded}
            />
          )}
          <HeaderName element={Link} to={user ? "/home" : "/"} prefix="We">
            Presto Admin
          </HeaderName>

          {user && (
            <HeaderNavigation aria-label="WePresto Admin">
              <HeaderMenu aria-label="Web links" menuLinkName="Links">
                <HeaderMenuItem element={Link} to="/users">
                  Users
                </HeaderMenuItem>
              </HeaderMenu>
            </HeaderNavigation>
          )}

          {user && (
            <SideNav
              aria-label="Side navigation"
              expanded={isSideNavExpanded}
              isPersistent={false}
            >
              <SideNavItems>
                <HeaderSideNavItems>
                  <HeaderMenuItem element={Link} to="/users">
                    Users
                  </HeaderMenuItem>
                </HeaderSideNavItems>
              </SideNavItems>
            </SideNav>
          )}

          {user && (
            <HeaderGlobalBar>
              <HeaderGlobalAction
                aria-label="Notificaciones"
                tooltipAlignment="center"
              >
                <Notification size={20} />
              </HeaderGlobalAction>
              <HeaderGlobalAction
                aria-label="Salir"
                tooltipAlignment="end"
                onClick={handleLogoutClick}
              >
                <Logout size={20} />
              </HeaderGlobalAction>
            </HeaderGlobalBar>
          )}

          {!user && (
            <HeaderGlobalBar>
              <HeaderGlobalAction
                aria-label="Inicia sesión"
                tooltipAlignment="center"
              >
                <Link to="/login">
                  <Login size={20} />
                </Link>
              </HeaderGlobalAction>
            </HeaderGlobalBar>
          )}
        </Header>
      )}
    />
  );
};

export default AppHeader;

/*
  © Copyright IBM Corporation 2023. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import React, { useContext } from 'react';
import { Content, SideNav, SideNavItems, SideNavLink, SideNavMenu } from 'carbon-components-react';
import { Link, Outlet } from 'react-router-dom';
import { ApplicationContext } from '../context/ApplicationContext';
import { isViewAllowed } from '../services/SessionService';
import * as CarbonIcons from '@carbon/icons-react';
import { VIEW, VIEW_MULTI, VIEW_SINGLE, VIEW_TYPE } from '../types/View';

const getCarbonIcon = (icon: string | undefined) => {
  // @ts-ignore
  const RET_VAL = CarbonIcons[icon];
  return RET_VAL;
};
const createSingleViewSideNavItem = (view: VIEW_SINGLE) => {

  if (!isViewAllowed(view.component)) {
    return <></>
  }

  const ICON = getCarbonIcon(view.icon);

  return <SideNavLink
    // @ts-ignore
    element={Link}
    to={view.path}
    renderIcon={ICON}>
    {view.name}
  </SideNavLink>
}

const createMultiViewSideNavItem = (view: VIEW_MULTI) => {
  const NAV_LINKS = view.views.map((view: VIEW_SINGLE) => createSingleViewSideNavItem(view));

  if (!NAV_LINKS.some(el => el.type !== React.Fragment)) {
    return <></>
  }

  const ICON = getCarbonIcon(view.icon);

  return <SideNavMenu
    title={view.name}
    renderIcon={ICON}>
    {NAV_LINKS}
  </SideNavMenu>
}

const createSideNavItem = {
  [VIEW_TYPE.SINGLE_VIEW]: (view: any) => createSingleViewSideNavItem(view),
  [VIEW_TYPE.MULTI_VIEW]: (view: any) => createMultiViewSideNavItem(view)
}

const Layout = () => {

  const { session }: any = useContext(ApplicationContext);
  const VIEWS: any[] = session?.application?.configuration?.views ?? [];

  return <>
    <SideNav
      className="side-nav"
      isFixedNav
      expanded={true}
      isChildOfHeader={false}
      aria-label="side-nav">
      <SideNavItems>
        {
          VIEWS.map((view: VIEW) => {
            return createSideNavItem[view.type](view)
          })
        }
      </SideNavItems>
    </SideNav>
    <Content>
      <Outlet />
    </Content>
  </>;
}

export default Layout;

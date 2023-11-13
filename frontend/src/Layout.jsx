import React from 'react';
import {AppShell} from "@mantine/core";
import App from './App';
import NavigationMenu from './components/NavigationMenu';

function Layout() {
  return (
    <AppShell header={{height: 60}}>
        <AppShell.Header withBorder={true}>
            <NavigationMenu/>
        </AppShell.Header>
        <AppShell.Main>
            <App/>
        </AppShell.Main>
    </AppShell>
  )
}

export default Layout
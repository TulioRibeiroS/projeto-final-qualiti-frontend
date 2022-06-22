import { BrowserRouter, Switch, Route } from "react-router-dom";

import Home from './pages/home';

const routes = [{
    path: "/",
    name: "Home",
    visible: false,
    Component: Home,
}];

const Router = () => (
    <BrowserRouter>
        <Layout routes={routes}>
            <Switch>
                {routes.map((route, index) => (
                    <Route 
                        component={route.component}
                        exact
                        key={index}
                        path={route.path}
                    />
                ))}
            </Switch>
        </Layout>
    </BrowserRouter>);

export default Router;

import { BrowserRouter, Switch, Route } from "react-router-dom";
// import { BrowserRouter as Router, Switch, Route} from "react-router-dom";

import Home from "./pages/Home";
import Layout from "./components/Layout";
import Courses from "./pages/Courses";
import Departament from "./pages/Departament";
import Professor from "./pages/Professor";
import Allocation from "./pages/Allocation";

const routes = [
  {
    path: "/",
    name: "Home",
    visible: false,
    component: Home,
  },
  {
    path: "/courses",
    name: "Courses",
    component: Courses,
  },
  {
    path: "/professor",
    name: "Professor",
    component: Professor,
  },
  {
    path: "/departament",
    name: "Departament",
    component: Departament,
  },
  {
    path: "/allocations",
    name: "Allocations",
    component: Allocation,
  },
];

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
  </BrowserRouter>
);

export default Router;

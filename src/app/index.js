import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect
} from "react-router-dom";
import { Provider } from "react-redux";

import {
  Products,
  PageNotFound,
  Cart,
  Favorites,
  SingleProduct
} from "./pages";
import { Layout } from "./components";
import { useFetch } from "./hooks";
import store from "./state";
import { ROUTES } from "../constants";

function onError() {
  return "Oops! No products found";
}

function onSuccess(payload) {
  store.dispatch({ type: "SET_PRODUCTS", payload });

  return payload;
}

function App() {
  const { loading: isLoading, products, error } = useFetch({
    onError,
    onSuccess,
    src: "https://boiling-reaches-93648.herokuapp.com/food-shop/products",
    initialState: [],
    dataKey: "products"
  });

  return (
    <Provider store={store}>
      <Router>
        <Layout>
          <Switch>
            <Route
              path={ROUTES.defaultPage}
              exact
              render={() => <Products isLoading={isLoading} error={error} />}
            />
            <Route path={ROUTES.cart} exact component={Cart} />
            <Route path={ROUTES.favorites} exact component={Favorites} />
            <Route
              path={ROUTES.product}
              exact
              render={props => {
                const { id } = props.match.params;
                const product = products.find(product => product.id === id);

                return (
                  <SingleProduct
                    {...props}
                    product={product}
                    isLoading={isLoading}
                  />
                );
              }}
            />
            <Redirect exact from={ROUTES.home} to={ROUTES.defaultPage} />
            <Route component={PageNotFound} />
          </Switch>
        </Layout>
      </Router>
    </Provider>
  );
}

export default App;

import { Route } from "react-router-dom";
import PrecedentSearchPage from "./PrecedentSearcPage";
import PrecedentDetailPage from "./PrecedentDetailPage";

const PrecedentRoutes = [
  <Route
    key="prec-s"
    path="/precedent/search"
    element={<PrecedentSearchPage />}
  />,
  <Route
    key="prec-d"
    path="/precedent/detail/:id"
    element={<PrecedentDetailPage />}
  />,
];

export default PrecedentRoutes;

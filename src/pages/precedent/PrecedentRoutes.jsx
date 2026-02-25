import { Route } from "react-router-dom";
import PrecedentSearchPage from "./PrecedentSearcPage";
import PrecedentDetailPage from "./PrecedentDetailPage";

const PrecedentRoutes = [
  <Route
    key="prec-s"
    path="/precedent/search.do"
    element={<PrecedentSearchPage />}
  />,
  <Route
    key="prec-d"
    path="/precedent/detail.do"
    element={<PrecedentDetailPage />}
  />,
];

export default PrecedentRoutes;

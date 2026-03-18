import { Route } from "react-router-dom";
import PrecedentListPage from "./PrecedentListPage";
import PrecedentDetailPage from "./PrecedentDetailPage";

const PrecedentRoutes = [
  <Route
    key="prec-s"
    path="/precedent/search"
    element={<PrecedentListPage />}
  />,
  <Route
    key="prec-d"
    path="/precedent/detail/:id"
    element={<PrecedentDetailPage />}
  />,
];

export default PrecedentRoutes;

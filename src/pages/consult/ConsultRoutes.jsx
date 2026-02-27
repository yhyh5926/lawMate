import { Route } from "react-router-dom";
import ConsultReservePage from "./ConsultReservePage";
import PaymentPage from "./PaymentPage";

const ConsultRoutes = [
  <Route
    key="prec-s"
    path="/consult/researve.do"
    element={<ConsultReservePage />}
  />,
  <Route key="prec-d" path="/payment/pay.do" element={<PaymentPage />} />,
];

export default ConsultRoutes;

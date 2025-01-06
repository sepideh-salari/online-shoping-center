import { Route, Routes, BrowserRouter as Router } from "react-router-dom";
import ProductList from "../pages/ProductList";
import Signup from "../pages/Signup";
import Login from "../pages/Login";
import PageNotFound from "../pages/PageNotFound";
function AppRouter() {
  return (
    <Router>
      <Routes>
        <Route path="/signup" element={<Signup />} />
        <Route path="/products" element={<ProductList />} />
        <Route path="*" element={<PageNotFound />} />
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Login />} />
      </Routes>
    </Router>
  );
}

export default AppRouter;

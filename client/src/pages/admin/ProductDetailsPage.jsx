import { useLocation, useNavigate, useParams } from "react-router-dom";
import ProductViewModal from "../../components/admin/ProductViewModal";
import { useAdmin } from "../../context/AdminContext";

const ProductDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { refreshProducts } = useAdmin();

  const returnTo = location.state?.from || "/admin/inventory";

  return (
    <ProductViewModal
      productId={id}
      startInEdit={Boolean(location.state?.edit)}
      onChanged={refreshProducts}
      onClose={() => navigate(returnTo)}
    />
  );
};

export default ProductDetailsPage;

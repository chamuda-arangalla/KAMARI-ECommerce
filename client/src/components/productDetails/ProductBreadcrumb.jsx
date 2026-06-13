import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";

export default function ProductBreadcrumb({ product }) {
  const collection = product.setName || product.collection;

  return (
    <nav className="pd-breadcrumb">
      <Link to="/">Home</Link>
      <ChevronRight size={13} />
      <Link to="/shop">Shop</Link>
      <ChevronRight size={13} />
      <Link to={`/collections?category=${encodeURIComponent(collection)}`}>
        {collection}
      </Link>
      <ChevronRight size={13} />
      <span>{product.name}</span>
    </nav>
  );
}

import { Link } from "react-router-dom";
import { IconBag, IconStar } from "./Icons.jsx";
import { useCart } from "../context/CartContext.jsx";
import { categoryLabel } from "../data/categories.js";
import "./ProductCard.css";

export default function ProductCard({ product }) {
  const { addItem } = useCart();
  const price = product.onSale ? product.salePrice : product.price;
  const lowStock = product.stock <= 6;

  return (
    <article className="product-card">
      <Link to={`/product/${product.id}`} className="product-card-media">
        <img src={product.image} alt={product.name} loading="lazy" />
        <div className="product-card-badges">
          {product.onSale && <span className="badge badge--sale">Sale</span>}
          {product.isNew && !product.onSale && <span className="badge badge--new">New</span>}
        </div>
        <span className="product-card-quickadd">View details</span>
      </Link>

      <div className="product-card-body">
        <p className="product-card-category">{categoryLabel(product.category)}</p>
        <h3 className="product-card-name">
          <Link to={`/product/${product.id}`}>{product.name}</Link>
        </h3>

        <div className="product-card-rating" aria-label={`${product.rating} out of 5 stars, ${product.reviews} reviews`}>
          {Array.from({ length: 5 }).map((_, i) => (
            <IconStar key={i} filled={i < Math.round(product.rating)} />
          ))}
          <span>({product.reviews})</span>
        </div>

        <div className="product-card-footer">
          <div className="product-card-price">
            <span className="price-current">${price.toFixed(2)}</span>
            {product.onSale && <span className="price-was">${product.price.toFixed(2)}</span>}
          </div>

          <button
            className="btn btn--primary btn--sm add-to-cart-btn"
            onClick={() => addItem(product, 1)}
            disabled={product.stock === 0}
          >
            <IconBag />
            {product.stock === 0 ? "Sold out" : "Add"}
          </button>
        </div>

        {lowStock && product.stock > 0 && (
          <p className="product-card-stock">Only {product.stock} left</p>
        )}
      </div>
    </article>
  );
}

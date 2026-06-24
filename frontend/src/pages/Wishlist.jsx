import { useWishlist } from "../context/WishlistContext";
import ProductCard from "../components/product/ProductCard";

const Wishlist = () => {
  const { wishlist } = useWishlist();

  return (
    <div className="container-custom py-10">
      <h1 className="text-3xl font-bold mb-8">My Wishlist</h1>

      {wishlist.length === 0 ? (
        <p>No items in wishlist</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {wishlist.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Wishlist;
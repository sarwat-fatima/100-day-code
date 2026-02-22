import { useContext } from "react";
import { FavoritesContext } from "../Components/context/FavoritesContext";
import PropertyCard from "../Components/PropertyCard";

function Favorites() {
    const { favorites } = useContext(FavoritesContext);

    if (favorites.length === 0) {
        return (
            <div className="container">
                <p>No Favorites added yet.</p>
            </div>
        );
    }
    return (
        <div className="container">
            <h2>My Favorites</h2>
            <div className="property-grid">
                {favorites.map((property) => (
                    <PropertyCard key={property.id} property={property} />
                ))}
            </div>
        </div>
    );
}
export default Favorites;

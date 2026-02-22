import { useContext } from "react";
import { FavoritesContext } from "./context/FavoritesContext";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import "./PropertyCard.css";

function PropertyCard({ property }) {
    const { favorites, toggleFavorite } = useContext(FavoritesContext);

    const isFavorite = favorites.find(
        (item) => item.id === property.id
    );

    return (
        <div className="property-card">
            <div className="image-wrapper">
                <img
                    src={property.image}
                    alt={property.title}
                    className="property-image"
                />

                <div
                    className={`heart-icon ${isFavorite ? "active" : ""}`}
                    onClick={() => toggleFavorite(property)}
                >
                    {isFavorite ? <FaHeart /> : <FaRegHeart />}
                </div>
            </div>

            <div className="property-content">
                <h3>{property.title}</h3>
                <p className="property-price">${property.price}</p>
                <p className="property-location">{property.location}</p>
            </div>
        </div>
    );
}

export default PropertyCard;

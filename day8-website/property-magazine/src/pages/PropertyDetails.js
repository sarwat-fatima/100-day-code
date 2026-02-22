import { useParams } from "react-router-dom";
import properties from "../data/properties";
import { useContext } from "react";
import { FavoritesContext } from "../Components/context/FavoritesContext";
import "./PropertyDetails.css";

function PropertyDetails() {
    const { toggleFavorite } = useContext(FavoritesContext);
    const { id } = useParams();
    const property = properties.find((item) => item.id === parseInt(id, 10));

    if (!property) {
        return <p>Property not found.</p>;
    }
    return (
        <div className="details-container">
            <img
                src={property.image}
                alt={property.title}
                className="details-image"
            />

            <div className="details-info">
                <h2>{property.title}</h2>
                <p className="details-price">${property.price}</p>
                <p className="details-location">{property.location}</p>
                <p className="details-description">{property.description}</p>

                <button
                    className="contact-btn"
                    onClick={() => toggleFavorite(property)}
                >
                    ❤️ Add to Favorites
                </button>
            </div>
        </div>
    );
}
export default PropertyDetails;

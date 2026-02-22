import { createContext, useEffect, useState } from "react";

export const FavoritesContext = createContext();

export function FavoritesProvider({ children}) {
     const [favorites, setFavorites] = useState(() => {
    const saved = localStorage.getItem("favorites");
    return saved ? JSON.parse(saved) : [];
     }    
    );
    useEffect(() => {
        localStorage.setItem("favorites", JSON.stringify(favorites));
    }, [favorites]);
const toggleFavorite = (property) => {
  setFavorites((prevFavorites) => {
    const exists = prevFavorites.find(
      (item) => item.id === property.id
    );

    if (exists) {
      return prevFavorites.filter(
        (item) => item.id !== property.id
      );
    } else {
      return [...prevFavorites, property];
    }
  });
};
    return (
        <FavoritesContext.Provider value={{ favorites, toggleFavorite }}>
            {children}
        </FavoritesContext.Provider>
    );
}

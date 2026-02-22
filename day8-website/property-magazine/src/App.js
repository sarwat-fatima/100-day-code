import Navbar from "./Components/Navbar"; 
import Hero from "./Components/Hero";
import properties from "./data/properties";
import PropertyCard from "./Components/PropertyCard";
import { useState } from "react";
import Favorites from "./pages/Favorites";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import PropertyDetails from "./pages/PropertyDetails";
import Footer from "./Components/footer";
import "./Components/Home.css";
function App() {
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [bedroomFilter, setBedroomFilter] = useState("all");
  const [MinPrice, setMinPrice] = useState(""); 
  const [MaxPrice, setMaxPrice] = useState("");
  const [sortOption, setSortOption] = useState("default");
  const filteredProperties = properties.filter((property) =>{
    const matchesSearch = property.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === "all" || property.type === typeFilter;
    const matchesBedroom = bedroomFilter === "all" || (bedroomFilter === "4" ? property.bedrooms >= 4 : property.bedrooms === parseInt(bedroomFilter));
    const matchesMinPrice = MinPrice === "" || property.price >= parseInt(MinPrice);
    const matchesMaxPrice = MaxPrice === "" || property.price <= parseInt(MaxPrice);

    return matchesSearch && matchesType && matchesBedroom && matchesMinPrice && matchesMaxPrice;  }
  );
  let sortedProperties = [...filteredProperties];
  if (sortOption === "priceLow") {
    sortedProperties.sort((a, b) => a.price - b.price);
  } else if (sortOption === "priceHigh") {
    sortedProperties.sort((a, b) => b.price - a.price);
  } else if (sortOption === "bedrooms") {
    sortedProperties.sort((a, b) => b.bedrooms - a.bedrooms);
  }
  return (
   
      <Router><Navbar />
      <Routes><Route path="/property/:id" element={<PropertyDetails />} />
      <Route path="/favorites" element={<Favorites />} />
        <Route path="/" element={
          <>      <Hero searchTerm={searchTerm} setSearchTerm={setSearchTerm} typeFilter={typeFilter} setTypeFilter={setTypeFilter} bedroomFilter={bedroomFilter} setBedroomFilter={setBedroomFilter} MinPrice={MinPrice} setMinPrice={setMinPrice} MaxPrice={MaxPrice} setMaxPrice={setMaxPrice} sortOption={sortOption} setSortOption={setSortOption} />
      
      {sortedProperties.length === 0 ? (
      <p>No properties found. Try adjusting filters.</p>
      ) : (
      <div className="container">
        <div className="property-grid">
          {sortedProperties.map((property) => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>
      </div>
)}</>
        }/></Routes>
        <Footer />

        </Router>
      

    
  );
}
export default App;

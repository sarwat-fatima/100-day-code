import "./Hero.css";

function Hero({ searchTerm, setSearchTerm, typeFilter, setTypeFilter, bedroomFilter, setBedroomFilter, MinPrice, setMinPrice, MaxPrice, setMaxPrice, sortOption, setSortOption }) {
    return (
        <div className="hero">
            <div className="hero-content">
                <h1>Find Your Dream Property</h1>
                <div className="filters">
                    <input type="text" placeholder="Search by location..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}/>
                    <button>Search</button>
                    <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)}>
                        <option value="all">All</option>
                        <option value="rent">Rent</option>
                        <option value="sale">Sale</option>
                    </select>
                    <select value={bedroomFilter} onChange={(e) => setBedroomFilter(e.target.value)}>
                        <option value="all">All Bedrooms</option>
                        <option value="1">1 Bedroom</option>
                        <option value="2">2 Bedrooms</option>
                        <option value="3">3 Bedrooms</option>
                        <option value="4">4+ Bedrooms</option>
                    </select>
                    <input type="number" placeholder="Min Price" value={MinPrice} onChange={(e) => setMinPrice(e.target.value)}/>
                    <input type="number" placeholder="Max Price" value={MaxPrice} onChange={(e) => setMaxPrice(e.target.value)}/>
                    <select value={sortOption} onChange={(e) => setSortOption(e.target.value)}>
                        <option value="default">Default</option>
                        <option value="priceLow">Price: Low to High</option>
                        <option value="priceHigh">Price: High to Low</option>
                        <option value="bedrooms">Bedrooms</option>
                    </select>
                </div>
            </div>
        </div>
    );
}
export default Hero;

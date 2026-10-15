import SearchBar from "../components/SearchBar";
import FilterPanel from "../components/FilterPanel";
import PackageList from "../components/PackageList";

function Packages({
  packages,
  search,
  setSearch,
  destination,
  setDestination,
  duration,
  setDuration,
  budget,
  setBudget,
  rating,
  setRating,
  travelDates,
  setTravelDates,
  onViewDetails,
  onAddToCart,
  loading,
  error,
}) {
  return (
    <main className="packages-page">

      <div className="packages-intro">

        <p>PLAN YOUR ESCAPE</p>

        <h1>
          Find your next
          <span> adventure.</span>
        </h1>

        <p>
          Search, filter and choose a journey
          that feels right for you.
        </p>

      </div>

      <section className="package-search-section">

        <SearchBar
          search={search}
          setSearch={setSearch}
        />

        <FilterPanel
          destination={destination}
          setDestination={setDestination}
          duration={duration}
          setDuration={setDuration}
          budget={budget}
          setBudget={setBudget}
          rating={rating}
          setRating={setRating}
        />

      </section>

      <section className="packages-list-section">

        {loading ? (
          <div className="no-results">
            <span>⏳</span>
            <h2>Loading packages...</h2>
            <p>
              Please wait while we fetch travel packages.
            </p>
          </div>
        ) : error ? (
          <div className="no-results">
            <span>⚠️</span>
            <h2>Unable to load packages</h2>
            <p>{error}</p>
          </div>
        ) : (
          <>
            <div className="results-heading">
              <div>
                <p>AVAILABLE JOURNEYS</p>
                <h2>Choose your escape</h2>
              </div>

              <span>
                {packages.length} packages
              </span>
            </div>

            <PackageList
              packages={packages}
              travelDates={travelDates}
              setTravelDates={setTravelDates}
              onViewDetails={onViewDetails}
              onAddToCart={onAddToCart}
            />
          </>
        )}

      </section>

    </main>
  );
}

export default Packages;
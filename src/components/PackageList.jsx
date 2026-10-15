import PackageCard from "./PackageCard";

function PackageList({
  packages,
  travelDates,
  setTravelDates,
  onViewDetails,
  onAddToCart,
}) {
  if (packages.length === 0) {
    return (
      <div className="no-results">
        <span>🧭</span>
        <h2>No travel packages found</h2>
        <p>
          No packages available for the selected criteria.
        </p>
      </div>
    );
  }

  return (
    <div className="package-grid">

      {packages.map((item) => (
        <PackageCard
          key={item.id}
          packageData={item}
          travelDate={travelDates[item.id] || ""}
          setTravelDate={(date) =>
            setTravelDates({
              ...travelDates,
              [item.id]: date,
            })
          }
          onViewDetails={onViewDetails}
          onAddToCart={onAddToCart}
        />
      ))}

    </div>
  );
}

export default PackageList;
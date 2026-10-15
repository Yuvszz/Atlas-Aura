function PackageCard({
  packageData,
  travelDate,
  setTravelDate,
  onViewDetails,
  onAddToCart,
}) {

  const openDatePicker = (e) => {
    if (e.target.showPicker) {
      e.target.showPicker();
    }
  };

  return (
    <div className="package-card">

      {/* =========================
          PACKAGE IMAGE
      ========================= */}

      <div className="package-image">

        <span
          role="img"
          aria-label={`${packageData.destination} travel`}
        >
          {packageData.emoji}
        </span>

        <small>
          {packageData.tag}
        </small>

      </div>

      {/* =========================
          PACKAGE CONTENT
      ========================= */}

      <div className="package-content">

        <p className="package-location">
          📍 {packageData.destination},{" "}
          {packageData.country}
        </p>

        <h2>
          {packageData.name}
        </h2>

        <div className="package-info">

          <span>
            ⭐ {packageData.rating}
          </span>

          <span>
            🕒 {packageData.duration} Days
          </span>

        </div>

        <p className="package-description">
          {packageData.description}
        </p>

        {/* =========================
            ACCESSIBLE TRAVEL DATE
        ========================= */}

        <label
          className="date-label"
          htmlFor={`travel-date-${packageData.id}`}
        >
          📅 Travel Date
        </label>

        <input
          id={`travel-date-${packageData.id}`}
          className="date-input"
          type="date"
          value={travelDate || ""}
          onChange={(e) =>
            setTravelDate(
              e.target.value
            )
          }
          onClick={openDatePicker}
          aria-label={`Select travel date for ${packageData.name}`}
        />

        {/* =========================
            BOTTOM
        ========================= */}

        <div className="package-bottom">

          <div>

            <small>
              Starting from
            </small>

            <strong>
              ₹
              {Number(
                packageData.price
              ).toLocaleString()}
            </strong>

          </div>

          {/* DETAILS */}

          <button
            type="button"
            className="details-button"
            onClick={() =>
              onViewDetails(
                packageData
              )
            }
            aria-label={`View details for ${packageData.name}`}
          >
            Details
          </button>

          {/* ADD */}

          <button
            type="button"
            className="add-button"
            onClick={() =>
              onAddToCart(
                packageData,
                travelDate
              )
            }
            aria-label={`Add ${packageData.name} to booking cart`}
          >
            + Add
          </button>

        </div>

      </div>

    </div>
  );
}

export default PackageCard;
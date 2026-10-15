function FilterPanel({
  destination,
  setDestination,
  duration,
  setDuration,
  budget,
  setBudget,
  rating,
  setRating,
}) {
  return (
    <div className="filter-panel">

      <label>
        Destination
        <select
          value={destination}
          onChange={(e) =>
            setDestination(e.target.value)
          }
        >
          <option value="all">
            All destinations
          </option>
          <option value="Munnar">
            Munnar
          </option>
          <option value="Bali">
            Bali
          </option>
          <option value="Dubai">
            Dubai
          </option>
          <option value="Manali">
            Manali
          </option>
          <option value="Maldives">
            Maldives
          </option>
          <option value="Ooty">
            Ooty
          </option>
        </select>
      </label>

      <label>
        Duration
        <select
          value={duration}
          onChange={(e) =>
            setDuration(e.target.value)
          }
        >
          <option value="all">
            Any duration
          </option>
          <option value="2">2 days</option>
          <option value="3">3 days</option>
          <option value="4">4 days</option>
          <option value="5">5 days</option>
        </select>
      </label>

      <label>
        Maximum Budget
        <select
          value={budget}
          onChange={(e) =>
            setBudget(e.target.value)
          }
        >
          <option value="all">
            Any budget
          </option>
          <option value="10000">
            ₹10,000
          </option>
          <option value="20000">
            ₹20,000
          </option>
          <option value="30000">
            ₹30,000
          </option>
          <option value="40000">
            ₹40,000
          </option>
        </select>
      </label>

      <label>
        Rating
        <select
          value={rating}
          onChange={(e) =>
            setRating(e.target.value)
          }
        >
          <option value="all">
            Any rating
          </option>
          <option value="4">4.0+</option>
          <option value="4.5">4.5+</option>
          <option value="4.8">4.8+</option>
        </select>
      </label>

    </div>
  );
}

export default FilterPanel;
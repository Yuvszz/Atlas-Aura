function TravelerCard({ traveler }) {
  return (
    <div className="traveler-card">
      <h3>Traveler</h3>

      <p>
        <strong>Name:</strong> {traveler.name}
      </p>

      <p>
        <strong>Email:</strong> {traveler.email}
      </p>

      <p>
        <strong>Phone:</strong> {traveler.phone}
      </p>

      <p>
        <strong>Travelers:</strong> {traveler.travelers}
      </p>
    </div>
  );
}

export default TravelerCard;
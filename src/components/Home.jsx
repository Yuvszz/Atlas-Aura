function Home() {
  return (
    <section className="home" id="home">

      <div className="hero-content">

        <p className="small-title">
          YOUR NEXT STORY STARTS HERE
        </p>

        <h1>
          Don't just visit.
          <br />
          <span>Feel the journey.</span>
        </h1>

        <p className="hero-text">
          Discover hand-picked journeys designed for people
          who want more than ordinary vacations.
        </p>

      </div>

      <div className="hero-side">

        <div className="floating-card">
          <span>✈️</span>

          <div>
            <strong>6+</strong>
            <p>curated journeys</p>
          </div>
        </div>

        <div className="hero-circle">
          <span>🌍</span>
        </div>

      </div>

    </section>
  );
}

export default Home;
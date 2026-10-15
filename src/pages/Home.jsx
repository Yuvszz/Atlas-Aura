import { Link } from "react-router-dom";

function Home() {
  return (
    <main className="home">

      <section className="hero">

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

          <Link
            to="/packages"
            className="explore-button"
          >
            Explore Packages →
          </Link>

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

      <section className="home-bottom">

        <p>WHY ATLAS AURA?</p>

        <h2>
          Your trip should feel like
          <span> your story.</span>
        </h2>

        <div className="feature-grid">

          <div>
            <span>🧭</span>
            <h3>Curated journeys</h3>
            <p>
              Carefully selected destinations for memorable
              experiences.
            </p>
          </div>

          <div>
            <span>⚡</span>
            <h3>Simple planning</h3>
            <p>
              Search, filter and book your journey with ease.
            </p>
          </div>

          <div>
            <span>💫</span>
            <h3>Travel differently</h3>
            <p>
              Discover experiences beyond ordinary vacations.
            </p>
          </div>

        </div>

      </section>

    </main>
  );
}

export default Home;
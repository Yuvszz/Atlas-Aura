function About() {
  return (
    <main className="about-page">

      <section className="about-hero">

        <p>THE ATLAS AURA STORY</p>

        <h1>
          Travel is not just
          <span> a destination.</span>
        </h1>

        <p>
          It's the people you meet, the places you discover
          and the stories you bring home.
        </p>

      </section>

      <section className="about-grid">

        <div className="about-card">
          <span>🧭</span>
          <h2>Curated</h2>
          <p>
            We select memorable destinations and experiences
            instead of ordinary travel packages.
          </p>
        </div>

        <div className="about-card">
          <span>💡</span>
          <h2>Simple</h2>
          <p>
            Search, filter, select your date and add your
            favourite journey to your booking cart.
          </p>
        </div>

        <div className="about-card">
          <span>🌱</span>
          <h2>Meaningful</h2>
          <p>
            We believe every journey should leave you with
            something worth remembering.
          </p>
        </div>

      </section>

      <section className="about-note">

        <div>
          <strong>6+</strong>
          <span>Destinations</span>
        </div>

        <div>
          <strong>4.8★</strong>
          <span>Average rating</span>
        </div>

        <div>
          <strong>24/7</strong>
          <span>Dreaming of travel</span>
        </div>

      </section>

    </main>
  );
}

export default About;
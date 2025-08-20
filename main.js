async function aggiornaMeteo() {
    const cityName = document.getElementById("cityInput").value.trim();
    if (!cityName) {
      alert("Inserisci il nome di una città");
      return;
    }

    try {
      // 1. Geocoding: città -> coordinate
      const geoUrl = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(cityName)}`;
      const geoResponse = await fetch(geoUrl);
      const geoData = await geoResponse.json();

      if (!geoData.length) {
        alert("Città non trovata");
        return;
      }

      const { lat, lon, display_name } = geoData[0];

      // 2. Aggiorna il nome della città (con descrizione completa)
      document.getElementById("citta").textContent = display_name;

      // 3. Chiamata API meteo con lat e lon ottenuti
      const meteoUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&models=italia_meteo_arpae_icon_2i&current=temperature_2m,relative_humidity_2m,precipitation,weather_code&forecast_days=1`;
      const meteoResponse = await fetch(meteoUrl);
      const meteoData = await meteoResponse.json();

      const current = meteoData.current || {};

      // 4. Mostra dati meteo
      document.getElementById("temperatura").textContent = current.temperature_2m ?? "N/D";
      document.getElementById("umidita").textContent = current.relative_humidity_2m ?? "N/D";
      document.getElementById("precipitazione").textContent = current.precipitation ?? "N/D";
      document.getElementById("weather-code").textContent = current.weather_code ?? "N/D";

    } catch (error) {
      console.error("Errore:", error);
      console.log("Si è verificato un errore nel recupero dei dati");
    }
  }

  // Opzionale: mostra meteo di default (Roma) all’avvio
  window.onload = () => {
    document.getElementById("cityInput").value = "Roma";
    aggiornaMeteo();
  };
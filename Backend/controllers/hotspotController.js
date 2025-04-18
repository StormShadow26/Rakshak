const axios = require("axios");
const cheerio = require("cheerio");
require("dotenv").config();

const GEOCODE_API = "https://api.opencagedata.com/geocode/v1/json";
const GEOCODE_KEY = process.env.GEOCODING_API_KEY;

async function scrapeDisasters() {
  const url = "https://reliefweb.int/disasters";

  try {
    const { data } = await axios.get(url);
    const $ = cheerio.load(data);
    const disasters = [];

    // For map view disasters
    $('.rw-disaster-map__article.rw-river-article--disaster').each((i, elem) => {
      const title = $(elem).find('.rw-river-article__title a').text().trim();
      const location = $(elem).find('.rw-entity-meta__tag-value--country a').text().trim();
      const date = $(elem).find('.rw-river-article__title a').attr('href').match(/\d{4}/g)?.[0] || "Unknown";
      const status = $(elem).find('.rw-entity-meta__tag-value--status').text().trim();
      const type = $(elem).find('.rw-entity-meta__tag-value--disaster-type a').text().trim();

      disasters.push({
        title: title || "Unknown",
        location: location || "Unknown",
        date: date || "Unknown",
        status: status || "Unknown",
        type: type || "Unknown"
      });
    });

    // For list view disasters (cards)
    $('.rw-river-article--card.rw-river-article--disaster').each((i, elem) => {
      const title = $(elem).find('.rw-river-article__title a').text().trim();
      const location = $(elem).find('.rw-entity-meta__tag-value--country a').text().trim();
      const date = $(elem).find('.rw-river-article__title a').attr('href').match(/\d{4}/g)?.[0] || "Unknown";
      const status = $(elem).find('.rw-entity-meta__tag-value--status').text().trim();
      const type = $(elem).find('.rw-entity-meta__tag-value--disaster-type a').text().trim();

      disasters.push({
        title: title || "Unknown",
        location: location || "Unknown",
        date: date || "Unknown",
        status: status || "Unknown",
        type: type || "Unknown"
      });
    });

    // console.log("✅ Scraped disasters:", disasters.slice(0, 5)); // preview
    return disasters;
  } catch (error) {
    console.error("❌ Failed to scrape:", error.message);
    return [];
  }
}
// const fs = require('fs');
// // const axios = require('axios');

// async function downloadData() {
//   const url = "https://reliefweb.int/disasters";

//   try {
//     const { data } = await axios.get(url);
//     console.log("✅ HTML Data fetched");

//     // Save the HTML data to a file
//     const htmlFileName = 'disasters.html';
//     fs.writeFileSync(htmlFileName, data);
//     console.log(`✅ HTML data has been saved to ${htmlFileName}`);

//   } catch (error) {
//     console.error("❌ Failed to fetch data:", error.message);
//   }
// }



// Geocode locations
function cleanLocationName(location) {
  const firstCountry = location.split(",")[0];
  return firstCountry.replace(/\s*\(.*?\)\s*/g, "").trim();
}


async function geocodeLocations(disasters) {
  const results = [];

  for (const disaster of disasters.slice(0, 10)) {
    try {
      const cleanedLocation = cleanLocationName(disaster.location);
      // console.log("cleaned:",GEOCODE_KEY );
      const res = await axios.get(GEOCODE_API, {
        params: {
          q: cleanedLocation,
          key: GEOCODE_KEY,
        },
      });
      // console.log(res.data);

      console.log("res:", res.data);
      const geo = res.data.results[0];
      console.log("geo is:", geo);
      if (geo) {
        results.push({
          ...disaster,
          lat: geo.geometry.lat,
          lon: geo.geometry.lng,
        });
      } else {
        console.warn("⚠️ No geo data for:", cleanedLocation);
      }
    } catch (err) {
      console.error("❌ Geocoding failed for:", disaster.location);
    }
  }

  console.log("✅ Geocoded disasters:", results);
  return results;
}


// Controller function
const getHotspots = async (req, res) => {
  try {
    // downloadData();
    const disasters = await scrapeDisasters();
    const geocoded = await geocodeLocations(disasters);

    console.log("Final hotspots data:", geocoded); // Log final data before sending response

    res.json(geocoded);
  } catch (error) {
    console.error(error);
    res.status(500).send("🔥 Internal Server Error");
  }
};

module.exports = { getHotspots };

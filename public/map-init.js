import * as L from 'https://unpkg.com/leaflet@1.9.4/dist/leaflet-src.esm.js';

window.addEventListener('DOMContentLoaded', () => {
  const mapContainer = document.getElementById('triviaMap');
  if (!mapContainer) return console.error('❌ Map container not found');

  setTimeout(() => {
    // Wipe any existing map instance
    if (mapContainer._leaflet_id) {
      mapContainer._leaflet_id = null;
    }

    const locs = JSON.parse(mapContainer.dataset.locs || '[]');
    const map = L.map(mapContainer);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);

    const coordinates = [];

    locs.forEach((loc) => {
      if (!loc.coordinates) return;

      const popupContent = `
        <div style="font-family: sans-serif; font-size: 14px; width: 200px; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.1);">

          <a href="/locations/${loc.locationRegionIsoSlug}/${loc.locationTownSlug}/${loc.locationNameSlug}" style="position: relative; display: block; width: 100%; aspect-ratio: 1 / 1; overflow: hidden;">

            ${loc.squareimageUrl ? `
              <img
                src="${loc.squareimageUrl}"
                alt="${loc.imageAlt || loc.name}"
                style="width: 100%; height: 100%; object-fit: cover; display: block;"
              />` : ''
            }

            <!-- 🔵 Dark blue overlay -->
            <div style="
              position: absolute;
              inset: 0;
              background-color: rgba(30, 58, 138, 0.5);
              z-index: 1;
            "></div>

            <!-- 📅 Top-right badge cluster -->
            ${(loc.isMon || loc.isTue || loc.isWed || loc.isThu || loc.isFri || loc.isSat || loc.isSun || loc.locationFrequency) ? `
              <div style="
                position: absolute;
                top: 6px;
                right: 6px;
                display: flex;
                flex-direction: column;
                align-items: flex-end;
                gap: 4px;
                z-index: 2;
              ">
                ${(loc.isMon || loc.isTue || loc.isWed || loc.isThu || loc.isFri || loc.isSat || loc.isSun) ? `
                  <div style="
                    background-color: rgba(0,0,0,0.6);
                    color: white;
                    font-size: 11px;
                    padding: 4px 8px;
                    border-radius: 6px;
                    display: flex;
                    align-items: center;
                    gap: 4px;
                  ">
                    
                    ${loc.isMon ? 'MON' :
                      loc.isTue ? 'TUE' :
                      loc.isWed ? 'WED' :
                      loc.isThu ? 'THU' :
                      loc.isFri ? 'FRI' :
                      loc.isSat ? 'SAT' :
                      loc.isSun ? 'SUN' : ''}
                  </div>` : ''
                }

                ${loc.locationFrequency ? `
                  <div style="
                    background-color: rgba(0,0,0,0.6);
                    color: white;
                    font-size: 11px;
                    padding: 4px 8px;
                    border-radius: 6px;
                  ">
                    ${loc.locationFrequency}
                  </div>` : ''
                }
              </div>` : ''
            }

            <!-- 📍 Name and town over image -->
            <div style="
              position: absolute;
              bottom: 8px;
              left: 12px;
              right: 12px;
              z-index: 2;
              color: white;
              text-shadow: 0 1px 2px rgba(0,0,0,0.6);
            ">
              <div style="font-size: 18px; font-weight: 700; line-height: 1.2;">${loc.name}</div>
              ${loc.town ? `<div style="font-size: 14px; text-transform: uppercase; margin-top: 1px;">${loc.town}</div>` : ''}
            </div>
          </a>
        </div>
      `;






      L.marker(loc.coordinates)
        .addTo(map)
        .bindPopup(popupContent);

      coordinates.push(loc.coordinates);
    });

    if (coordinates.length === 1) {
      map.setView(coordinates[0], 15);
    } else if (coordinates.length > 1) {
      const bounds = L.latLngBounds(coordinates);
      map.fitBounds(bounds, { padding: [50, 50] });
    } else {
      map.setView([-25.2744, 133.7751], 5);
    }

    // Force layout correction
    setTimeout(() => {
      map.invalidateSize();
      window.dispatchEvent(new Event('resize'));
    }, 200);
  }, 50);
});

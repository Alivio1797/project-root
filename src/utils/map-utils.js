import L from 'leaflet';

let mapInstance = null;
let markerInstance = null;

// Function to initialize the map
export function initMap(containerId, position) {
  // Check if the map already exists
  if (mapInstance) {
    // If a map is already initialized, remove it before re-initializing
    mapInstance.remove();
  }

  const container = document.getElementById(containerId);
  const map = L.map(container).setView([position.lat, position.lon], 13);  // Set initial map position

  // Add tile layer to the map
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors',
  }).addTo(map);

  // Save the map instance for later use
  mapInstance = map;

  return map;
}

// Function to add a click listener to the map
export function addMapClickListener(map, onMapClick) {
  map.on('click', async (event) => {
    const lat = event.latlng.lat;  // Get latitude from the click event
    const lon = event.latlng.lng;  // Get longitude from the click event

    // Perform reverse geocoding to get the location name
    const locationName = await getLocationName(lat, lon);

    // Call the callback to update location or do something with the data
    onMapClick(lat, lon, locationName);
  });
}

// Function for reverse geocoding to get the location name
async function getLocationName(lat, lon) {
  const url = `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json&addressdetails=1`;

  try {
    const response = await fetch(url);
    const data = await response.json();
    // Return the location name or a default message if not found
    return data.display_name || 'Unknown Location';
  } catch (error) {
    console.error('Error getting location name:', error);
    return 'Location not found';
  }
}

// Function to add a draggable marker to the map
export function addDraggableMarker(map, position, onDragEnd) {
  const customIcon = L.icon({
    iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',  // Correct CDN URL for marker
    iconSize: [25, 41],  // Icon size
    iconAnchor: [12, 41],  // Icon anchor point
    popupAnchor: [1, -34],  // Popup position
    shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',  // Correct CDN URL for marker shadow
    shadowSize: [41, 41],  // Shadow size
  });

  // Create the draggable marker
  const marker = L.marker([position.lat, position.lon], { draggable: true, icon: customIcon }).addTo(map);

  // Event listener when the marker is dragged and dropped
  marker.on('dragend', (e) => {
    const { lat, lng } = e.target.getLatLng();  // Get the new position of the marker
    onDragEnd(lat, lng);  // Call the callback when the marker is dragged
  });

  // Save the marker instance for later use
  markerInstance = marker;

  return marker;
}

// Function to clean up the map and marker
export function cleanupMap() {
  if (mapInstance) {
    mapInstance.remove();  // Remove the map instance from the container
    mapInstance = null;  // Set map instance to null
  }

  if (markerInstance) {
    markerInstance.remove();  // Remove the marker from the map if it exists
    markerInstance = null;  // Set marker instance to null
  }
}
export const LOCAL_DEST_IMAGES: Record<string, string> = {
  "Adams Peak": "/assets/places/Adams Peak.webp",
  "Anuradhapura": "/assets/places/Anuradhapura.jpg",
  "Arugam Bay": "/assets/places/Arugam Bay.jpg",
  "Bentota": "/assets/places/Bentota.jpg",
  "Buduruwagala": "/assets/places/Buduruwagala.jpg",
  "Colombo": "/assets/places/Colombo.jpg",
  "Ella": "/assets/places/Ella.jpg",
  "Galle Fort": "/assets/places/Galle Fort.webp",
  "Jaffna": "/assets/places/Jaffna.jpeg",
  "Kalpitiya": "/assets/places/Kalpitiya.jpg",
  "Knuckles Range": "/assets/places/Knuckles Range.jpg",
  "Mannar": "/assets/places/Mannar.jpg",
  "Mirissa": "/assets/places/Mirissa.jpg",
  "Negombo": "/assets/places/Negombo.jpg",
  "Nuwara Eliya": "/assets/places/Nuwara Eliya.jpg",
  "Pinnawala": "/assets/places/Pinnawala.jpg",
  "Polonnaruwa": "/assets/places/Polonnaruwa.jpg",
  "Sigiriya": "/assets/places/Sigiriya.jpg",
  "Tangalle": "/assets/places/Tangalle.jpg",
  "Trincomalee": "/assets/places/Trincomalee.jpg",
  "Wilpattu": "/assets/places/Wilpattu.jpg",
  "Kandy": "/assets/places/kandy.jpg",
  "Yala National Park": "/assets/places/Yala National Park.jpg",
  "Dambulla": "/assets/places/Dambulla.webp",
  "Horton Plains": "/assets/places/Horton Plains.webp",
  "Hikkaduwa": "/assets/places/Hikkaduwa.jpg"
};

export const getPlaceImage = (name: string): string => {
  return LOCAL_DEST_IMAGES[name] || "/assets/places/Colombo.jpg"; // Using Colombo as a safe fallback if somehow an image is missing
};

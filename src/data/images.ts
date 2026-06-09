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
  
  // Fallbacks for missing places
  "Yala National Park": "https://images.unsplash.com/photo-1581888227599-779811939961?q=80&w=800&auto=format&fit=crop",
  "Dambulla": "https://images.unsplash.com/photo-1627589704256-df3029f6de34?q=80&w=800&auto=format&fit=crop",
  "Horton Plains": "https://images.unsplash.com/photo-1589308078059-be1415eab4c3?q=80&w=800&auto=format&fit=crop",
  "Hikkaduwa": "https://images.unsplash.com/photo-1544551763-46a013bb70d5?q=80&w=800&auto=format&fit=crop"
};

export const DEFAULT_PLACE_IMAGE = "https://images.unsplash.com/photo-1544735716-392fe2489ffa?q=80&w=800&auto=format&fit=crop";

export const getPlaceImage = (name: string): string => {
  return LOCAL_DEST_IMAGES[name] || DEFAULT_PLACE_IMAGE;
};

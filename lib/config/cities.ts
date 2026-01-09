export interface City {
  name: string;
  country: string;
  sellers: number;
  href: string;
}

export const CITIES: City[] = [
  { name: "Lagos", country: "Nigeria", sellers: 342, href: "/sellers?city=lagos" },
  { name: "Nairobi", country: "Kenya", sellers: 278, href: "/sellers?city=nairobi" },
  { name: "Accra", country: "Ghana", sellers: 156, href: "/sellers?city=accra" },
  { name: "Johannesburg", country: "South Africa", sellers: 224, href: "/sellers?city=johannesburg" },
  { name: "Cairo", country: "Egypt", sellers: 198, href: "/sellers?city=cairo" },
  { name: "Addis Ababa", country: "Ethiopia", sellers: 134, href: "/sellers?city=addis-ababa" },
];
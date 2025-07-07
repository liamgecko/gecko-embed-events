export interface Event {
  id: number
  title: string
  date: string
  time: string
  location: string
  attendees: number
  waitlistSpaces?: number
  price: string
  category: string
  description?: string
  image?: string
  tags?: string[]
  type?: string
}

export const events: Event[] = [
  {
    id: 1,
    title: "Tech Conference 2025",
    date: "2025-03-15",
    time: "9:00 AM - 5:00 PM",
    location: "San Francisco Convention Center",
    attendees: 250,
    price: "$299",
    category: "Technology",
    description: "Join us for the biggest tech conference of the year featuring keynote speakers, workshops, and networking opportunities.",
    image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400&h=250&fit=crop",
    tags: ["Technology", "Conference", "Networking"],
    type: "On Campus"
  },
  {
    id: 2,
    title: "Startup Networking Mixer",
    date: "2025-03-18",
    time: "6:00 PM - 9:00 PM",
    location: "The Foundry, Downtown",
    attendees: 75,
    price: "Free",
    category: "Networking",
    description: "Connect with fellow entrepreneurs, investors, and industry professionals in a relaxed networking environment.",
    image: "https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=400&h=250&fit=crop",
    tags: ["Networking", "Startup", "Social"],
    type: "On Campus"
  },
  {
    id: 3,
    title: "Design Workshop: UI/UX Fundamentals",
    date: "2025-03-22",
    time: "10:00 AM - 4:00 PM",
    location: "Design Studio Hub",
    attendees: 30,
    price: "$149",
    category: "Design",
    description: "Learn the fundamentals of UI/UX design with hands-on workshops and expert guidance from industry professionals.",
    image: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400&h=250&fit=crop",
    tags: ["Design", "Workshop", "Learning"],
    type: "Online"
  },
  {
    id: 4,
    title: "Marketing Strategy Summit",
    date: "2025-03-25",
    time: "8:30 AM - 6:00 PM",
    location: "Grand Hotel Conference Center",
    attendees: 120,
    price: "$199",
    category: "Marketing",
    description: "Discover the latest marketing trends and strategies with presentations from top marketing experts and thought leaders.",
    image: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=250&fit=crop",
    tags: ["Marketing", "Strategy", "Conference"],
    type: "On Campus"
  },
  {
    id: 5,
    title: "Product Launch Party",
    date: "2025-03-28",
    time: "7:00 PM - 11:00 PM",
    location: "Innovation Lab",
    attendees: 200,
    price: "$50",
    category: "Product",
    description: "Celebrate the launch of our latest product with live demos, entertainment, and networking opportunities.",
    image: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=400&h=250&fit=crop",
    tags: ["Product", "Launch", "Social"],
    type: "Online"
  },
  {
    id: 6,
    title: "AI & Machine Learning Workshop",
    date: "2025-04-02",
    time: "1:00 PM - 5:00 PM",
    location: "Tech Innovation Center",
    attendees: 0,
    waitlistSpaces: 15,
    price: "$179",
    category: "Technology",
    description: "Deep dive into AI and machine learning with practical examples and hands-on coding sessions.",
    image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400&h=250&fit=crop",
    tags: ["Technology", "AI", "Workshop"],
    type: "Online"
  },
  {
    id: 7,
    title: "Creative Writing Masterclass",
    date: "2025-04-05",
    time: "2:00 PM - 6:00 PM",
    location: "Literary Arts Center",
    attendees: 0,
    price: "$89",
    category: "Education",
    description: "Enhance your writing skills with expert guidance and peer feedback in this intensive masterclass.",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=250&fit=crop",
    tags: ["Education", "Writing", "Creative"],
    type: "On Campus"
  },
  {
    id: 8,
    title: "Sustainable Business Forum",
    date: "2025-04-08",
    time: "9:00 AM - 3:00 PM",
    location: "Green Business Hub",
    attendees: 180,
    price: "$129",
    category: "Business",
    description: "Explore sustainable business practices and connect with eco-conscious entrepreneurs and investors.",
    image: "https://images.unsplash.com/photo-1556761175-b413da4baf72?w=400&h=250&fit=crop",
    tags: ["Business", "Sustainability", "Networking"],
    type: "On Campus"
  },
  {
    id: 9,
    title: "Digital Photography Workshop",
    date: "2025-04-12",
    time: "10:00 AM - 4:00 PM",
    location: "Photo Studio Complex",
    attendees: 35,
    price: "$199",
    category: "Photography",
    description: "Master digital photography techniques with professional equipment and expert instruction.",
    image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=400&h=250&fit=crop",
    tags: ["Photography", "Workshop", "Creative"],
    type: "Online"
  },
  {
    id: 10,
    title: "Health & Wellness Expo",
    date: "2025-04-15",
    time: "11:00 AM - 7:00 PM",
    location: "Wellness Convention Center",
    attendees: 300,
    price: "$25",
    category: "Health",
    description: "Discover the latest in health and wellness with demonstrations, workshops, and product showcases.",
    image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=250&fit=crop",
    tags: ["Health", "Wellness", "Expo"],
    type: "On Campus"
  }
]

export const getCategoryColor = (category: string) => {
  const colors = {
    Technology: "bg-blue-100 text-blue-800",
    Networking: "bg-green-100 text-green-800",
    Design: "bg-purple-100 text-purple-800",
    Marketing: "bg-orange-100 text-orange-800",
    Product: "bg-pink-100 text-pink-800",
    Education: "bg-indigo-100 text-indigo-800",
    Business: "bg-emerald-100 text-emerald-800",
    Photography: "bg-amber-100 text-amber-800",
    Health: "bg-red-100 text-red-800"
  }
  return colors[category as keyof typeof colors] || "bg-gray-100 text-gray-800"
} 
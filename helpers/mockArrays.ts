import option2_preview from "@/public/about/about-option-image-2.png";
import option3_preview from "@/public/about/about-option-image-3.png";
import Ella from '@/public/discover/Colombo.webp'
import Galle from '@/public/discover/Galle.webp'
import Yapahuwa from '@/public/discover/Colombo.webp'
import user1 from '@/public/discover/user1.jpg'
import user2 from '@/public/discover/user2.jpg'
import user3 from '@/public/discover/user3.jpg'
import user4 from '@/public/discover/user4.jpg'
import user5 from '@/public/discover/user5.jpg'


export const trendingOptions = [
    {
        id: 1,
        icon: "pool",
        label: 'Beach',
        href: '/'
    },
    {
        id: 2,
        icon: "sunny",
        label: 'Warm',
        href: '/'
    },
    {
        id: 3,
        icon: "eco",
        label: 'Nature',
        href: '/'
    },
    {
        id: 4,
        icon: "agriculture",
        label: 'Farm',
        href: '/'
    },
    {
        id: 5,
        icon: "water",
        label: 'Lake',
        href: '/'
    },
    {
        id: 6,
        icon: "landscape",
        label: 'Mountain',
        href: '/'
    },
    {
        id: 7,
        icon: "wb_sunny",
        label: 'warm',
        href: '/'
    },
    {
        id: 8,
        icon: "hiking",
        label: 'hiking',
        href: '/'
    },
    {
        id: 9,
        icon: "apartment",
        label: 'City View',
        href: '/'
    },
    {
        id: 10,
        icon: "ramen_dining",
        label: 'Foods',
        href: '/'
    },
    {
        id: 11,
        icon: "surfing",
        label: 'Surfing',
        href: '/'
    },
]
export const mobileTrendingOptions = [
    {
        id: 1,
        icon: "pool",
        label: 'Beach',
        href: '/'
    },
    {
        id: 2,
        icon: "sunny",
        label: 'Warm',
        href: '/'
    },
    {
        id: 3,
        icon: "eco",
        label: 'Nature',
        href: '/'
    },
    {
        id: 4,
        icon: "agriculture",
        label: 'Farm',
        href: '/'
    },
    {
        id: 5,
        icon: "water",
        label: 'Lake',
        href: '/'
    },
    {
        id: 6,
        icon: "landscape",
        label: 'Mountain',
        href: '/'
    },
    {
        id: 7,
        icon: "wb_sunny",
        label: 'warm',
        href: '/'
    },
    {
        id: 8,
        icon: "hiking",
        label: 'hiking',
        href: '/'
    },
]
export const smallMobileTrendingOptions = [
    {
        id: 1,
        icon: "pool",
        label: 'Beach',
        href: '/'
    },
    {
        id: 2,
        icon: "sunny",
        label: 'Warm',
        href: '/'
    },
    {
        id: 3,
        icon: "eco",
        label: 'Nature',
        href: '/'
    },
    {
        id: 4,
        icon: "agriculture",
        label: 'Farm',
        href: '/'
    },
    {
        id: 5,
        icon: "water",
        label: 'Lake',
        href: '/'
    },
    {
        id: 6,
        icon: "landscape",
        label: 'Mountain',
        href: '/'
    },
]

export const navItems = [
    { icon: 'home', label: 'Home' },
    { icon: 'group', label: 'About Us' },
    { icon: 'call', label: 'Contact' },
    { icon: 'flight', label: 'Travels' },
    { icon: 'auto_stories', label: 'Bookings' }
];

export const weeklyDealsOptions = [
    { name: "Private Villa", address: "Tangalla, Uva Province", favorite: true, route: "/apartments/id", rating: 2, bgImage: option2_preview, hoverImage: option3_preview },
    { name: "Seya Villa", address: "Tangalla, Uva Province", favorite: false, route: "/apartments/id", rating: 4, bgImage: option2_preview, hoverImage: option3_preview },
    { name: "Ceyara lodge", address: "Tangalla, Uva Province", favorite: false, route: "/apartments/id", rating: 5, bgImage: option2_preview, hoverImage: option3_preview },
    { name: "Ocean Breeze", address: "Colombo, Western Province", favorite: true, route: "/apartments/id", rating: 3, bgImage: option2_preview, hoverImage: option3_preview },
    { name: "Sunset Villa", address: "Matara, Southern Province", favorite: true, route: "/apartments/id", rating: 1, bgImage: option2_preview, hoverImage: option3_preview },
    { name: "Sunset Villa", address: "Matara, Southern Province", favorite: false, route: "/apartments/id", rating: 5, bgImage: option2_preview, hoverImage: option3_preview },
    { name: "Sunset Villa", address: "Matara, Southern Province", favorite: true, route: "/apartments/id", rating: 4, bgImage: option2_preview, hoverImage: option3_preview },
]

export const ellaLocations = [
    { name: "Ella Rock", address: "Ella, Uva Province", favorite: true, route: "/apartments/id", rating: 2, bgImage: option2_preview, hoverImage: option3_preview },
    { name: "Nine Arches Bridge", address: "Ella, Uva Province", favorite: false, route: "/apartments/id", rating: 4, bgImage: option2_preview, hoverImage: option3_preview },
    { name: "Ravana Falls", address: "Ella, Uva Province", favorite: false, route: "/apartments/id", rating: 5, bgImage: option2_preview, hoverImage: option3_preview },
    { name: "Diyaluma Falls", address: "Koslanda, Uva Province", favorite: true, route: "/apartments/id", rating: 3, bgImage: option2_preview, hoverImage: option3_preview },
    { name: "Little Adam's Peak", address: "Ella, Uva Province", favorite: true, route: "/apartments/id", rating: 1, bgImage: option2_preview, hoverImage: option3_preview },
    { name: "Bambaragala Mountain", address: "Ella, Uva Province", favorite: false, route: "/apartments/id", rating: 5, bgImage: option2_preview, hoverImage: option3_preview },
    { name: "Uva Wellassa", address: "Badulla, Uva Province", favorite: true, route: "/apartments/id", rating: 4, bgImage: option2_preview, hoverImage: option3_preview },
];

export const galleLocations = [
    { name: "Galle Fort", address: "Galle, Southern Province", favorite: true, route: "/apartments/id", rating: 2, bgImage: option2_preview, hoverImage: option3_preview },
    { name: "Unawatuna Beach", address: "Galle, Southern Province", favorite: false, route: "/apartments/id", rating: 4, bgImage: option2_preview, hoverImage: option3_preview },
    { name: "Koggala Beach", address: "Galle, Southern Province", favorite: false, route: "/apartments/id", rating: 5, bgImage: option2_preview, hoverImage: option3_preview },
    { name: "Jungle Beach", address: "Galle, Southern Province", favorite: true, route: "/apartments/id", rating: 3, bgImage: option2_preview, hoverImage: option3_preview },
    { name: "Mirissa Beach", address: "Mirissa, Southern Province", favorite: true, route: "/apartments/id", rating: 1, bgImage: option2_preview, hoverImage: option3_preview },
    { name: "Weligama Beach", address: "Weligama, Southern Province", favorite: false, route: "/apartments/id", rating: 5, bgImage: option2_preview, hoverImage: option3_preview },
    { name: "Mihintale", address: "Anuradhapura, North Central Province", favorite: true, route: "/apartments/id", rating: 4, bgImage: option2_preview, hoverImage: option3_preview },
];

export const yapahuwaLocations = [
    { name: "Yapahuwa Rock Fortress", address: "Yapahuwa, North Western Province", favorite: true, route: "/apartments/id", rating: 2, bgImage: option2_preview, hoverImage: option3_preview },
    { name: "Ritigala", address: "Ritigala, North Central Province", favorite: false, route: "/apartments/id", rating: 4, bgImage: option2_preview, hoverImage: option3_preview },
    { name: "Pidurangala", address: "Sigiriya, Central Province", favorite: false, route: "/apartments/id", rating: 5, bgImage: option2_preview, hoverImage: option3_preview },
    { name: "Sigiriya Rock Fortress", address: "Sigiriya, Central Province", favorite: true, route: "/apartments/id", rating: 3, bgImage: option2_preview, hoverImage: option3_preview },
    { name: "Anuradhapura Ancient City", address: "Anuradhapura, North Central Province", favorite: true, route: "/apartments/id", rating: 1, bgImage: option2_preview, hoverImage: option3_preview },
    { name: "Dambulla Cave Temple", address: "Dambulla, Central Province", favorite: false, route: "/apartments/id", rating: 5, bgImage: option2_preview, hoverImage: option3_preview },
    { name: "Polonnaruwa Ancient City", address: "Polonnaruwa, North Central Province", favorite: true, route: "/apartments/id", rating: 4, bgImage: option2_preview, hoverImage: option3_preview },
];

export const popularLocations = [
    {
        id: 1,
        name: 'Colombo',
        href: Ella,
        alt: 'Colombo, SriLanka',
        description: "Experience Colombo’s Coastal Pulse",
        paragraph: `Colombo is the bustling capital of Sri Lanka, blending old-world charm with modern city vibes. From its colonial buildings and colorful markets to high-rise hotels and seaside views, it's a vibrant mix of culture, history, and coastal beauty.`,

    },
    {
        id: 2,
        name: 'Galle',
        href: Galle,
        alt: 'Galle, SriLanka',
        description: "Historic Charm in Galle Fort",
        paragraph: `Galle is a charming coastal city in Sri Lanka, best known for its historic Dutch Fort, cobblestone streets, and ocean views. With its blend of colonial architecture, cute cafes, and tropical beaches, Galle offers a peaceful yet cultural escape by the sea.`
    },
    {
        id: 3,
        name: 'Negombo',
        href: Yapahuwa,
        alt: 'Negombo, SriLanka',
        description: "Golden Sands of Negombo",
        paragraph: `Negombo is a scenic city nestled in the hills of Sri Lanka, known for its sacred Temple of the Tooth and peaceful lake. Surrounded by lush greenery and rich traditions, it’s a spiritual and cultural heartland where history and nature beautifully meet.`
    },
    {
        id: 4,
        name: 'Kalutara',
        href: Ella,
        alt: 'Kalutara, SriLanka',
        description: "Uncover Kalutara’s Hidden Heritage",
        paragraph: `Kalutara is a quiet hill-country town in Sri Lanka, surrounded by tea estates and misty mountains. Once an ancient royal capital, it holds a mix of history and natural charm, offering peaceful views, temples, and a slower pace of life away from the busy cities.`,
    },
]

export const trustedClients = [
    {
        id: 1,
        href: user1
    }, {
        id: 2,
        href: user2
    }, {
        id: 3,
        href: user3
    }, {
        id: 4,
        href: user4
    }, {
        id: 5,
        href: user5
    },
]

export const hotelCountData = [
    { range: "0-500", count: 45 },
    { range: "501-1000", count: 67 },
    { range: "1001-1500", count: 89 },
    { range: "1501-2000", count: 23 },
    { range: "2001-2500", count: 55 },
    { range: "2501-3000", count: 33 },
    { range: "3001-3500", count: 77 },
    { range: "3501-4000", count: 12 },
    { range: "4001-4500", count: 41 },
    { range: "4501-5000", count: 19 },
    { range: "5001-5500", count: 88 },
    { range: "5501-6000", count: 70 },
    { range: "6001-6500", count: 52 },
    { range: "6501-7000", count: 31 },
    { range: "7001-7500", count: 59 },
    { range: "7501-8000", count: 49 },
    { range: "8001-8500", count: 65 },
    { range: "8501-9000", count: 73 },
    { range: "9001-9500", count: 37 },
    { range: "9501-10000", count: 51 },
    { range: "10001-10500", count: 64 },
    { range: "10501-11000", count: 25 },
    { range: "11001-11500", count: 42 },
    { range: "11501-12000", count: 56 },
    { range: "12001-12500", count: 48 },
    { range: "12501-13000", count: 34 },
    { range: "13001-13500", count: 72 },
    { range: "13501-14000", count: 61 },
    { range: "14001-14500", count: 78 },
    { range: "14501-15000", count: 50 },
    { range: "15001-15500", count: 53 },
    { range: "15501-16000", count: 44 },
    { range: "16001-16500", count: 35 },
    { range: "16501-17000", count: 80 },
    { range: "17001-17500", count: 62 },
    { range: "17501-18000", count: 68 },
    { range: "18001-18500", count: 79 },
    { range: "18501-19000", count: 27 },
    { range: "19001-19500", count: 61 },
    { range: "19501-20000", count: 13 }
];
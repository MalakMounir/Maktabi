import hotDeskImage from "@/assets/space-hot-desk.jpg";
import meetingRoomImage from "@/assets/space-meeting-room.jpg";
import privateOfficeImage from "@/assets/space-private-office.jpg";
import eventSpaceImage from "@/assets/space-event.jpg";

export type SpaceType = "desk" | "meeting_room" | "private_office" | "event_space";

export interface Space {
  id: string;
  name: string;
  nameAr: string;
  type: SpaceType;
  location: string;
  locationAr: string;
  price: number;
  currency: string;
  rating: number;
  reviewCount: number;
  image: string;
  amenities: string[];
  capacity: number;
  availability: "available" | "limited" | "unavailable";
  description: string;
  descriptionAr: string;
  houseRules: string[];
  cancellationPolicy: string;
  provider: string;
}

export interface Booking {
  id: string;
  spaceId: string;
  spaceName: string;
  spaceImage: string;
  date: string;
  startTime: string;
  endTime: string;
  duration: number;
  totalPrice: number;
  currency: string;
  status: "upcoming" | "completed" | "cancelled" | "cancelled_by_host";
  location: string;
  refundStatus?: "pending" | "processed";
  cancellationReason?: string;
}

export const spaces: Space[] = [
  {
    id: "1",
    name: "The Hive Coworking - Hot Desk",
    nameAr: "ذا هايف كوووركينغ - مكتب مشترك",
    type: "desk",
    location: "Dubai Marina, Dubai",
    locationAr: "دبي مارينا، دبي",
    price: 75,
    currency: "AED",
    rating: 4.8,
    reviewCount: 124,
    image: hotDeskImage,
    amenities: ["wifi", "coffee", "ac", "printer", "locker"],
    capacity: 1,
    availability: "available",
    description: "A vibrant coworking space with stunning marina views. Perfect for freelancers and remote workers looking for a professional environment.",
    descriptionAr: "مساحة عمل مشتركة نابضة بالحياة مع إطلالات خلابة على المرسى. مثالية للعاملين المستقلين والعاملين عن بُعد.",
    houseRules: ["No loud calls in open areas", "Clean up after yourself", "Respect quiet zones"],
    cancellationPolicy: "Free cancellation up to 24 hours before booking",
    provider: "The Hive Spaces"
  },
  {
    id: "2",
    name: "Executive Boardroom - Al Quoz",
    nameAr: "غرفة اجتماعات تنفيذية - القوز",
    type: "meeting_room",
    location: "Al Quoz, Dubai",
    locationAr: "القوز، دبي",
    price: 350,
    currency: "AED",
    rating: 4.9,
    reviewCount: 89,
    image: meetingRoomImage,
    amenities: ["wifi", "screen", "ac", "whiteboard", "coffee", "video_conf"],
    capacity: 12,
    availability: "limited",
    description: "State-of-the-art boardroom with premium AV equipment, ideal for executive meetings and presentations.",
    descriptionAr: "غرفة اجتماعات حديثة مجهزة بأحدث تقنيات الصوت والفيديو، مثالية للاجتماعات التنفيذية والعروض التقديمية.",
    houseRules: ["Maximum 12 participants", "No food in the meeting room", "Leave the room as you found it"],
    cancellationPolicy: "Free cancellation up to 48 hours before booking",
    provider: "Premium Spaces Dubai"
  },
  {
    id: "3",
    name: "Skyline Private Office",
    nameAr: "مكتب سكاي لاين الخاص",
    type: "private_office",
    location: "DIFC, Dubai",
    locationAr: "مركز دبي المالي العالمي",
    price: 800,
    currency: "AED",
    rating: 4.7,
    reviewCount: 56,
    image: privateOfficeImage,
    amenities: ["wifi", "ac", "parking", "reception", "coffee", "printer", "meeting_room_access"],
    capacity: 4,
    availability: "available",
    description: "Premium private office in the heart of DIFC with dedicated reception and 24/7 access.",
    descriptionAr: "مكتب خاص فاخر في قلب مركز دبي المالي العالمي مع استقبال مخصص ووصول على مدار الساعة.",
    houseRules: ["24/7 access", "No overnight stays", "Professional dress code"],
    cancellationPolicy: "Free cancellation up to 7 days before booking",
    provider: "DIFC Offices"
  },
  {
    id: "4",
    name: "The Workshop Event Space",
    nameAr: "ذا ووركشوب - قاعة فعاليات",
    type: "event_space",
    location: "Alserkal Avenue, Dubai",
    locationAr: "السركال أفينيو، دبي",
    price: 1500,
    currency: "AED",
    rating: 4.9,
    reviewCount: 203,
    image: eventSpaceImage,
    amenities: ["wifi", "ac", "projector", "sound_system", "kitchen", "parking", "stage"],
    capacity: 100,
    availability: "available",
    description: "Industrial-chic event space perfect for workshops, launches, and corporate gatherings.",
    descriptionAr: "مساحة فعاليات بتصميم صناعي أنيق، مثالية لورش العمل وحفلات الإطلاق والتجمعات المؤسسية.",
    houseRules: ["Setup and breakdown times included", "Catering allowed", "Security deposit required"],
    cancellationPolicy: "50% refund if cancelled 14 days before event",
    provider: "Alserkal Spaces"
  },
  {
    id: "5",
    name: "Downtown Flex Desk",
    nameAr: "مكتب مرن داون تاون",
    type: "desk",
    location: "Downtown Dubai",
    locationAr: "وسط مدينة دبي",
    price: 95,
    currency: "AED",
    rating: 4.6,
    reviewCount: 178,
    image: hotDeskImage,
    amenities: ["wifi", "coffee", "ac", "printer"],
    capacity: 1,
    availability: "available",
    description: "Modern hot desk in the heart of Downtown with Burj Khalifa views.",
    descriptionAr: "مكتب مشترك حديث في قلب داون تاون مع إطلالات على برج خليفة.",
    houseRules: ["Quiet hours 9-5", "No personal belongings overnight"],
    cancellationPolicy: "Free cancellation up to 24 hours before",
    provider: "Downtown Works"
  },
  {
    id: "6",
    name: "Creative Studio Meeting Room",
    nameAr: "غرفة اجتماعات الاستوديو الإبداعي",
    type: "meeting_room",
    location: "JLT, Dubai",
    locationAr: "أبراج بحيرة الجميرا، دبي",
    price: 200,
    currency: "AED",
    rating: 4.5,
    reviewCount: 67,
    image: meetingRoomImage,
    amenities: ["wifi", "screen", "ac", "whiteboard"],
    capacity: 8,
    availability: "unavailable",
    description: "Inspiring meeting room designed for creative brainstorming sessions.",
    descriptionAr: "غرفة اجتماعات ملهمة مصممة لجلسات العصف الذهني الإبداعية.",
    houseRules: ["Maximum 8 participants", "Cleanup required"],
    cancellationPolicy: "Free cancellation up to 24 hours before",
    provider: "JLT Creative Hub"
  }
];

export const bookings: Booking[] = [
  {
    id: "BK-2024-001",
    spaceId: "1",
    spaceName: "The Hive Coworking - Hot Desk",
    spaceImage: hotDeskImage,
    date: "2024-01-15",
    startTime: "09:00",
    endTime: "17:00",
    duration: 8,
    totalPrice: 600,
    currency: "AED",
    status: "upcoming",
    location: "Dubai Marina, Dubai"
  },
  {
    id: "BK-2024-002",
    spaceId: "2",
    spaceName: "Executive Boardroom - Al Quoz",
    spaceImage: meetingRoomImage,
    date: "2024-01-20",
    startTime: "14:00",
    endTime: "16:00",
    duration: 2,
    totalPrice: 700,
    currency: "AED",
    status: "upcoming",
    location: "Al Quoz, Dubai"
  },
  {
    id: "BK-2023-089",
    spaceId: "3",
    spaceName: "Skyline Private Office",
    spaceImage: privateOfficeImage,
    date: "2023-12-10",
    startTime: "09:00",
    endTime: "18:00",
    duration: 9,
    totalPrice: 7200,
    currency: "AED",
    status: "completed",
    location: "DIFC, Dubai"
  }
];

export const spaceTypes = [
  { id: "desk", label: "Hot Desk", labelAr: "مكتب مشترك", icon: "Monitor" },
  { id: "meeting_room", label: "Meeting Room", labelAr: "غرفة اجتماعات", icon: "Users" },
  { id: "private_office", label: "Private Office", labelAr: "مكتب خاص", icon: "Building" },
  { id: "event_space", label: "Event Space", labelAr: "قاعة فعاليات", icon: "Calendar" }
];

export const amenityLabels: Record<string, { label: string; labelAr: string; icon: string }> = {
  wifi: { label: "High-Speed WiFi", labelAr: "واي فاي عالي السرعة", icon: "Wifi" },
  coffee: { label: "Free Coffee", labelAr: "قهوة مجانية", icon: "Coffee" },
  ac: { label: "Air Conditioning", labelAr: "تكييف", icon: "Snowflake" },
  printer: { label: "Printer", labelAr: "طابعة", icon: "Printer" },
  locker: { label: "Locker", labelAr: "خزانة", icon: "Lock" },
  screen: { label: "Display Screen", labelAr: "شاشة عرض", icon: "Monitor" },
  whiteboard: { label: "Whiteboard", labelAr: "لوح أبيض", icon: "PenTool" },
  video_conf: { label: "Video Conferencing", labelAr: "مؤتمرات الفيديو", icon: "Video" },
  parking: { label: "Parking", labelAr: "موقف سيارات", icon: "Car" },
  reception: { label: "Reception", labelAr: "استقبال", icon: "UserCheck" },
  meeting_room_access: { label: "Meeting Room Access", labelAr: "دخول غرف الاجتماعات", icon: "DoorOpen" },
  projector: { label: "Projector", labelAr: "جهاز عرض", icon: "Presentation" },
  sound_system: { label: "Sound System", labelAr: "نظام صوتي", icon: "Volume2" },
  kitchen: { label: "Kitchen", labelAr: "مطبخ", icon: "UtensilsCrossed" },
  stage: { label: "Stage", labelAr: "منصة", icon: "Layout" }
};

export const popularLocations = [
  { name: "Dubai Marina", nameAr: "دبي مارينا", count: 45 },
  { name: "DIFC", nameAr: "مركز دبي المالي العالمي", count: 38 },
  { name: "Downtown Dubai", nameAr: "وسط مدينة دبي", count: 52 },
  { name: "Business Bay", nameAr: "الخليج التجاري", count: 34 },
  { name: "JLT", nameAr: "أبراج بحيرة الجميرا", count: 28 },
  { name: "Abu Dhabi", nameAr: "أبوظبي", count: 67 }
];

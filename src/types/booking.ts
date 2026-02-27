export interface BookingData {
  stylist: {
    id: string;
    name: string;
    image: string;
  } | null;
  service: {
    id: string;
    name: string;
    price: number;
    duration: number;
  } | null;
  date: Date | null;
  time: string | null;
  customerInfo: {
    name: string;
    phone: string;
    email: string;
  };
  bookingId?: string;
}

import { supabase } from '@/integrations/supabase/client';

export interface Appointment {
  id: string;
  bookingNumber?: number;
  barberName: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  service: string;
  date: string;
  time: string;
  status: string;
  price: string;
  duration?: number;
  notes?: string;
  created_at?: string;
  updated_at?: string;
}

export const appointmentStore = {
  async getAppointments(): Promise<Appointment[]> {
    const { data, error } = await supabase
      .from('appointments')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching appointments:', error);
      return [];
    }

    return (data || []).map((item: any) => ({
      id: item.id,
      bookingNumber: item.booking_number,
      barberName: item.barber_name,
      customerName: item.customer_name,
      customerPhone: item.customer_phone,
      customerEmail: item.customer_email || '',
      service: item.service,
      date: item.date,
      time: item.time,
      status: item.status,
      price: item.price || '',
      duration: item.duration || 60,
      notes: item.notes || '',
      created_at: item.created_at,
      updated_at: item.updated_at,
    }));
  },

  async getAppointmentsByBarber(barberName: string, date: string): Promise<string[]> {
    const { data, error } = await supabase
      .from('appointments')
      .select('time, duration')
      .eq('barber_name', barberName)
      .eq('date', date)
      .in('status', ['pending', 'confirmed']);

    if (error) {
      console.error('Error fetching appointments by barber:', error);
      return [];
    }

    const blockedSlots: string[] = [];
    const allTimeSlots = [
      '10:00 AM', '10:15 AM', '10:30 AM', '10:45 AM',
      '11:00 AM', '11:15 AM', '11:30 AM', '11:45 AM', '12:00 PM', '12:15 PM', '12:30 PM', '12:45 PM',
      '1:00 PM', '1:15 PM', '1:30 PM', '1:45 PM', '2:00 PM', '2:15 PM', '2:30 PM', '2:45 PM',
      '3:00 PM', '3:15 PM', '3:30 PM', '3:45 PM', '4:00 PM', '4:15 PM', '4:30 PM', '4:45 PM',
      '5:00 PM', '5:15 PM', '5:30 PM', '5:45 PM', '6:00 PM', '6:15 PM', '6:30 PM', '6:45 PM',
      '7:00 PM', '7:15 PM', '7:30 PM', '7:45 PM', '8:00 PM'
    ];

    data.forEach(appointment => {
      const startTime = appointment.time;
      const duration = appointment.duration || 60;
      const startIndex = allTimeSlots.indexOf(startTime);
      
      if (startIndex !== -1) {
        const slotsToBlock = Math.ceil(duration / 15);
        for (let i = 0; i < slotsToBlock; i++) {
          const slotIndex = startIndex + i;
          if (slotIndex < allTimeSlots.length) {
            blockedSlots.push(allTimeSlots[slotIndex]);
          }
        }
      }
    });

    return blockedSlots;
  },

  async addAppointment(appointment: Omit<Appointment, 'id'>): Promise<Appointment | null> {
    const { data, error } = await supabase
      .from('appointments')
      .insert([{
        barber_name: appointment.barberName,
        customer_name: appointment.customerName,
        customer_phone: appointment.customerPhone,
        customer_email: appointment.customerEmail,
        service: appointment.service,
        date: appointment.date,
        time: appointment.time,
        status: appointment.status,
        price: appointment.price,
        duration: appointment.duration,
      }])
      .select()
      .single();

    if (error) {
      console.error('Error adding appointment:', error);
      return null;
    }

    return {
      id: data.id,
      bookingNumber: data.booking_number,
      barberName: data.barber_name,
      customerName: data.customer_name,
      customerPhone: data.customer_phone,
      customerEmail: data.customer_email || '',
      service: data.service,
      date: data.date,
      time: data.time,
      status: data.status,
      price: data.price || '',
      duration: data.duration || 60,
      created_at: data.created_at,
      updated_at: data.updated_at,
    };
  }
};

import { supabase } from '@/integrations/supabase/client';

export interface UnavailabilityEntry {
  id: string;
  barber_name: string;
  date: string;
  time_slots: string[];
  is_full_day: boolean;
  reason?: string;
  created_at?: string;
}

export const unavailabilityStore = {
  async getUnavailability(barberName: string, date: string): Promise<UnavailabilityEntry | null> {
    const { data, error } = await supabase
      .from('unavailability')
      .select('*')
      .eq('barber_name', barberName)
      .eq('date', date)
      .maybeSingle();

    if (error) {
      console.error('Error fetching unavailability:', error);
      return null;
    }

    return data;
  },

  async getUnavailableSlotsForDate(barberName: string, date: string): Promise<{ slots: string[], isFullDay: boolean }> {
    const entry = await this.getUnavailability(barberName, date);
    
    if (!entry) {
      return { slots: [], isFullDay: false };
    }

    return {
      slots: entry.time_slots || [],
      isFullDay: entry.is_full_day || false
    };
  },

  async addUnavailability(entry: Omit<UnavailabilityEntry, 'id' | 'created_at'>): Promise<UnavailabilityEntry | null> {
    const { data, error } = await supabase
      .from('unavailability')
      .insert([entry])
      .select()
      .single();

    if (error) {
      console.error('Error adding unavailability:', error);
      return null;
    }

    return data;
  },

  async updateUnavailability(id: string, updates: Partial<UnavailabilityEntry>): Promise<boolean> {
    const { error } = await supabase
      .from('unavailability')
      .update(updates)
      .eq('id', id);

    if (error) {
      console.error('Error updating unavailability:', error);
      return false;
    }

    return true;
  },

  async deleteUnavailability(id: string): Promise<boolean> {
    const { error } = await supabase
      .from('unavailability')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting unavailability:', error);
      return false;
    }

    return true;
  }
};

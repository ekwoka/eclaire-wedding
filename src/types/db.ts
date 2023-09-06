import { array, coerce, enums, object, string, trimmed } from 'superstruct';

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Guest {
  created_at?: string;
  dietary_restrictions?: string | null;
  id?: number;
  name: string;
  rsvp_id: number;
}

export const guest = object({
  name: trimmed(string()),
  dietary_restrictions: trimmed(string()),
});

export interface RSVP {
  can_attend?: number;
  created_at?: string;
  email: string;
  id?: number;
  name: string;
  other_notes: string;
}

export const rsvp = object({
  name: trimmed(string()),
  email: trimmed(string()),
  can_attend: coerce(enums([0, 1, 2]), string(), Number),
  other_notes: trimmed(string()),
});

export interface RSVPAddRequest {
  rsvp: RSVP;
  guests: Guest[];
}

export const rsvpAddRequest = object({
  rsvp,
  guests: array(guest),
});

export interface Database {
  public: {
    Tables: {
      guests: {
        Row: {
          created_at: string;
          dietary_restrictions: string | null;
          id: number;
          name: string;
          rsvp_id: number;
        };
        Insert: {
          created_at?: string;
          dietary_restrictions?: string | null;
          id?: number;
          name: string;
          rsvp_id: number;
        };
        Update: {
          created_at?: string;
          dietary_restrictions?: string | null;
          id?: number;
          name?: string;
          rsvp_id?: number;
        };
        Relationships: [
          {
            foreignKeyName: 'guests_rsvp_id_fkey';
            columns: ['rsvp_id'];
            referencedRelation: 'rsvp';
            referencedColumns: ['id'];
          },
        ];
      };
      rsvp: {
        Row: {
          can_attend: Attendance;
          created_at: string;
          email: string;
          id: number;
          name: string;
          other_notes: string;
        };
        Insert: {
          can_attend?: number;
          created_at?: string;
          email: string;
          id?: number;
          name: string;
          other_notes: string;
        };
        Update: {
          can_attend?: number;
          created_at?: string;
          email?: string;
          id?: number;
          name?: string;
          other_notes?: string;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
}

export enum Attendance {
  Yes = 1,
  No = 0,
  Maybe = 2,
}

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type DeviceType = "desktop" | "mobile" | "tablet" | "unknown";

export interface Database {
  public: {
    Tables: {
      qr_codes: {
        Row: {
          id: string;
          user_id: string | null;
          name: string | null;
          type: "url" | "text" | "wifi" | "vcard" | "email" | "phone" | "sms";
          content: string;
          destination_url: string | null;
          is_dynamic: boolean;
          short_code: string | null;
          foreground_color: string;
          background_color: string;
          size: number;
          error_correction: string;
          total_scans: number;
          unique_scans: number;
          last_scanned_at: string | null;
          created_at: string;
          updated_at: string;
          deleted_at: string | null;
        };
        Insert: {
          id?: string;
          user_id?: string | null;
          name?: string | null;
          type: "url" | "text" | "wifi" | "vcard" | "email" | "phone" | "sms";
          content: string;
          destination_url?: string | null;
          is_dynamic?: boolean;
          short_code?: string | null;
          foreground_color?: string;
          background_color?: string;
          size?: number;
          error_correction?: string;
          total_scans?: number;
          unique_scans?: number;
          last_scanned_at?: string | null;
          created_at?: string;
          updated_at?: string;
          deleted_at?: string | null;
        };
        Update: {
          id?: string;
          user_id?: string | null;
          name?: string | null;
          type?: "url" | "text" | "wifi" | "vcard" | "email" | "phone" | "sms";
          content?: string;
          destination_url?: string | null;
          is_dynamic?: boolean;
          short_code?: string | null;
          foreground_color?: string;
          background_color?: string;
          size?: number;
          error_correction?: string;
          total_scans?: number;
          unique_scans?: number;
          last_scanned_at?: string | null;
          created_at?: string;
          updated_at?: string;
          deleted_at?: string | null;
        };
      };
      scans: {
        Row: {
          id: string;
          qr_code_id: string;
          scanned_at: string;
          ip_address: string | null;
          visitor_id: string | null;
          is_unique: boolean;
          country: string | null;
          country_name: string | null;
          region: string | null;
          city: string | null;
          latitude: number | null;
          longitude: number | null;
          user_agent: string | null;
          device_type: DeviceType;
          browser: string | null;
          browser_version: string | null;
          os: string | null;
          os_version: string | null;
          referrer: string | null;
          language: string | null;
        };
        Insert: {
          id?: string;
          qr_code_id: string;
          scanned_at?: string;
          ip_address?: string | null;
          visitor_id?: string | null;
          is_unique?: boolean;
          country?: string | null;
          country_name?: string | null;
          region?: string | null;
          city?: string | null;
          latitude?: number | null;
          longitude?: number | null;
          user_agent?: string | null;
          device_type?: DeviceType;
          browser?: string | null;
          browser_version?: string | null;
          os?: string | null;
          os_version?: string | null;
          referrer?: string | null;
          language?: string | null;
        };
        Update: {
          id?: string;
          qr_code_id?: string;
          scanned_at?: string;
          ip_address?: string | null;
          visitor_id?: string | null;
          is_unique?: boolean;
          country?: string | null;
          country_name?: string | null;
          region?: string | null;
          city?: string | null;
          latitude?: number | null;
          longitude?: number | null;
          user_agent?: string | null;
          device_type?: DeviceType;
          browser?: string | null;
          browser_version?: string | null;
          os?: string | null;
          os_version?: string | null;
          referrer?: string | null;
          language?: string | null;
        };
      };
      profiles: {
        Row: {
          id: string;
          email: string | null;
          full_name: string | null;
          avatar_url: string | null;
          plan: string;
          stripe_customer_id: string | null;
          dynamic_qr_limit: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email?: string | null;
          full_name?: string | null;
          avatar_url?: string | null;
          plan?: string;
          stripe_customer_id?: string | null;
          dynamic_qr_limit?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string | null;
          full_name?: string | null;
          avatar_url?: string | null;
          plan?: string;
          stripe_customer_id?: string | null;
          dynamic_qr_limit?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
  };
}

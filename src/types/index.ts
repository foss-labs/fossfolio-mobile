import type React from "react";

export type Child = {
  children: React.ReactNode;
};

export interface User {
  id: string;
  display_name: string;
  email: string;
  slug: string;
  photo_url: string;
  is_student: boolean;
  college_name?: string;
  refresh_token: string;
}

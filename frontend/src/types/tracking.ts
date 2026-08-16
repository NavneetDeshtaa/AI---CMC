export interface Notification {
  id: string;
  title: string;
  message: string;
  is_read: boolean;
  contract_id: string | null;
  created_at: string;
}

export interface RenewalObligation {
  id: string;
  contract_id: string;
  item_type: "renewal" | "obligation";
  title: string;
  description: string | null;
  due_date: string;
  notice_period_days: number | null;
  is_completed: boolean;
}
export interface SystemStatus {
  redis: string;
  celery_workers: string[];
  celery_worker_count: number;
}

export interface ActivityItem {
  message: string;
  time: string;
}

const STORAGE_KEY = "recentActivities";

export function addActivity(message: string) {
  const activities: ActivityItem[] = JSON.parse(
    localStorage.getItem(STORAGE_KEY) || "[]"
  );

  activities.unshift({
    message,
    time: new Date().toLocaleString(),
  });

  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(activities.slice(0, 10))
  );
}

export function getActivities(): ActivityItem[] {
  return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
}

export function clearActivities() {
  localStorage.removeItem(STORAGE_KEY);
}
export type ScheduleTypes = "completed" | "ongoing" | "delayed" | "scheduled";

export interface GanttData {
  id: number;
  task_name: string;
  start: string;
  end: string;
  schedule_type: ScheduleTypes;
}

export const gantData: Array<GanttData> = [
  {
    id: 1,
    task_name: "Sprint 1",
    start: "09-11-2023",
    end: "09-21-2023",
    schedule_type: "completed",
  },
  {
    id: 2,
    task_name: "Sprint 2",
    start: "09-22-2023",
    end: "10-02-2023",
    schedule_type: "completed",
  },
  {
    id: 3,
    task_name: "Sprint 3",
    start: "10-02-2023",
    end: "10-16-2023",
    schedule_type: "ongoing",
  },
  {
    id: 4,
    task_name: "Sprint 4",
    start: "10-16-2023",
    end: "10-30-2023",
    schedule_type: "delayed",
  },
  {
    id: 5,
    task_name: "Sprint 5",
    start: "11-01-2023",
    end: "11-12-2023",
    schedule_type: "scheduled",
  },
];

import * as z from "zod";

export const attendanceSchema = z.object({
  id: z.string().optional(),
  date: z.string(),
  shift: z.string(),
  staff_id: z.string(),
});

export type AttendanceSchema = z.infer<typeof attendanceSchema>;

export type GroupedAttendance = {
  id: string;
  date: string;
  shift: string;
  [roleName: string]: string;
};

export type AttendanceFormData = {
  date: string;
  shift: string;
  [roleIdKey: string]: string;
};

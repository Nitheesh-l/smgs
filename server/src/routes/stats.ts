import { Router, Request, Response } from 'express';
import { getDb } from '../mongo';

const router = Router();

router.get('/', async (req: Request, res: Response) => {
  try {
    const db = getDb();
    const studentsCount = await db.collection('students').countDocuments();
    const totalSubjects = await db.collection('subjects').countDocuments();

    // Today's date string (assumes attendance.date stored as ISO string YYYY-MM-DD)
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    const todayStr = `${yyyy}-${mm}-${dd}`;

    const attendanceToday = await db.collection('attendance').countDocuments({ date: todayStr, status: 'Present' });

    // Average attendance for current month: average of (periods_present / total_periods) * 100 across attendance docs
    const month = today.getMonth() + 1;
    const year = today.getFullYear();

    const agg = await db.collection('attendance').aggregate([
      { $match: { month: month, year: year } },
      { $project: { pct: { $multiply: [{ $divide: ['$periods_present', '$total_periods'] }, 100] } } },
      { $group: { _id: null, avgPct: { $avg: '$pct' } } },
    ]).toArray();

    const avgAttendance = agg[0]?.avgPct ? Math.round(agg[0].avgPct * 10) / 10 : 0; // one decimal

    res.json({
      totalStudents: studentsCount,
      attendanceToday,
      avgAttendance,
      totalSubjects,
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
});

export default router;
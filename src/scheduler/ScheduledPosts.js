import cron from "node-cron";
import { db } from "../utils/database.js";
import { verbose, critical } from "../utils/logger.js";

export const runScheduler = () => {
  cron.schedule("* * * * *", async () => {
    try {
      const result = await db.query(
        `UPDATE posts
        SET is_scheduled = FALSE          -- stop overwriting created_at
        WHERE is_scheduled = TRUE
        AND scheduled_at IS NOT NULL
        AND scheduled_at <= NOW()         -- both UTC-aware now
        RETURNING id, user_id, scheduled_at`
      );

      if (result.rowCount > 0) {
        verbose("[SCHEDULER] Published scheduled posts:", result.rows);
      }
    } catch (err) {
      critical("[SCHEDULER ERROR]", err);
    }
  });
};

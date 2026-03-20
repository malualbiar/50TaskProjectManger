import { api } from './api'

// ── Owner (Admin) endpoints ───────────────────────────────────────────────────

/**
 * GET /api/projects/owner-projects-summary/
 * Returns list of projects for the owner's organisation with task counts.
 */
export async function getOwnerProjects() {
  return api.get('/projects/owner-projects-summary/')
}

/**
 * GET /api/projects/owner-dashboard-metrics/
 * Returns aggregate metrics: total/pending/in_progress/completed projects & tasks.
 */
export async function getOwnerMetrics() {
  return api.get('/projects/owner-dashboard-metrics/')
}

/**
 * GET /api/projects/owner/analytics/managers/
 * Returns per-manager performance analytics.
 */
export async function getManagerAnalytics() {
  return api.get('/projects/owner/analytics/managers/')
}

// ── Manager (PM) endpoints ────────────────────────────────────────────────────

/**
 * POST /api/projects/create-project/
 * Body: { name, start_date, end_date }
 */
export async function createProject(data) {
  return api.post('/projects/create-project/', data)
}

/**
 * POST /api/projects/create-tasks/
 * Body: { title, project (id), assigned_to (user id), start_date, end_date }
 */
export async function createTask(data) {
  return api.post('/projects/create-tasks/', data)
}

// ── Member endpoints ──────────────────────────────────────────────────────────

/**
 * PATCH /api/projects/<id>/update-task-status/
 * Body: { status }  (allowed: "IN_PROGRESS" | "COMPLETED")
 */
export async function updateTaskStatus(taskId, status) {
  return api.patch(`/projects/${taskId}/update-task-status/`, { status })
}

// ── Shared endpoints ──────────────────────────────────────────────────────────

/**
 * GET /api/projects/projects/<id>/gantt/
 * Returns gantt-formatted task data for a project.
 */
export async function getGanttData(projectId) {
  return api.get(`/projects/projects/${projectId}/gantt/`)
}

// ── Activity Logs ─────────────────────────────────────────────────────────────

/**
 * GET /api/logs/activity-logs/
 * Returns activity log entries for the organisation.
 */
export async function getActivityLogs() {
  return api.get('/logs/activity-logs/')
}

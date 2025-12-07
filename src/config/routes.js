/**
 * Route Configuration
 * 
 * This module defines all application routes with their access control requirements.
 * 
 * Access Levels:
 * - PUBLIC: No authentication required (landing, courses, lessons)
 * - AUTHENTICATED: Requires user to be logged in (creator dashboard)
 * - ADMIN: Requires admin email (aakash.mufc@gmail.com)
 */

export const ACCESS_LEVELS = {
    PUBLIC: 'public',
    AUTHENTICATED: 'authenticated',
    ADMIN: 'admin'
}

/**
 * Route definitions with metadata
 * Each route specifies its path, component, and access level
 */
export const ROUTES = {
    // ========================================
    // PUBLIC ROUTES - No login required
    // ========================================

    // Auth pages
    LOGIN: {
        path: '/login',
        access: ACCESS_LEVELS.PUBLIC
    },
    AUTH_CALLBACK: {
        path: '/auth/callback',
        access: ACCESS_LEVELS.PUBLIC
    },

    // Main content pages - accessible to everyone
    HOME: {
        path: '/',
        access: ACCESS_LEVELS.PUBLIC
    },
    COURSES: {
        path: '/courses',
        access: ACCESS_LEVELS.PUBLIC
    },
    COURSE_DETAIL: {
        path: '/courses/:courseId',
        access: ACCESS_LEVELS.PUBLIC
    },
    LESSON: {
        path: '/courses/:courseId/lesson/:lessonId',
        access: ACCESS_LEVELS.PUBLIC
    },

    // ========================================
    // AUTHENTICATED ROUTES - Login required
    // ========================================

    CREATOR_DASHBOARD: {
        path: '/creator',
        access: ACCESS_LEVELS.AUTHENTICATED
    },

    // ========================================
    // ADMIN ROUTES - Admin email required
    // ========================================

    ADMIN: {
        path: '/admin',
        access: ACCESS_LEVELS.ADMIN
    },
    ADMIN_COURSES: {
        path: '/admin/courses',
        access: ACCESS_LEVELS.ADMIN
    },
    ADMIN_COURSE_DETAIL: {
        path: '/admin/courses/:courseId',
        access: ACCESS_LEVELS.ADMIN
    },
    ADMIN_LESSON_EDITOR: {
        path: '/admin/lesson/:lessonId',
        access: ACCESS_LEVELS.ADMIN
    },
    ADMIN_QUESTIONS: {
        path: '/admin/questions',
        access: ACCESS_LEVELS.ADMIN
    },
    ADMIN_SETTINGS: {
        path: '/admin/settings',
        access: ACCESS_LEVELS.ADMIN
    }
}

/**
 * Helper to check if a route is public
 */
export const isPublicRoute = (path) => {
    return Object.values(ROUTES).some(
        route => route.path === path && route.access === ACCESS_LEVELS.PUBLIC
    )
}

/**
 * Admin email - single source of truth
 */
export const ADMIN_EMAIL = 'aakash.mufc@gmail.com'

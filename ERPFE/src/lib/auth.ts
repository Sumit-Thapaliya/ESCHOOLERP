/**
 * Auth constants shared by the login screens and the flow store.
 *
 * The mocks that used to live here (DEMO_OTP, a fake requestOtp/verifyOtp) are
 * gone. Real calls live in src/lib/api/auth.ts and go through our own
 * /api/auth/* routes so the refresh token can stay in an httpOnly cookie.
 *
 * Values mirror the backend's platform-auth.constants.ts:
 *   OTP_TTL_MS = 5 * 60 * 1000, OTP_MAX_ATTEMPTS = 5
 */
export const OTP_LENGTH = 6;
export const OTP_TTL_SECONDS = 300;
export const OTP_MAX_ATTEMPTS = 5;

/**
 * There is NO resend endpoint on either plane - a fresh code requires a fresh
 * login. When the challenge expires the user goes back to the credentials step
 * rather than being offered a resend that cannot exist.
 */
export const CAN_RESEND_OTP = false;

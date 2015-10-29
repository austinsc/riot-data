export const mongodb = 'mongodb://localhost:27017';
export const timeout = 10 * 1000; // 10 seconds
export const requestCap = 500; // 500 Requests - Production will be 180;000.
export const requestDuration = 10 * 60 * 1000; // 10 Minutes
export const requestDelay = Math.ceil(1 / (requestCap / requestDuration)); // Required wait time between requests.
export const teamInfoLimit = 10; // We can look up 10 teams via the teamInfoApi at a time.
export const regions = [ 'br', 'eune', 'euw', 'kr', 'lan', 'las', 'na', 'oce', 'ru', 'tr' ];
export const tiers = [ 'challenger', 'master' ];
export const apiKey = '5f1c0c7d-d474-4b79-8480-a53c9c41ad60';
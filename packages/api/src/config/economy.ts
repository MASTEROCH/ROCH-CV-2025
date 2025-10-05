// Economy constants for the game
export const ECONOMY_CONFIG = {
  // Roulette configuration
  ROULETTE: {
    SEGMENTS: 8,
    FREE_SPIN_COOLDOWN: 24 * 60 * 60 * 1000, // 24 hours in milliseconds
    AUTO_SPIN_DELAY: 2000, // 2 seconds between auto spins
  },

  // Currency conversion rates
  CONVERSION: {
    COINS_TO_TICKETS: 900, // 900 coins = 1 ticket
    TICKETS_TO_COINS: 900, // 1 ticket = 900 coins
  },

  // Default rewards
  REWARDS: {
    DAILY_LOGIN: 100, // coins
    FIRST_SPIN: 50, // coins
    WIN_3_TIMES: 200, // coins
    INVITE_FRIEND: 500, // coins
    STREAK_BONUS: 50, // coins per day
  },

  // Starting balances
  STARTING_BALANCE: {
    COINS: 1000,
    TICKETS: 1,
    TON_GAME: 0,
  },

  // Shop prices (in TON)
  SHOP_PRICES: {
    COINS_100: 0.1,
    COINS_500: 0.45,
    COINS_1000: 0.8,
    STARTER_PACK: 1.0,
  },

  // Streak configuration
  STREAK: {
    MAX_DAYS: 7,
    BONUS_MULTIPLIER: 1.5,
  },

  // Task configuration
  TASKS: {
    DAILY_RESET_HOUR: 0, // UTC hour
    WEEKLY_RESET_DAY: 1, // Monday (0 = Sunday)
  },
} as const;
import { betterAuth } from 'better-auth'
import {tanstackStartCookies} from "better-auth/tanstack-start";

export const auth = betterAuth({
  emailAndPassword: {
    enabled: true,
  },


  plugins: [
      // Core
      tanstackStartCookies()        // SHOULD ALWAYS BE AT THE END
  ]
})

import { monitor } from '@colyseus/monitor'
import { playground } from '@colyseus/playground'
import type { Router } from 'express'
import basicAuth from 'express-basic-auth'

const basicAuthMiddleware = basicAuth({
  users: {
    [process.env.ADMIN_USER]: process.env.ADMIN_PASSWORD,
  },
  challenge: true,
})

export const colyseusRoutes = (app: Router, isProduction: boolean) => {
  app.get('/health', (req, res) => {
    res.status(200).send("It's time to kick ass and chew bubblegum!")
  })

  if (!isProduction) {
    app.use('/', playground)
  }

  app.use('/colyseus', monitor())
}

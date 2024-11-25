import config from '@colyseus/tools'

import { RedisDriver, RedisPresence } from 'colyseus'
import type e from 'express'
import { Router } from 'express'
import 'dotenv/config'
import { colyseusRoutes } from './routes/BasicColyseusRoute'

import Redis from 'ioredis'
import { MyRoom } from './rooms/MyRoom'

export default config({
    initializeGameServer: (gameServer) => {
        gameServer
            .define('caro', MyRoom)
            .filterBy(['roomType', 'roomMode'])
            .sortBy({ createdAt: 'ascending' })
        console.log('Game server rooms defined successfully.')
    },

    initializeExpress: (app: e.Express) => {
        const router = Router()
        colyseusRoutes(app, process.env.NODE_ENV === 'production')
        app.use('/api', router)
    },

    options: {
        presence: new RedisPresence({
            port: Number(process.env.REDIS_PORT),
            host: process.env.REDIS_HOST,
            tls: process.env.NODE_ENV === 'dev' ? null : {},
        }),
        driver: new RedisDriver({
            port: Number(process.env.REDIS_PORT),
            host: process.env.REDIS_HOST,
            tls: process.env.NODE_ENV === 'dev' ? null : {},
        }),
        publicAddress: `${process.env.PUBLIC_IP}${process.env.NODE_ENV === 'dev' ? `:${process.env.PORT}` : ''}`,
    },

    beforeListen: async () => {
        console.log(`Server public address: ${process.env.PUBLIC_IP}`)
        console.log(
            `Connecting to Redis at ${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`,
        )

        const redis = new Redis({
            host: process.env.REDIS_HOST,
            port: Number(process.env.REDIS_PORT),
            tls: process.env.NODE_ENV === 'dev' ? null : {},
        })

        try {
            const response = await redis.ping()
            if (response === 'PONG') {
                console.log('Connected to Redis successfully.')
            } else {
                console.error('Pong not received: ', response)
            }
        } catch (error) {
            console.error('Failed to connect to Redis:', error)
        } finally {
            redis.disconnect() // Clean up connection
        }
    },
})

import { ArraySchema, Schema, type } from '@colyseus/schema'
import type { Client } from 'colyseus'

export class PlayerSchema extends Schema {
    @type('string') id: string
    @type('boolean') connected: boolean
    @type('number') penalty = 0
    address: string
    username: string
    avatar: string

    constructor(client: Client, stats: Record<string, any>) {
        super()
        this.id = client.sessionId
        this.connected = true
        this.address = client.userData.address
        this.username = client.userData.name
        this.avatar = client.userData.avatar
    }
}

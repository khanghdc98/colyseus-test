import { MapSchema, Schema, type } from '@colyseus/schema'
import { PlayerSchema } from './Player'

export class BaseRoomSchema extends Schema {
  @type({ map: PlayerSchema }) players = new MapSchema<PlayerSchema>()
  @type('number') gameOver = 0
}

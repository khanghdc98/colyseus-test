import { Room, ServerError, type Client } from "@colyseus/core";
import { BaseRoomSchema, MyRoomState } from "./schema/MyRoomState";

export class MyRoom extends Room<MyRoomState> {
  maxClients = 2;
  roomType: string | undefined;
  roomMode: string | undefined;
  createdAt: number | undefined;
  protected protectPassword: string | undefined;

  onCreate(options: any) {
    console.log('room created:', this.roomId)
    this.setState(new BaseRoomSchema())
    this.createdAt = new Date().getTime()
    if (options.password)
      this.protectPassword = options.password
    if (!Number.isNaN(options.maxClients) && options.maxClients < this.maxClients) {
      this.maxClients = options.maxClients
    }

    this.onMessage("*", (client: Client, data: any) => {
      console.warn('Unregistered actions', client.sessionId, data)
    })
  }

  async onAuth(client: Client, options: any) {
    try {
      if (this.protectPassword && this.protectPassword !== options.password) {
        throw new Error('protectPassword not matching')
      }


      return true
    } catch (error: any) {
      throw new ServerError(401, error.message)
    }
  }

  onJoin(client: Client, options: any) {
    console.log(client.sessionId, "joined!");
  }

  onLeave(client: Client, consented: boolean) {
    console.log(client.sessionId, "left!");
  }

  onDispose() {
    console.log("room", this.roomId, "disposing...");
  }

}

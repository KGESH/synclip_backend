import { Injectable } from '@nestjs/common';
import { ISocketConnection } from '../dtos/socket.dto';

@Injectable()
export class ConnectionService {
  private connectedClients: ISocketConnection[] = []; // Todo: extract to redis

  getConnections() {
    return this.connectedClients;
  }

  addConnection(connection: ISocketConnection) {
    this.connectedClients.push(connection);
  }

  findConnectionByMac({ mac }: Pick<ISocketConnection, 'mac'>) {
    return this.connectedClients.find((c) => c.mac === mac);
  }

  updateConnection({
    mac,
    ...args
  }: Pick<ISocketConnection, 'mac'> & Partial<ISocketConnection>) {
    this.connectedClients = this.connectedClients.map((c) => {
      if (c.mac === mac) {
        return {
          ...c,
          ...args,
        };
      }
      return c;
    });
  }

  removeConnection(clientId: string) {
    this.connectedClients = this.connectedClients.filter(
      (c) => c.socketId !== clientId,
    );
  }
}

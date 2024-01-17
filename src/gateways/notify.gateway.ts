import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import typia from 'typia';
import { Server, Socket } from 'socket.io';
import { DeviceService } from '../services/device.service';
import { ConnectionService } from '../services/connection.service';
import { Logger } from '@nestjs/common';
import { ISocketConnection, ISocketMessage } from '../dtos/socket.dto';
import { DeviceType } from '@prisma/client';
import { IDevice } from '../dtos/device.dto';
import { FcmService } from '../services/fcm.service';
import { IBinaryFileUpload, ITextUpload } from '../dtos/drive.dto';

@WebSocketGateway(3030, { cors: { origin: '*' } })
export class NotifyGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  private readonly logger = new Logger(NotifyGateway.name);
  @WebSocketServer() private server!: Server;

  constructor(
    private readonly connectionService: ConnectionService,
    private readonly deviceService: DeviceService,
    private readonly fcmService: FcmService,
  ) {}

  afterInit(server: Server) {
    this.logger.log('==========Websocket server init==========');
  }

  async handleConnection(client: Socket) {
    this.logger.debug(`==========Websocket client connected==========`);

    const url = client.request.url;
    const params = new URLSearchParams(url?.split('?')[1]);

    const validated = typia.is<Pick<IDevice, 'mac' | 'deviceType'>>({
      mac: params.get('mac'),
      deviceType: params.get('deviceType'),
    });

    if (!validated) {
      this.logger.log(`Invalid socket connection params`, params);
      return;
    }

    const mac = params.get('mac') as string;
    const deviceType = params.get('deviceType') as DeviceType;
    const device = await this.deviceService.findDevice({ mac });

    const connection: ISocketConnection = {
      mac,
      deviceType,
      socketId: client.id,
      deviceId: device?.id || null,
      userId: device?.userId || null,
    };

    this.connectionService.addConnection(connection);
    this.logger.log('clients', this.connectionService.getConnections());
  }

  handleDisconnect(client: Socket) {
    this.logger.debug(
      `==========Websocket client disconnected==========`,
      client.id,
    );

    // Remove client
    this.connectionService.removeConnection(client.id);
  }

  @SubscribeMessage('health')
  handleHealthCheck(
    @MessageBody() data: unknown,
    @ConnectedSocket() client: Socket,
  ) {
    this.logger.debug('[Websocket health check]', data);
    client.emit('pong', 'pong');
  }

  @SubscribeMessage('copy')
  async copyHandler(
    @MessageBody() data: unknown,
    @ConnectedSocket() client: Socket,
  ) {
    this.logger.debug(
      `==========Websocket copy message received==========`,
      data,
    );

    const isValidated = typia.is<ITextUpload | IBinaryFileUpload>(data);

    if (!isValidated) return;

    this.logger.debug(this.connectionService.getConnections());

    const connections = this.connectionService.getConnections();

    const copiedDevice = connections.find(
      (connection) => connection.socketId === client.id,
    );

    if (!copiedDevice || !copiedDevice.userId) {
      this.logger.log(`Copied device not found or not registered`);
      return;
    }

    const devices = await this.deviceService.findDevices({
      userId: copiedDevice.userId,
    });

    // How to get desktop devices and mobile devices more fancy?
    const devicesWithoutCopiedDevice = devices.filter(
      (device) => device.id !== copiedDevice.deviceId,
    );

    const [desktops, mobiles] = this._splitDevicesByType(
      devicesWithoutCopiedDevice,
    );

    // Todo: validate data
    await this.fcmService.sendNotification({
      mobiles,
      type: 'silent',
      payload: data as ITextUpload | IBinaryFileUpload,
    });

    const desktopConnectionIds = this._getDesktopConnectionIds(
      connections,
      desktops,
    );

    this.emitToDesktops({
      connectionIds: desktopConnectionIds,
      event: 'paste',
      data,
    });
  }

  emitToDesktops<T>({ connectionIds, event, data }: ISocketMessage<T>) {
    if (connectionIds.length === 0) {
      this.logger.log(`No other connection ids`);
      return;
    }

    this.logger.verbose(`Emit to desktops`, connectionIds, data);
    this.server.to(connectionIds).emit(event, data);
  }

  private _splitDevicesByType(devices: IDevice[]) {
    return devices.reduce(
      ([desktops, mobiles], device) => {
        device.deviceType === DeviceType.PC
          ? desktops.push(device)
          : mobiles.push(device);
        return [desktops, mobiles];
      },
      [[] as IDevice[], [] as IDevice[]],
    );
  }

  private _getDesktopConnectionIds(
    connections: ISocketConnection[],
    desktopDevices: IDevice[],
  ) {
    return connections
      .filter((connection) =>
        desktopDevices.some((desktop) => desktop.id === connection.deviceId),
      )
      .map((connection) => connection.socketId);
  }
}

import { Injectable, Logger } from '@nestjs/common';
import * as firebase from 'firebase-admin';
import {
  IFcmNotificationWithoutPayload,
  IFcmSilentPayload,
  IFcmSilentNotification,
  IFcmNotificationContent,
  INotification,
} from '../dtos/fcm.dto';
import { IDevice } from '../dtos/device.dto';
import { UnknownException } from '../exceptions/unknown.exception';

@Injectable()
export class FcmService {
  private readonly logger = new Logger(FcmService.name);

  async sendNotification(notification: INotification) {
    try {
      if (notification.type === 'silent') {
        return this._sendDataToDevices(
          notification.mobiles,
          notification.payload,
        );
      } else {
        return this._sendNotificationToDevices(
          notification.mobiles,
          notification.content,
        );
      }
    } catch (e) {
      throw new UnknownException(e);
    }
  }

  private async _sendDataToDevices(
    mobiles: IDevice[],
    payload: IFcmSilentPayload,
  ) {
    const promises = mobiles.map((device) => {
      return this._sendSilentNotification({
        fcmToken: device.fcmToken,
        payload,
      });
    });

    Promise.allSettled(promises).then((results) => {
      results.forEach((result) => {
        if (result.status === 'rejected') {
          this.logger.debug(`Failed to send notification`);
          this.logger.debug(result.reason);
        } else {
          this.logger.debug(`Success to send notification`);
          this.logger.debug(result.value);
        }
      });
    });
  }

  private async _sendNotificationToDevices(
    mobiles: IDevice[],
    content: IFcmNotificationContent,
  ) {
    const promises = mobiles.map((device) => {
      return this._sendNotification({
        fcmToken: device.fcmToken,
        title: content.title,
        body: content.body,
      });
    });

    Promise.allSettled(promises).then((results) => {
      results.forEach((result) => {
        if (result.status === 'rejected') {
          this.logger.debug(`Failed to send notification`);
          this.logger.debug(result.reason);
        } else {
          this.logger.debug(`Success to send notification`);
          this.logger.debug(result.value);
        }
      });
    });
  }

  private async _sendSilentNotification({
    fcmToken,
    payload,
  }: IFcmSilentNotification) {
    return firebase.messaging().send({
      token: fcmToken,
      data: {
        payload: JSON.stringify(payload),
      },
    });
  }

  private async _sendNotification({
    fcmToken,
    title,
    body,
  }: IFcmNotificationWithoutPayload) {
    return firebase.messaging().send({
      token: fcmToken,
      notification: { title, body },
    });
  }
}

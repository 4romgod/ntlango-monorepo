import type { RealtimeEventEnvelope } from '@/websocket/gateway';

export const LOCAL_WEBSOCKET_DOMAIN_NAME = 'local.websocket.internal';

type LocalConnectionSender = (serializedPayload: string) => void;

const localConnectionSenders = new Map<string, LocalConnectionSender>();

export const registerLocalConnection = (connectionId: string, sender: LocalConnectionSender): void => {
  localConnectionSenders.set(connectionId, sender);
};

export const unregisterLocalConnection = (connectionId: string): void => {
  localConnectionSenders.delete(connectionId);
};

export const postToLocalConnection = async <TPayload>(
  connectionId: string,
  payload: RealtimeEventEnvelope<TPayload>,
): Promise<void> => {
  const sender = localConnectionSenders.get(connectionId);

  if (!sender) {
    const goneError = new Error('Connection is no longer available') as Error & {
      name: string;
      $metadata: { httpStatusCode: number };
    };
    goneError.name = 'GoneException';
    goneError.$metadata = { httpStatusCode: 410 };
    throw goneError;
  }

  sender(JSON.stringify(payload));
};

import { atom } from 'recoil';

export const channelState = atom({
  key: 'channel',
  default: { channelId: null },
});

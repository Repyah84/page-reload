import { HostInterval } from 'src/background/models/host-interval';
import { RuntimeMessageStartReloadData } from './runtime-message-start-reload-data.type';

export interface TabReload extends RuntimeMessageStartReloadData {
  startReloadDate: number | null;
  interval: HostInterval;
}

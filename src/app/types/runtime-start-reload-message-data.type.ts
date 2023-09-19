import { RuntimeTabDto } from '../dto/runtime-tab-dto.type';

export interface RuntimeStartReloadMessageData extends RuntimeTabDto {
  tabId: number;
}

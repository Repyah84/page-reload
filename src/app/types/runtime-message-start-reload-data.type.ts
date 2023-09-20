import { RuntimeTabDto } from '../dto/runtime-tab-dto.type';

export interface RuntimeMessageStartReloadData extends RuntimeTabDto {
  tabId: number;
}

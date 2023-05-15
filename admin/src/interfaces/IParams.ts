import {IPagination} from "./IPagination";

export interface IParams {
  pagination: IPagination,
  filters: any,
  sort: any,
  _q: string
}

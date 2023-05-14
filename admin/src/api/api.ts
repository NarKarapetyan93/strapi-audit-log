import axiosInstance from '../../src/utils/axiosInstance';
import {IParams} from "../interfaces/IParams";

const apiRequest = {
  getLogs: async (params: IParams) => {
    return axiosInstance.get(`/audit-log`, {params});
  },
  getLog: async (id: number) => {
    return axiosInstance.get(`/audit-log/${id}`);
  },
};
export default apiRequest;

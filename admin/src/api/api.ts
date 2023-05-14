import axiosInstance from '../../src/utils/axiosInstance';
import {IParams} from "../interfaces/IParams";

const apiRequest = {
  getLogs: async (params: IParams) => {
    return axiosInstance.get(`/audit-log`, {params});
  },
  getLog: async (id: number) => {
    return axiosInstance.get(`/audit-log/${id}`);
  },
  getContentTypes: async () => {
    return axiosInstance.get(`/audit-log/content-types`);
  },
};
export default apiRequest;

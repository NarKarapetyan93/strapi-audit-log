import axiosInstance from '../../src/utils/axiosInstance';

const apiRequest = {
  getLogs: async () => {
    return axiosInstance.get(`/audit-log`);
  },
  getLog: async (id: number) => {
    return axiosInstance.get(`/audit-log/${id}`);
  },
};
export default apiRequest;

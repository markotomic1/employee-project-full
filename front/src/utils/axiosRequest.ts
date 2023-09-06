import axios from "axios";
export const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
  headers: { "Content-Type": "application/json" },
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";

// export default class HTTPRequest {
//   private axiosInstance: AxiosInstance;

//   constructor(config?: { noToken?: boolean }) {
//     let token = localStorage.getItem("token");
//     this.axiosInstance = axios.create({
//       baseURL: "http://localhost:3000/app/",
//       headers: {
//         "Content-Type": "application/json",
//         Authorization:
//           token && !config?.noToken
//             ? "Bearer " + localStorage.getItem("token")
//             : "",
//       },
//     });
//   }

//   // async request<T>(
//   //   method: string,
//   //   url: string,
//   //   data?: {} | null,
//   //   config: AxiosRequestConfig = {}
//   // ): Promise<T> {
//   //   try {
//   //     const response: AxiosResponse<T> = await this.axiosInstance({
//   //       method,
//   //       url,
//   //       data,
//   //       ...config,
//   //     });
//   //     return response.data;
//   //   } catch (error) {
//   //     throw new Error("error.message");
//   //   }
//   // }

//   // async get<T>(
//   //   url: string,
//   //   params?: {},
//   //   config?: AxiosRequestConfig
//   // ): Promise<T> {
//   //   return this.request<T>("GET", url, null, { params, ...config });
//   // }

//   // async post<T>(
//   //   url: string,
//   //   data?: any,
//   //   config?: AxiosRequestConfig
//   // ): Promise<T> {
//   //   return this.request<T>("POST", url, data, config);
//   // }
//   // async patch<T>(
//   //   url: string,
//   //   data?: any,
//   //   config?: AxiosRequestConfig
//   // ): Promise<T> {
//   //   return this.request<T>("PATCH", url, data, config);
//   // }
//   // async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
//   //   return this.request<T>("DELETE", url, { data: null }, config);
//   // }
// }
// export const api = new HTTPRequest();

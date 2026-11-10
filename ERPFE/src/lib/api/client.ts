import type { AxiosRequestConfig } from "axios";
import { http } from "@/lib/axios";

/**
 * Verb helpers over the shared axios instance.
 *
 * The instance itself - baseURL, headers, envelope unwrap, 401 refresh - lives
 * in "@/lib/axios". This file only turns `AxiosResponse<T>` into `T`, so call
 * sites read like `const users = await get<User[]>("/users")`.
 */
export { http, mintAccessToken } from "@/lib/axios";

export async function get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
  return (await http.get<T>(url, config)).data;
}

export async function post<T>(url: string, body?: unknown, config?: AxiosRequestConfig): Promise<T> {
  return (await http.post<T>(url, body, config)).data;
}

export async function patch<T>(url: string, body?: unknown, config?: AxiosRequestConfig): Promise<T> {
  return (await http.patch<T>(url, body, config)).data;
}

export async function put<T>(url: string, body?: unknown, config?: AxiosRequestConfig): Promise<T> {
  return (await http.put<T>(url, body, config)).data;
}

export async function del<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
  return (await http.delete<T>(url, config)).data;
}

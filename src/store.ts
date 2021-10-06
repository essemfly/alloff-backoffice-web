import { writable } from "svelte/store";
import { Admin, AdminUserApi } from "./api";

export const admin = writable<Admin | undefined>(undefined);

import { writable } from "svelte/store";
import { Admin } from "./api";

export const admin = writable<Admin | undefined>(undefined);

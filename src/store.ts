import { Admin } from "@lessbutter/alloff-backoffice-api";
import { writable } from "svelte/store";
import { useCore } from "./core/CoreProvider";

export const admin = writable<Admin | undefined>(undefined);

const { apiConfig } = useCore();
export { apiConfig };

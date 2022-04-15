import { writable } from "svelte/store";
import { Admin, Configuration } from "@lessbutter/alloff-backoffice-api";

export const admin = writable<Admin | undefined>(undefined);

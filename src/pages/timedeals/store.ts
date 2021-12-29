import { writable } from "svelte/store";
import {

  TimedealDomainStatus,
} from "../../helpers/timedeal";

export const search = writable("");
export const newStatus = writable<TimedealDomainStatus | undefined>(undefined);

import { NotificationStatusEnum, NotificationtypeEnum } from "src/api";
import { writable } from "svelte/store";
import {
  getNotificationStatusLabel,
  getNotificationTypeLabel,
} from "../../helpers/notification";

export const search = writable("");
export const typeStatus = writable<NotificationtypeEnum | undefined>(undefined);
export const statusEnum = writable<NotificationStatusEnum | undefined>(undefined);

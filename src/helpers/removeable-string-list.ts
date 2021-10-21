import shortid from "shortid";
import { Writable, writable } from "svelte/store";
export type StringListItem = { key: string; body: string };
export class RemovableStringList {
  private _hashMap: Writable<StringListItem[]>;
  private _onAdd?: () => void;

  constructor(options: {
    initialValues?: string[];
    onChange?: (state: StringListItem[]) => void;
    onAdd?: () => void;
  }) {
    const { initialValues, onChange, onAdd } = options;
    this._hashMap = writable(
      initialValues?.map((body) => ({ key: shortid(), body })) ?? []
    );
    if (onChange) {
      this._hashMap.subscribe(onChange);
    }
    this._onAdd = onAdd;
  }

  static from(options: {
    initialValues?: string[];
    onChange?: (state: StringListItem[]) => void;
    onAdd?: () => void;
  }) {
    const instance = new RemovableStringList(options);
    return {
      add: (value: string) => instance.add(value),
      remove: (key: string) => instance.remove(key),
      map: instance._hashMap,
    };
  }

  add(body: string) {
    if (body.trim() === "") return;
    this._hashMap.update((state) => [...state, { key: shortid(), body }]);
    if (this._onAdd) {
      this._onAdd();
    }
  }

  remove(removeKey: string) {
    this._hashMap.update((state) =>
      state.filter(({ key }) => key !== removeKey)
    );
  }
}

import { get, writable, Writable } from "svelte/store";

import CoreProvider, { useCore } from "@app/core/CoreProvider";

export default abstract class Service<M> {
  public core: CoreProvider;
  public _entities: Writable<Record<string, M>>;

  constructor() {
    this.core = useCore();
    this._entities = writable({});
  }

  public get entities() {
    return get(this._entities);
  }

  public _updateEntities(values: Record<string, M>) {
    this._entities.set(values);
  }

  public async catchError(error: any) {
    // Needs refactoring
  }
}

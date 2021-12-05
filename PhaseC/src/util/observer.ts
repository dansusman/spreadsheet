import { CartesianPair, SubscriptionBundle } from "../types";
import { cartesianToString } from "./gridCoords";

export class CellObservable {
    private observers: CellObserver[] = [];
    notify() {
        this.observers.forEach((obs: CellObserver) => {
            obs.update();
        });
    }
    subscribe(obs: CellObserver) {
        if (
            !this.observers.reduce(
                (prev, observer) => prev || obs.coords === observer.coords,
                false
            )
        ) {
            this.observers.push(obs);
        }
    }

    flush() {
        this.observers = [];
    }
}

export class CellObserverStore {
    private store: Map<string, CellObservable> = new Map();
    private observerStore: Map<string, CellObserver> = new Map();
    private static instance: CellObserverStore = new CellObserverStore();
    private constructor() {}

    static getInstance(): CellObserverStore {
        return this.instance;
    }

    addMe(
        coords: CartesianPair,
        updateFunc: (n: number) => void
    ): SubscriptionBundle {
        if (this.observerStore.has(cartesianToString(coords))) {
            return {
                observable: this.store.get(cartesianToString(coords))!,
                observer: this.observerStore.get(cartesianToString(coords))!,
            };
        } else {
            const observer = new CellObserver(coords, updateFunc);
            const observable = new CellObservable();
            this.observerStore.set(cartesianToString(coords), observer);
            this.store.set(cartesianToString(coords), observable);
            return { observer, observable };
        }
    }

    resetListenersInObservable(
        obsCoords: CartesianPair[],
        listener: CellObserver
    ): void {
        if (listener) {
            obsCoords.forEach((observableCoord) => {
                const observable = this.store.get(
                    cartesianToString(observableCoord)
                );
                if (observable) {
                    observable.subscribe(listener);
                }
            });
        }
    }
}

export class CellObserver {
    private shouldUpdate: number = 0;
    readonly coords: string;
    private updateFunc: (n: number) => void;
    constructor(coords: CartesianPair, updateFunc: (n: number) => void) {
        this.coords = cartesianToString(coords);
        this.updateFunc = updateFunc;
    }
    update() {
        this.shouldUpdate += 1;
        this.updateFunc(this.shouldUpdate);
    }
}

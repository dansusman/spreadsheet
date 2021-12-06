import { CartesianPair, SubscriptionBundle } from "../types";
import { cartesianToString } from "./gridCoords";

/**
 * An observable object, or the Subject in the Observer Pattern.
 * Allows Cell's to communicate up the dependency tree.
 */
export class CellObservable {
    private observers: CellObserver[] = [];
    /**
     * Notify all observers of this CellObservable to update
     * their values.
     */
    notify() {
        this.observers.forEach((obs: CellObserver) => {
            obs.update();
        });
    }
    /**
     * Subscribes this CellObservable to the given CellObserver
     * @param obs the CellObserver to which to subscribe
     */
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
}

/**
 * The Global, Singleton store that holds bidirectional dependencies
 * for Cells. Contains CellObservable objects that map to Cells and
 * CellObserver objects that map to Cells.
 */
export class CellObserverStore {
    private store: Map<string, CellObservable> = new Map();
    private observerStore: Map<string, CellObserver> = new Map();
    private static instance: CellObserverStore = new CellObserverStore();
    private constructor() {}

    /**
     * Gets the Singleton instance of the CellObserverStore.
     * @returns the one and only instance of this global store
     */
    static getInstance(): CellObserverStore {
        return this.instance;
    }

    /**
     * Adds a Cell found at the given coordinates in the grid to
     * the global CellObserverStore.
     * @param coords the CartesianPair location on the grid
     * @param updateFunc a function that allows React to update
     * @returns a SubscriptionBundle, with the Cell's CellObserver
     * and CellObservable
     */
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

    /**
     * Resets all Observables given to listen to the given
     * observer.
     * @param obsCoords a list of CellObservable coordinates
     * @param listener a CellObserver
     */
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

/**
 * An observer that listens to updates from a CellObservable.
 * This is the Observer in the Observer pattern.
 */
export class CellObserver {
    private shouldUpdate: number = 0;
    readonly coords: string;
    private updateFunc: (n: number) => void;
    constructor(coords: CartesianPair, updateFunc: (n: number) => void) {
        this.coords = cartesianToString(coords);
        this.updateFunc = updateFunc;
    }
    /**
     * Update the CellObserver when told to by a CellObservable.
     * Updates both the field shouldUpdate and the field updateFunc
     * to apply changes to store and trigger a React rerender.
     */
    update() {
        this.shouldUpdate += 1;
        this.updateFunc(this.shouldUpdate);
    }
}

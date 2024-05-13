import { createStore } from "redux";

const initialStore = {
    value: 0,
    age: 28,
};

const rootReducer = (store = initialStore, action) => {
    return store;
};

const store = createStore(rootReducer);
console.log(store.getState());

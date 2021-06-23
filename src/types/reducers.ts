export type ReducerAction<ActionType> = {
  type: ActionType;
  data?: unknown;
};

export type Reducer<State, Action> = (prevState: State, action: Action) => State;

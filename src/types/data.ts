export enum NumberDataTypes {
  "Riding" = "riding",
  "Helmet" = "helmet",
  "Parked (Upright)" = "parkedUpright",
  "Parked (Fallen)" = "parkedFallen",
  "Bike Riding" = "bikeRiding",
  "Bike Parked" = "bikeParked",
  "Reckless" = "reckless",
}

export type NumberDataSet = Record<NumberDataTypes, number>;
export const NumberDataSet = (): NumberDataSet =>
  Object.fromEntries(
    Object.values(NumberDataTypes).map((key) => [key, 0]),
  ) as NumberDataSet;

export type Comment = {
  latitude: number;
  longitude: number;
  time: Date;
  comment: string;
};

export const Members = ["Blake", "Hunter", "Mike", "Jonathon"];
export const Locations = ["Loc 1", "Loc2"];
export type Data = {
  startTime?: Date;
  endTime?: Date;
  location: string;
  recorder: string;
  comments: Comment[];
} & NumberDataSet;
export const Data = (): Data => ({
  startTime: undefined,
  endTime: undefined,
  location: "",
  recorder: "",
  comments: [],
  ...NumberDataSet(),
});

export type NumberDataSet = {
  riding: {
    name: "Riding";
    value: number;
  };
  helmet: {
    name: "Helmet";
    value: number;
  };
  parkedUpright: {
    name: "Parked Upright";
    value: number;
  };
  parkedFallen: {
    name: "Parked Fallen";
    value: number;
  };
  bikeRiding: {
    name: "Bike Riding";
    value: number;
  };
  bikeParked: {
    name: "Bike Parked";
    value: number;
  };
  reckless: {
    name: "Reckless";
    value: number;
  };
};
export const NumberDataSet = (): NumberDataSet => {
  return {
    riding: {
      name: "Riding",
      value: 0,
    },
    helmet: {
      name: "Helmet",
      value: 0,
    },
    parkedUpright: {
      name: "Parked Upright",
      value: 0,
    },
    parkedFallen: {
      name: "Parked Fallen",
      value: 0,
    },
    bikeRiding: {
      name: "Bike Riding",
      value: 0,
    },
    bikeParked: {
      name: "Bike Parked",
      value: 0,
    },
    reckless: {
      name: "Reckless",
      value: 0,
    },
  };
};
export const Members = ["Blake", "Hunter", "Mike", "Jonathon"];
export type Data = {
  startTime: Date;
  numberData: NumberDataSet;
};
export const Data = (): Data => ({
  startTime: new Date(),
  numberData: NumberDataSet(),
});

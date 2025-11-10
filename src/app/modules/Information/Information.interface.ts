

export interface IInformation {
  title: string;
  subTitle: string;
  email: string;
  phone: string;
  address: string;
  instagram: string;
  facebook: string;
  heroImg: string;
  age: number;
  countDownDate: Date;
  countDownImg: string;
  location: {
    type: 'Point';
    coordinates: [number, number]; // [longitude, latitude]
  };
  distance: number
};


export interface IMapLoaction {
  longitude?: number;
  latitude?: number;
  distance?: number;
}
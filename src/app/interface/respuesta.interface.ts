export interface Respuesta {
    newPriceEuro: number;
    newPricePeso: number;
    newPrice: number;
    departureStation: string;
    arrivalStation:   string;
    flightCarrier:    FlightCarrier;
    flightNumber:     string;
    price:            number;
}

export enum FlightCarrier {
    Co = "CO",
    Es = "ES",
    MX = "MX",
}

export interface attendance {
    date :string;
    // name:string;
    fromTime:string;
    toTime:string;
    subid:string;
    fid:string;
    rollNo:string;
    userid:string;
    isPresent:boolean;
    // TODO: fill all the columns for completeness
}

export interface studentPresent{
    name:string;
    rollNo:string;
    isPresent:boolean;
}
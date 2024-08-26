export interface timeTable {
    fromTime:string;
    toTime:string;
    subid:string;
    fid:string;
    // TODO: fill all the columns for completeness
  }


export interface periods {
    fromTime : string;
    toTime : string;
    subName : string;
    subid :string;
    fid :string;
    facultyName : string;
    // TODO: fill all the columns for completeness
}

export interface subjects {
    subid : string;
    subName : string;
    subFullName :string;
    // TODO: fill all the columns for completeness
}

export interface facultyName {
    lastName : string;
    firstName : string;
    // TODO: fill all the columns for completeness
}
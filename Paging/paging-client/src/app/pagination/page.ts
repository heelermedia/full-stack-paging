export class Page {
    public isSelected: boolean = false;
    //TODO: this will simplify some code in the pager control
    public chunkIndex: number;
    constructor(public pageNumber: number) { }
}
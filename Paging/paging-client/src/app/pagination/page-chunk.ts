import { Page } from "./page";

export class PageChunk {
    public index: number;
    public isSelected: boolean = false;
    constructor(public pages: Page[]) {

    }
}

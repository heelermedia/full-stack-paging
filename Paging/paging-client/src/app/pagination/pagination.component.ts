import { Component, OnInit, Input } from '@angular/core';
import { MockDataService } from '../mock-data/mock-data.service';
import { PaginationService } from './pagination.service';
import { Subscription } from 'rxjs';
import { PageMetaData } from './page-meta-data';
import { Page } from './page';
import { PageChunk } from './page-chunk';

@Component({
    selector: 'app-pagination',
    templateUrl: './pagination.component.html',
    styleUrls: ['./pagination.component.scss']
})
export class PaginationComponent implements OnInit {
    //the display array since there could be many pages
    private pagesDisplay: Page[] = [];
    //an array of page chunks to page back and forth between to update ui display
    private pageChunks: PageChunk[] = [];
    private selectedPageChunk: PageChunk;
    private maxPagesPerChunk: number = 10;

    //the page meta data
    //setting this in a hosting component will initialize this control
    @Input() pageMetaData: PageMetaData;
    //set pages and total info
    private showingX: number;
    private toX: number;

    //store subscriptions so I can dispose of them
    private subscriptions: Subscription[] = [];

    constructor(private _pagerService: PaginationService) { }

    public ngOnInit() {
        this.initialize();
        //subscribe to hosting component setting a page externally via the browser
        //TODO: update obervable name to have browser in it
        this.subscriptions.push(this._pagerService.setPageFromQueryParametersObservable.subscribe((pageNumber: number) => {
            //set correct PageChunk
            let pageChunk: PageChunk = this.getPageChunkByPageNumber(pageNumber);
            //turn the page number into a 0 based index
            pageNumber = (pageNumber - 1) % 10
            this.setPageDisplay(pageChunk, pageNumber);
        }));
        //reset everything if the hosting control changes the page meta data
        this.subscriptions.push(this._pagerService.initialize.subscribe(() => {
            this.initialize();
        }));
    }

    private initialize(): void {
        this.pageChunks = [];
        this.pagesDisplay = [];
        this.showingX = 0;
        this.toX = 0;
        this.pageIndex = 1;
        this.pageChunks = this.createPageChunks(this.pageMetaData);
        this.selectedPageChunk = this.getPageChunkByPageNumber(this.pageMetaData.currentPage);
        if (this.selectedPageChunk) {
            this.selectedPageChunk.isSelected = true;
            this.setPageDisplay(this.selectedPageChunk, (this.pageMetaData.currentPage - 1) % 10);
        }
    }

    //a function to get the index of the selected Page instance
    //to help determine if we are at the end of the pagesDisplay array or not
    private getIndexOfSelectedPage(): number {
        const selectedPage = this.pagesDisplay.find((page: Page) => {
            return page.isSelected;
        });
        return this.pagesDisplay.indexOf(selectedPage);
    }

    //get a page by index
    private getPageByIndex(pageIndex: number): Page {
        return this.pagesDisplay.find((page: Page, index: number) => {
            return pageIndex === index;
        });
    }

    //a function to set the selected page
    private setSelectedPage(page: Page): void {
        for (var i = 0; i < this.pagesDisplay.length; i++) {
            this.pagesDisplay[i].isSelected = false;
        }
        page.isSelected = true;
        //update showing counts
        this.setShowingRecordCounts(page);
        //notify components that are using this component
        this._pagerService.pageChanged(page);
    }

    private getSelectedPage(): Page {
        return this.pagesDisplay.forEach((page: Page, index: number) => {
            return page.isSelected;
        })[0];
    }

    private getLastPageInPageChunks(): Page {
        const lastPageChunk: PageChunk = this.pageChunks[this.pageChunks.length - 1];
        const lastPage: Page = lastPageChunk.pages[lastPageChunk.pages.length - 1];
        return lastPage;
    }

    //set the active page of the displayed pages
    private onPageClicked(page: Page): void {
        //set the selected page
        this.setSelectedPage(page);
        //enable next and previous
        //this.enableNextAndPrevious(this.getIndexOfSelectedPage());
    }

    //TODO: this function must first step through each displayed page then update the displayPages array at the
    //end of that process
    private onNext(): void {
        //on next first see if we are at the end of the displayArray
        const selectedPageIndex: number = this.getIndexOfSelectedPage();
        //a variable for the next index
        const nextIndex: number = (selectedPageIndex + 1);
        if (selectedPageIndex === (this.pagesDisplay.length - 1)) {
            //if so get the next page chunk
            let pageChunk: PageChunk = this.getNextPageChunk();
            //mark the selected page chunk as not selected
            this.selectedPageChunk.isSelected = false;
            //select the new page chunk
            pageChunk.isSelected = true;
            //set the select page chunk
            this.selectedPageChunk = pageChunk;
            //display the new page chunk
            this.setPageDisplay(pageChunk, 0);
        } else {
            //otherwise advance the selected page
            this.setSelectedPage(this.getPageByIndex(nextIndex));
            //control next button execution
            //this.enableNextAndPrevious(nextIndex);
        }
    }

    private onPrevious(): void {
        //on previous first see if we are at the beginning of the displayArray
        const selectedPageIndex: number = this.getIndexOfSelectedPage();
        //a variable for the previous index
        const previousIndex: number = (selectedPageIndex - 1);
        if (selectedPageIndex === 0) {
            //if so get the previous page chunk
            let pageChunk: PageChunk = this.getPreviousPageChunk();
            //mark the selected page chunk as not selected
            this.selectedPageChunk.isSelected = false;
            //select the new page chunk
            pageChunk.isSelected = true;
            //set the select page chunk
            this.selectedPageChunk = pageChunk;
            //display the new page chunk
            this.setPageDisplay(pageChunk, this.selectedPageChunk.pages.length - 1);
        } else {
            //otherwise advance the selected page backwards
            this.setSelectedPage(this.getPageByIndex(previousIndex));
            //this.enableNextAndPrevious(previousIndex);
        }
    }

    //get the index of a page chunk to see where we are in the array
    private getIndexOfPageChunk(pageChunk: PageChunk): number {
        return this.pageChunks.indexOf(pageChunk);
    }

    //get the selected page chunk
    public getSelectedPageChunk(): PageChunk {
        return this.pageChunks.find((pageChunk: PageChunk) => {
            return pageChunk.isSelected;
        });
    }

    public getNextPageChunk(): PageChunk {
        const length = this.pageChunks.length;
        const nextIndex = this.pageChunks.indexOf(this.getSelectedPageChunk()) + 1;
        //if we are at the end of the array go back to the beginning
        if (nextIndex > (length - 1)) {
            return this.pageChunks[0];
        } else {
            return this.pageChunks[nextIndex];
        }
    }

    public getPreviousPageChunk(): PageChunk {
        const previousIndex = this.pageChunks.indexOf(this.getSelectedPageChunk()) - 1;
        //if we are at the end of the array go back to the beginning
        if (previousIndex < 0) {
            //if its at the beginning of the array cycle back to the end
            return this.pageChunks[this.pageChunks.length - 1];
        } else {
            return this.pageChunks[previousIndex];
        }
    }

    //a function to get a PageChunk by page index to help with properly initializing this component
    private getPageChunkByPageNumber(pageNumber: number): PageChunk {
        //going to look through all the page chunks to
        //find the one that contains the Page with a matching page number
        //if the user refreshed or copy and pasted the url
        //then the hosting component will pass in the pageIndex we are looking for
        let targetPageChunk: PageChunk;
        let found: boolean = false;
        for (var i = 0; i < this.pageChunks.length; i++) {
            let pageChunk: PageChunk = this.pageChunks[i];
            let pages: Page[] = pageChunk.pages;
            for (var j = 0; j < pages.length; j++) {
                let pi: number = pages[j].pageNumber;
                if (pageNumber === pi) {
                    targetPageChunk = pageChunk;
                    found = true;
                    break;
                }
            }
            if (found) break;
        }
        return targetPageChunk;
    }

    private setPageDisplay(pageChunk: PageChunk, pageIndex: number): void {
        // this.setNextAndPreviousVisibility(pageChunk);
        this.pagesDisplay = pageChunk.pages;
        //set the selected page
        this.setSelectedPage(this.pagesDisplay[pageIndex]);
    }

    private setShowingRecordCounts(page: Page): void {
        let selectedPageNumber: number = page.pageNumber;
        if (selectedPageNumber > 1) {
            //this.toX should always be pageNumber * this.pageMetaData.pageSize
            this.toX = selectedPageNumber * this.pageMetaData.pageSize;
            //this.showIngX will always be this.toX subtract one less than the page size
            this.showingX = this.toX - (this.pageMetaData.pageSize - 1);
            //if it is the last page in the last chunk make sure to adjust for variations of the
            //display count 
            if (this.getLastPageInPageChunks().pageNumber === page.pageNumber) {
                this.toX = this.toX - (this.toX - this.pageMetaData.totalCount);
            }
        } else {
            this.showingX = selectedPageNumber;
            this.toX = this.pageMetaData.pageSize;
        }
    }

    //create a start index so the page number will be correct when creating pages
    private pageIndex: number = 1;
    private createPageChunks(pageMetaData: PageMetaData): PageChunk[] {
        //create an array of page chunks to return
        let pageChunks: PageChunk[] = [];
        //get the total number of chunks
        let pageTotal: number = pageMetaData.totalPages;
        let chunkTotal: number = Math.ceil(pageTotal / this.maxPagesPerChunk);
        //get the size of the last chunk 
        let lastChunkSize: number = (pageTotal % this.maxPagesPerChunk);
        //use the chunkTotal to create chunks of pages
        for (let i = 1; i <= chunkTotal; i++) {
            //create an array of pages
            let pages: Page[] = this.createPages(((i === chunkTotal)

                && (lastChunkSize > 0))

                ? lastChunkSize : this.maxPagesPerChunk, (i - 1));

            //push the new chunk
            let pageChunk: PageChunk = new PageChunk(pages);
            pageChunk.index = i;
            pageChunks.push(pageChunk);
        }
        return pageChunks;
    }

    //Create a list of pages
    //chunkIndex = the 0 based chunk index
    private createPages(pageCount: number, chunkIndex: number): Page[] {
        let pages: Page[] = [];
        for (let i = 1; i <= pageCount; i++) {
            let page: Page = new Page(this.pageIndex);
            page.chunkIndex = chunkIndex;
            pages.push(page);
            this.pageIndex++;
        }
        return pages;
    }

    public ngOnDestroy(): void {
        this.subscriptions.forEach((subscription: Subscription) => {
            subscription.unsubscribe();
        });
    }
}

export interface IBrowserNavigator {
    browser: Browser;
    activePage: Page;
    navigateToURL: (url: string) => Promise<void>;
    close: () => Promise<void>;
    disconnect: () => Promise<void>;
    init?: () => IBrowserNavigator;
    close: () => Promise<void>;
}

export interface IAmazonBrowser extends BrowserNavigator {
    navigateToProductPage: (productPageURL: string) => Promise<void>;
    addProductToCart: () => Promise<void>;
    resultsPageToProductListing: () => Promise<void>;
    navigateToCheckoutPage: () => Promise<void>;
    init?: () => IAmazonBrowser;
    close: () => Promise<void>;
    disconnect: () => Promise<void>;
    proceedToCheckout: () => Promise<void>;

}

export interface IGoodReadsBrowser extends BrowserNavigator {
    getRandomBookForGenre: (genreURL: string) => Promise<string | undefined>;
    getGenreOptions: () => Promise<any>;
    init?: () => IGoodReadsBrowser | any;
    close: () => Promise<void>;
    disconnect: () => Promise<void>;

}

export interface IGenreSelection {
    genreSelection: string;
}
# Goodreads Amazon Puppeteer

## Setup 


### Install Node Version 14.8

#### From [nodejs.dev](https://www.nodejs.dev)
Visit 
[https://www.nodejs.dev](https://nodejs.dev/download/) and select `14` and click download.

---

#### Using [Node Version Manager](https://github.com/nvm-sh/nvm)


To install node using nvm run:
```
nvm install 14
```
If you have Node 14.8 and nvm installed, run: 
```
nvm use 14
```
---

### Clone repo
```
git clone https://github.com/paalwilliams/goodreads-amazon-puppeteer-
```

### Change directory into repo
```
cd goodreads-amazon-puppeteer
```
### Install dependencies

```
npm install
```
### TypeScript
If you need to install typescript...
```
npm install -g typescript
```
### Compile application

```
tsc
```

### Run
```
node index.js
```

You will see output in the terminal about the current state of the application. Once it has fetched the available genres you will be prompted to select one.

<img width="441" alt="Screen Shot 2022-02-19 at 12 12 01 AM" src="https://user-images.githubusercontent.com/49243504/154788879-b5e095b4-adaf-4644-82ea-a6ed2e2c0956.png">

Use your arrow keys to move through the different choices, and hit the `enter` key once you have selected one. 

Once you hit enter, the application will select a random book from that genre, find the listing on Amazon, add it to your cart, and display the checkout page. 

If you are not logged in, Amazon will prompt you to sign in before you can view the checkout page.

### Notes
It may take a while for the initial run to start up.

`Important!` You must close all running Chrome instances prior to running this application.

This application requires that Google Chrome be installed.

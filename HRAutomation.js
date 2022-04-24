const puppeteer=require('puppeteer');
let codeFile=require('./code')
const loginLink = "https://www.hackerrank.com/auth/login";
let credentials=require('./credentials');
const email=credentials.email;
const  password=credentials.password;

// Puppeteer works on promises

let page;
let browserLaunchPromise = puppeteer.launch({
    headless: false,
    defaultViewport: null,
    args: ["--start-maximized"],
});

browserLaunchPromise.then(function(browserInstance){
    let newTabWillBePromise=browserInstance.newPage();
    return newTabWillBePromise;
}).then(function(newTab){
    console.log("Tab Opened");
    page=newTab;
    const pageWillBeOpened=newTab.goto(loginLink);
    return pageWillBeOpened;
}).then(function(){
    console.log("Website Opened");
    let typedEmailPromise=page.type("input[id='input-1']",email,{delay:120});
    return typedEmailPromise;
}).then(function(){
    let typedPasswordPromise=page.type("input[id='input-2']",password,{delay:120});
    return typedPasswordPromise;
}).then(function(){
    let loginClickPromise=page.click('button[data-analytics="LoginPassword"]',{delay:120});
    return loginClickPromise
}).then(function () {
    let algoWillBeclickedPromise = waitAndClick(
      '.topic-card a[data-attr1="algorithms"]',
      page
    );
    return algoWillBeclickedPromise;
  }).then(function () {
    let getToWarmupPromise = waitAndClick('input[value="warmup"]', page);
    return getToWarmupPromise;
  }).then(function () {
    let ChallengesArrPromise = page.$$(
      ".ui-btn.ui-btn-normal.primary-cta.ui-btn-line-primary.ui-btn-styled",
      { delay: 100 }
    );
    return ChallengesArrPromise;
  }).then(function (questionsArr) {
    console.log("No of Questions" + questionsArr.length);
     let questionWillBeSolvedPromise = questionSolver(page,questionsArr[0], codeFile.answers[0]);
        // loop chaining 
        // for (let i = 1; i < questionsArr.length; i++) {
        //    // console.log(i);
        //    questionWillBeSolvedPromise=questionWillBeSolvedPromise
        //         .then(function () {
        //             return questionSolver(page,questionsArr[i], codeFile.answers[i]);
        //         })
        // }
  });

function waitAndClick(selector,cPage)
{
    return new Promise(function (resolve, reject) {
        let waitForModalPromise = cPage.waitForSelector(selector);
        waitForModalPromise
          .then(function () {
            let clickModalPromise = cPage.click(selector);
            return clickModalPromise;
          })
          .then(function () {
            resolve();
          })
          .catch(function () {
            reject();
          });
      });
}

function questionSolver(page,question,ans)
{
    return new Promise(function(resolve , reject){
        let questionWillBeClickedPromise = question.click();
        questionWillBeClickedPromise
        .then(function () {
            let waitForEditorPromise = waitAndClick(
            ".monaco-editor.no-user-select.vs",
            page
            );
            return waitForEditorPromise;
        })
        .then(function () {
            return waitAndClick(".checkbox-input", page);
        })
        .then(function () {
            return page.waitForSelector(".text-area.custominput");
        })
        .then(function () {
            return page.type(".text-area.custominput", ans, { delay: 20 });
        })
        .then(function () {
            let ctrlonHoldPromise = page.keyboard.down('Control');
            return ctrlonHoldPromise
          }).then(function(){
            let AisPressedPromise = page.keyboard.press('A' , {delay : 20});
            return AisPressedPromise
          }).then(function(){
            let XisPressedPromise = page.keyboard.press('X' , {delay:20})
            return XisPressedPromise
         }).then(function(){
            let ctrlIsReleasedPromise = page.keyboard.up('Control')
            return ctrlIsReleasedPromise
         }).then(function () {
           let waitForEditorPromise = waitAndClick(
             ".monaco-editor.no-user-select.vs",
             page
           );
           return waitForEditorPromise;
         }).then(function () {
           let ctrlonHoldPromise = page.keyboard.down('Control');
           return ctrlonHoldPromise
         }).then(function(){
           let AisPressedPromise = page.keyboard.press('A' , {delay : 20});
           return AisPressedPromise
         }).then(function(){
           let VisPressedPromise = page.keyboard.press('V' , {delay:20})
           return VisPressedPromise
         }).then(function(){
            let ctrlIsReleasedPromise = page.keyboard.up('Control')
            return ctrlIsReleasedPromise
         }).then(function(){
            return page.click('.hr-monaco__run-code' , {delay : 100})
         })
        //  }).then(function(){
        //     return page.click('.align-left-conatiner>ol>li>a[data-attr1="Warmup"]',100);
        //  })
         .then(function(){
             resolve()
         }).catch(function(err){
            console.log(err)
         })
     });
}
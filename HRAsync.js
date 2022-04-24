const puppeteer=require('puppeteer');
let codeFile=require('./code')
const loginLink = "https://www.hackerrank.com/auth/login";
let credentials=require('./credentials');
const email=credentials.email;
const  password=credentials.password;

//IIFE 
//Promises changed to Async-Await --Cleaner Code
(async function(){
    try{
        let browserLaunchPromise = await puppeteer.launch({
            headless: false,
            defaultViewport: null,
            args: ["--start-maximized"],
        });

        let newTab= await browserLaunchPromise.newPage();

        await newTab.goto(loginLink);

        await newTab.type("input[id='input-1']",email,{delay:120});

        await newTab.type("input[id='input-2']",password,{delay:120});

        await newTab.click('button[data-analytics="LoginPassword"]',{delay:120});

        await waitAndClick('.topic-card a[data-attr1="algorithms"]',newTab);

        await waitAndClick('input[value="warmup"]', newTab);

        let ChallengesArr = await newTab.$$(".ui-btn.ui-btn-normal.primary-cta.ui-btn-line-primary.ui-btn-styled",{ delay: 100 });

        await questionSolver(newTab, ChallengesArr[0] , codeFile.answers[0] );
    }
    catch(err)
    {
        console.log(err);
    }
})();

async function waitAndClick(selector,cPage)
{
  try{
    let waitForModalPromise = await cPage.waitForSelector(selector);
    await cPage.click(selector, { delay: 100 });

  }catch(err){
    console.log(err);
  }
    
}

async function questionSolver(page,question,ans)
{
  try{
    let questionWillBeClickedPromise = await question.click();

    await  waitAndClick(".monaco-editor.no-user-select.vs",page);

    await waitAndClick(".checkbox-input", page);

    await page.waitForSelector(".text-area.custominput");

    await page.type(".text-area.custominput", ans, { delay: 20 });

    await  page.keyboard.down('Control');

    await page.keyboard.press('A' , {delay : 20});

    await page.keyboard.press('X' , {delay:20})

    await page.keyboard.up('Control')

    await waitAndClick(".monaco-editor.no-user-select.vs",page)

    await page.keyboard.down('Control');

    await page.keyboard.press('A' , {delay : 20});

    await page.keyboard.press('V' , {delay:20});

    await page.keyboard.up('Control');

    await page.click('.hr-monaco__run-code' , {delay : 20});

  }catch(err){
    console.log(err)
  }
  
}
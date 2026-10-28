export const config = {calendarUrl: 'https://calendly.com/adam-riplwealth/30min', email: 'adam@riplwealth.com', endpoint: 'https://formsubmit.co/ajax/adam@riplwealth.com'};
export const stages = ['Builder','Accumulator','Navigator','Steward'];
export const questions = [
 {title:'Do you know what you paid in taxes, but wonder whether a better plan was possible?',hint:'A rough sense is enough. No numbers needed.',options:['Yes','No','Not sure']},
 {title:'Is more than a few months of cash sitting in your business account?',hint:'Cash can have a good reason to be there. We’ll start with what it’s for.',options:['Yes','No','Not sure']},
 {title:'Does your CPA mostly file your taxes, rather than plan with you during the year?',hint:'Think about when those conversations usually happen.',options:['Yes','No','Not sure']},
 {title:'If you stepped away for six months, would your money keep working without you?',hint:'Think about your personal finances as well as your company.',options:['Yes','No','Not sure']},
 {title:'Which sounds most like your life right now?',hint:'Choose the closest fit, even if more than one feels familiar.',options:['I’m building. Most of what I earn goes back into the business.','I’m earning well. I want the money outside my business to have a plan.','I’m facing a transition: a sale, retirement, or a big financial decision.','I’m thinking about family, giving, and what comes next for my wealth.']},
 {title:'What would you most like your money to help you do next?',hint:'Choose the priority that matters most today.',options:['Build a foundation beyond the business.','Turn strong income into lasting personal wealth.','Navigate a major change with a clear plan.','Make a lasting difference for my family or causes.']},
 {title:'When an extra dollar comes in, what is your first instinct?',hint:'Neither is better. This helps us understand how you approach decisions.',options:['Safety: keep a reserve and know exactly where it is.','Opportunity: put it toward the next possibility.']}
];
export function score(answers){
 if(answers.length!==questions.length || answers.some((v,i)=>!Number.isInteger(v)||v<0||v>=questions[i].options.length)) throw new Error('Complete all questions');
 const points=[0,0,0,0];points[answers[4]]+=2;points[answers[5]]+=1;
 return {stage:stages[points.indexOf(Math.max(...points))],tendency:answers[6]===0?'Safety':'Opportunity',secondary:answers[4]!==answers[5]?stages[answers[5]]:null};
}
export const descriptions={
 Builder:'You’re putting your energy into building the business. The next question is how to build a financial foundation for yourself alongside it.',
 Accumulator:'Your hard work is creating income and options. The next step is connecting the pieces so that cash, investments, and planning have a shared purpose.',
 Navigator:'A change is on the horizon, or already here. The order of your decisions matters, especially when your business and personal life are changing together.',
 Steward:'You’re thinking about what your wealth can make possible for others. Family, giving, and a thoughtful legacy are becoming part of the plan.'
};
export const reviewTopics={
 Builder:['A personal financial plan that keeps getting postponed','Dependence on the business for future income','Tax and exit questions that need a longer runway'],
 Accumulator:['Cash without a clear purpose or time frame','Investment decisions disconnected from tax planning','Accounts that don’t work toward the same goal'],
 Navigator:['Tax and legal decisions made in the wrong order','Money invested without a clear spending timeline','A transition without a personal income plan'],
 Steward:['Giving decisions disconnected from the broader plan','Family intentions that haven’t been put into words','Cash and investments without a defined next purpose']
};
const baseRisk='Investing involves risk, including possible loss of principal.';
const buffer='Buffers cover only specified losses, can depend on purchase timing and holding period, and usually limit upside. Losses remain possible.';
const daf='DAF gifts are irrevocable; the sponsor controls the assets. Deductions depend on eligibility, limits, and your circumstances. Coordinate with your tax professional.';
const originalVideos=[
 ['Builder',"Everything I make goes back into the business. What’s left for me?",'Build a second engine beside the company.','A personal investment plan can help connect business success to goals outside the business.',baseRisk],
 ['Builder','My CPA files my taxes. Nobody’s actually planning them.','One quarterback for the financial team.','Coordinate your CPA, attorney, banker, insurance, and investment decisions.','RIPL does not provide tax or legal advice; your CPA and attorney guide those decisions.'],
 ['Builder','I’ll get serious about investing when things slow down.','Give time a place in the plan.','Explore the tradeoffs of waiting, while protecting the cash the business needs.',baseRisk+' Starting earlier does not guarantee an outcome.'],
 ['Builder','If I sell someday, will the IRS take a huge bite?','Explore QSBS eligibility before a sale.','Some qualifying C-corporation stock may receive favorable federal tax treatment.','QSBS has strict company, stock, acquisition-date, and holding-period requirements. Many businesses do not qualify. State treatment may differ. Review with your tax professional.'],
 ['Accumulator','I’ve got too much cash sitting in the business account.','Every dollar gets a job.','Separate Today, Tomorrow, and Beyond so reserves and longer-term money each have a purpose.','Cash needs depend on operating expenses, taxes, obligations, and your plans. Investing reserves can create liquidity risk.'],
 ['Accumulator','I want my money in the market, but I hate paying tax on the gains.','Bring tax planning into the portfolio.','Explore direct indexing and tax-loss harvesting alongside your CPA.','Tax benefits are not guaranteed. Wash-sale rules, fees, tracking differences, and your tax situation matter; investments can lose value.'],
 ['Accumulator','I want growth, but I can’t stomach another 2022.','Understand the cushion and the cap.','Explore the tradeoffs of market exposure through buffered ETFs.',buffer],
 ['Accumulator','I’ve got accounts everywhere and no plan connecting them.','One plan. Every account with a job.','Use SAGE™ to connect the moving pieces to what you want your money to do.',baseRisk+' A coordinated plan does not remove market risk.'],
 ['Navigator','I’m about to sell my business. What do I do first?','Get the right people working in order.','Coordinate tax, legal, and investment planning before key sale decisions.','RIPL coordinates with your tax and legal professionals. Sale terms and available strategies depend on your circumstances.'],
 ['Navigator','I just got a big check and I’m scared to put it all in at once.','Make a plan before choosing an investment.','Discuss a timeline and whether structured notes or buffered ETFs have a role.','Structured notes can lose principal, carry issuer credit risk, and be difficult to sell. '+buffer],
 ['Navigator','I’m about to stop getting a paycheck for the first time.','Build a plan for your next paycheck.','Connect spending needs, reserves, and investments to a retirement income plan.','Investment income and returns are not guaranteed. Withdrawals, inflation, and market losses can affect how long money lasts.'],
 ['Navigator','My big income year is going to crush me on taxes.','Bring charitable intentions into the plan.','Consider whether donor-advised fund timing fits a high-income year.',daf+' Giving costs money; a deduction does not make a gift free.'],
 ['Steward','I give a lot, but I’m not sure I’m doing it smart.','Give with a plan, grant over time.','Explore a donor-advised fund for coordinating ongoing charitable intentions.',daf],
 ['Steward','I’m sitting on stock with huge gains. Selling it hurts.','Consider the assets behind the gift.','Explore giving appreciated stock through a donor-advised fund.',daf+' Asset acceptance and tax treatment vary.'],
 ['Steward','I want my kids set up without taking away their drive.','Build a family framework around wealth.','Clarify values, responsibilities, and the conversations that should come before a transfer.','Estate documents and legal structures require advice from your attorney. No approach guarantees a family outcome.'],
 ['Steward','My money’s safe, but it isn’t doing anything.','Give safety a purpose, too.','Match each dollar to the time you need it and the job you want it to do.','Cash can serve important liquidity needs. Inflation affects purchasing power; investing introduces risk of loss.']
].map((v,i)=>({id:i+1,stage:v[0],title:v[1],answer:v[2],summary:v[3],risk:v[4],src:'',duration:'30–60 sec planned'}));
export const videos = [
 [0,'The One-Engine Plane','5mGcHdBkbM4'],
 [1,'Filing Isn’t Planning','nO3Q11UhlOI'],
 [4,'Give Your Cash a Job Description','pEZf5wGZhtQ'],
 [5,'Open the Box',''],
 [8,'Call Before You Sign','8uHdWpxZd8M'],
 [9,'Wade In, Don’t Dive',''],
 [12,'Giving on Purpose','dFqZwnZoUBg'],
 [15,'The Ice Cube on the Counter','']
].map(([index,shortTitle,youtubeId],i)=>({...originalVideos[index],id:i+1,shortTitle,youtubeId,duration:youtubeId?'Watch video':'Coming soon'}));
export function topicsFor(answers,stage){
 const topics=[];
 if(answers[0]!==1)topics.push('Whether tax planning could be more proactive alongside your CPA');
 if(answers[1]!==1)topics.push('Which cash is needed for the business, and which has a different job');
 if(answers[2]!==1)topics.push('Who coordinates planning conversations throughout the year');
 if(answers[3]!==0)topics.push('How much your personal financial plan depends on your daily work');
 return [...topics,...reviewTopics[stage]].slice(0,3);
}

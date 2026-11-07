/* Superday Prep app. Loaded by bootstrap.js after sign-in. */
/* ---------- Question bank ---------- */
const BANK = [
 // Accounting
 {id:"a1",t:"Accounting",l:"Basic",q:"Walk me through the three financial statements.",a:`<p>The <b>income statement</b> shows revenue, expenses and net income over a period. The <b>balance sheet</b> shows assets, liabilities and equity at a point in time, and assets must equal liabilities plus equity. The <b>cash flow statement</b> starts with net income, adjusts for non-cash items like D&A and stock comp and for changes in working capital, then adds investing and financing activity to get the net change in cash.</p><p>Net income flows to retained earnings and to the top of the cash flow statement; the ending cash from the cash flow statement becomes cash on the balance sheet.</p>`},
 {id:"a2",t:"Accounting",l:"Basic",q:"Depreciation goes up by $10. Walk me through the three statements. Assume a 40% tax rate.",a:`<ul><li><b>IS:</b> operating income down $10, taxes down $4, net income down $6.</li><li><b>CFS:</b> net income down $6, add back the $10 non-cash expense, so cash from operations is up $4. Cash is up $4.</li><li><b>BS:</b> cash +$4, PP&E −$10, so assets −$6. Retained earnings −$6. Balances.</li></ul>`},
 {id:"a3",t:"Accounting",l:"Basic",q:"If you could only use one statement to judge a company's health, which would you pick and why?",a:`<p>The <b>cash flow statement</b>. It shows how much cash the business actually generates and where it goes, which accrual-based net income can hide. Some interviewers accept the balance sheet if you argue you can back into net income from retained earnings, but the cash flow answer is the standard one.</p>`},
 {id:"a4",t:"Accounting",l:"Basic",q:"Inventory goes up by $10 and is paid for with cash. Walk me through the statements.",a:`<ul><li><b>IS:</b> no change. Buying inventory is not an expense until it's sold.</li><li><b>CFS:</b> the increase in inventory, a current asset, reduces cash from operations by $10.</li><li><b>BS:</b> inventory +$10, cash −$10. Assets unchanged.</li></ul>`},
 {id:"a5",t:"Accounting",l:"Basic",q:"A company buys $100 of PP&E funded entirely with debt. What happens at the moment of purchase?",a:`<ul><li><b>IS:</b> nothing yet.</li><li><b>CFS:</b> CapEx of −$100 in investing, +$100 debt issued in financing. No net change in cash.</li><li><b>BS:</b> PP&E +$100, debt +$100.</li></ul><p>Follow-on: over time you'd record depreciation and interest expense, both lowering net income.</p>`},
 {id:"a6",t:"Accounting",l:"Intermediate",q:"A customer prepays $100 for a year of service. How does that hit the statements when the cash comes in?",a:`<ul><li><b>IS:</b> nothing yet, because the service hasn't been delivered.</li><li><b>CFS:</b> the increase in deferred revenue, a liability, adds $100 to cash from operations.</li><li><b>BS:</b> cash +$100, deferred revenue +$100.</li></ul><p>As service is delivered, revenue is recognized and deferred revenue falls.</p>`},
 {id:"a7",t:"Accounting",l:"Intermediate",q:"What is goodwill and how is it created?",a:`<p>Goodwill is an intangible asset created in an acquisition when the purchase price exceeds the fair value of the target's identifiable net assets (after write-ups). It represents things like brand, customer relationships and synergies. It is not amortized under US GAAP; it is tested for impairment, and a write-down hits the income statement as a non-cash charge.</p>`},
 {id:"a8",t:"Accounting",l:"Intermediate",q:"Stock-based compensation increases by $10. Walk me through the statements at a 40% tax rate.",a:`<ul><li><b>IS:</b> pre-tax income −$10, net income −$6.</li><li><b>CFS:</b> net income −$6, add back $10 non-cash SBC, cash +$4.</li><li><b>BS:</b> cash +$4. Equity: retained earnings −$6, common stock/APIC +$10, so equity +$4. Balances.</li></ul>`},
 {id:"a9",t:"Accounting",l:"Intermediate",q:"What is working capital, and why can negative working capital be a good sign?",a:`<p>Working capital is current operating assets minus current operating liabilities (receivables, inventory, payables, deferred revenue). Negative working capital can be healthy when a company collects cash before it pays suppliers or delivers the product, like subscription software, retailers with fast inventory turns, or restaurants. It means customers are effectively financing the business.</p>`},
 // EV
 {id:"e1",t:"Enterprise Value",l:"Basic",q:"What's the difference between equity value and enterprise value?",a:`<p><b>Equity value</b> is the value of the company to common shareholders only: share price × diluted shares. <b>Enterprise value</b> is the value of the core operations to all capital providers: equity value + debt + preferred stock + noncontrolling interests − cash and non-operating assets.</p>`},
 {id:"e2",t:"Enterprise Value",l:"Basic",q:"Why do you add debt and subtract cash when calculating enterprise value?",a:`<p>EV reflects the cost of acquiring the core business. A buyer has to repay or assume the debt, so it adds to the cost. Cash is a non-operating asset the buyer gets and could use to pay down part of the price, so it reduces the effective cost. A cleaner framing: EV counts every investor's claim on the operating assets, and excess cash isn't an operating asset.</p>`},
 {id:"e3",t:"Enterprise Value",l:"Intermediate",q:"Can enterprise value be negative? What would that mean?",a:`<p>Yes, when cash exceeds equity value plus debt. It often happens with companies in distress or small companies sitting on large cash balances. It suggests the market expects the business to burn cash or doubts the cash can be returned to shareholders.</p>`},
 {id:"e4",t:"Enterprise Value",l:"Intermediate",q:"A company issues $100 of new shares and uses the proceeds to repay $100 of debt. What happens to equity value and enterprise value?",a:`<p>Equity value rises by $100 (more shares outstanding at the same price). Debt falls by $100. Enterprise value is <b>unchanged</b>, because the core business didn't change, only the capital structure.</p>`},
 {id:"e5",t:"Enterprise Value",l:"Basic",q:"Why do you pair EV with EBITDA but equity value with net income?",a:`<p>Match the numerator to the investors the metric serves. EBITDA is before interest, so it's available to both debt and equity holders: use enterprise value. Net income is after interest, so it belongs only to shareholders: use equity value (P/E).</p>`},
 // Valuation
 {id:"v1",t:"Valuation",l:"Basic",q:"Walk me through the main ways to value a company.",a:`<ol><li><b>Comparable companies:</b> value based on trading multiples (EV/EBITDA, P/E) of similar public companies.</li><li><b>Precedent transactions:</b> multiples paid in past acquisitions of similar companies.</li><li><b>DCF:</b> intrinsic value as the present value of projected free cash flows plus a terminal value.</li></ol><p>You can also mention an LBO analysis as a floor for what a sponsor would pay.</p>`},
 {id:"v2",t:"Valuation",l:"Basic",q:"Which methodology usually gives the highest valuation?",a:`<p>Precedent transactions usually come out highest because they include a <b>control premium</b> and synergies. A DCF is often next but swings widely with assumptions. Trading comps tend to be lower. It's a rule of thumb, not a law: a DCF with aggressive assumptions can beat everything.</p>`},
 {id:"v3",t:"Valuation",l:"Basic",q:"How would you pick comparable companies?",a:`<p>Screen on <b>industry</b>, <b>size</b> (revenue, EBITDA, market cap) and <b>geography</b>, then refine by business model, growth and margin profile. Aim for roughly 5–15 companies and drop clear outliers.</p>`},
 {id:"v4",t:"Valuation",l:"Intermediate",q:"Two companies in the same industry trade at different EV/EBITDA multiples. Why?",a:`<p>The higher multiple usually reflects <b>faster expected growth</b>, <b>higher margins or returns on capital</b>, <b>lower risk</b> (more recurring revenue, less cyclicality, less leverage) or better market position. It can also reflect lower capital intensity, since EBITDA ignores CapEx.</p>`},
 // DCF
 {id:"d1",t:"DCF",l:"Basic",q:"Walk me through a DCF.",a:`<ol><li>Project unlevered free cash flow for 5–10 years.</li><li>Calculate a terminal value with the perpetuity growth method or an exit multiple.</li><li>Discount the cash flows and terminal value to today at WACC.</li><li>Sum them to get enterprise value, then bridge to equity value and divide by diluted shares for an implied share price.</li></ol>`},
 {id:"d2",t:"DCF",l:"Basic",q:"How do you calculate unlevered free cash flow?",a:`<p>EBIT × (1 − tax rate) + D&A and other non-cash charges − change in net working capital − CapEx. Some banks start from EBITDA or net income; the key is that it excludes interest expense, so it's available to all capital providers.</p>`},
 {id:"d3",t:"DCF",l:"Basic",q:"How do you calculate WACC?",a:`<p>WACC = cost of equity × % equity + cost of debt × (1 − tax rate) × % debt + cost of preferred × % preferred. Use market values for the weights. Debt is tax-effected because interest is tax-deductible.</p>`},
 {id:"d4",t:"DCF",l:"Intermediate",q:"How do you calculate cost of equity, and why unlever and relever beta?",a:`<p>Use CAPM: cost of equity = risk-free rate + levered beta × equity risk premium (sometimes plus a size premium). Comparable companies' betas include their own leverage, so you <b>unlever</b> them to strip out capital structure, take the median, then <b>relever</b> it at your company's target capital structure: β<sub>L</sub> = β<sub>U</sub> × (1 + (1 − t) × D/E).</p>`},
 {id:"d5",t:"DCF",l:"Basic",q:"What are the two ways to calculate terminal value, and which do you prefer?",a:`<p><b>Perpetuity growth (Gordon Growth):</b> final-year FCF × (1 + g) / (WACC − g). <b>Exit multiple:</b> final-year EBITDA × a multiple from comps. Bankers often use the multiple method because it ties to market data, but it imports market mispricing. The growth method is more theoretical. Use each to sanity-check the other via the implied multiple or implied growth rate.</p>`},
 {id:"d6",t:"DCF",l:"Intermediate",q:"When would you use levered free cash flow instead of unlevered?",a:`<p>Levered FCF is after interest and debt repayment, so it's discounted at the <b>cost of equity</b> and gives <b>equity value</b> directly. It's used when the capital structure is central to the business, like banks, or in some LBO-style analyses. Most DCFs use unlevered FCF and WACC to get enterprise value.</p>`},
 {id:"d7",t:"DCF",l:"Advanced",q:"What happens to WACC as a company adds more debt?",a:`<p>At first WACC <b>falls</b>, because debt is cheaper than equity and interest is tax-deductible. Past a point it <b>rises</b>, as higher default risk pushes up both the cost of debt and the cost of equity (levered beta rises). That U-shape implies an optimal capital structure.</p>`},
 {id:"d8",t:"DCF",l:"Intermediate",q:"When is a DCF a bad choice?",a:`<p>When cash flows are hard to forecast or not meaningful: early-stage companies with negative cash flow, highly cyclical businesses, and financial institutions, where debt is part of operations (use a dividend discount model instead).</p>`},
 // LBO
 {id:"l1",t:"LBO",l:"Basic",q:"Walk me through a basic LBO.",a:`<ol><li>Set purchase price and the sources and uses: how much debt vs. sponsor equity funds the deal.</li><li>Adjust the balance sheet for the new debt, equity and any goodwill.</li><li>Project the three statements and the cash available to pay down debt.</li><li>Assume an exit, usually after 3–7 years at an EBITDA multiple.</li><li>Calculate the sponsor's returns: IRR and multiple of money (MOIC).</li></ol>`},
 {id:"l2",t:"LBO",l:"Basic",q:"Why does a private equity firm use leverage?",a:`<p>Leverage reduces the equity check, which magnifies returns on that equity if the business performs. Interest is also tax-deductible. The trade-off is higher risk: more debt means a bigger chance of default if cash flow disappoints.</p>`},
 {id:"l3",t:"LBO",l:"Basic",q:"What makes a company a good LBO candidate?",a:`<p>Stable, predictable cash flow to service debt; low CapEx needs; strong market position; a reasonable price; room to cut costs or improve operations; a solid management team; and a realistic exit path.</p>`},
 {id:"l4",t:"LBO",l:"Basic",q:"What drives returns in an LBO?",a:`<p>Three levers: <b>EBITDA growth</b> (revenue growth and margin expansion), <b>multiple expansion</b> (exiting at a higher multiple than entry) and <b>debt paydown</b> (cash flow reducing debt so more of the exit value goes to equity). A smaller equity check also raises returns, at more risk.</p>`},
 {id:"l5",t:"LBO",l:"Advanced",q:"Paper LBO: buy a company with $10M EBITDA at 10x, funded 60% debt. In 5 years EBITDA is $15M, you exit at 10x, and debt has been paid down to $30M. What's the MOIC and rough IRR?",a:`<ul><li>Entry price $100M; debt $60M; equity $40M.</li><li>Exit EV $150M − $30M debt = $120M equity.</li><li>MOIC = 120 / 40 = <b>3.0x</b>.</li><li>3x over 5 years ≈ <b>25% IRR</b>.</li></ul><p>Rules of thumb: 2x in 5 yrs ≈ 15%, 2x in 3 yrs ≈ 26%, 3x in 5 yrs ≈ 25%.</p>`},
 {id:"l6",t:"LBO",l:"Intermediate",q:"What is a dividend recapitalization?",a:`<p>The company raises new debt and uses it to pay a dividend to the PE owners. The sponsor gets cash back early, which boosts IRR, without selling the company. It increases leverage and risk for the business.</p>`},
 // M&A
 {id:"m1",t:"M&A",l:"Basic",q:"Walk me through a merger model.",a:`<ol><li>Project financials for the buyer and seller.</li><li>Set the purchase price and the mix of cash, debt and stock.</li><li>Combine the income statements, adjusting for foregone interest on cash, new interest on debt, new shares issued, and synergies.</li><li>Calculate combined EPS and compare to the buyer's standalone EPS to see if the deal is accretive or dilutive.</li></ol>`},
 {id:"m2",t:"M&A",l:"Intermediate",q:"In an all-stock deal, how can you tell quickly if it's accretive or dilutive?",a:`<p>Compare P/E multiples. If the buyer's P/E is <b>higher</b> than the P/E it pays for the seller, the deal is accretive: the buyer is using expensive currency to buy cheaper earnings. If the buyer's P/E is lower, it's dilutive. This ignores synergies and transaction effects.</p>`},
 {id:"m3",t:"M&A",l:"Intermediate",q:"Why would a buyer pay with stock instead of cash or debt?",a:`<p>It may not have enough cash or debt capacity; its stock may be richly valued, making it cheap currency; or it wants the seller's shareholders to share in the combined company's risk. Cash is usually the cheapest source, then debt, then stock, based on their after-tax costs.</p>`},
 // ---- Accounting (more)
 {id:"a10",t:"Accounting",l:"Basic",q:"What's the difference between cash and accrual accounting?",a:`<p><b>Accrual</b> accounting records revenue when it's earned and expenses when they're incurred, whether or not cash has moved. <b>Cash</b> accounting records them only when cash comes in or goes out. Public companies use accrual accounting under GAAP, which is why you need the cash flow statement to see actual cash.</p>`},
 {id:"a11",t:"Accounting",l:"Basic",q:"Walk me through the cash flow statement.",a:`<ul><li><b>Operating:</b> start with net income, add back non-cash items (D&A, stock comp, deferred taxes, impairments), subtract non-cash gains, and adjust for changes in working capital.</li><li><b>Investing:</b> CapEx, acquisitions, and purchases or sales of securities and assets.</li><li><b>Financing:</b> debt issued or repaid, stock issued or repurchased, dividends.</li></ul><p>The three sections sum to the net change in cash.</p>`},
 {id:"a12",t:"Accounting",l:"Basic",q:"A company makes a $10 sale on credit, so accounts receivable rises by $10. Walk me through the statements at a 40% tax rate.",a:`<ul><li><b>IS:</b> revenue +$10, pre-tax income +$10, net income +$6.</li><li><b>CFS:</b> net income +$6, but the AR increase is −$10, so cash is −$4 (taxes are paid in cash on revenue not yet collected).</li><li><b>BS:</b> cash −$4, AR +$10, assets +$6. Retained earnings +$6.</li></ul>`},
 {id:"a13",t:"Accounting",l:"Basic",q:"A company records a $10 expense it hasn't paid yet, so accounts payable rises by $10. Walk me through the statements at a 40% tax rate.",a:`<ul><li><b>IS:</b> expenses +$10, net income −$6.</li><li><b>CFS:</b> net income −$6, AP increase +$10, cash +$4.</li><li><b>BS:</b> cash +$4. Liabilities: AP +$10. Equity: retained earnings −$6. Both sides +$4.</li></ul>`},
 {id:"a14",t:"Accounting",l:"Intermediate",q:"A company writes down $10 of PP&E. Walk me through the statements at a 40% tax rate.",a:`<ul><li><b>IS:</b> $10 write-down expense, net income −$6 (assuming it's tax-deductible).</li><li><b>CFS:</b> net income −$6, add back the non-cash write-down +$10, cash +$4.</li><li><b>BS:</b> cash +$4, PP&E −$10, assets −$6. Retained earnings −$6.</li></ul><p>In reality write-downs are often not deductible for cash taxes right away, which affects deferred taxes.</p>`},
 {id:"a15",t:"Accounting",l:"Basic",q:"A company raises $100 of debt at 10% interest. Walk me through the statements at issuance, then after one year of interest (40% tax).",a:`<p><b>At issuance:</b> no IS change; CFF +$100; cash +$100 and debt +$100.</p><p><b>After a year:</b> interest expense $10, net income −$6; cash −$6 on the CFS; on the BS cash −$6 and retained earnings −$6.</p>`},
 {id:"a16",t:"Accounting",l:"Intermediate",q:"A company sells PP&E with a $100 book value for $120 in cash. Walk me through the statements at a 40% tax rate.",a:`<ul><li><b>IS:</b> $20 gain, net income +$12.</li><li><b>CFS:</b> net income +$12, subtract the $20 non-cash gain in operations, +$120 in investing. Cash +$112.</li><li><b>BS:</b> cash +$112, PP&E −$100, assets +$12. Retained earnings +$12.</li></ul>`},
 {id:"a17",t:"Accounting",l:"Basic",q:"A company pays a $10 dividend. Walk me through the statements.",a:`<p>No change on the income statement. On the CFS, −$10 in financing, so cash −$10. On the balance sheet, cash −$10 and retained earnings −$10.</p>`},
 {id:"a18",t:"Accounting",l:"Intermediate",q:"A company writes down $10 of obsolete inventory. Walk me through the statements at a 40% tax rate.",a:`<ul><li><b>IS:</b> COGS (or a write-down line) +$10, net income −$6.</li><li><b>CFS:</b> net income −$6, add back $10 (either as a non-cash charge or through the decrease in inventory), cash +$4.</li><li><b>BS:</b> inventory −$10, cash +$4, assets −$6. Retained earnings −$6.</li></ul>`},
 {id:"a19",t:"Accounting",l:"Intermediate",q:"A company sells $10 of inventory for $15 in cash. Walk me through the statements at a 40% tax rate.",a:`<ul><li><b>IS:</b> revenue $15, COGS $10, pre-tax income $5, net income $3.</li><li><b>CFS:</b> net income +$3, decrease in inventory +$10, cash +$13.</li><li><b>BS:</b> cash +$13, inventory −$10, assets +$3. Retained earnings +$3.</li></ul>`},
 {id:"a20",t:"Accounting",l:"Basic",q:"When do you capitalize a cost instead of expensing it?",a:`<p>Capitalize it when it benefits the business for more than a year, like buildings, equipment or acquired software. It goes on the balance sheet as an asset and is depreciated or amortized over its useful life. Costs whose benefit is used up within the year, like salaries and rent, are expensed right away on the income statement.</p>`},
 {id:"a21",t:"Accounting",l:"Intermediate",q:"What are deferred tax assets and deferred tax liabilities?",a:`<p>They come from differences between book taxes (GAAP) and cash taxes. A <b>DTL</b> means the company paid less cash tax than its book tax expense and will pay more later. Accelerated tax depreciation is the classic cause. A <b>DTA</b> means it paid more cash tax up front or has losses that will reduce future taxes, such as net operating losses.</p>`},
 {id:"a22",t:"Accounting",l:"Advanced",q:"What is a net operating loss (NOL), and how can a company use it?",a:`<p>An NOL arises when taxable income is negative. The company carries it forward to offset future taxable income and cut cash taxes. Under current US rules, new NOLs carry forward indefinitely but can offset only 80% of taxable income in a year. After an ownership change, such as an acquisition, Section 382 limits how much can be used each year. NOLs sit on the balance sheet as a deferred tax asset.</p>`},
 {id:"a23",t:"Accounting",l:"Intermediate",q:"Goodwill is impaired by $10. Walk me through the statements at a 40% tax rate.",a:`<p>Assuming the impairment is tax-deductible, it works like depreciation: net income −$6; on the CFS add back $10, cash +$4; on the BS goodwill −$10, cash +$4, retained earnings −$6.</p><p>Bonus point: goodwill impairment is usually <b>not</b> deductible for cash taxes, so in practice net income falls by the full $10 with no cash tax savings.</p>`},
 {id:"a24",t:"Accounting",l:"Basic",q:"What is EBITDA and why do people use it?",a:`<p>Earnings before interest, taxes, depreciation and amortization. It approximates cash operating profit and ignores capital structure, tax differences and non-cash D&A, so it makes companies easier to compare. Its weaknesses: it ignores CapEx and working capital, so it can overstate the cash a capital-heavy business really generates.</p>`},
 {id:"a25",t:"Accounting",l:"Intermediate",q:"What's the difference between LIFO and FIFO when prices are rising?",a:`<p>Under <b>LIFO</b>, the newest, most expensive inventory is expensed first: COGS is higher, so net income and taxes are lower, and ending inventory on the balance sheet is lower. <b>FIFO</b> does the opposite: lower COGS, higher net income and taxes, higher inventory. LIFO is allowed under US GAAP but not IFRS.</p>`},
 {id:"a26",t:"Accounting",l:"Intermediate",q:"How are operating and finance leases treated under current US GAAP (ASC 842)?",a:`<p>Both put a right-of-use asset and a lease liability on the balance sheet. A <b>finance lease</b> shows depreciation and interest expense on the income statement, so it sits below EBITDA. An <b>operating lease</b> shows one straight-line lease expense inside operating expenses, so it reduces EBITDA.</p>`},
 {id:"a27",t:"Accounting",l:"Intermediate",q:"How do you account for owning less than 20%, 20–50%, and more than 50% of another company?",a:`<ul><li><b>Under 20%:</b> a passive investment, generally carried at fair value.</li><li><b>20–50%:</b> the equity method. Record an investment asset and your share of its net income on one line of the IS.</li><li><b>Over 50%:</b> consolidate 100% of its financials and show the part you don't own as a noncontrolling interest.</li></ul>`},
 {id:"a28",t:"Accounting",l:"Intermediate",q:"What is a noncontrolling interest?",a:`<p>When a parent owns more than 50% but less than 100% of a subsidiary, it consolidates all of the sub's revenue, expenses, assets and liabilities. The share it doesn't own shows up as noncontrolling interest: a line in equity on the balance sheet, and a deduction from net income on the income statement to get net income attributable to the parent.</p>`},
 {id:"a29",t:"Accounting",l:"Basic",q:"What's the difference between accounts receivable and deferred revenue?",a:`<p><b>Accounts receivable</b> is an asset: the company delivered the product but hasn't been paid. <b>Deferred revenue</b> is a liability: the company has been paid but hasn't delivered yet.</p>`},
 {id:"a30",t:"Accounting",l:"Basic",q:"A company buys back $50 of its stock. Walk me through the statements.",a:`<p>No change on the income statement, though EPS rises because there are fewer shares. On the CFS, −$50 in financing. On the BS, cash −$50 and equity −$50 (treasury stock).</p>`},
 {id:"a31",t:"Accounting",l:"Advanced",q:"A company prepays $100 for a year of insurance, then uses up $25 of it in the first quarter. Walk me through both steps at a 40% tax rate.",a:`<p><b>Payment:</b> no IS change; the prepaid expense increase is −$100 in operations; cash −$100, prepaid expenses +$100.</p><p><b>Quarter one:</b> $25 of expense, net income −$15; on the CFS net income −$15, plus the $25 decrease in prepaids, cash +$10; on the BS prepaids −$25, cash +$10, retained earnings −$15.</p>`},
 {id:"a32",t:"Accounting",l:"Basic",q:"What is free cash flow and why does it matter?",a:`<p>Free cash flow is cash from operations minus CapEx. It's the cash the business generates after reinvesting to maintain and grow itself, which is what's available to pay down debt, pay dividends, buy back stock or make acquisitions.</p>`},
 {id:"a33",t:"Accounting",l:"Intermediate",q:"Can a company with positive net income go bankrupt?",a:`<p>Yes. Net income isn't cash. A company can be profitable while cash is tied up in growing receivables or inventory, spent on heavy CapEx, or needed for large debt maturities it can't refinance. If it runs out of cash to pay obligations, it can fail despite reported profits.</p>`},
 {id:"a34",t:"Accounting",l:"Basic",q:"What's the difference between gross margin, EBITDA margin and net margin?",a:`<p><b>Gross margin</b> = (revenue − COGS) / revenue: profit on the product itself. <b>EBITDA margin</b> = EBITDA / revenue: operating profitability before D&A, after operating expenses like SG&A. <b>Net margin</b> = net income / revenue: what's left for shareholders after everything, including interest and taxes.</p>`},
 // ---- Enterprise Value (more)
 {id:"e6",t:"Enterprise Value",l:"Basic",q:"How do you calculate diluted shares outstanding?",a:`<p>Start with basic shares. Add in-the-money options and warrants using the <b>treasury stock method</b>: assume they're exercised, and assume the company uses the exercise proceeds to buy back shares at the current price. Add RSUs, and convertible securities that are in the money (if-converted method).</p>`},
 {id:"e7",t:"Enterprise Value",l:"Intermediate",q:"A company has 100 shares at a $10 share price and 10 options with a $5 strike. What are its diluted shares?",a:`<p>The options are in the money. Exercise creates 10 new shares and $50 of proceeds. At $10 a share, $50 buys back 5 shares. Net new shares = 10 − 5 = 5, so diluted shares = <b>105</b>.</p>`},
 {id:"e8",t:"Enterprise Value",l:"Intermediate",q:"Why do you add noncontrolling interest when calculating enterprise value?",a:`<p>Because the parent consolidates 100% of the subsidiary's revenue and EBITDA even though it doesn't own all of it. To keep EV/EBITDA consistent, the numerator also has to include the value of the part owned by others.</p>`},
 {id:"e9",t:"Enterprise Value",l:"Intermediate",q:"Why do you subtract equity-method investments when calculating enterprise value?",a:`<p>The company records only its share of those investees' net income, on one line, so none of their revenue or EBITDA is in the consolidated figures. Subtracting the investments keeps EV consistent with an EBITDA that excludes them. It's the mirror image of adding noncontrolling interest.</p>`},
 {id:"e10",t:"Enterprise Value",l:"Advanced",q:"Should you include operating leases in enterprise value?",a:`<p>It depends on the metric you pair it with. Under US GAAP, operating lease expense is already deducted in EBITDA, so you generally <b>don't</b> add the lease liability to EV. If you use EBITDAR (before rent), or IFRS numbers where all leases sit below EBITDA, then you <b>do</b> add lease liabilities. The rule is consistency between numerator and denominator.</p>`},
 {id:"e11",t:"Enterprise Value",l:"Basic",q:"A company raises $100 of debt and holds it as cash. What happens to equity value and enterprise value?",a:`<p>Neither changes. Debt rises by $100 and cash rises by $100, so they offset in the EV calculation. Share count and share price are unaffected.</p>`},
 {id:"e12",t:"Enterprise Value",l:"Intermediate",q:"A company uses $100 of cash to buy back stock. What happens to equity value and enterprise value?",a:`<p>Equity value falls by $100, because there are fewer shares and, in theory, the share price is unchanged. Cash also falls by $100. EV is <b>unchanged</b>: the operating business is the same.</p>`},
 {id:"e13",t:"Enterprise Value",l:"Intermediate",q:"A company pays a $50 dividend. What happens to equity value and enterprise value?",a:`<p>Equity value falls by $50 as cash leaves to shareholders (the share price drops on the ex-dividend date). Cash falls by $50 too, so EV is <b>unchanged</b>.</p>`},
 {id:"e14",t:"Enterprise Value",l:"Advanced",q:"A company spends $100 of cash to acquire another business. What happens to equity value and enterprise value?",a:`<p>Equity value is unchanged at the moment of the deal, assuming a fair price: shareholders swapped $100 of cash for $100 of business. Cash falls by $100 while the operating assets grow, so EV <b>rises by $100</b>. (If the deal were funded with debt, EV would rise by $100 through the debt.)</p>`},
 {id:"e15",t:"Enterprise Value",l:"Basic",q:"Why might you prefer EV/EBITDA over P/E?",a:`<p>EV/EBITDA is independent of capital structure, so it compares companies with different debt levels. It also ignores tax and D&A differences. P/E is affected by leverage, interest, tax rates and one-time items.</p>`},
 {id:"e16",t:"Enterprise Value",l:"Intermediate",q:"Is EV/Net Income a valid multiple? What about Equity Value/EBITDA?",a:`<p>No to both. They mismatch investor groups. Net income belongs only to equity holders, so it pairs with equity value. EBITDA is available to all capital providers, so it pairs with enterprise value.</p>`},
 {id:"e17",t:"Enterprise Value",l:"Basic",q:"When would you use EV/Revenue instead of EV/EBITDA?",a:`<p>When EBITDA is negative or not meaningful, like early-stage or high-growth companies such as many software businesses. It's also used when margins are expected to converge across a peer group, so revenue drives value.</p>`},
 {id:"e18",t:"Enterprise Value",l:"Advanced",q:"How do you treat convertible bonds when calculating enterprise value?",a:`<p>If they're <b>in the money</b> (share price above the conversion price), treat them as converted: add the new shares to diluted shares and don't count them as debt. If they're <b>out of the money</b>, count them as debt. Never count them both ways.</p>`},
 {id:"e19",t:"Enterprise Value",l:"Basic",q:"What's the difference between the book value and market value of equity?",a:`<p>Book value is shareholders' equity on the balance sheet, based on historical accounting. Market value is share price × diluted shares, and reflects investors' expectations of future cash flows. For most healthy companies market value is higher.</p>`},
 {id:"e20",t:"Enterprise Value",l:"Basic",q:"Equity value is $500, debt $200, cash $50, preferred stock $25 and noncontrolling interest $25. What's enterprise value?",a:`<p>EV = 500 + 200 + 25 + 25 − 50 = <b>$700</b>.</p>`},
 // ---- Valuation (more)
 {id:"v5",t:"Valuation",l:"Basic",q:"What are the most common valuation multiples?",a:`<p>EV/Revenue, EV/EBITDA, EV/EBIT and P/E are the most common. Industry-specific ones include P/Book and P/Tangible Book for banks, P/FFO for REITs, EV/EBITDAR for retailers and airlines, and EV/Reserves or EV/EBITDAX for oil and gas.</p>`},
 {id:"v6",t:"Valuation",l:"Basic",q:"How do you pick precedent transactions?",a:`<p>Screen for deals in the same industry, of similar size, ideally within the last 3–5 years, and in a similar geography. Then refine for deal type (strategic vs. sponsor, control deals) and market conditions at the time.</p>`},
 {id:"v7",t:"Valuation",l:"Intermediate",q:"What are the weaknesses of precedent transactions?",a:`<p>Data can be stale, and market conditions at the time may differ from today. Disclosure is often limited, especially for private targets. Each deal has its own circumstances: synergies, competitive tension, distressed sellers. There may simply be few truly comparable deals.</p>`},
 {id:"v8",t:"Valuation",l:"Intermediate",q:"What is a control premium and why do buyers pay one?",a:`<p>It's the amount paid above the target's undisturbed share price, often 20–40%. A buyer pays it to gain control: to set strategy, capture synergies and direct cash flows, which a minority shareholder can't do. Shareholders also won't sell without one.</p>`},
 {id:"v9",t:"Valuation",l:"Basic",q:"How do you present the results of a valuation?",a:`<p>Usually with a <b>football field</b>: a horizontal bar chart of the implied value range from each method (comps, precedents, DCF, LBO, 52-week trading range, analyst targets), with the current price or offer price marked as a line.</p>`},
 {id:"v10",t:"Valuation",l:"Intermediate",q:"How would you value a company with negative earnings?",a:`<p>Use EV/Revenue or operating metrics (users, subscribers, bookings) against comps and precedents. A DCF with a longer projection period can work if you believe in a path to profitability. P/E and EV/EBITDA aren't meaningful.</p>`},
 {id:"v11",t:"Valuation",l:"Intermediate",q:"How would you value a bank?",a:`<p>Use P/E, Price/Book and Price/Tangible Book, along with ROE, plus a dividend discount model instead of a DCF. EV and EBITDA don't work because debt and interest are part of a bank's operations, not just financing.</p>`},
 {id:"v12",t:"Valuation",l:"Advanced",q:"How would you value a REIT?",a:`<p>Use Price/FFO and Price/AFFO (funds from operations, which add back real estate depreciation), net asset value based on cap rates applied to property NOI, and dividend yield. Net income is distorted by large depreciation on properties that often appreciate.</p>`},
 {id:"v13",t:"Valuation",l:"Advanced",q:"How does valuing a private company differ from valuing a public one?",a:`<p>There's no market price, so you rely on comps, precedents and a DCF. You may apply an illiquidity or size discount, use a higher discount rate, and estimate beta from public peers. The financials may be less reliable or not audited, and you'll put more weight on precedent transactions.</p>`},
 {id:"v14",t:"Valuation",l:"Basic",q:"What's the difference between LTM and NTM multiples?",a:`<p><b>LTM</b> (last twelve months) uses actual reported results. <b>NTM</b> (next twelve months) uses forward estimates. Growth companies are usually valued on forward multiples, because trailing numbers understate what they'll earn.</p>`},
 {id:"v15",t:"Valuation",l:"Intermediate",q:"What does it mean to calendarize financials, and why do you do it?",a:`<p>Companies have different fiscal year-ends. Calendarizing weights portions of fiscal years to line them up with a calendar year. For example, for a June year-end company, CY2026 ≈ 50% of FY2026 + 50% of FY2027. It makes comps truly comparable.</p>`},
 {id:"v16",t:"Valuation",l:"Advanced",q:"What is a sum-of-the-parts valuation and when would you use it?",a:`<p>Value each business segment separately using its own peer multiples or a DCF, add them up, then subtract net debt to get equity value. Use it for conglomerates whose segments differ in growth and risk. Markets often apply a conglomerate discount, which is a common argument for a spin-off.</p>`},
 {id:"v17",t:"Valuation",l:"Intermediate",q:"Why do you adjust EBITDA when building comps?",a:`<p>To strip out non-recurring items that distort the multiple: restructuring charges, litigation, impairments, gains or losses on asset sales, and one-time transaction costs. The goal is a normalized figure that reflects ongoing performance across every company in the set.</p>`},
 {id:"v18",t:"Valuation",l:"Basic",q:"Why use several valuation methods instead of one?",a:`<p>Each has weaknesses: comps depend on market sentiment, precedents can be stale, and a DCF is sensitive to assumptions. Using several triangulates a defensible range, and big gaps between them tell you something worth investigating.</p>`},
 {id:"v19",t:"Valuation",l:"Intermediate",q:"Where does an LBO analysis fit into a valuation?",a:`<p>It shows the most a financial sponsor could pay and still hit its target return, usually 20%+ IRR. It often acts as a floor in a sale process, since a strategic buyer with synergies should be able to pay more.</p>`},
 // ---- DCF (more)
 {id:"d9",t:"DCF",l:"Basic",q:"Why do you discount future cash flows?",a:`<p>Because of the time value of money and risk. A dollar today can be invested to earn a return, and future cash flows are uncertain. The discount rate reflects the return investors require for that risk.</p>`},
 {id:"d10",t:"DCF",l:"Basic",q:"How long is a typical DCF projection period, and why?",a:`<p>Usually 5–10 years: long enough for the company to reach a steady state where growth and margins stabilize, so a terminal value makes sense. Fast-growing companies need longer periods.</p>`},
 {id:"d11",t:"DCF",l:"Intermediate",q:"What is the mid-year convention?",a:`<p>It assumes cash flows arrive in the middle of each year rather than at the end, which is more realistic. You discount using periods of 0.5, 1.5, 2.5 and so on, which slightly raises the value. With the perpetuity growth method, the terminal value uses the same mid-year period; with an exit multiple it's usually discounted at the full final year.</p>`},
 {id:"d12",t:"DCF",l:"Intermediate",q:"How do you get from enterprise value to an implied share price in a DCF?",a:`<p>Subtract debt, preferred stock and noncontrolling interest, and add cash and non-operating assets such as equity investments, to get equity value. Divide by diluted shares. Since dilution from options depends on the share price, the calculation is circular and is solved iteratively.</p>`},
 {id:"d13",t:"DCF",l:"Intermediate",q:"What's a reasonable terminal growth rate?",a:`<p>Usually 2–3%, roughly in line with long-term inflation or GDP growth. It must be well below the discount rate and can't exceed the long-run growth of the economy, or the company would eventually become the economy.</p>`},
 {id:"d14",t:"DCF",l:"Basic",q:"Why is cost of equity higher than cost of debt?",a:`<p>Equity is riskier: it's paid last in a bankruptcy and has no guaranteed return, so investors demand more. Debt also gets a tax benefit because interest is deductible, which lowers its after-tax cost further.</p>`},
 {id:"d15",t:"DCF",l:"Advanced",q:"Which has a bigger impact on a DCF: a 10% change in revenue or a 1% change in the discount rate?",a:`<p>It depends, so walk through the logic. A 10% revenue change flows through EBITDA and FCF in every year and the terminal value, but not one-for-one, since some costs are fixed and working capital and CapEx move too. A 1-point change in the discount rate (say 10% to 11%) changes the present value of everything, and the terminal value is very sensitive to it, often moving total value 10–15%. Close call; say you'd run a sensitivity table.</p>`},
 {id:"d16",t:"DCF",l:"Intermediate",q:"How do you factor net operating losses into a DCF?",a:`<p>Use them to reduce cash taxes in the projected years, subject to annual limits like the 80% rule and Section 382 after an ownership change. You can also value the NOLs separately and add them to enterprise value.</p>`},
 {id:"d17",t:"DCF",l:"Basic",q:"How does a change in working capital affect free cash flow?",a:`<p>An increase in net working capital (more receivables or inventory, or fewer payables) uses cash, so it reduces FCF. A decrease frees up cash and increases FCF. Growing companies usually need more working capital each year.</p>`},
 {id:"d18",t:"DCF",l:"Basic",q:"What is the equity risk premium?",a:`<p>The extra return investors expect from stocks over the risk-free rate, typically around 5–6% for the US. It's usually based on historical data or providers like Kroll (formerly Duff & Phelps), or implied from current market prices.</p>`},
 {id:"d19",t:"DCF",l:"Basic",q:"What risk-free rate do you use?",a:`<p>The yield on a long-term government bond in the same currency as the cash flows, typically the 10-year US Treasury (some banks use the 20-year).</p>`},
 {id:"d20",t:"DCF",l:"Intermediate",q:"How do you estimate cost of debt?",a:`<p>Use the yield to maturity on the company's traded bonds, the yields of similarly rated debt, or current borrowing rates from lenders. Use market rates, not the historical coupon. Multiply by (1 − tax rate) because interest is deductible.</p>`},
 {id:"d21",t:"DCF",l:"Intermediate",q:"Two companies are identical except one has much more debt. Which has the higher cost of equity?",a:`<p>The one with more debt. Leverage makes equity riskier, which raises levered beta and therefore the cost of equity under CAPM.</p>`},
 {id:"d22",t:"DCF",l:"Basic",q:"What does beta measure?",a:`<p>How much a stock's returns move relative to the overall market. A beta of 1 moves with the market; 1.5 is 50% more volatile; below 1 is less volatile. It captures systematic risk, the kind diversification can't remove.</p>`},
 {id:"d23",t:"DCF",l:"Advanced",q:"How do you sanity-check a terminal value?",a:`<p>Cross-check the methods. From a perpetuity growth terminal value, calculate the implied EBITDA multiple and compare it to comps. From an exit multiple, back out the implied growth rate and check it's around 2–3%. Also check what share of total value comes from the terminal value; 60–80% is common, but much more is a warning sign.</p>`},
 {id:"d24",t:"DCF",l:"Basic",q:"Why is terminal value usually most of a DCF's value?",a:`<p>Because it captures every cash flow after the projection period, forever, while the projection covers only 5–10 years. Early-year cash flows are also often depressed by investment, and discounting hurts later years less than you might think.</p>`},
 {id:"d25",t:"DCF",l:"Advanced",q:"How do you back out the implied perpetuity growth rate from an exit-multiple terminal value?",a:`<p>Rearrange the Gordon Growth formula. TV = FCF × (1 + g) / (WACC − g), so g = (TV × WACC − FCF) / (TV + FCF), where FCF is the final projected year's free cash flow.</p>`},
 {id:"d26",t:"DCF",l:"Advanced",q:"Should you add back stock-based compensation when calculating free cash flow?",a:`<p>It's debated. SBC is non-cash, so it's added back on the cash flow statement, but it's a real cost to shareholders through dilution. Adding it back while ignoring future dilution overstates value. Many practitioners treat it as a cash expense in a DCF, or account for the projected dilution in the share count.</p>`},
 // ---- LBO (more)
 {id:"l7",t:"LBO",l:"Basic",q:"What are the typical sources of funds in an LBO?",a:`<p>Senior secured bank debt (a revolver, term loan A, term loan B), senior or subordinated high-yield notes, mezzanine or preferred, and sponsor equity. Sometimes also management rollover equity and seller notes.</p>`},
 {id:"l8",t:"LBO",l:"Basic",q:"What are the typical uses of funds in an LBO?",a:`<p>Buying the target's equity, refinancing its existing debt, paying transaction and financing fees, and sometimes funding cash to the balance sheet. Sources must equal uses.</p>`},
 {id:"l9",t:"LBO",l:"Intermediate",q:"How does bank debt differ from high-yield bonds?",a:`<p><b>Bank debt:</b> senior and secured, usually floating rate, amortizes over time, can be prepaid easily, and often has maintenance covenants. <b>High-yield bonds:</b> often unsecured or junior, fixed rate, repaid at maturity in one bullet, have call protection that makes early repayment costly, use only incurrence covenants, and carry higher interest.</p>`},
 {id:"l10",t:"LBO",l:"Intermediate",q:"What's the difference between maintenance and incurrence covenants?",a:`<p><b>Maintenance</b> covenants must be met every quarter, like a maximum leverage or minimum interest coverage ratio. <b>Incurrence</b> covenants are tested only when the company takes an action, like issuing more debt, paying a dividend or making an acquisition. Bank loans tend to have maintenance covenants; bonds have incurrence covenants.</p>`},
 {id:"l11",t:"LBO",l:"Basic",q:"What is a revolver?",a:`<p>A revolving credit facility: a line of credit the company can draw, repay and redraw, usually to fund working capital swings or short-term cash needs. It's usually the most senior and cheapest debt, and the company pays a small commitment fee on the undrawn amount.</p>`},
 {id:"l12",t:"LBO",l:"Intermediate",q:"What is PIK interest?",a:`<p>Payment-in-kind interest isn't paid in cash; it's added to the loan principal. It preserves cash flow but makes the debt balance grow over time. It's common in mezzanine and holdco debt, and it carries a higher rate to compensate.</p>`},
 {id:"l13",t:"LBO",l:"Basic",q:"What's the difference between IRR and MOIC?",a:`<p><b>MOIC</b> (multiple of invested capital) is total value returned ÷ equity invested, with no regard for time. <b>IRR</b> is the annualized return, so it accounts for timing. Doubling your money in 3 years is a far better IRR than doubling it in 7, though MOIC is 2x either way.</p>`},
 {id:"l14",t:"LBO",l:"Basic",q:"Roughly what IRR do you get by doubling your money in 3 years? In 5 years? Tripling in 3 years?",a:`<ul><li>2x in 3 years ≈ <b>26%</b></li><li>2x in 5 years ≈ <b>15%</b></li><li>3x in 3 years ≈ <b>44%</b></li></ul><p>Useful anchors: 3x in 5 years ≈ 25%; 2.5x in 5 years ≈ 20%.</p>`},
 {id:"l15",t:"LBO",l:"Intermediate",q:"How does a higher purchase price affect LBO returns?",a:`<p>It lowers returns. At the same leverage, the sponsor writes a bigger equity check, and unless the exit multiple also rises, the equity value at exit is spread over more invested capital. That's why sponsors are disciplined on entry price.</p>`},
 {id:"l16",t:"LBO",l:"Advanced",q:"How does the holding period affect IRR and MOIC?",a:`<p>Holding longer usually raises MOIC as more debt is paid down and EBITDA grows, but it often lowers IRR because returns are spread over more years. Sponsors may exit early, or do a dividend recap, to lock in a high IRR even at a lower multiple.</p>`},
 {id:"l17",t:"LBO",l:"Intermediate",q:"How much leverage is typical in an LBO?",a:`<p>Commonly around 4–7x EBITDA in total, depending on the industry, the stability of cash flow and credit market conditions. Lenders also look at interest coverage (EBITDA ÷ interest) and the equity cushion; sponsors often contribute 40–60% equity today.</p>`},
 {id:"l18",t:"LBO",l:"Advanced",q:"Paper LBO: buy a company with $50M EBITDA at 8x using 5x leverage. After 5 years, EBITDA is $70M, you exit at 8x, and debt is down to $150M. What's the MOIC and rough IRR?",a:`<ul><li>Entry EV $400M, debt $250M, equity $150M.</li><li>Exit EV $560M − $150M debt = $410M equity.</li><li>MOIC = 410 / 150 ≈ <b>2.7x</b>.</li><li>2.7x over 5 years ≈ <b>22% IRR</b> (between 2.5x ≈ 20% and 3x ≈ 25%).</li></ul>`},
 {id:"l19",t:"LBO",l:"Basic",q:"What's the difference between a strategic buyer and a financial buyer?",a:`<p>A <b>strategic</b> buyer is an operating company buying to grow its business. It can count on synergies, so it can often pay more, and it plans to hold indefinitely. A <b>financial</b> buyer, like a PE firm, buys for returns, uses heavy leverage, and plans to exit in about 3–7 years.</p>`},
 {id:"l20",t:"LBO",l:"Intermediate",q:"Why do sponsors want management to roll over equity or receive an option pool?",a:`<p>To align incentives: if management owns a meaningful stake, they benefit from the same equity upside the sponsor does. It also signals management's confidence in the plan, and rollover reduces the cash the sponsor needs.</p>`},
 {id:"l21",t:"LBO",l:"Intermediate",q:"How do you calculate cash available to pay down debt in an LBO?",a:`<p>Start with levered free cash flow: net income + D&A and other non-cash items − change in working capital − CapEx. Subtract mandatory amortization and any cash needed for the minimum cash balance. What's left goes to optional prepayment, often through a required cash sweep.</p>`},
 {id:"l22",t:"LBO",l:"Intermediate",q:"What is a cash sweep?",a:`<p>A requirement, common in term loans, that a percentage of excess free cash flow be used to repay debt early, often 50–75%, stepping down as leverage falls. It cuts lenders' risk and speeds deleveraging, which also boosts the equity's value at exit.</p>`},
 {id:"l23",t:"LBO",l:"Basic",q:"What IRR does a private equity firm typically target?",a:`<p>Historically 20–25% for a buyout, with lower targets in high-valuation or high-interest-rate environments, often high teens. They also focus on MOIC, commonly around 2.5–3x over a typical hold.</p>`},
 // ---- M&A (more)
 {id:"m4",t:"M&A",l:"Basic",q:"Why would one company acquire another?",a:`<p>To grow faster than it could on its own, gain market share, enter new geographies or customer segments, acquire technology or talent, achieve cost and revenue synergies, or defend against a competitor. Sometimes it's because the target is undervalued.</p>`},
 {id:"m5",t:"M&A",l:"Basic",q:"What are revenue synergies and cost synergies? Which are more reliable?",a:`<p><b>Cost synergies</b> come from cutting overlapping headcount and facilities, procurement savings and shared functions. <b>Revenue synergies</b> come from cross-selling, pricing power and new markets. Cost synergies are more reliable because management controls them; revenue synergies depend on customers and are often discounted.</p>`},
 {id:"m6",t:"M&A",l:"Intermediate",q:"How do you quickly tell whether an all-cash or all-debt deal is accretive?",a:`<p>Compare the target's earnings yield (net income ÷ purchase price, or 1 ÷ P/E paid) to the after-tax cost of funding. Cash costs its foregone interest × (1 − tax rate); debt costs its interest rate × (1 − tax rate). If the earnings yield is higher than the after-tax cost, the deal is accretive.</p>`},
 {id:"m7",t:"M&A",l:"Advanced",q:"A buyer with a 15x P/E acquires a target at 10x P/E, funded fully with debt at 8% interest and a 25% tax rate. Accretive or dilutive?",a:`<p>Target earnings yield = 1 ÷ 10 = 10%. After-tax cost of debt = 8% × (1 − 25%) = 6%. Since 10% > 6%, the deal is <b>accretive</b>, before transaction costs and any purchase accounting effects.</p>`},
 {id:"m8",t:"M&A",l:"Intermediate",q:"What is an exchange ratio?",a:`<p>In a stock deal, the number of acquirer shares each target share receives: offer price per target share ÷ acquirer share price. For example, a $30 offer with the acquirer at $60 gives 0.5 acquirer shares per target share.</p>`},
 {id:"m9",t:"M&A",l:"Intermediate",q:"What's the difference between a fixed and a floating exchange ratio?",a:`<p><b>Fixed:</b> the number of shares is set, so the dollar value the seller receives moves with the acquirer's stock price. <b>Floating:</b> the dollar value is set, so the number of shares adjusts and the buyer bears the stock price risk. Collars limit how far either can move.</p>`},
 {id:"m10",t:"M&A",l:"Intermediate",q:"How does purchase price allocation change the balance sheet in an acquisition?",a:`<p>The target's assets and liabilities are marked to fair value, often writing up PP&E and intangibles. The target's old goodwill is written off and new goodwill is created for the excess of the price over the fair value of net identifiable assets. In a stock purchase, the write-ups also create a deferred tax liability.</p>`},
 {id:"m11",t:"M&A",l:"Advanced",q:"What's the difference between a stock purchase, an asset purchase and a 338(h)(10) election?",a:`<ul><li><b>Stock purchase:</b> buy the shares; take on all assets and liabilities; no tax step-up for the buyer, so write-ups aren't deductible.</li><li><b>Asset purchase:</b> buy selected assets and liabilities; the buyer gets a tax step-up and deductible amortization; a C-corp seller may face double taxation.</li><li><b>338(h)(10):</b> legally a stock purchase but treated as an asset purchase for taxes; available for subsidiaries and S-corps.</li></ul>`},
 {id:"m12",t:"M&A",l:"Intermediate",q:"Can an accretive deal still be a bad deal?",a:`<p>Yes. EPS accretion says nothing about value. A buyer with a high P/E can buy a low-quality, slow-growing business, show accretion and still destroy value by overpaying, earning a return below its cost of capital, or failing at integration. The better test is whether the return on the investment beats the cost of capital.</p>`},
 {id:"m13",t:"M&A",l:"Basic",q:"What is a fairness opinion?",a:`<p>A letter from an investment bank to a company's board stating that the deal price is fair, from a financial point of view, to its shareholders. It's backed by valuation analysis and helps the board show it met its fiduciary duty.</p>`},
 {id:"m14",t:"M&A",l:"Intermediate",q:"What are a breakup fee and a reverse termination fee?",a:`<p>A <b>breakup fee</b> (typically about 2–4% of equity value) is paid by the target to the buyer if the target walks away, for example for a better offer. A <b>reverse termination fee</b> is paid by the buyer to the target if the buyer can't close, often because of failed financing or regulatory approval.</p>`},
 {id:"m15",t:"M&A",l:"Basic",q:"Walk me through a typical sell-side M&A process.",a:`<ol><li><b>Preparation:</b> build the model, write the teaser and confidential information memorandum, assemble a buyers list.</li><li><b>First round:</b> send teasers, sign NDAs, distribute the CIM, receive indications of interest.</li><li><b>Second round:</b> management presentations, data room diligence, final bids and markups of the purchase agreement.</li><li><b>Negotiate and sign</b> with the winning bidder, then <b>close</b> after approvals.</li></ol>`},
 {id:"m16",t:"M&A",l:"Intermediate",q:"What is a contribution analysis?",a:`<p>In a stock merger, it compares the share of combined revenue, EBITDA and net income each company contributes against the ownership each side's shareholders will have. If a company contributes 60% of the earnings but its holders get 45% of the combined company, they'd argue for a better exchange ratio.</p>`},
 {id:"m17",t:"M&A",l:"Advanced",q:"How do you calculate the synergies needed to make a dilutive deal break even?",a:`<p>Find the EPS shortfall: buyer's standalone EPS − pro forma EPS. Multiply by pro forma shares outstanding to get the net income gap. Divide by (1 − tax rate) to get the <b>pre-tax synergies</b> required to close it.</p>`},
 {id:"m18",t:"M&A",l:"Intermediate",q:"What is a hostile takeover, and how can targets defend against one?",a:`<p>An acquisition attempt the target's board opposes, often through a tender offer directly to shareholders or a proxy fight to replace the board. Defenses include a poison pill (shareholder rights plan), a staggered board, finding a friendlier "white knight" buyer, and recapitalizing the company.</p>`},
 {id:"m19",t:"M&A",l:"Intermediate",q:"Why might target shareholders prefer cash over stock?",a:`<p>Cash gives certainty and immediate liquidity, with no exposure to the buyer's share price or integration risk. Stock lets them share in synergies and future upside, and can defer taxes, but they take on the risk of the combined company.</p>`},
 {id:"m20",t:"M&A",l:"Intermediate",q:"What's the difference between a merger vote and a tender offer?",a:`<p>In a <b>merger</b>, the target's shareholders vote at a meeting after a proxy statement is filed, which takes several months. In a <b>tender offer</b>, the buyer offers to buy shares directly from shareholders. It can close faster, often in about a month, and is common in all-cash deals.</p>`},
 // ---- Fit
 {id:"f1",t:"Fit",l:"Basic",q:"Walk me through your resume.",a:`<p>Aim for 60–90 seconds, told as a story, not a list. 1) Where you're from and why you chose your school. 2) What first got you interested in finance. 3) Two or three experiences that built real skills, and what each taught you. 4) Why that path leads to investment banking now, and to this firm. End on why you're in the room.</p>`},
 {id:"f2",t:"Fit",l:"Basic",q:"Why investment banking?",a:`<p>Give two or three specific reasons tied to your experience, not generic ones like prestige or money. Strong themes: the steep learning curve and the technical and financial foundation; working on transactions that shape companies; and the client-facing, team-based work. Back each with a moment, such as a conversation with an analyst, a deal you followed or a club project.</p>`},
 {id:"f3",t:"Fit",l:"Basic",q:"Why our firm?",a:`<p>Be specific: name people you spoke with and what they told you, recent deals the firm or group worked on, and how the firm's size, culture or sector focus fits you. Middle-market and boutique firms like to hear about lean deal teams and early responsibility. Show you did the networking.</p>`},
 {id:"f4",t:"Fit",l:"Intermediate",q:"You go to a non-target school. Why should we take a chance on you?",a:`<p>Don't apologize. Frame it as proof of drive: you had to build your own path through cold outreach, self-taught technicals, club leadership or relevant internships. Give concrete evidence: the number of alumni you spoke with, a model you built, results you got. Close with how that same initiative will make you a strong analyst.</p>`},
 {id:"f5",t:"Fit",l:"Basic",q:"Tell me about a time you worked on a team to accomplish something difficult.",a:`<p>Use STAR: Situation, Task, Action, Result. Choose a story with a real challenge, like a tight deadline or a disagreement. Spend most of the time on <i>your</i> actions, and end with a measurable result and what you learned. Keep it under two minutes.</p>`},
 {id:"f6",t:"Fit",l:"Basic",q:"What's your greatest weakness?",a:`<p>Pick a real but non-fatal weakness, not a disguised strength like "I work too hard," and nothing core to the job like attention to detail. Explain a specific step you've taken to improve, and evidence that it's working.</p>`},
 {id:"f7",t:"Fit",l:"Intermediate",q:"Tell me about a deal you've been following.",a:`<p>Cover: buyer and target and what each does; price, premium and multiple (EV/EBITDA or EV/Revenue); how it was financed (cash, stock or debt); the strategic rationale; and your own view: was it a good deal, and what are the risks (regulation, integration, overpaying)? Pick a deal from the last few months, ideally in the group you're interviewing for.</p>`},
 {id:"f8",t:"Fit",l:"Basic",q:"What do you think an analyst does day to day?",a:`<p>Builds and updates financial models (comps, DCFs, LBOs, merger models), creates pitch books and other client materials, does industry and company research, manages data rooms and diligence lists, and coordinates the logistics of live deals. Long hours and high attention to detail are expected. Show that you know the work and want it.</p>`},
 {id:"f9",t:"Fit",l:"Basic",q:"Where do you see yourself in five years?",a:`<p>Show commitment to banking without over-promising. A safe answer: you want to master the analyst role, earn more responsibility, and be on track to become an associate. Avoid saying you plan to leave for private equity or a hedge fund right away.</p>`},
 {id:"f10",t:"Fit",l:"Intermediate",q:"What's the difference between industry groups and product groups?",a:`<p><b>Industry (coverage) groups</b> focus on a sector, like healthcare or industrials, and own client relationships. <b>Product groups</b> specialize in a type of transaction across industries, like M&A, leveraged finance, equity capital markets or restructuring, and execute those deals with coverage bankers. Know which you'd prefer and why.</p>`},
 {id:"f11",t:"Fit",l:"Intermediate",q:"Why banking instead of sales and trading or consulting?",a:`<p>Contrast honestly without trashing the others. Compared with S&T: you prefer longer, project-based work and deep company analysis over fast, market-driven decisions. Compared with consulting: you want to work on transactions and get hard financial skills. Tie it back to experiences that drew you to deals.</p>`},
 {id:"f12",t:"Fit",l:"Intermediate",q:"Pitch me a stock.",a:`<p>1) Recommendation: buy or sell, current price and price target. 2) A one-line business description. 3) Two or three thesis points the market is missing, with numbers. 4) Valuation: current multiple vs. peers and history, and what your target implies. 5) Key risks and catalysts. Know it well enough for follow-ups.</p>`},
 {id:"f13",t:"Fit",l:"Intermediate",q:"What's going on in the markets right now?",a:`<p>Know the current levels and recent direction of the S&P 500, the 10-year Treasury yield and the Fed funds rate, plus one or two big themes (rates, M&A and IPO activity, a notable deal). Then connect it to banking: how the environment is affecting deal volume and financing. Read the news every day during recruiting.</p>`},
 // ---- Brain Teasers
 {id:"b1",t:"Brain Teasers",l:"Basic",q:"What's the angle between the hour and minute hands at 3:15?",a:`<p>The minute hand is at 90° (on the 3). The hour hand has moved a quarter of the way from 3 to 4: each hour is 30°, so it's at 90° + 7.5° = 97.5°. The angle is <b>7.5°</b>.</p>`},
 {id:"b2",t:"Brain Teasers",l:"Intermediate",q:"How many times a day do the hour and minute hands of a clock overlap?",a:`<p><b>22 times.</b> In 12 hours the minute hand laps the hour hand 11 times (not 12, because the overlap you'd expect between 11 and 12 actually happens at 12:00). That's 11 every 12 hours, so 22 in a day.</p>`},
 {id:"b3",t:"Brain Teasers",l:"Basic",q:"What's the sum of the numbers from 1 to 100?",a:`<p>Pair them: 1 + 100, 2 + 99, and so on gives 50 pairs of 101. 50 × 101 = <b>5,050</b>. The general formula is n(n + 1) / 2.</p>`},
 {id:"b4",t:"Brain Teasers",l:"Intermediate",q:"You have 8 identical-looking balls, and one is slightly heavier. With a balance scale, what's the minimum number of weighings to find it?",a:`<p><b>Two.</b> Weigh 3 against 3. If they balance, the heavy ball is one of the 2 left over: weigh them against each other. If one side is heavier, take those 3 and weigh 1 against 1; if they balance, it's the third. Each weighing has three outcomes, so it splits the group into thirds.</p>`},
 {id:"b5",t:"Brain Teasers",l:"Basic",q:"A bat and a ball cost $1.10 together. The bat costs $1.00 more than the ball. How much is the ball?",a:`<p><b>5 cents.</b> If the ball is x, the bat is x + 1.00, so 2x + 1.00 = 1.10 and x = 0.05. The quick answer of 10 cents is wrong because the bat would then cost $1.10 and the total would be $1.20.</p>`},
 {id:"b6",t:"Brain Teasers",l:"Basic",q:"A patch of lily pads doubles in size every day. It covers the whole lake on day 48. On what day did it cover half the lake?",a:`<p><b>Day 47.</b> It doubles each day, so it was half the size the day before it covered the whole lake.</p>`},
 {id:"b7",t:"Brain Teasers",l:"Advanced",q:"You have two identical eggs and a 100-floor building. What's the minimum number of drops needed, in the worst case, to find the highest floor an egg can survive?",a:`<p><b>14.</b> If you drop the first egg from floor n and it breaks, you need up to n − 1 drops with the second egg, one floor at a time. So each time the first egg survives, shrink the next step by one: floor 14, then 27, 39, 50, and so on. That keeps the worst case constant. You need n + (n − 1) + ... + 1 ≥ 100, so n(n + 1) / 2 ≥ 100, which gives n = 14.</p>`},
 {id:"b8",t:"Brain Teasers",l:"Intermediate",q:"You have a 3-gallon jug and a 5-gallon jug. How do you measure exactly 4 gallons?",a:`<ol><li>Fill the 5. Pour into the 3, leaving 2 in the 5.</li><li>Empty the 3. Pour the 2 gallons into it.</li><li>Fill the 5 again. Pour into the 3 until it's full, which takes 1 gallon.</li><li><b>4 gallons</b> remain in the 5-gallon jug.</li></ol>`},
 {id:"b9",t:"Brain Teasers",l:"Advanced",q:"How many zeros are at the end of 100 factorial?",a:`<p>Each trailing zero needs a factor of 10 = 2 × 5, and there are plenty of 2s, so count the 5s. Multiples of 5 up to 100: 20. Multiples of 25 add an extra 5 each: 4 more. Total: <b>24</b>.</p>`},
 {id:"b10",t:"Brain Teasers",l:"Basic",q:"Without a calculator: what's 17 × 23?",a:`<p>Use (a − b)(a + b) = a² − b²: (20 − 3)(20 + 3) = 400 − 9 = <b>391</b>. Interviewers want to hear the shortcut, and to see you stay calm while doing it.</p>`},
 {id:"b11",t:"Brain Teasers",l:"Intermediate",q:"Estimate the number of gas stations in the United States.",a:`<p>Structure matters more than the exact number. One approach: about 330M people and roughly 280M registered vehicles. If each fills up about once a week, that's 40M fill-ups a day. A typical station might handle about 300 fill-ups a day (around 8 pumps, 15–20 hours, a few fill-ups per pump per hour). 40M ÷ 300 ≈ <b>130,000</b> stations. The real figure is roughly 145,000, so that's close. State your assumptions clearly and sanity-check the result.</p>`},
 {id:"b12",t:"Brain Teasers",l:"Intermediate",q:"How many golf balls fit in a school bus?",a:`<p>Bus interior: about 8 ft wide × 6 ft high × 20 ft long ≈ 1,000 cubic feet, or about 1.7M cubic inches (1 cubic foot = 1,728 cubic inches). A golf ball is about 1.7 inches across, roughly 2.5 cubic inches. Spheres fill about 65% of a space. 1.7M × 0.65 ÷ 2.5 ≈ <b>roughly 450,000</b>. Mention that seats take up space if you want extra credit.</p>`},
 {id:"b13",t:"Brain Teasers",l:"Intermediate",q:"You have two ropes. Each takes exactly 60 minutes to burn, but they burn unevenly. How do you measure 45 minutes?",a:`<p>Light rope A at both ends and rope B at one end at the same time. Rope A burns out in <b>30 minutes</b>, since burning from both ends halves the time however uneven it is. At that moment, light the other end of rope B. Its remaining 30 minutes of rope now burns in <b>15</b>. Total: 45 minutes.</p>`},
 {id:"b14",t:"Brain Teasers",l:"Intermediate",q:"There are three doors: a car is behind one, goats behind the others. You pick a door, and the host, who knows where the car is, opens another door to show a goat. Should you switch?",a:`<p><b>Yes. Switching wins two-thirds of the time.</b> Your first pick is right 1/3 of the time. The other 2/3 of the time the car is behind one of the other two doors, and the host has just shown you which one it isn't. So the remaining door has a 2/3 chance.</p>`},
 {id:"b15",t:"Brain Teasers",l:"Intermediate",q:"What's the probability of rolling at least one six in four rolls of a die?",a:`<p>Use the complement. The chance of no six in one roll is 5/6, so in four rolls it's (5/6)⁴ = 625/1296 ≈ 48.2%. So the chance of at least one six is 1 − 0.482 ≈ <b>51.8%</b>.</p>`},
 {id:"b16",t:"Brain Teasers",l:"Basic",q:"You flip a fair coin three times. What's the probability of getting exactly two heads?",a:`<p>There are 2³ = 8 equally likely outcomes. Exactly two heads: HHT, HTH, THH, which is 3 ways. Probability = <b>3/8</b>, or 37.5%.</p>`},
 {id:"b17",t:"Brain Teasers",l:"Basic",q:"Roughly how long does it take money to double at an 8% annual return?",a:`<p>Use the <b>Rule of 72</b>: 72 ÷ 8 ≈ <b>9 years</b>. The same rule works in reverse: to double in 6 years you need about a 12% return. It's handy for quick IRR checks too.</p>`},
 {id:"b18",t:"Brain Teasers",l:"Intermediate",q:"You drive to a city at 60 mph and back at 40 mph. What's your average speed for the round trip?",a:`<p>Not 50. Pick a distance, say 120 miles each way. Going takes 2 hours, coming back 3 hours. That's 240 miles in 5 hours = <b>48 mph</b>. You spend more time at the slower speed, so it pulls the average down.</p>`},
 {id:"b19",t:"Brain Teasers",l:"Intermediate",q:"Three switches outside a closed room control one light bulb inside. You can enter the room only once. How do you tell which switch controls the bulb?",a:`<p>Turn on switch 1 for a few minutes, then turn it off. Turn on switch 2 and walk in. If the bulb is <b>on</b>, it's switch 2. If it's <b>off but warm</b>, it's switch 1. If it's <b>off and cold</b>, it's switch 3.</p>`},
 {id:"b20",t:"Brain Teasers",l:"Advanced",q:"There are 100 closed lockers. Person 1 opens every locker, person 2 toggles every 2nd locker, person 3 every 3rd, and so on up to person 100. How many lockers are open at the end?",a:`<p>Locker n is toggled once for each of its divisors. Divisors come in pairs, so most numbers have an even count and end closed. Perfect squares have an odd count (one divisor pairs with itself), so they end open: 1, 4, 9, ..., 100. That's <b>10 lockers</b>.</p>`},
 {id:"b21",t:"Brain Teasers",l:"Basic",q:"Without a calculator: what's 12.5% of 640?",a:`<p>12.5% is 1/8. 640 ÷ 8 = <b>80</b>. Know the common fractions by heart: 1/8 = 12.5%, 1/6 ≈ 16.7%, 3/8 = 37.5%, 5/8 = 62.5%.</p>`},
 {id:"b22",t:"Brain Teasers",l:"Basic",q:"Without a calculator: what's 45 squared?",a:`<p>For any number ending in 5: multiply the leading digit by the next number up, then add 25 on the end. 4 × 5 = 20, so 45² = <b>2,025</b>. (Same trick: 65² → 6 × 7 = 42 → 4,225.)</p>`},
 {id:"b23",t:"Brain Teasers",l:"Basic",q:"Without a calculator: what's 25 × 48?",a:`<p>25 × 4 = 100, and 48 = 4 × 12, so 25 × 48 = 100 × 12 = <b>1,200</b>. Look for factors that make round numbers.</p>`},
 {id:"b24",t:"Brain Teasers",l:"Basic",q:"A stock rises 50% one year and falls 50% the next. Where does it end up?",a:`<p><b>Down 25%.</b> $100 → $150 → $75. The loss applies to a bigger base than the gain did. That's also why a 50% loss needs a 100% gain to get back to even.</p>`},
 {id:"b25",t:"Brain Teasers",l:"Intermediate",q:"Two trains 100 miles apart head toward each other, one at 40 mph and one at 60 mph. A bird flies back and forth between them at 75 mph until they meet. How far does the bird fly?",a:`<p>Don't sum the back-and-forth trips. The trains close the gap at 100 mph, so they meet in 1 hour. The bird flies the whole hour at 75 mph: <b>75 miles</b>.</p>`},
 {id:"b26",t:"Brain Teasers",l:"Basic",q:"Ten people are in a room, and everyone shakes hands with everyone else once. How many handshakes are there?",a:`<p>Each of 10 people shakes 9 hands, but that counts every handshake twice: 10 × 9 ÷ 2 = <b>45</b>. In general n(n − 1) / 2.</p>`},
 {id:"b27",t:"Brain Teasers",l:"Intermediate",q:"You draw two cards from a standard deck without replacement. What's the probability both are aces?",a:`<p>4/52 for the first ace, then 3/51 for the second: (4/52) × (3/51) = 12/2,652 = <b>1/221</b>, about 0.45%.</p>`},
 {id:"b28",t:"Brain Teasers",l:"Advanced",q:"You roll a die and I pay you the number that comes up, in dollars. What would you pay to play? What if you could re-roll once and must keep the second roll?",a:`<p><b>One roll:</b> expected value = (1+2+3+4+5+6) / 6 = <b>$3.50</b>.</p><p><b>With a re-roll:</b> re-roll only if the first roll is below 3.50, so keep 4, 5 or 6 (average 5) and re-roll 1, 2 or 3 (worth 3.50). EV = ½ × 5 + ½ × 3.50 = <b>$4.25</b>. You'd pay up to that, less if you want a margin for risk.</p>`},
 {id:"b29",t:"Brain Teasers",l:"Intermediate",q:"How many people need to be in a room for a better-than-even chance that two share a birthday?",a:`<p><b>23</b> (about 50.7%). It's lower than people expect because you're comparing every pair: 23 people form 253 pairs. Calculate it as 1 minus the chance all birthdays differ: 1 − (365/365 × 364/365 × ... × 343/365).</p>`},
 {id:"b30",t:"Brain Teasers",l:"Basic",q:"On average, how many flips of a fair coin does it take to get the first heads?",a:`<p><b>Two.</b> For an event with probability p, the expected number of tries until the first success is 1/p, and 1 ÷ 0.5 = 2.</p>`},
 {id:"b31",t:"Brain Teasers",l:"Basic",q:"A drawer holds 10 black socks and 10 white socks, and it's dark. How many socks must you take to guarantee a matching pair? A black pair?",a:`<p><b>Any matching pair: 3.</b> With only two colors, the third sock must match one of the first two.</p><p><b>A black pair: 12.</b> In the worst case you pull all 10 white socks first, then need 2 black.</p>`},
 {id:"b32",t:"Brain Teasers",l:"Intermediate",q:"A snail is at the bottom of a 30-foot well. Each day it climbs 3 feet, and each night it slips back 2. On which day does it get out?",a:`<p>It gains a net 1 foot a day, so after 27 days and nights it's at 27 feet. On <b>day 28</b> it climbs 3 feet to reach 30 and is out before it can slip back. The trap is answering 30.</p>`},
 {id:"b33",t:"Brain Teasers",l:"Advanced",q:"You have 12 balls, and one is either heavier or lighter than the rest (you don't know which). How many weighings on a balance do you need to find it and say whether it's heavy or light?",a:`<p><b>Three.</b> Weigh 4 vs 4.</p><ul><li><b>If they balance:</b> the odd ball is in the other 4. Weigh 3 of them against 3 good balls. If that balances, the 4th is odd; weigh it against a good ball to see if it's heavy or light. If not, you know the direction; weigh 1 vs 1 of those 3.</li><li><b>If the left side is heavier:</b> call the left balls H1–H4 (possibly heavy) and the right L1–L4 (possibly light). Weigh H1, H2, L1 against H3, L2 and a good ball. Left heavy → H1 or H2 heavy, or L2 light: weigh H1 vs H2. Right heavy → H3 heavy or L1 light: weigh H3 vs a good ball. Balance → H4, L3 or L4: weigh L3 vs L4.</li></ul>`},
 {id:"b34",t:"Brain Teasers",l:"Intermediate",q:"A farmer must take a fox, a chicken and a sack of grain across a river. The boat holds the farmer and one item. The fox can't be left alone with the chicken, or the chicken with the grain. How does he do it?",a:`<ol><li>Take the chicken across. Come back.</li><li>Take the fox across. <b>Bring the chicken back.</b></li><li>Take the grain across, leaving it with the fox. Come back.</li><li>Take the chicken across.</li></ol><p>The key move is bringing something back.</p>`},
 {id:"b35",t:"Brain Teasers",l:"Basic",q:"Today is Monday. What day of the week will it be in 100 days?",a:`<p>100 ÷ 7 = 14 weeks with 2 days left over. Two days after Monday is <b>Wednesday</b>.</p>`},
 {id:"b36",t:"Brain Teasers",l:"Intermediate",q:"How many squares of any size are on a chessboard?",a:`<p>Count by size: 64 squares of 1×1, 49 of 2×2, 36 of 3×3, down to 1 of 8×8. 1 + 4 + 9 + 16 + 25 + 36 + 49 + 64 = <b>204</b>.</p>`},
 {id:"b37",t:"Brain Teasers",l:"Advanced",q:"Four people must cross a bridge at night with one flashlight. At most two can cross at a time, and a pair moves at the slower person's speed. They take 1, 2, 5 and 10 minutes. What's the fastest total time?",a:`<p><b>17 minutes.</b></p><ol><li>1 and 2 cross (2 min). 1 returns (1).</li><li>5 and 10 cross together (10). 2 returns (2).</li><li>1 and 2 cross (2).</li></ol><p>2 + 1 + 10 + 2 + 2 = 17. The insight is sending the two slowest together so the 10 is counted only once. Having 1 escort everyone takes 19.</p>`},
 {id:"b38",t:"Brain Teasers",l:"Intermediate",q:"Estimate the annual revenue of a typical Starbucks store.",a:`<p>One approach: open about 16 hours a day. Morning rush around 60 customers an hour for 3 hours (180); the other 13 hours average about 30 an hour (≈ 390). That's roughly 570 transactions a day at about $7 each ≈ $4,000 a day. × 360 days ≈ <b>$1.4–1.5M a year</b>. That's in the right range; an average US company-run store does roughly $1.5–2M. Say where you'd adjust: location, drive-thru, mobile orders.</p>`},
 {id:"b39",t:"Brain Teasers",l:"Intermediate",q:"Estimate how many smartphones are sold in the US each year.",a:`<p>About 330M people; maybe 85% are old enough and own a smartphone, about 280M users. If people replace their phone every 2–3 years, that's roughly 95–140M phones a year. Add some for businesses, lost or broken phones, and second devices. A reasonable answer is <b>about 120–140M</b>, which is close to actual US shipments. Show the replacement-cycle logic clearly.</p>`},
 {id:"b40",t:"Brain Teasers",l:"Basic",q:"Bacteria in a jar double every minute. Starting from one bacterium, the jar is full at 60 minutes. If you start with two, when is it full?",a:`<p><b>59 minutes.</b> Starting with two puts you exactly one doubling ahead.</p>`},
 {id:"b41",t:"Brain Teasers",l:"Intermediate",q:"You have 10 bottles of pills. Every pill weighs 1 gram except in one bottle, where each pill weighs 1.1 grams. With a single reading on a digital scale, how do you find that bottle?",a:`<p>Take 1 pill from bottle 1, 2 from bottle 2, and so on up to 10 from bottle 10: 55 pills that would weigh 55 grams if all were normal. Weigh them. The excess over 55 grams, divided by 0.1, is the bottle number. For example, 55.7 grams means <b>bottle 7</b>.</p>`},
 {id:"b42",t:"Brain Teasers",l:"Advanced",q:"A family has two children, and at least one is a boy. What's the probability both are boys?",a:`<p><b>1/3.</b> The equally likely families are BB, BG, GB and GG. "At least one boy" rules out only GG, leaving BB, BG and GB, and just one of those is two boys. (If you were told the <i>older</i> child is a boy, the answer would be 1/2. Mentioning that shows you understand why.)</p>`},
 // ---- Fit (more)
 {id:"f14",t:"Fit",l:"Basic",q:"Tell me about a time you showed leadership.",a:`<p>Use STAR. Pick a moment where you <i>chose</i> to step up, not just a title you held: organizing a project that was stalling, starting a club initiative, training new hires at a job. Spend most of the answer on what you did to get others moving: setting the plan, dividing work, handling someone who wasn't contributing. End with a concrete result (a number if you can) and what you'd repeat.</p>`},
 {id:"f15",t:"Fit",l:"Basic",q:"Tell me about a time you had a conflict with a teammate.",a:`<p>Pick a real disagreement about work, not personality, and keep the other person sympathetic. Show that you: 1) understood their view first, 2) addressed it directly and privately, 3) found a solution based on what was best for the outcome, and 4) kept the relationship intact. Interviewers are checking whether you're easy to work with at 2 a.m.</p>`},
 {id:"f16",t:"Fit",l:"Basic",q:"Tell me about a time you made a mistake.",a:`<p>Choose a genuine mistake with real but recoverable consequences, ideally one involving detail or communication. Own it in one sentence without excuses. Then explain how you fixed it right away, who you told, and the specific system you now use so it doesn't happen again (a checklist, a second review). Banks want analysts who flag errors fast.</p>`},
 {id:"f17",t:"Fit",l:"Basic",q:"Tell me about a time you had to manage several deadlines at once.",a:`<p>Pick a week where things genuinely collided: exams, a job, a club deliverable, recruiting. Explain how you prioritized (by deadline and stakes), communicated early with anyone who might be affected, and protected quality on the most important item. Mention a concrete tool you use: a running task list, calendar blocking. This previews how you'll handle staffing on several live deals.</p>`},
 {id:"f18",t:"Fit",l:"Basic",q:"Tell me about a time you went above and beyond what was expected.",a:`<p>Describe a task where the minimum would have been acceptable and you chose to do more: building a model nobody asked for, rebuilding a process, staying to finish something properly. Make clear <i>why</i> you did it (you cared about the outcome) and what it led to. Avoid stories that sound like you ignored instructions.</p>`},
 {id:"f19",t:"Fit",l:"Intermediate",q:"Tell me about a time you persuaded someone to change their mind.",a:`<p>Show that you won with evidence and listening, not pressure. Structure: what they believed and why; the data or reasoning you gathered; how you framed it around what they cared about; the result. A good banking angle is persuading a group with numbers, for example a stock pitch in your investment club.</p>`},
 {id:"f20",t:"Fit",l:"Basic",q:"Tell me about a time you received critical feedback.",a:`<p>Name specific feedback (for example, "my slides were cluttered" or "I didn't ask enough questions early"). Show that you didn't get defensive, that you asked how to improve, and that you changed something concrete. Finish with proof it worked. Analysts get edited constantly; this tells them you're coachable.</p>`},
 {id:"f21",t:"Fit",l:"Basic",q:"What are your greatest strengths?",a:`<p>Pick two or three that matter for an analyst, like work ethic, attention to detail, learning quickly, or being a reliable teammate. Back each with a one-line example, not adjectives. For a non-target candidate, "I teach myself hard things" is powerful if you can point to it: self-taught modeling, cold outreach results.</p>`},
 {id:"f22",t:"Fit",l:"Basic",q:"How would your past manager or teammates describe you?",a:`<p>Give three words and a quick example for each. Make them consistent with the rest of your story and true; interviewers sometimes ask your references. Good picks for banking: dependable, detail-oriented, positive under pressure.</p>`},
 {id:"f23",t:"Fit",l:"Intermediate",q:"Why did you choose your school?",a:`<p>Be honest and positive: cost and scholarships, family, a strong program, staying close to home. Don't apologize for it or imply it was a fallback. Then pivot: what you did with the opportunity, like leading the finance club, building a network from scratch, or landing internships without an on-campus pipeline.</p>`},
 {id:"f24",t:"Fit",l:"Intermediate",q:"Your GPA is lower than we usually see. Can you explain it?",a:`<p>Keep it short and don't make excuses. If there's a real reason (working to pay for school, a hard first semester, a family situation), state it in one sentence. Then show the trend: a higher recent or major GPA, strong grades in finance and accounting classes, and technical preparation that proves you can handle the work.</p>`},
 {id:"f25",t:"Fit",l:"Basic",q:"Who have you spoken with at our firm?",a:`<p>Name two or three people, their groups, and one specific thing you learned from each ("Jordan in industrials told me analysts get real client exposure early, which matters to me"). This is where your networking tracker pays off. Never claim conversations you didn't have; interviewers check.</p>`},
 {id:"f26",t:"Fit",l:"Intermediate",q:"Where else are you interviewing?",a:`<p>Be honest but strategic. Mention a couple of similar firms (same tier, size or sector) to show a focused, consistent search. Don't list every bank, and don't name firms that make it look like you're unsure what you want. Close by saying why this firm is a top choice.</p>`},
 {id:"f27",t:"Fit",l:"Advanced",q:"If you had offers from us and from a bulge bracket bank, which would you take?",a:`<p>Don't dodge, and don't trash the other bank. Explain why <i>this</i> firm fits you: the group's deal flow, leaner teams and earlier responsibility, the people you met, the location. Something like "I'd want to be somewhere I'll do real work from day one, and that's what I've heard here." If it's truly your top choice, say so.</p>`},
 {id:"f28",t:"Fit",l:"Basic",q:"How do you handle long hours and stress?",a:`<p>Show that you know what the job demands and have handled heavy workloads before (a job alongside school, sports, exam weeks). Mention what keeps you steady: staying organized, sleep when you can, exercise. Avoid saying you never get stressed; say how you stay effective when you are.</p>`},
 {id:"f29",t:"Fit",l:"Intermediate",q:"You find a mistake in a model an hour before it goes to the client. What do you do?",a:`<p>Tell your associate right away, even though it's uncomfortable. Explain what the mistake is, what it affects, and how long the fix will take, ideally with the fix already under way. Hiding it or quietly hoping no one notices is the wrong answer. Then check related numbers for the same error.</p>`},
 {id:"f30",t:"Fit",l:"Advanced",q:"What would you do if a senior banker asked you to do something you thought was unethical?",a:`<p>First, ask clarifying questions; you may be missing context. If it still seems wrong, raise it respectfully with them. If it's clearly improper, decline and escalate through the right channels (another senior person, compliance). The firm's reputation and your integrity come first.</p>`},
 {id:"f31",t:"Fit",l:"Intermediate",q:"Why a middle-market or boutique bank instead of a bulge bracket?",a:`<p>Give reasons that are true for you: leaner deal teams, so more responsibility and senior exposure early; more varied work across a deal; a closer-knit culture; and clients that are founder-owned or growing companies. Back it with something from your networking conversations.</p>`},
 {id:"f32",t:"Fit",l:"Intermediate",q:"Why do you want to work in this group?",a:`<p>Show real interest in the sector: what drew you to it (a class, a job, a family business), two trends shaping it right now, and a recent deal the group or firm worked on. If you're interviewing for a product group like M&A or restructuring, explain why that type of work appeals to you.</p>`},
 {id:"f33",t:"Fit",l:"Basic",q:"Why do you want to work in this city?",a:`<p>Give a ties-based reason: family, where you grew up, school, or a clear plan to build your life there. Firms worry about hiring analysts who'll leave, so show commitment. For Midwest offices (Chicago, St. Louis, Kansas City, Minneapolis), deep local roots are an advantage. Say so.</p>`},
 {id:"f34",t:"Fit",l:"Basic",q:"Do you have any questions for me?",a:`<p>Always ask two or three. Ask about <i>them</i> and the work, not things you could Google: "What's a deal you've enjoyed working on here, and why?", "What separates the top analysts in your group?", "How has the group's deal flow changed this year?" Avoid asking about pay, hours or exit opportunities.</p>`},
 {id:"f35",t:"Fit",l:"Intermediate",q:"Tell me about a time you had to learn something difficult quickly.",a:`<p>A great question for non-target candidates. Use a real example of teaching yourself: financial modeling from online resources, accounting before a class covered it, a new tool at an internship. Describe the deadline or stakes, how you broke it down (resources, practice, asking the right people), and the result. It shows you'll get up to speed fast as an analyst.</p>`},
 // ---- LBO (more)
 {id:"l24",t:"LBO",l:"Basic",q:"Why do PE firms like businesses with low CapEx needs?",a:`<p>Low CapEx means more of EBITDA turns into free cash flow, which is what pays down debt. High free cash flow conversion lets the company support more leverage and deleverage faster, both of which raise equity returns. Capital-heavy businesses spend cash just to stay where they are.</p>`},
 {id:"l25",t:"LBO",l:"Basic",q:"What's the difference between senior and subordinated debt?",a:`<p><b>Senior</b> debt gets repaid first in a bankruptcy and is usually secured by the company's assets, so it carries lower interest rates and tighter covenants. <b>Subordinated</b> (junior) debt is repaid only after senior debt, so it's riskier and pays higher interest, often with fewer covenants and longer maturities.</p>`},
 {id:"l26",t:"LBO",l:"Intermediate",q:"In a bankruptcy, what order are claims repaid in?",a:`<p>Under the absolute priority rule, from first to last: 1) secured debt (revolver, term loans), up to the value of its collateral; 2) senior unsecured debt, such as many bonds; 3) subordinated debt and mezzanine; 4) preferred stock; 5) common equity. Each class is repaid in full before the next gets anything, which is why common equity is usually wiped out.</p>`},
 {id:"l27",t:"LBO",l:"Intermediate",q:"What is unitranche debt?",a:`<p>A single loan that combines senior and subordinated debt into one facility with one blended interest rate and one set of documents. It's typically provided by a direct lender rather than a bank syndicate. It's simpler and faster to arrange, at a somewhat higher rate than pure senior debt, and is common in middle-market LBOs.</p>`},
 {id:"l28",t:"LBO",l:"Intermediate",q:"What is private credit, and why has it grown so much?",a:`<p>Private credit is lending by non-bank funds (direct lenders) instead of banks or public bond markets. It has grown because banks pulled back after stricter post-2008 regulation, and sponsors value its speed, certainty of execution and flexible terms, especially for middle-market deals. The trade-off is usually a higher interest rate.</p>`},
 {id:"l29",t:"LBO",l:"Advanced",q:"How are financing fees and transaction fees treated in an LBO model?",a:`<p><b>Financing fees</b> (paid to lenders for arranging debt) are capitalized and amortized over the life of the debt, a non-cash expense that's added back on the cash flow statement. <b>Transaction fees</b> (advisory, legal and accounting) are not capitalized; they're expensed at closing, which effectively reduces the sponsor's equity. Both are uses of funds.</p>`},
 {id:"l30",t:"LBO",l:"Advanced",q:"Paper LBO: buy a company with $100M EBITDA at 6x using 4x leverage. After 3 years, EBITDA is $120M, you exit at 6x, and debt is down to $300M. What's the MOIC and rough IRR?",a:`<ul><li>Entry EV $600M, debt $400M, equity $200M.</li><li>Exit EV $720M − $300M debt = $420M equity.</li><li>MOIC = 420 / 200 = <b>2.1x</b>.</li><li>2x in 3 years is about 26%, so 2.1x in 3 years ≈ <b>28% IRR</b>.</li></ul><p>A shorter hold turns a modest multiple into a strong IRR.</p>`},
 {id:"l31",t:"LBO",l:"Advanced",q:"Paper LBO: buy at $200M (10x $20M EBITDA) with $120M debt and $80M equity. In year 3 you do a $40M dividend recap. You exit in year 5 for $260M with $100M of net debt. What are the MOIC and IRR, and how does the recap change things?",a:`<ul><li>Exit equity = 260 − 100 = $160M. Total returned = 40 + 160 = $200M.</li><li>MOIC = 200 / 80 = <b>2.5x</b>.</li><li>IRR ≈ <b>22%</b>. A 2.5x received entirely in year 5 would be about 20%.</li></ul><p>The recap doesn't change the multiple, but getting $40M back two years early raises the IRR. That's why sponsors use recaps.</p>`},
 {id:"l32",t:"LBO",l:"Advanced",q:"A company has $10M of EBITDA. A sponsor can borrow 5x at entry, expects to exit in 5 years at 8x on $15M of EBITDA with $20M of debt left, and needs a 2.5x MOIC. What's the most it can pay?",a:`<ul><li>Exit equity = (8 × 15) − 20 = $100M.</li><li>For 2.5x, the equity check can be at most 100 / 2.5 = $40M.</li><li>Debt at entry = 5 × 10 = $50M.</li><li>Maximum price = 40 + 50 = <b>$90M, or 9.0x EBITDA</b>.</li></ul><p>Working backward from a target return is how an LBO sets a price floor in a sale process.</p>`},
 {id:"l33",t:"LBO",l:"Intermediate",q:"How can a sponsor still earn a good return if it exits at a lower multiple than it paid?",a:`<p>By growing EBITDA and paying down debt enough to offset the multiple contraction. For example, buy at 10x and exit at 8x: if EBITDA grows 50% and a big chunk of debt is repaid, equity value can still rise substantially. Sponsors often model a flat or lower exit multiple on purpose to be conservative.</p>`},
 {id:"l34",t:"LBO",l:"Intermediate",q:"If EBITDA and the multiple stay flat, can a sponsor still make money? Give an example.",a:`<p>Yes, through debt paydown. Buy at $80M (8x $10M EBITDA) with $50M of debt and $30M of equity. If free cash flow repays $25M of debt over 5 years, the exit at the same $80M leaves $55M for equity. MOIC ≈ <b>1.8x</b>, IRR ≈ <b>13%</b>. It's positive, but well below target, which is why sponsors need growth too.</p>`},
 {id:"l35",t:"LBO",l:"Intermediate",q:"How does the target's balance sheet change when an LBO closes?",a:`<p>The old equity is eliminated and replaced with the sponsor's new equity. Existing debt is usually refinanced and the new acquisition debt is added. Assets may be written up to fair value, and goodwill is created for the excess of the purchase price over the fair value of net assets. Capitalized financing fees appear as an asset or a reduction of debt.</p>`},
 {id:"l36",t:"LBO",l:"Advanced",q:"Does more leverage always mean a higher IRR?",a:`<p>Not always. More debt means a smaller equity check, which raises returns, but also higher interest, which eats the cash available to pay down debt, and higher risk of breaching covenants or defaulting. Past a point, borrowing costs rise steeply and a downturn can wipe out the equity. Lenders also cap leverage, so the practical answer is "up to a point."</p>`},
 {id:"l37",t:"LBO",l:"Basic",q:"Why does an LBO model include a minimum cash balance?",a:`<p>A business needs cash on hand to run day to day: payroll, suppliers, seasonal swings. The model keeps that amount on the balance sheet and uses only cash above it for debt paydown. If cash falls below the minimum, the model draws on the revolver.</p>`},
 {id:"l38",t:"LBO",l:"Advanced",q:"Why is there a circular reference in many LBO models?",a:`<p>Interest is often calculated on the average debt balance for the year. But the year-end balance depends on how much debt is repaid, which depends on free cash flow, which depends on interest expense. That loop is circular. Modelers either turn on iterative calculation with a circuit-breaker switch, or calculate interest on the beginning balance to avoid it.</p>`},
 {id:"l39",t:"LBO",l:"Intermediate",q:"What are EBITDA add-backs, and why do lenders and sponsors care about them?",a:`<p>Adjustments that raise reported EBITDA to "adjusted EBITDA" by removing one-time costs or adding expected savings: restructuring, owner compensation above market, projected synergies. Leverage and the purchase multiple are calculated on adjusted EBITDA, so add-backs increase how much can be borrowed and paid. Aggressive add-backs make a deal riskier than it looks, so diligence scrutinizes them closely.</p>`},
 {id:"l40",t:"LBO",l:"Basic",q:"What is a secondary buyout?",a:`<p>A sale of a company from one private equity firm to another. The selling sponsor exits; the buyer believes it can still grow the business, improve operations, or add acquisitions. It's one of the most common exit routes, alongside selling to a strategic buyer or an IPO.</p>`},
 {id:"l41",t:"LBO",l:"Intermediate",q:"What is a buy-and-build strategy, and what is multiple arbitrage?",a:`<p>The sponsor buys a <b>platform</b> company, then makes smaller <b>add-on</b> acquisitions. Smaller companies usually sell at lower multiples, say 5–6x, while the larger combined company may be valued at 10x or more at exit. That gap is <b>multiple arbitrage</b>: each dollar of acquired EBITDA is worth more at exit than it cost. It's especially common in fragmented industries like healthcare services and business services.</p>`},
 {id:"l42",t:"LBO",l:"Intermediate",q:"How do private equity firms get paid?",a:`<p>Traditionally "2 and 20": an annual <b>management fee</b> of about 2% of committed capital, plus <b>carried interest</b> of about 20% of profits. Carry is usually paid only after investors get their capital back plus a preferred return, or hurdle, often 8%. Carried interest gives the firm a big incentive to generate high returns.</p>`},
 {id:"l43",t:"LBO",l:"Intermediate",q:"Of the three main return drivers, which do sponsors prefer to rely on?",a:`<p><b>EBITDA growth</b>, because they can influence it through operations, pricing and add-ons. <b>Debt paydown</b> is fairly predictable if cash flow holds up. <b>Multiple expansion</b> is the least controllable, since it depends on market conditions at exit, so sponsors usually assume the exit multiple equals or is below the entry multiple.</p>`},
 {id:"l44",t:"LBO",l:"Intermediate",q:"What is covenant-lite debt?",a:`<p>Loans without maintenance covenants, so the borrower isn't tested quarterly on leverage or coverage ratios; only incurrence covenants apply. It gives the company and sponsor more breathing room in a downturn, but lenders lose early warning signals and the ability to step in sooner. It became common in the broadly syndicated term loan B market.</p>`},
 {id:"l45",t:"LBO",l:"Basic",q:"What are the main risks in an LBO?",a:`<p>Cash flow falling short of the plan and the company struggling to service its debt; rising interest rates on floating-rate debt; covenant breaches; overpaying at entry; a weak exit market that forces a lower multiple or longer hold; and execution risk on the operational improvements the plan depends on.</p>`},
 // ---- M&A (more)
 {id:"m21",t:"M&A",l:"Advanced",q:"Buyer: $100M net income, 50M shares, $40 share price. It buys a target with $20M of net income for $300M, paid all in stock. Accretive or dilutive, and by how much?",a:`<ul><li>Buyer EPS = 100 / 50 = $2.00 (P/E of 20x). Price paid for target = 300 / 20 = 15x.</li><li>New shares issued = 300 / 40 = 7.5M.</li><li>Pro forma EPS = (100 + 20) / 57.5 = $2.09.</li><li><b>About 4.3% accretive</b>, as expected, since the buyer's 20x P/E is above the 15x it paid.</li></ul>`},
 {id:"m22",t:"M&A",l:"Advanced",q:"Same buyer ($100M net income, 50M shares, $2.00 EPS). It buys the $20M net income target for $300M in cash, which was earning 4% interest. Tax rate 25%. Accretive or dilutive?",a:`<ul><li>Foregone interest after tax = 300 × 4% × (1 − 25%) = $9M.</li><li>Pro forma net income = 100 + 20 − 9 = $111M, with no new shares.</li><li>Pro forma EPS = 111 / 50 = $2.22: <b>11% accretive</b>.</li></ul><p>Cash is the cheapest funding here: its 3% after-tax cost is well below the target's 6.7% earnings yield (20 / 300).</p>`},
 {id:"m23",t:"M&A",l:"Advanced",q:"Same deal, but funded with $300M of new debt at 6% interest and a 25% tax rate. Accretive or dilutive?",a:`<ul><li>After-tax interest = 300 × 6% × 75% = $13.5M.</li><li>Pro forma net income = 100 + 20 − 13.5 = $106.5M.</li><li>Pro forma EPS = 106.5 / 50 = $2.13: <b>6.5% accretive</b>.</li></ul><p>Ranking for this deal: cash (11%) > debt (6.5%) > stock (4.3%), matching their after-tax costs of 3%, 4.5% and 5% (1 ÷ the buyer's 20x P/E).</p>`},
 {id:"m24",t:"M&A",l:"Intermediate",q:"How do you quickly judge accretion or dilution when a deal is funded with a mix of cash, debt and stock?",a:`<p>Calculate a weighted cost of acquisition. The cost of stock is the buyer's earnings yield (1 ÷ P/E); the cost of debt is the interest rate × (1 − tax); the cost of cash is the foregone interest rate × (1 − tax). Weight each by its share of the funding and compare the result to the target's earnings yield at the purchase price. If the target's yield is higher, the deal is accretive. Example: 50% stock at 5% and 50% debt at 4.5% gives 4.75%, below a 6.7% target yield, so it's accretive.</p>`},
 {id:"m25",t:"M&A",l:"Intermediate",q:"The buyer's P/E is higher than the target's, but the deal is still dilutive. How could that happen?",a:`<p>The quick P/E test ignores several real costs: new depreciation and amortization from writing up the target's assets and intangibles, transaction and financing fees, higher interest if debt is used, lost interest on cash, and integration costs. If those are large enough, they can turn a deal that looks accretive into a dilutive one.</p>`},
 {id:"m26",t:"M&A",l:"Intermediate",q:"Why does an acquisition often create extra depreciation and amortization, and how does that affect EPS?",a:`<p>At closing the target's PP&E and intangible assets (customer relationships, technology, brands) are written up to fair value. Those higher values are depreciated and amortized over their useful lives, which adds new non-cash expense, reduces pro forma net income, and makes the deal less accretive. Goodwill itself isn't amortized under US GAAP.</p>`},
 {id:"m27",t:"M&A",l:"Advanced",q:"A buyer pays $500M for a target with $300M of book equity, which includes $50M of existing goodwill. PP&E is written up by $100M, and the tax rate is 25%. Assuming a stock purchase, how much new goodwill is created?",a:`<ul><li>Write off the old goodwill: 300 − 50 = $250M of tangible and identifiable book value.</li><li>Add the write-up: + $100M.</li><li>Subtract the new deferred tax liability on the write-up: 100 × 25% = $25M.</li><li>Fair value of net identifiable assets = 250 + 100 − 25 = $325M.</li><li>New goodwill = 500 − 325 = <b>$175M</b>.</li></ul>`},
 {id:"m28",t:"M&A",l:"Advanced",q:"Why does a stock purchase create a deferred tax liability when assets are written up?",a:`<p>In a stock purchase, the book value of the assets is written up but the tax basis isn't. So book depreciation will be higher than tax depreciation, meaning the company will pay more cash tax than its book tax expense suggests in future years. That future tax is recorded as a DTL equal to the write-up × the tax rate. In an asset purchase or 338(h)(10) election, the tax basis also steps up, so no DTL is created.</p>`},
 {id:"m29",t:"M&A",l:"Basic",q:"A buyer with 80M shares issues 20M new shares to acquire a target. What percentage of the combined company do the target's shareholders own?",a:`<p>20 / (80 + 20) = <b>20%</b>. The buyer's original shareholders own 80%. Pro forma ownership is a key negotiating point in stock deals and is compared against each side's contribution to combined earnings.</p>`},
 {id:"m30",t:"M&A",l:"Basic",q:"A target's undisturbed share price is $40, and the buyer offers $52. What's the premium, and why use the undisturbed price?",a:`<p>Premium = (52 − 40) / 40 = <b>30%</b>. The undisturbed price is the share price before any rumors or leaks about the deal moved it. Using it measures the true premium; measuring from a price already inflated by speculation would understate it.</p>`},
 {id:"m31",t:"M&A",l:"Intermediate",q:"Why does the acquirer's stock often fall when a deal is announced?",a:`<p>Investors may think the buyer overpaid (the "winner's curse" in competitive auctions), doubt the synergies, worry about integration risk or taking on debt, or expect dilution from new shares. Meanwhile the target's stock usually jumps toward the offer price.</p>`},
 {id:"m32",t:"M&A",l:"Intermediate",q:"What is an earnout, and when is it used?",a:`<p>Part of the purchase price paid later, only if the business hits agreed targets, such as revenue or EBITDA over the next two or three years. It bridges a valuation gap: the seller gets paid for the growth it promises, and the buyer pays only if it happens. It's common in private-company and founder-led deals, and often leads to disputes over how the targets were measured.</p>`},
 {id:"m33",t:"M&A",l:"Intermediate",q:"What is a merger of equals?",a:`<p>A combination of two companies of similar size, usually all-stock with little or no premium, where ownership and board seats are split roughly evenly. Shared leadership and headquarters decisions are typically negotiated. In practice one side often ends up with more control, and cultural integration can be hard.</p>`},
 {id:"m34",t:"M&A",l:"Intermediate",q:"What's the difference between a spin-off, a carve-out and a split-off?",a:`<ul><li><b>Spin-off:</b> the parent distributes shares of a subsidiary to its own shareholders, creating a separate public company. Usually tax-free, with no cash raised.</li><li><b>Carve-out:</b> the parent sells a minority stake in the subsidiary to the public through an IPO, raising cash and usually keeping control.</li><li><b>Split-off:</b> shareholders choose to exchange parent shares for subsidiary shares, which also reduces the parent's share count.</li></ul>`},
 {id:"m35",t:"M&A",l:"Basic",q:"Why would a company sell or spin off one of its businesses?",a:`<p>To focus on its core business; because the unit is worth more on its own or to another owner (unlocking a conglomerate discount); to raise cash to pay down debt or fund growth; because the unit is underperforming or needs investment the parent won't make; or because regulators require it as a condition of another deal.</p>`},
 {id:"m36",t:"M&A",l:"Intermediate",q:"What is HSR antitrust review?",a:`<p>Under the Hart-Scott-Rodino Act, deals above a size threshold must be filed with the FTC and the DOJ before closing. There's an initial 30-day waiting period. If regulators have concerns, they issue a <b>second request</b> for more information, which can delay closing by months and may lead to required divestitures, a lawsuit to block the deal, or the deal being abandoned.</p>`},
 {id:"m37",t:"M&A",l:"Basic",q:"What does a buyer look at in due diligence?",a:`<p><b>Financial:</b> quality of earnings, working capital, debt and debt-like items. <b>Commercial:</b> market, customers, competitive position. <b>Legal:</b> contracts, litigation, intellectual property. Also tax, HR and benefits, IT and cybersecurity, environmental issues, and the management team. The goal is to confirm the value and find risks that change the price or the terms.</p>`},
 {id:"m38",t:"M&A",l:"Basic",q:"What's the difference between a letter of intent and a definitive agreement?",a:`<p>A <b>letter of intent (LOI)</b> sets out the key terms (price, structure, timing, exclusivity) and is mostly non-binding, apart from points like confidentiality and exclusivity. The <b>definitive agreement</b> is the binding contract signed after diligence. It covers price and adjustments, representations and warranties, covenants, conditions to closing, and termination rights.</p>`},
 {id:"m39",t:"M&A",l:"Intermediate",q:"What are representations and warranties, and what is a MAC clause?",a:`<p><b>Reps and warranties</b> are statements of fact the seller makes about the business, such as accurate financials and no undisclosed litigation. If they prove false, the buyer may have remedies, often through indemnification or reps-and-warranties insurance. A <b>MAC</b> (material adverse change) clause lets the buyer walk away if something badly damages the target between signing and closing. Courts set a very high bar for invoking it.</p>`},
 {id:"m40",t:"M&A",l:"Intermediate",q:"What's the difference between a no-shop and a go-shop provision?",a:`<p>A <b>no-shop</b> bars the target from soliciting other bids after signing, though a fiduciary out usually lets the board accept a clearly superior unsolicited offer. A <b>go-shop</b> lets the target actively seek better offers for a set period, often 30–45 days, usually with a lower breakup fee. Go-shops are common when the target didn't run a full auction before signing.</p>`},
 {id:"m41",t:"M&A",l:"Basic",q:"What's the difference between buy-side and sell-side advisory?",a:`<p>On the <b>sell side</b>, the bank represents the seller: it runs the process, prepares the materials, contacts buyers and negotiates to get the best price and terms. On the <b>buy side</b>, it advises the acquirer: finding and evaluating targets, valuation, structuring, bidding strategy and often financing. Sell-side work is more process-heavy for analysts and closes more predictably.</p>`},
 {id:"m42",t:"M&A",l:"Intermediate",q:"How would you estimate the value of expected synergies?",a:`<p>Take the expected annual run-rate synergies, apply taxes, and either capitalize them at a multiple or discount the cash flows. Example: $20M of annual cost synergies × an 8x EBITDA multiple ≈ $160M. Then subtract one-time costs to achieve them, and adjust for timing and the risk they don't materialize. Buyers rarely pay sellers for all of it; the share of synergies paid away in the premium is a key judgment.</p>`},
 // ---- DCF (more)
 {id:"d27",t:"DCF",l:"Basic",q:"Final-year free cash flow is $10M, WACC is 10% and terminal growth is 2%. What's the terminal value?",a:`<p>TV = FCF × (1 + g) / (WACC − g) = 10 × 1.02 / (0.10 − 0.02) = 10.2 / 0.08 = <b>$127.5M</b>. Remember to grow the final-year cash flow one year before dividing.</p>`},
 {id:"d28",t:"DCF",l:"Basic",q:"A terminal value of $1,000M is calculated at the end of year 5. At a 10% WACC, what's it worth today?",a:`<p>PV = 1,000 / 1.10⁵ = 1,000 / 1.61 ≈ <b>$621M</b>. A handy anchor: 1.1⁵ ≈ 1.61, so at 10% a year-5 dollar is worth about 62 cents today.</p>`},
 {id:"d29",t:"DCF",l:"Basic",q:"A company is 60% equity at a 12% cost of equity and 40% debt at a 6% pre-tax cost of debt. The tax rate is 25%. What's its WACC?",a:`<ul><li>After-tax cost of debt = 6% × (1 − 25%) = 4.5%.</li><li>WACC = 60% × 12% + 40% × 4.5% = 7.2% + 1.8% = <b>9.0%</b>.</li></ul>`},
 {id:"d30",t:"DCF",l:"Basic",q:"The risk-free rate is 4%, levered beta is 1.2 and the equity risk premium is 5.5%. What's the cost of equity?",a:`<p>CAPM: 4% + 1.2 × 5.5% = 4% + 6.6% = <b>10.6%</b>.</p>`},
 {id:"d31",t:"DCF",l:"Advanced",q:"A comparable company has a levered beta of 1.5, a debt-to-equity ratio of 0.5 and a 25% tax rate. Unlever its beta, then relever it for a company with a debt-to-equity ratio of 1.0.",a:`<ul><li>Unlevered beta = 1.5 / (1 + (1 − 0.25) × 0.5) = 1.5 / 1.375 ≈ <b>1.09</b>.</li><li>Relevered beta = 1.09 × (1 + 0.75 × 1.0) = 1.09 × 1.75 ≈ <b>1.91</b>.</li></ul><p>More leverage means a higher beta and a higher cost of equity.</p>`},
 {id:"d32",t:"DCF",l:"Basic",q:"EBIT is $100M, the tax rate is 25%, D&A is $20M, CapEx is $30M and net working capital increases by $10M. What's unlevered free cash flow?",a:`<p>UFCF = EBIT × (1 − t) + D&A − CapEx − increase in NWC = 75 + 20 − 30 − 10 = <b>$55M</b>.</p>`},
 {id:"d33",t:"DCF",l:"Intermediate",q:"Depreciation goes up by $10 with no change to CapEx. How does unlevered free cash flow change at a 25% tax rate?",a:`<p>EBIT falls by $10, so after-tax EBIT falls by $7.50. Adding back the extra $10 of D&A gives a net <b>increase of $2.50</b>. That's the depreciation tax shield: $10 × 25%. Depreciation itself isn't cash; it only matters through taxes.</p>`},
 {id:"d34",t:"DCF",l:"Advanced",q:"With 2% terminal growth, roughly how much does the terminal value change if WACC goes from 10% to 11%?",a:`<p>The terminal value is proportional to 1 / (WACC − g). That goes from 1 / 0.08 = 12.5 to 1 / 0.09 ≈ 11.1, a drop of about <b>11%</b>. Add the slightly heavier discounting back to today and total value falls even more. It shows how sensitive a DCF is to the discount rate.</p>`},
 {id:"d35",t:"DCF",l:"Advanced",q:"Using an 8x exit multiple on $50M of final-year EBITDA, the terminal value is $400M. Final-year FCF is $25M and WACC is 10%. What growth rate does that imply, and is it reasonable?",a:`<p>g = (TV × WACC − FCF) / (TV + FCF) = (40 − 25) / 425 ≈ <b>3.5%</b>. That's above the usual 2–3% long-term range, so the 8x multiple may be aggressive. You'd sanity-check it against comps and maybe lower it.</p>`},
 {id:"d36",t:"DCF",l:"Basic",q:"What are sensitivity tables in a DCF, and which inputs do you sensitize?",a:`<p>Grids showing the implied value or share price across a range of two inputs. The usual pairs are WACC vs. terminal growth rate and WACC vs. exit multiple. Operating assumptions like revenue growth and margins are also common. They show how much the answer depends on assumptions you can't know precisely, and turn a single point into a range.</p>`},
 {id:"d37",t:"DCF",l:"Intermediate",q:"Can you use a DCF if the company has negative free cash flow in the early years?",a:`<p>Yes. Negative early cash flows are simply discounted like any other and reduce the value. But more of the value then comes from the terminal value, so you need a longer projection period until the business reaches a steady state, and the answer becomes very sensitive to long-term assumptions.</p>`},
 {id:"d38",t:"DCF",l:"Advanced",q:"Besides debt, what debt-like items might you subtract when going from enterprise value to equity value?",a:`<p>Unfunded pension obligations (often after tax), finance lease liabilities, preferred stock, noncontrolling interest, and sometimes accrued but unpaid items like deferred compensation, litigation reserves, or earnouts owed from past acquisitions. The test is whether a buyer would have to pay it and whether the cash flows you discounted already reflect it.</p>`},
 {id:"d39",t:"DCF",l:"Intermediate",q:"How would you adjust a DCF for a highly cyclical company?",a:`<p>Avoid projecting from a peak or trough year. Normalize revenue and margins to mid-cycle levels, especially in the final year that drives the terminal value. You might project a full cycle, and you can cross-check the exit multiple against the multiples peers trade at through the cycle.</p>`},
 {id:"d40",t:"DCF",l:"Intermediate",q:"Your DCF says a stock is worth $60, but it trades at $40. What might explain the gap?",a:`<p>Either your assumptions are more optimistic than the market's (growth, margins, terminal value, a lower discount rate) or the market is missing something. Check the inputs first: reverse the DCF to see what growth the $40 price implies. If your assumptions hold up and you can name why the market is wrong, it might be an investment idea. Usually the answer is the assumptions.</p>`},
 {id:"d41",t:"DCF",l:"Intermediate",q:"Should WACC use the company's current capital structure or a target one?",a:`<p>Usually a <b>target</b> (long-term) capital structure, often based on peer averages or management's stated policy, because the DCF values cash flows over many years. If the current structure is temporary, like right after an LBO, using it would distort the discount rate.</p>`},
 {id:"d42",t:"DCF",l:"Basic",q:"Why use market values instead of book values when weighting debt and equity in WACC?",a:`<p>WACC is meant to reflect what investors require today. The market value of equity (share price × shares) captures current expectations; book equity is a historical accounting number that can be far off. For debt, book and market values are usually close, so book value is often used unless the debt trades at a big discount.</p>`},
 {id:"d43",t:"DCF",l:"Advanced",q:"What is a stub period in a DCF?",a:`<p>The partial year between the valuation date and the end of the current fiscal year. If you value a company in September, only the remaining months of this year's cash flow belong to a new buyer. You include just that portion and adjust the discount periods so later years are discounted by the right fraction of a year.</p>`},
 {id:"d44",t:"DCF",l:"Intermediate",q:"How is a dividend discount model different from a DCF?",a:`<p>A DDM discounts expected dividends to shareholders at the cost of equity, giving equity value directly. It's used for banks and insurers, where debt is part of operations and free cash flow is hard to define. A standard DCF discounts unlevered free cash flow at WACC to get enterprise value.</p>`},
 {id:"d45",t:"DCF",l:"Advanced",q:"When would you add a size premium or company-specific risk premium to the cost of equity?",a:`<p>For small companies, private companies, or businesses with risks CAPM's beta doesn't capture, like customer concentration or key-person dependence. Historically small companies have earned returns above what CAPM predicts, so practitioners add a premium of a few percentage points. It's judgment-heavy, so be ready to justify it.</p>`},
 {id:"d46",t:"DCF",l:"Intermediate",q:"How does a lower corporate tax rate affect a DCF valuation?",a:`<p>Free cash flow rises because taxes on EBIT fall, which raises value. WACC rises slightly because the tax shield on debt is smaller, which offsets a little. The net effect is almost always a higher valuation.</p>`},
 {id:"d47",t:"DCF",l:"Intermediate",q:"Why do you discount unlevered free cash flow at WACC rather than at the cost of equity?",a:`<p>Consistency. Unlevered FCF is before interest, so it belongs to all capital providers, debt and equity. Its discount rate must reflect what all of them require: WACC. Discounting it at the higher cost of equity would undervalue the business; discounting levered FCF at WACC would overvalue the equity.</p>`},
 {id:"d48",t:"DCF",l:"Basic",q:"What are the most common mistakes in a DCF?",a:`<p>Hockey-stick projections that don't match history; a terminal growth rate that's too high; mixing levered cash flows with WACC (or vice versa); forgetting working capital or under-forecasting CapEx relative to growth; using book values in WACC; a terminal value that is nearly all of the value without sanity checks; and double-counting items in the bridge to equity value.</p>`},
 // ---- Valuation (more)
 {id:"v20",t:"Valuation",l:"Basic",q:"Peers trade at a median 9x EV/EBITDA. Your company has $50M of EBITDA, $100M of net debt and 20M diluted shares. What's the implied share price?",a:`<ul><li>Implied EV = 9 × 50 = $450M.</li><li>Equity value = 450 − 100 = $350M.</li><li>Share price = 350 / 20 = <b>$17.50</b>.</li></ul><p>Always go through the bridge: an EV multiple gives EV, not equity value.</p>`},
 {id:"v21",t:"Valuation",l:"Basic",q:"Peers trade at 15x forward earnings, and your company is expected to earn $3.00 per share next year. What's the implied share price?",a:`<p>15 × $3.00 = <b>$45</b>. Because P/E is an equity multiple, it gives the share price directly with no bridge from EV.</p>`},
 {id:"v22",t:"Valuation",l:"Basic",q:"Comparable acquisitions were done at 1.5–2.0x revenue. Your company has $200M of revenue. What's the implied enterprise value range?",a:`<p>1.5 × 200 = $300M to 2.0 × 200 = $400M, so <b>$300–400M</b>. Since precedents include a control premium, this range is what a buyer might pay, not where the stock should trade.</p>`},
 {id:"v23",t:"Valuation",l:"Intermediate",q:"What is the PEG ratio and why use it?",a:`<p>PEG = P/E ÷ expected annual EPS growth rate (in percent). A company at 30x earnings growing 20% a year has a PEG of 1.5. It adjusts P/E for growth, so you can compare a fast grower at a high multiple to a slow grower at a low one. Around 1.0 is often called fairly valued, but it ignores risk and the quality of growth.</p>`},
 {id:"v24",t:"Valuation",l:"Intermediate",q:"When would you use EV/EBIT instead of EV/EBITDA?",a:`<p>When D&A is large and differs across peers, as in capital-intensive industries like manufacturing, telecom or airlines. D&A is a rough proxy for the capital the business needs to reinvest, so ignoring it can make capital-heavy companies look cheap. Some analysts use EV/(EBITDA − CapEx) for the same reason.</p>`},
 {id:"v25",t:"Valuation",l:"Intermediate",q:"Two companies trade at the same EV/EBITDA but very different P/E multiples. Why?",a:`<p>The difference comes from everything between EBITDA and net income: <b>leverage</b> (interest expense), <b>D&A</b> (capital intensity or acquisition-related amortization), and <b>tax rates</b>. A heavily indebted company has lower net income, so its P/E looks higher even if the operating business is valued the same.</p>`},
 {id:"v26",t:"Valuation",l:"Intermediate",q:"Why might a faster-growing company trade at a lower multiple than a slower-growing peer?",a:`<p>Growth isn't the only driver. It may have lower margins or returns on capital, need heavy CapEx to grow, be more cyclical or riskier, have customer concentration, carry more debt, or the market may doubt its growth will last. Quality and durability of earnings matter as much as speed.</p>`},
 {id:"v27",t:"Valuation",l:"Intermediate",q:"On a football field, the DCF range is far above the trading comps range and they don't overlap. What do you do?",a:`<p>Investigate before presenting it. Check DCF assumptions (growth, margins, terminal value, WACC) and whether the comps set is truly comparable. The gap may be legitimate, for example if the market is pessimistic on the sector, but you should be able to explain it. Often it leads you to adjust the DCF or refine the comps.</p>`},
 {id:"v28",t:"Valuation",l:"Intermediate",q:"How would you value a software (SaaS) company?",a:`<p>Usually EV/NTM revenue or EV/ARR (annual recurring revenue), since many are unprofitable or reinvesting heavily. Adjust for quality using growth, gross margin, net revenue retention, customer acquisition cost payback, and the Rule of 40. Mature, profitable software companies are also valued on EV/EBITDA, free cash flow multiples, and a DCF.</p>`},
 {id:"v29",t:"Valuation",l:"Basic",q:"What is the Rule of 40?",a:`<p>A software benchmark: revenue growth % + profit margin % (usually free cash flow or EBITDA margin) should be at least 40. A company growing 30% with a 10% FCF margin scores 40. Companies above 40 typically earn higher revenue multiples, because they balance growth and profitability well.</p>`},
 {id:"v30",t:"Valuation",l:"Advanced",q:"How would you value an oil and gas exploration and production company?",a:`<p>The main method is <b>net asset value (NAV)</b>: the discounted cash flows from producing the company's proved and probable reserves under a commodity price deck, minus net debt. Common multiples: EV/EBITDAX (EBITDA before exploration expense), EV/proved reserves, and EV/daily production. Results are very sensitive to oil and gas price assumptions.</p>`},
 {id:"v31",t:"Valuation",l:"Advanced",q:"How would you value an insurance company?",a:`<p>Use Price/Book and Price/Tangible Book, compared against return on equity; P/E on operating earnings; and a dividend discount model. Life insurers may also use embedded value. As with banks, EV and EBITDA don't apply because investment income and the balance sheet are core to operations.</p>`},
 {id:"v32",t:"Valuation",l:"Advanced",q:"How would you value a pre-revenue biotech company?",a:`<p>Use a <b>risk-adjusted NPV (rNPV)</b>: project cash flows for each drug if approved, then weight them by the probability of succeeding through each clinical trial phase, discount them, and subtract development costs. Add cash, which is often a large share of value. You can also compare to recent licensing deals and acquisitions of companies at the same trial stage.</p>`},
 {id:"v33",t:"Valuation",l:"Intermediate",q:"How would you value a retailer?",a:`<p>EV/EBITDA and P/E, and often <b>EV/EBITDAR</b> (before rent) to compare retailers that lease stores with those that own them. Key operating metrics include same-store sales growth, sales per square foot, inventory turnover, and new store economics.</p>`},
 {id:"v34",t:"Valuation",l:"Intermediate",q:"How would you value a regulated utility?",a:`<p>P/E and dividend yield compared to peers, a dividend discount model, and the regulated rate base: the asset value on which regulators allow the utility to earn a set return. Earnings are stable and set by regulators, so growth in the rate base drives value. EV/EBITDA is also used.</p>`},
 {id:"v35",t:"Valuation",l:"Basic",q:"Do you use the mean or median of a comps set, and how do you handle outliers?",a:`<p>The <b>median</b> is usually preferred because one extreme multiple can distort the mean. Look at the 25th and 75th percentiles as a range. Exclude outliers whose multiples are meaningless (negative earnings, one-time distortions), and explain any exclusions rather than quietly dropping them.</p>`},
 {id:"v36",t:"Valuation",l:"Intermediate",q:"What is a liquidation valuation, and when is it used?",a:`<p>It estimates what the company's assets would fetch if sold off, after applying recovery rates (e.g. near 100% for cash, much less for inventory or specialized equipment), minus liabilities in order of priority. It's used for distressed companies and in restructuring, and shows the downside for creditors.</p>`},
 {id:"v37",t:"Valuation",l:"Advanced",q:"What is a replacement cost valuation?",a:`<p>It estimates what it would cost to build the business's assets from scratch today: plants, networks, inventory, and sometimes the time to reach the same market position. It's useful for asset-heavy industries like infrastructure, real estate, or manufacturing, and as a sanity check: a buyer shouldn't pay far more than replacement cost unless there's something hard to replicate.</p>`},
 {id:"v38",t:"Valuation",l:"Intermediate",q:"What is a premiums paid analysis?",a:`<p>It looks at the premiums paid over the undisturbed share price in comparable past acquisitions of public companies, commonly 1 day, 1 week and 1 month before announcement. Applying that range (often 25–40%) to the target's undisturbed price gives an implied value range. It's frequently shown on the football field for public targets.</p>`},
 {id:"v39",t:"Valuation",l:"Basic",q:"Besides comps, precedents and a DCF, what else often appears on a football field?",a:`<p>The <b>52-week trading range</b> (high and low share price), <b>analyst price targets</b>, a premiums paid analysis, and an <b>LBO analysis</b> showing what a sponsor could pay. These are reference points, not intrinsic valuations, but they help a board judge an offer.</p>`},
 {id:"v40",t:"Valuation",l:"Intermediate",q:"How do non-operating assets affect a valuation?",a:`<p>Assets that don't generate the EBITDA you're valuing (excess cash, investments in other companies, unused land, NOLs) aren't captured by multiples or the DCF of operating cash flows. Value them separately and add them to get from enterprise value to equity value, or the valuation will be too low.</p>`},
 {id:"v41",t:"Valuation",l:"Intermediate",q:"A buyer offers $30 per share for a company with 50M diluted shares, $300M of net debt and $150M of EBITDA. What EV/EBITDA multiple is the buyer paying?",a:`<ul><li>Equity purchase price = 30 × 50 = $1,500M.</li><li>EV = 1,500 + 300 = $1,800M.</li><li>EV/EBITDA = 1,800 / 150 = <b>12.0x</b>.</li></ul><p>Then compare that 12x against comps and precedents to judge whether the offer is full.</p>`},
 // ---- Accounting (more)
 {id:"a35",t:"Accounting",l:"Intermediate",q:"A company delivers $100 of service that a customer prepaid last year. Walk me through the statements at a 40% tax rate.",a:`<ul><li><b>IS:</b> revenue +$100, net income +$60.</li><li><b>CFS:</b> net income +$60, but deferred revenue falls by $100, which is −$100 in operations. Cash −$40 (the taxes now owed on revenue collected earlier).</li><li><b>BS:</b> cash −$40. Liabilities: deferred revenue −$100. Equity: retained earnings +$60. Both sides −$40.</li></ul>`},
 {id:"a36",t:"Accounting",l:"Basic",q:"A customer pays a $10 invoice the company billed last month. Walk me through the statements.",a:`<p>No income statement change, because the revenue was already recorded when billed. On the CFS, the decrease in accounts receivable is +$10 in operations. On the BS, cash +$10 and AR −$10, so total assets don't change.</p>`},
 {id:"a37",t:"Accounting",l:"Basic",q:"A company pays $10 it owed to a supplier (accounts payable). Walk me through the statements.",a:`<p>No income statement change; the expense was recorded earlier. On the CFS, the decrease in AP is −$10 in operations. On the BS, cash −$10 and AP −$10.</p>`},
 {id:"a38",t:"Accounting",l:"Basic",q:"A company issues $100 of new stock. Walk me through the statements.",a:`<p>No income statement change. On the CFS, +$100 in financing. On the BS, cash +$100 and equity (common stock and APIC) +$100.</p>`},
 {id:"a39",t:"Accounting",l:"Intermediate",q:"A company buys $100 of equipment with cash, then records $10 of depreciation in the first year. Walk me through both steps at a 40% tax rate.",a:`<p><b>Purchase:</b> no IS change; −$100 CapEx in investing; cash −$100 and PP&E +$100.</p><p><b>Depreciation:</b> net income −$6; add back $10 on the CFS, so cash +$4; on the BS, PP&E −$10, cash +$4, retained earnings −$6.</p>`},
 {id:"a40",t:"Accounting",l:"Basic",q:"A company repays $50 of debt principal. Walk me through the statements.",a:`<p>No income statement change; repaying principal isn't an expense. On the CFS, −$50 in financing. On the BS, cash −$50 and debt −$50. Only interest goes through the income statement.</p>`},
 {id:"a41",t:"Accounting",l:"Intermediate",q:"A company records a $20 employee bonus that it won't pay until next year. Walk me through the statements at a 40% tax rate.",a:`<ul><li><b>IS:</b> compensation expense +$20, net income −$12.</li><li><b>CFS:</b> net income −$12, increase in accrued expenses +$20, cash +$8.</li><li><b>BS:</b> cash +$8. Liabilities: accrued expenses +$20. Equity: retained earnings −$12. Both sides +$8.</li></ul>`},
 {id:"a42",t:"Accounting",l:"Intermediate",q:"A company expects $10 of receivables won't be collected and records a bad debt expense. Walk me through the statements at a 40% tax rate.",a:`<ul><li><b>IS:</b> bad debt expense +$10, net income −$6.</li><li><b>CFS:</b> net income −$6, add back the non-cash $10 (or show it through the AR decrease), cash +$4.</li><li><b>BS:</b> net accounts receivable −$10 (through the allowance for doubtful accounts), cash +$4, assets −$6. Retained earnings −$6.</li></ul>`},
 {id:"a43",t:"Accounting",l:"Basic",q:"A company buys $10 of inventory on credit. Walk me through the statements.",a:`<p>No income statement change. On the CFS, the inventory increase (−$10) and the AP increase (+$10) offset, so no change in cash. On the BS, inventory +$10 and accounts payable +$10.</p>`},
 {id:"a44",t:"Accounting",l:"Basic",q:"A company's stock price doubles. What happens on its financial statements?",a:`<p><b>Nothing.</b> The share price isn't recorded on the company's own financial statements. Market capitalization and equity value rise, but the balance sheet equity is based on historical accounting. (It could affect future stock comp expense or dilution, but not the statements directly.)</p>`},
 {id:"a45",t:"Accounting",l:"Basic",q:"A company does a 2-for-1 stock split. What changes?",a:`<p>Shares outstanding double and the share price roughly halves, so market value is unchanged. There's no effect on cash, net income or total equity. Per-share figures like EPS are restated for all periods so they stay comparable.</p>`},
 {id:"a46",t:"Accounting",l:"Intermediate",q:"How is cash flow from operations different from EBITDA?",a:`<p>Cash flow from operations is after cash interest and cash taxes, and it reflects changes in working capital and other non-cash items. EBITDA is before interest, taxes and working capital. So a company with big interest bills, high taxes or growing receivables can have operating cash flow far below EBITDA.</p>`},
 {id:"a47",t:"Accounting",l:"Intermediate",q:"What's the difference between recording revenue gross and net?",a:`<p>If the company is the <b>principal</b> (it controls the good or service before it reaches the customer), it records the full sale as revenue and its cost in COGS: <b>gross</b>. If it's an <b>agent</b> arranging a sale for someone else, like a marketplace, it records only its fee: <b>net</b>. Gross reporting makes revenue look bigger, so compare margins carefully across companies.</p>`},
 {id:"a48",t:"Accounting",l:"Intermediate",q:"What are the five steps of revenue recognition under ASC 606?",a:`<ol><li>Identify the contract with the customer.</li><li>Identify the separate performance obligations.</li><li>Determine the transaction price.</li><li>Allocate the price to each performance obligation.</li><li>Recognize revenue as each obligation is satisfied.</li></ol><p>The core idea: revenue is recognized when control of the good or service transfers to the customer.</p>`},
 {id:"a49",t:"Accounting",l:"Basic",q:"What's the difference between depreciation and amortization, and what is accumulated depreciation?",a:`<p><b>Depreciation</b> spreads the cost of tangible assets (equipment, buildings) over their useful lives; <b>amortization</b> does the same for intangible assets (patents, customer lists). <b>Accumulated depreciation</b> is the total depreciation recorded so far; it's a contra-asset that reduces gross PP&E to net PP&E on the balance sheet.</p>`},
 {id:"a50",t:"Accounting",l:"Basic",q:"Why does interest appear on the income statement but debt repayment doesn't?",a:`<p>Interest is the cost of borrowing, an expense of the period, so it reduces net income. Repaying principal is just returning money that was borrowed: it reduces a liability and cash, but isn't a cost. That's why principal repayment appears only in the financing section of the cash flow statement.</p>`},
 {id:"a51",t:"Accounting",l:"Intermediate",q:"A company has 45 days sales outstanding, 60 days of inventory and 30 days payable outstanding. What's its cash conversion cycle, and what does it mean?",a:`<p>Cash conversion cycle = DSO + DIO − DPO = 45 + 60 − 30 = <b>75 days</b>. That's how long cash is tied up between paying suppliers and collecting from customers. A shorter cycle means less working capital is needed to run the business; a negative one means suppliers are effectively funding it.</p>`},
 {id:"a52",t:"Accounting",l:"Basic",q:"A company has $365M of annual revenue and $50M of accounts receivable. What's its days sales outstanding?",a:`<p>DSO = AR ÷ revenue × 365 = 50 / 365 × 365 = <b>50 days</b>. Revenue is $1M a day, so $50M of receivables is 50 days of sales. Rising DSO can signal collection problems or aggressive revenue recognition.</p>`},
 {id:"a53",t:"Accounting",l:"Intermediate",q:"What is a quality of earnings report?",a:`<p>A diligence report, usually by an accounting firm, that tests whether a company's reported EBITDA is real and repeatable. It reviews adjustments and add-backs, one-time items, revenue recognition, working capital trends and how much earnings turn into cash. Buyers and lenders rely on it to set price and leverage.</p>`},
 {id:"a54",t:"Accounting",l:"Basic",q:"A company has $100M of EBITDA, $20M of interest expense and $400M of debt. What are its interest coverage and leverage ratios?",a:`<ul><li>Interest coverage = EBITDA ÷ interest = 100 / 20 = <b>5.0x</b>.</li><li>Leverage = debt ÷ EBITDA = 400 / 100 = <b>4.0x</b>.</li></ul><p>These are the ratios lenders watch most closely, and they often appear in covenants.</p>`},
 {id:"a55",t:"Accounting",l:"Intermediate",q:"Net income is $10, revenue $100, total assets $200 and equity $50. Calculate ROE using the DuPont breakdown.",a:`<ul><li>Profit margin = 10 / 100 = 10%.</li><li>Asset turnover = 100 / 200 = 0.5x.</li><li>Equity multiplier (leverage) = 200 / 50 = 4.0x.</li><li>ROE = 10% × 0.5 × 4 = <b>20%</b> (check: 10 / 50 = 20%).</li></ul><p>DuPont shows <i>why</i> ROE is high: here it's mostly leverage, not profitability.</p>`},
 {id:"a56",t:"Accounting",l:"Intermediate",q:"What's the difference between the direct and indirect methods for the cash flow statement?",a:`<p>The <b>indirect</b> method, which almost every company uses, starts with net income and adjusts for non-cash items and working capital changes. The <b>direct</b> method lists actual cash receipts and payments: cash from customers, cash paid to suppliers and employees. Both give the same cash from operations.</p>`},
 // ---- Enterprise Value (more)
 {id:"e21",t:"Enterprise Value",l:"Intermediate",q:"A company has 100 basic shares at $20. It has 10 options with a $10 strike and 5 options with a $25 strike. What are its diluted shares?",a:`<ul><li>The $25 options are out of the money, so ignore them.</li><li>The $10 options: exercise creates 10 shares and $100 of proceeds, which buys back 100 / 20 = 5 shares. Net new shares = 5.</li><li>Diluted shares = 100 + 5 = <b>105</b>.</li></ul>`},
 {id:"e22",t:"Enterprise Value",l:"Basic",q:"How do restricted stock units (RSUs) affect diluted shares?",a:`<p>RSUs have no exercise price, so there are no proceeds to buy back shares. Add them to the share count in full (at least those expected to vest). They're often a bigger source of dilution than options at mature tech companies.</p>`},
 {id:"e23",t:"Enterprise Value",l:"Intermediate",q:"A company has a $100 convertible bond that converts at $25 per share. How do you treat it if the stock trades at $30? At $20?",a:`<p>On conversion it becomes 100 / 25 = 4 shares.</p><ul><li><b>At $30:</b> it's in the money, so assume conversion. Add 4 shares to diluted shares, and don't count the $100 as debt.</li><li><b>At $20:</b> it's out of the money, so holders won't convert. Count the $100 as debt and add no shares.</li></ul>`},
 {id:"e24",t:"Enterprise Value",l:"Intermediate",q:"Share price $10, 50 basic shares, 5 options with a $6 strike, $200 of debt, $70 of cash and $30 of preferred stock. What's enterprise value?",a:`<ul><li>Options: 5 new shares, proceeds of $30 buy back 3 shares, so +2 net. Diluted shares = 52.</li><li>Equity value = 52 × $10 = $520.</li><li>EV = 520 + 200 + 30 − 70 = <b>$680</b>.</li></ul>`},
 {id:"e25",t:"Enterprise Value",l:"Intermediate",q:"Equity value is $1,000, debt $300, cash $150, noncontrolling interest $50 and equity-method investments $100. What's enterprise value?",a:`<p>EV = 1,000 + 300 + 50 − 150 − 100 = <b>$1,100</b>. Add noncontrolling interest because EBITDA includes 100% of consolidated subsidiaries; subtract equity investments because their earnings aren't in EBITDA.</p>`},
 {id:"e26",t:"Enterprise Value",l:"Basic",q:"Your valuation gives an enterprise value of $900. The company has $300 of debt, $100 of cash and 35 diluted shares. What's the implied share price?",a:`<p>Equity value = 900 − 300 + 100 = $700. Share price = 700 / 35 = <b>$20</b>. Going from EV back to equity value reverses the EV formula.</p>`},
 {id:"e27",t:"Enterprise Value",l:"Basic",q:"A company issues $100 of new stock and keeps the cash. What happens to equity value and enterprise value?",a:`<p>Equity value rises by $100 (more shares at the same price). Cash rises by $100, which is subtracted in EV. EV is <b>unchanged</b>: the operating business didn't change.</p>`},
 {id:"e28",t:"Enterprise Value",l:"Intermediate",q:"A company borrows $100 and uses it to buy back stock. What happens to equity value and enterprise value?",a:`<p>Equity value falls by $100 as shares are retired. Debt rises by $100. EV is <b>unchanged</b>. This is a leveraged recapitalization: only the mix of debt and equity financing the business changes.</p>`},
 {id:"e29",t:"Enterprise Value",l:"Intermediate",q:"A company sells a division for $100 in cash, exactly what it's worth. What happens to equity value and enterprise value?",a:`<p>Equity value is unchanged: shareholders swapped a $100 business for $100 of cash. EV <b>falls by $100</b>, because the company now has fewer operating assets and $100 more cash, which is subtracted in EV. It's the reverse of an acquisition.</p>`},
 {id:"e30",t:"Enterprise Value",l:"Basic",q:"A company's stock price rises 10% after strong earnings. What happens to equity value and enterprise value?",a:`<p>Equity value rises 10%. EV rises by the <b>same dollar amount</b>, since debt and cash are unchanged. In percentage terms EV rises by less than 10% if the company has net debt, because equity is only part of EV.</p>`},
 {id:"e31",t:"Enterprise Value",l:"Intermediate",q:"Bondholders convert $100 of debt into equity. What happens to equity value and enterprise value?",a:`<p>Debt falls by $100 and equity value rises by $100 as new shares are issued. EV is <b>unchanged</b>. The claims on the business moved from creditors to shareholders.</p>`},
 {id:"e32",t:"Enterprise Value",l:"Intermediate",q:"A company writes down $50 of goodwill. What happens to equity value and enterprise value?",a:`<p>In theory, <b>neither changes</b>. The write-down is a non-cash accounting charge that recognizes value the market had probably already priced in. Book equity falls, but market value depends on future cash flows, which don't change. (If the write-down reveals bad news the market didn't know, the share price could drop.)</p>`},
 {id:"e33",t:"Enterprise Value",l:"Intermediate",q:"Employees exercise options and pay $50 to the company. What happens to equity value and enterprise value?",a:`<p>Shares outstanding rise and cash rises by $50, so equity value rises by $50. EV is <b>unchanged</b>, since the extra cash offsets it. If you were already using diluted shares (treasury stock method), equity value barely moves, since the dilution was already counted.</p>`},
 {id:"e34",t:"Enterprise Value",l:"Basic",q:"Should you use basic or diluted shares when calculating equity value?",a:`<p><b>Diluted.</b> Options, warrants, RSUs and in-the-money convertibles represent claims that will become shares, so they're part of what equity holders own collectively. Using basic shares understates equity value, and a buyer would have to pay those holders too.</p>`},
 {id:"e35",t:"Enterprise Value",l:"Advanced",q:"A company has $500 of cash, but it needs $200 to run its operations day to day. How much cash do you subtract when calculating EV?",a:`<p>Arguably only the <b>$300 of excess cash</b>. The $200 is effectively an operating asset like inventory: a buyer couldn't take it out without hurting the business. In practice many banks subtract all cash for simplicity, so say you'd follow your group's convention but explain the logic. Similar issues apply to cash trapped overseas or restricted cash.</p>`},
 {id:"e36",t:"Enterprise Value",l:"Advanced",q:"How do you treat an unfunded pension obligation in enterprise value?",a:`<p>Treat it as debt-like: add it to EV, usually after tax, since pension contributions are tax-deductible. For example, a $100 deficit at a 25% tax rate adds $75. Be consistent: if pension expense is already deducted in the EBITDA you use, you may need to adjust it so you don't double-count.</p>`},
 {id:"e37",t:"Enterprise Value",l:"Intermediate",q:"Should you add accounts payable or deferred revenue to enterprise value like debt?",a:`<p>Generally <b>no</b>. They're operating liabilities, part of working capital. Their effects already flow through the operating cash flows and EBITDA you're valuing, and they don't carry interest. Counting them as debt would double-count. Exceptions are judgment calls, like unusually stretched payables.</p>`},
 {id:"e38",t:"Enterprise Value",l:"Basic",q:"Why do you add preferred stock when calculating enterprise value?",a:`<p>Preferred stock is a claim on the company senior to common equity: it usually has a fixed dividend and liquidation preference, and a buyer would generally need to redeem it. It behaves more like debt than common stock, so it's added to EV like other non-common capital.</p>`},
 {id:"e39",t:"Enterprise Value",l:"Advanced",q:"Should net operating losses affect enterprise value?",a:`<p>They can. NOLs are a non-operating asset that will reduce future cash taxes. Some practitioners subtract their estimated present value when calculating EV, like cash. Others leave them in the DCF by lowering projected taxes. Either way, count them once and remember that ownership changes can limit their use (Section 382).</p>`},
 {id:"e40",t:"Enterprise Value",l:"Advanced",q:"A company's bonds trade at 70 cents on the dollar. Which value of debt do you use in enterprise value?",a:`<p>For a healthy company, book and market value of debt are close, so book value is fine. For a distressed company whose debt trades far below face value, the <b>market value</b> better reflects what investors think the claims are worth, though a buyer taking control may still have to repay at face (via change-of-control clauses). Mention both and the trade-off.</p>`},
 {id:"e41",t:"Enterprise Value",l:"Intermediate",q:"Is enterprise value exactly what a buyer would pay to acquire the company?",a:`<p>Not exactly. A buyer usually pays a control premium over the market price, plus transaction and financing fees. Some debt has change-of-control provisions requiring repayment, possibly at a premium, while other debt may be assumed. Cash may not all be accessible. EV is a useful approximation of the cost of the operating business, not the final price.</p>`},
 {id:"e42",t:"Enterprise Value",l:"Basic",q:"Two companies have the same enterprise value but very different equity values. Why?",a:`<p>Different capital structures. The one with more net debt (debt minus cash) has a smaller equity value, because more of the business's value belongs to creditors. Operating value is the same; only who owns the claims differs.</p>`},
 {id:"b43",t:"Brain Teasers",l:"Basic",q:"Without a calculator: what's 15% of 80 plus 20% of 45?",a:`<p>15% of 80: 10% is 8, 5% is 4, so 12. 20% of 45: 10% is 4.5, doubled is 9. Total = <b>21</b>. Building percentages from 10% and 5% is the fastest way to do this out loud.</p>`},
 {id:"b44",t:"Brain Teasers",l:"Basic",q:"What's 2 to the 10th power? Roughly what's 2 to the 20th?",a:`<p>2¹⁰ = <b>1,024</b>, about a thousand. So 2²⁰ = 1,024² ≈ <b>1 million</b> (exactly 1,048,576). Handy for anything involving doubling.</p>`},
 {id:"b45",t:"Brain Teasers",l:"Basic",q:"Without a calculator: what's 99 × 99?",a:`<p>(100 − 1)² = 10,000 − 200 + 1 = <b>9,801</b>. Rewrite numbers near a round number and expand.</p>`},
 {id:"b46",t:"Brain Teasers",l:"Basic",q:"Roughly what is 3/7 as a percentage?",a:`<p>1/7 ≈ 14.3%, so 3/7 ≈ <b>42.9%</b>. Worth memorizing: 1/7 ≈ 14.3%, 1/8 = 12.5%, 1/9 ≈ 11.1%, 1/11 ≈ 9.1%, 1/12 ≈ 8.3%.</p>`},
 {id:"b47",t:"Brain Teasers",l:"Basic",q:"You invest $1,000 at 10% a year, compounded annually. What's it worth after 3 years?",a:`<p>$1,000 → $1,100 → $1,210 → <b>$1,331</b>. That's 1.1³ = 1.331. Simple interest would give only $1,300; the extra $31 is interest on interest.</p>`},
 {id:"b48",t:"Brain Teasers",l:"Basic",q:"You roll two dice. What's the probability the sum is 7, and why is 7 the most likely sum?",a:`<p>There are 36 equally likely outcomes, and 6 of them sum to 7 (1+6, 2+5, 3+4, 4+3, 5+2, 6+1), so the probability is <b>6/36 = 1/6</b>. Every value of the first die has exactly one partner that makes 7, which no other sum can say.</p>`},
 {id:"b49",t:"Brain Teasers",l:"Basic",q:"You flip a fair coin 10 times. What's the probability of at least one heads?",a:`<p>Use the complement: the only way to fail is all tails, (1/2)¹⁰ = 1/1,024. So the answer is 1 − 1/1,024 = <b>1,023/1,024</b>, about 99.9%.</p>`},
 {id:"b50",t:"Brain Teasers",l:"Basic",q:"A bag has 3 red balls and 2 blue balls. You draw two without replacement. What's the probability both are red?",a:`<p>3/5 for the first red, then 2/4 for the second: (3/5) × (2/4) = 6/20 = <b>3/10</b>.</p>`},
 {id:"b51",t:"Brain Teasers",l:"Advanced",q:"A disease affects 1% of people. A test is 99% accurate for both sick and healthy people. You test positive. What's the probability you have the disease?",a:`<p><b>50%.</b> Imagine 10,000 people: 100 are sick, and 99 of them test positive. Of the 9,900 healthy people, 1% (99) also test positive. So of 198 positives, 99 are sick: 99 / 198 = 50%. This is Bayes' theorem; the low base rate is what most people miss.</p>`},
 {id:"b52",t:"Brain Teasers",l:"Basic",q:"A lottery ticket has a 1-in-a-million chance of winning $500,000. What's the most you'd pay for it?",a:`<p>Expected value = $500,000 × 1/1,000,000 = <b>$0.50</b>. A risk-neutral person would pay up to 50 cents. You could add that people buy tickets for more because they value the small chance of a life-changing payout.</p>`},
 {id:"b53",t:"Brain Teasers",l:"Intermediate",q:"Each year a stock has a 50% chance of rising 20% and a 50% chance of falling 10%. What's its expected annual return?",a:`<p>0.5 × 20% + 0.5 × (−10%) = <b>5%</b>. Bonus point: over time the typical outcome is lower than that, because one up year and one down year leave you at 1.2 × 0.9 = 1.08, or about 3.9% a year compounded. Volatility drags on compounded returns.</p>`},
 {id:"b54",t:"Brain Teasers",l:"Advanced",q:"You flip cards from a shuffled deck one at a time. On average, at what position does the first ace appear?",a:`<p>The 4 aces split the 48 other cards into 5 gaps, and by symmetry each gap averages 48 / 5 = 9.6 cards. So the first ace is, on average, card 9.6 + 1 = <b>10.6</b>. General formula: (n + 1) / (k + 1) = 53 / 5.</p>`},
 {id:"b55",t:"Brain Teasers",l:"Advanced",q:"On average, how many rolls of a die does it take to see all six faces at least once?",a:`<p>Add the expected waits for each new face. The first roll is always new (1 roll). Then a new face has probability 5/6 (expected 6/5 rolls), then 4/6 (6/4), and so on down to 1/6 (6 rolls). Total = 6 × (1 + 1/2 + 1/3 + 1/4 + 1/5 + 1/6) = 6 × 2.45 ≈ <b>14.7 rolls</b>.</p>`},
 {id:"b56",t:"Brain Teasers",l:"Advanced",q:"On average, how many flips of a fair coin does it take to get two heads in a row?",a:`<p><b>6.</b> Use two states. Let E be the expected flips from scratch, and F the expected flips when you've just thrown one heads.</p><ul><li>From scratch: flip once; heads (½) moves you to F, tails (½) leaves you at E. So E = 1 + ½F + ½E.</li><li>After one heads: flip once; heads (½) finishes, tails (½) sends you back to E. So F = 1 + ½E.</li><li>Substitute: E = 1 + ½(1 + ½E) + ½E = 1.5 + 0.75E, so 0.25E = 1.5 and <b>E = 6</b>.</li></ul>`},
 {id:"b57",t:"Brain Teasers",l:"Intermediate",q:"You have a 7-minute hourglass and a 4-minute hourglass. How do you measure exactly 9 minutes?",a:`<ol><li>Start both.</li><li>At 4 minutes the 4-minute glass runs out; flip it.</li><li>At 7 minutes the 7-minute glass runs out; flip it. (The 4-minute glass has 1 minute left.)</li><li>At 8 minutes the 4-minute glass runs out. The 7-minute glass has had 1 minute of sand fall since it was flipped; flip it again.</li><li>That 1 minute of sand runs back. It finishes at <b>9 minutes</b>.</li></ol>`},
 {id:"b58",t:"Brain Teasers",l:"Basic",q:"How do you cut a round cake into 8 equal pieces with only 3 straight cuts?",a:`<p>Make two vertical cuts through the center at right angles, giving 4 wedges. Then make one horizontal cut through the middle of the cake's height, splitting each wedge into top and bottom: <b>8 pieces</b>. The trick is thinking in three dimensions.</p>`},
 {id:"b59",t:"Brain Teasers",l:"Intermediate",q:"How many times does the digit 1 appear when you write the numbers from 1 to 100?",a:`<p>Count by place. Units digit: 1, 11, 21, ..., 91 gives 10. Tens digit: 10 through 19 gives 10. Plus the 1 in 100. Total = <b>21</b>. (11 is counted twice, which is correct since it has two 1s.)</p>`},
 {id:"b60",t:"Brain Teasers",l:"Intermediate",q:"A man looks at a photo and says: \"Brothers and sisters I have none, but that man's father is my father's son.\" Who is in the photo?",a:`<p>"My father's son," for a man with no brothers, is <b>himself</b>. So "that man's father is me," which means the photo shows <b>his son</b>. Work it out loud from the inside of the sentence outward.</p>`},
 {id:"b61",t:"Brain Teasers",l:"Intermediate",q:"What's the next number: 2, 6, 12, 20, 30, ...?",a:`<p>The gaps are 4, 6, 8, 10, so the next gap is 12 and the answer is <b>42</b>. Another way: each term is n × (n + 1): 1×2, 2×3, 3×4, 4×5, 5×6, then 6×7 = 42.</p>`},
 {id:"b62",t:"Brain Teasers",l:"Intermediate",q:"Two doors: one leads out, one doesn't. One guard always tells the truth, the other always lies, and you don't know which is which. You can ask one guard one question. What do you ask?",a:`<p>Ask either guard: <b>"If I asked the other guard which door leads out, what would he say?"</b> Then take the <b>other</b> door. If you asked the truth-teller, he truthfully reports the liar's wrong answer; if you asked the liar, he lies about the truth-teller's right answer. Either way you hear the wrong door.</p>`},
 {id:"b63",t:"Brain Teasers",l:"Intermediate",q:"Estimate how many weddings take place in the US each year.",a:`<p>One approach: about 330M people and a life expectancy near 78, so roughly 4.2M people per age group. If about 80% marry at some point, that's around 3.4M people, or 1.7M first weddings a year. Add remarriages, maybe 15–20% more, for <b>about 2 million</b>. That matches the real figure of roughly 2 million.</p>`},
 {id:"b64",t:"Brain Teasers",l:"Intermediate",q:"Estimate how many pizzas Americans eat in a year.",a:`<p>About 330M people. Suppose the average person eats pizza once every two weeks (26 times a year), about 3 slices each time, or 3/8 of a pizza. 330M × 26 × 0.375 ≈ <b>3.2 billion pizzas</b>. The commonly cited figure is around 3 billion, so that's in the right range. Adjust for kids vs. adults if asked.</p>`},
 {id:"b65",t:"Brain Teasers",l:"Intermediate",q:"Estimate how many dentists there are in the US.",a:`<p>Start from demand. 330M people × about 2 visits a year = 660M visits. A dentist working with hygienists might see about 15 patients a day for 240 days, about 3,600 a year. 660M ÷ 3,600 ≈ <b>180,000–200,000</b> dentists. The real number is roughly 200,000. Note that many people skip visits, which you could adjust for.</p>`},
 {id:"f36",t:"Fit",l:"Basic",q:"What do you do for fun outside of school and work?",a:`<p>Give one or two real interests with a specific detail, which makes you memorable and gives the interviewer something to talk about (a sport you compete in, a cooking project, a team you follow closely). Avoid anything that sounds made up for the interview. Keep it brief and genuine; they're checking whether you'd be good company on a long night.</p>`},
 {id:"f37",t:"Fit",l:"Basic",q:"Tell me something about yourself that isn't on your resume.",a:`<p>Share a short story that shows character: how you grew up, a job that taught you work ethic, a challenge you overcame, an unusual skill. Tie it back lightly to a quality that helps in banking, like resilience, curiosity or reliability. Avoid repeating anything from the resume.</p>`},
 {id:"f38",t:"Fit",l:"Intermediate",q:"Why should we hire you over the other candidates?",a:`<p>Give a confident 30-second closing pitch with three points: 1) proof you can do the work (technical preparation, relevant experience); 2) a trait that sets you apart, backed by evidence (e.g. building a banking network from a school with no pipeline); 3) genuine fit with this firm and group. Don't criticize other candidates.</p>`},
 {id:"f39",t:"Fit",l:"Basic",q:"What accomplishment are you most proud of?",a:`<p>Pick something where your own effort clearly drove the result and the stakes felt real, ideally with a number attached. Explain the challenge, what you did, and why it matters to you. Personal accomplishments are fine (paying your way through school, a big athletic goal) as long as they show drive and discipline.</p>`},
 {id:"f40",t:"Fit",l:"Intermediate",q:"Tell me about a time you failed.",a:`<p>Choose a genuine failure to reach a goal, not a disguised success. Briefly explain what you were aiming for and why you fell short, owning your part. Spend most of the time on what you learned and what you did differently next time, with evidence it worked. Interviewers want self-awareness and resilience.</p>`},
 {id:"f41",t:"Fit",l:"Intermediate",q:"Tell me about a time you had to work without clear instructions.",a:`<p>Show how you handle ambiguity, which is constant for analysts. Describe the unclear task, how you made reasonable assumptions, found examples or asked targeted questions instead of guessing or waiting, and checked in early to confirm you were on track. End with the result.</p>`},
 {id:"f42",t:"Fit",l:"Basic",q:"Tell me about a time you worked with someone very different from you.",a:`<p>Describe a teammate with a different background, working style or view. Show that you adapted, looked for what they brought to the work, and found a way to collaborate effectively. End with what the team achieved and what you learned about working with different people.</p>`},
 {id:"f43",t:"Fit",l:"Intermediate",q:"Tell me about a time you disagreed with a manager or someone senior.",a:`<p>Show respect for hierarchy and good judgment. Explain the disagreement, how you raised it privately with evidence rather than opinion, and that you were open to their reasoning. Then either they agreed, or you committed fully to their decision. Never tell a story where you went around them or were proven right in a way that embarrassed them.</p>`},
 {id:"f44",t:"Fit",l:"Basic",q:"Tell me about a time you dealt with a difficult customer or client.",a:`<p>A great place to use a service or retail job, which many non-target candidates have. Show that you stayed calm, listened to understand the real problem, found a solution within your limits, and kept the relationship. It shows the client-service mindset banks want.</p>`},
 {id:"f45",t:"Fit",l:"Basic",q:"How did you first get interested in finance?",a:`<p>Tell a genuine, specific origin story: a family business, a class, investing your own money, a conversation with someone in the industry. Then show how the interest deepened through action (clubs, reading, internships, networking) and narrowed to investment banking. The progression matters more than the starting point.</p>`},
 {id:"f46",t:"Fit",l:"Intermediate",q:"What industry do you find most interesting right now, and why?",a:`<p>Pick one you can discuss with some depth, ideally linked to the group you're interviewing for. Cover: how the industry makes money, two current trends (e.g. consolidation, regulation, technology), recent deals, and why it interests you personally. Expect follow-up questions.</p>`},
 {id:"f47",t:"Fit",l:"Basic",q:"Explain what an investment bank does as if I were your grandparent.",a:`<p>Keep it simple and accurate: "Companies sometimes need to raise money or buy or sell other businesses. Investment banks help them do that. They figure out what a company is worth, find investors or buyers, and handle the negotiations and paperwork." This tests whether you can communicate clearly, which matters with clients.</p>`},
 {id:"f48",t:"Fit",l:"Basic",q:"What have you done to prepare for this role?",a:`<p>Be concrete: the technical preparation you've done (accounting, valuation, building a model from scratch), relevant coursework or clubs, the people you've spoken with at the firm and across the industry, and how you follow markets and deals. It shows commitment and that you'll ramp up quickly.</p>`},
 {id:"f49",t:"Fit",l:"Basic",q:"What's a book or podcast you've enjoyed recently?",a:`<p>Name something you actually read or listened to, and be ready to discuss it. It doesn't have to be about finance, but one that connects (business, investing, history, biography) is helpful. Give a one-line summary and one thing you took away from it. Never name a book you haven't read.</p>`},
 {id:"f50",t:"Fit",l:"Intermediate",q:"What concerns you most about this job?",a:`<p>Be honest but show you've thought it through. For example, the learning curve in the first few months, and how you're preparing for it. Avoid saying the hours or the pressure scare you; show you understand them and have a plan.</p>`},
 {id:"f51",t:"Fit",l:"Intermediate",q:"Two senior bankers both give you urgent work due at the same time. What do you do?",a:`<p>Don't just pick one or quietly try to do both badly. Tell both bankers about the conflict right away, give a realistic estimate for each task, and let them (or the staffer, or your associate) decide priorities. Then deliver on what you committed to. Transparency is the key point.</p>`},
 {id:"f52",t:"Fit",l:"Basic",q:"How do you handle detailed, repetitive work like checking numbers or formatting slides?",a:`<p>Show that you take it seriously and have a system: checklists, reviewing your own work with fresh eyes, tying numbers back to sources, and learning the firm's formatting standards. Mention an example where your attention to detail caught an error. A lot of analyst work is like this, and accuracy builds trust.</p>`},
 {id:"f53",t:"Fit",l:"Basic",q:"What did you learn from your most recent internship or job?",a:`<p>Give two or three specific lessons, each with a moment that taught it: a technical skill, a lesson about communicating with managers, or a realization about what work you enjoy. Stay positive about the employer. Connect the lessons to why you'll be a better analyst.</p>`},
 {id:"f54",t:"Fit",l:"Advanced",q:"What will you do if you don't get an investment banking offer this cycle?",a:`<p>Show commitment and resilience without sounding desperate. Something like: you'd look for the role that builds the closest skills (a corporate development, valuation or Big Four transaction services role, or a smaller bank), keep networking, and recruit again. Make clear banking is the goal you're pursuing.</p>`},
 {id:"f55",t:"Fit",l:"Intermediate",q:"Tell me about a time you had to deliver bad news.",a:`<p>Show that you delivered it promptly, directly and with a plan. Describe the situation, how you told the person (in person or on a call rather than hiding behind email), how you explained the impact, and what you proposed to fix it. Analysts sometimes have to tell associates about mistakes or delays, so this shows maturity.</p>`},
 {id:"f56",t:"Fit",l:"Advanced",q:"Walk me through a financial model you've built.",a:`<p>Be ready if your resume mentions modeling. Cover: the purpose and company, the structure (inputs, projections, the three statements or DCF, outputs), your key assumptions and why, what the model concluded, and what you'd improve. Know the numbers. Expect the interviewer to probe any assumption.</p>`},
 {id:"f57",t:"Fit",l:"Intermediate",q:"I see you changed majors (or have a gap on your resume). Can you explain that?",a:`<p>Answer briefly and without defensiveness. Give the honest reason in one or two sentences, then focus on what you learned or did during that time and how it led to where you are now. Frame it as a deliberate step in your story, not something to hide.</p>`},
];
const CORE = new Set('a1 a2 a3 a4 a5 a6 a7 a8 a9 a10 a11 a12 a13 a15 a17 a20 a21 a23 a24 a29 a30 a32 a33 a35 a38 a40 a43 a44 e1 e2 e3 e4 e5 e6 e7 e8 e11 e12 e13 e15 e16 e17 e20 e24 e34 v1 v2 v3 v4 v5 v6 v7 v8 v9 v10 v14 v17 v18 v19 v20 v41 d1 d2 d3 d4 d5 d6 d7 d8 d9 d10 d12 d13 d14 d17 d18 d19 d21 d22 d24 d27 d29 d30 d32 l1 l2 l3 l4 l5 l6 l7 l8 l9 l13 l14 l15 l17 l19 l21 l23 l24 l25 l34 l36 l43 m1 m2 m3 m4 m5 m6 m7 m8 m10 m12 m13 m15 m19 m21 m25 m29 m30 b1 b3 b5 b6 b10 b14 b15 b16 b17 b18 b24 b28 b48 b51 f1 f2 f3 f4 f5 f6 f7 f8 f9 f13 f14 f15 f16 f21 f23 f25 f32 f34 f38 f51'.split(" "));
const TOPICS = ["Accounting","Enterprise Value","Valuation","DCF","LBO","M&A","Brain Teasers","Fit"];
const STAGES = ["Identified","Emailed","Replied","Call set","Called","Thanked","Referred"];
const DAY = 864e5;

/* ---------- State and persistence ---------- */
const LS = "superday-prep-v1";
let S = {cards:{}, reviewLog:{}, contacts:[], settings:{}, mockHist:[], simHist:[], firms:{}};
function lsRead(){try{const r=localStorage.getItem(LS);if(r)Object.assign(S,JSON.parse(r));}catch(e){}}
function lsWrite(){try{localStorage.setItem(LS,JSON.stringify(S));}catch(e){}}
lsRead();
let dbRefs=null, saveTimer=null, saving=false, pending=false;
const saveEl=document.getElementById("saveState");
function save(){
  lsWrite();
  try{pushStats();}catch(e){}
  if(!dbRefs) return;
  clearTimeout(saveTimer); saveTimer=setTimeout(flush,700);
}
async function flush(){
  if(!dbRefs) return;
  if(saving){pending=true;return;}
  saving=true; saveEl.textContent="Saving...";
  try{
    await dbRefs.prep.set({cards:S.cards, reviewLog:S.reviewLog, newLog:S.newLog||{}, mockHist:S.mockHist.slice(0,40), simHist:(S.simHist||[]).slice(0,20), readyLog:S.readyLog||{}, peerHist:(S.peerHist||[]).slice(0,20), updated:Date.now()});
    await dbRefs.net.set({contacts:S.contacts, settings:S.settings, firms:S.firms||{}, tlChecks:S.tlChecks||{}, story:S.story||{}, updated:Date.now()});
    saveEl.textContent="Saved to your account";
  }catch(e){saveEl.textContent="Saved in this browser (account save failed)";}
  saving=false; if(pending){pending=false;flush();}
}
(async()=>{
  if(!window.claude?.use) return;
  try{
    const [db,user]=await Promise.all([claude.use("db"),claude.use("user")]);
    if(!db||!user) return;
    const id=await user.id(); if(!id) return;
    const col=db.collection("data/users/"+id);
    const refs={prep:col.doc("prep"),net:col.doc("network")};
    const timeout=new Promise((_,r)=>setTimeout(()=>r(new Error("timeout")),10000));
    const [p,n]=await Promise.race([Promise.all([refs.prep.get(),refs.net.get()]),timeout]);
    const pd=p.data(), nd=n.data();
    if(pd){S.cards=pd.cards||{};S.reviewLog=pd.reviewLog||{};S.newLog=pd.newLog||{};S.mockHist=pd.mockHist||[];S.simHist=pd.simHist||[];S.readyLog=pd.readyLog||{};S.peerHist=pd.peerHist||[];}
    if(nd){S.contacts=nd.contacts||[];S.settings=nd.settings||{};S.firms=nd.firms||{};S.tlChecks=nd.tlChecks||{};S.story=nd.story||{};}
    dbRefs=refs;
    if(!pd||!nd) flush(); else saveEl.textContent="Saved to your account";
    lsWrite(); renderAll();
  }catch(e){}
})();

/* ---------- Helpers ---------- */
const $=s=>document.querySelector(s);
const esc=s=>String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const today=()=>{const d=new Date();d.setHours(0,0,0,0);return d;};
const iso=d=>{const x=new Date(d);return x.getFullYear()+"-"+String(x.getMonth()+1).padStart(2,"0")+"-"+String(x.getDate()).padStart(2,"0");};
const parseIso=s=>{if(!s)return null;const [y,m,d]=s.split("-").map(Number);return new Date(y,m-1,d);};
const addDays=(n)=>iso(new Date(today().getTime()+n*DAY));
const fmtInt=d=>d<1?"<10m":d<30?Math.round(d)+"d":d<365?Math.round(d/30)+"mo":(d/365).toFixed(1)+"y";
function toast(msg){const t=$("#toast");t.textContent=msg;t.hidden=false;clearTimeout(toast._t);toast._t=setTimeout(()=>t.hidden=true,2200);}
async function copy(text){try{await navigator.clipboard.writeText(text);toast("Copied");}catch(e){const r=document.createRange();r.selectNodeContents($("#emOut"));const s=getSelection();s.removeAllRanges();s.addRange(r);toast("Selected. Press Ctrl/Cmd+C to copy");}}

/* ---------- Routing ---------- */
const VIEWS=["drill","superday","story","mock","network","firms","timeline","club"];
function route(){
  const v=VIEWS.includes(location.hash.slice(1))?location.hash.slice(1):"drill";
  document.querySelectorAll("[data-panel]").forEach(p=>p.hidden=p.dataset.panel!==v);
  document.querySelectorAll("nav.tabs a").forEach(a=>{if(a.dataset.view===v)a.setAttribute("aria-current","page");else a.removeAttribute("aria-current");});
}
addEventListener("hashchange",()=>{route();if(location.hash==="#timeline")renderTimeline();});

/* ---------- Spaced repetition ---------- */
let drillFilter=new Set(TOPICS), current=null, revealed=false;
const cs=id=>S.cards[id]||{reps:0,ease:2.5,ivl:0,due:0};
function schedule(c,g){ // g: 0 again,1 hard,2 good,3 easy; returns new state
  let {reps,ease,ivl}=c; const n={...c}; n.last=g;
  if(g===0){n.reps=0;n.ease=Math.max(1.3,ease-.2);n.ivl=0;n.due=Date.now()+10*6e4;n.lapses=(c.lapses||0)+1;return n;}
  if(g===1){n.ivl=reps===0?1:Math.max(1,ivl*1.2);n.ease=Math.max(1.3,ease-.15);}
  if(g===2){n.ivl=reps===0?1:reps===1?3:ivl*ease;}
  if(g===3){n.ivl=reps===0?3:reps===1?5:ivl*ease*1.3;n.ease=ease+.15;}
  n.reps=reps+1; n.due=today().getTime()+Math.round(n.ivl)*DAY; return n;
}
let extraNew=0;
const isPro=()=>!!(window.__ME&&window.__ME.pro);
const isFull=()=>S.settings.studySet==="full"&&isPro();
const inSet=b=>isFull()||CORE.has(b.id);
const setBank=()=>BANK.filter(inSet);
const setLabel=()=>isFull()?"":"core ";
function plan(){
  const d=S.settings.superday; if(!d) return null;
  const date=parseIso(d), days=Math.round((date-today())/DAY);
  if(days<0) return {days,past:true,date};
  const unseen=setBank().filter(b=>!S.cards[b.id]).length;
  const introduced=(S.newLog||{})[iso(new Date())]||0;
  const learnDays=Math.max(1,days-2); // keep the last two days for review only
  const perDay=Math.ceil((unseen+introduced)/learnDays);
  const finish=new Date(today().getTime()+(Math.ceil(unseen/Math.max(perDay,1))-(introduced<perDay?1:0))*DAY);
  return {days,date,unseen,introduced,perDay,left:Math.max(0,perDay-introduced),finish};
}
function capped(n){ // never schedule a review after the interview
  const p=plan(); if(!p||p.past||p.days<1) return n;
  const cutoff=p.date.getTime()-DAY;
  if(n.due>cutoff&&cutoff>=today().getTime()) n.due=cutoff;
  return n;
}
function queue(){
  if(focusIds&&focusIds.length)return {due:[],fresh:[],allFresh:[],p:plan(),focus:true,list:focusIds.map(byId).filter(Boolean)};
  const now=Date.now(), pool=BANK.filter(b=>drillFilter.has(b.t));
  const due=pool.filter(b=>S.cards[b.id]&&S.cards[b.id].due<=now).sort((a,b)=>S.cards[a.id].due-S.cards[b.id].due);
  const allFresh=pool.filter(b=>inSet(b)&&!S.cards[b.id]); // reviews of anything already learned still show up
  const p=plan(), cap=p&&!p.past?p.left+extraNew:Infinity;
  const fresh=allFresh.slice(0,cap);
  return {due,fresh,allFresh,p,list:[...due,...fresh]};
}
const fmtDay=d=>d.toLocaleDateString(undefined,{weekday:"short",month:"short",day:"numeric"});
function renderCountdown(q){
  const N=setBank().length, L=setLabel();
  const p=q.p, box=$("#countdown"), hdr=$("#hdrCount");
  const input=`<div class="cd-date"><label for="sdDate">Superday date</label><input type="date" id="sdDate" value="${esc(S.settings.superday||"")}" min="${iso(new Date())}"></div>`;
  if(!p){hdr.textContent="";box.innerHTML=`<div class="countdown"><div class="cd-body"><h2>When is your superday?</h2><p>Set the date and you'll get a daily goal that gets you through all ${N} ${L}questions in time, with the last two days kept for review.</p></div>${input}</div>`;return;}
  if(p.past){hdr.textContent="";box.innerHTML=`<div class="countdown urgent"><div class="cd-body"><h2>Your superday date has passed</h2><p>Set the date of your next interview to get a new daily plan.</p></div>${input}</div>`;return;}
  const seen=N-p.unseen, pct=Math.round(seen/N*100);
  hdr.textContent=p.days===0?"Superday is today":p.days===1?"1 day to superday":p.days+" days to superday";
  let msg;
  if(p.days===0) msg=`Interview day. Skim the reviews below, keep your answers short and structured, and good luck.`;
  else if(p.unseen===0) msg=isFull()?`You've seen all ${N} questions. From here it's reviews only, and every review lands before ${fmtDay(new Date(p.date.getTime()-DAY))}.`:`You've seen all ${N} core questions. Keep up with reviews, or switch to the full set below to keep learning new ones.`;
  else if(p.days<=2) msg=`Final stretch. Today: <b>${p.left} new</b> and <b>${q.due.length} due for review</b>. Focus on the reviews you keep missing.`;
  else if(p.left===0) msg=`<b>Today's goal is done:</b> ${p.introduced} new question${p.introduced===1?"":"s"} learned${q.due.length?` and <b>${q.due.length} review${q.due.length===1?"":"s"}</b> still due`:""}. You're on track to see all ${N} ${L}questions by ${fmtDay(p.finish)}.`;
  else msg=`Today's goal: <b>${p.left} new question${p.left===1?"":"s"}</b> and <b>${q.due.length} due for review</b>. At this pace you'll have seen all ${N} ${L}questions by ${fmtDay(p.finish)}, leaving the last two days for review.`;
  box.innerHTML=`<div class="countdown ${p.days<=7?"urgent":""}"><div class="cd-body"><div class="cd-main"><span class="cd-num">${p.days}</span><h2>${p.days===1?"day":"days"} until superday · ${fmtDay(p.date)}</h2></div><p>${msg}</p><div class="bar" role="img" aria-label="${seen} of ${N} ${L}questions seen"><i style="width:${pct}%"></i></div><p style="margin-top:4px;font-size:.78rem">${seen} of ${N} ${L}questions seen (${pct}%)</p></div>${input}</div>`;
}
$("#countdown").addEventListener("change",e=>{if(e.target.id!=="sdDate")return;S.settings.superday=e.target.value||"";extraNew=0;
  // pull any reviews scheduled past the new date back before it
  const p=plan(); if(p&&!p.past) Object.keys(S.cards).forEach(id=>S.cards[id]=capped(S.cards[id]));
  save();renderDrill();toast(e.target.value?"Superday date saved":"Superday date cleared");});
function grade(id,g,src){
  const k=iso(new Date());
  if(!S.cards[id]){S.newLog=S.newLog||{};S.newLog[k]=(S.newLog[k]||0)+1;if(extraNew>0)extraNew--;}
  S.cards[id]=capped(schedule(cs(id),g));
  S.reviewLog[k]=(S.reviewLog[k]||0)+1;
  if(focusIds){focusIds=focusIds.filter(x=>x!==id);if(!focusIds.length){focusIds=null;toast("Focus session done");}}
  save(); if(src!=="mock"){current=null;revealed=false;} renderDrill();
}
function streak(){let n=0,d=today();if(!S.reviewLog[iso(d)])d=new Date(d.getTime()-DAY);while(S.reviewLog[iso(d)]){n++;d=new Date(d.getTime()-DAY);}return n;}
/* ---------- Readiness score ---------- */
// How much each topic counts toward overall readiness, roughly by how often it comes up at a superday.
const TOPIC_W={"Accounting":.18,"Enterprise Value":.12,"Valuation":.14,"DCF":.16,"LBO":.12,"M&A":.10,"Brain Teasers":.06,"Fit":.12};
let focusIds=null, showBreakdown=false;
try{showBreakdown=localStorage.getItem("superday-rb")==="1";}catch(e){}
function strength(c){ // 0..1: how well a card is known
  if(!c)return 0;
  if(c.reps===0)return .15;
  let s=Math.min(1,.35+.65*Math.min(c.ivl||0,21)/21);
  if((Date.now()-c.due)/DAY>Math.max(2,c.ivl||0))s*=.8; // badly overdue
  return s;
}
function perfScores(t){
  const sims=(S.simHist||[]).filter(h=>h.topics&&h.topics[t]!=null).slice(0,3).flatMap(h=>[h.topics[t],h.topics[t]]); // simulations count double
  const mocks=(S.mockHist||[]).filter(h=>h.t===t).slice(0,6).map(h=>h.score);
  return [...sims,...mocks];
}
function readiness(){
  const SB=setBank();
  const topics=TOPICS.map(t=>{
    const qs=SB.filter(b=>b.t===t);
    const K=qs.length?qs.reduce((a,b)=>a+strength(S.cards[b.id]),0)/qs.length:0;
    const ps=perfScores(t), P=ps.length?ps.reduce((a,b)=>a+b,0)/ps.length/10:null;
    return {t,K,P,R:P==null?K*.85:.6*K+.4*P,n:qs.length,seen:qs.filter(b=>S.cards[b.id]).length};
  });
  const score=Math.round(100*topics.reduce((a,x)=>a+x.R*TOPIC_W[x.t],0));
  const label=score>=80?"Superday ready":score>=65?"First-round ready":score>=40?"Getting there":"Early days";
  const slipping=Object.entries(S.cards).filter(([,c])=>(c.lapses||0)>0||c.last===0).map(([id,c])=>({b:byId(id),c})).filter(x=>x.b)
    .sort((a,b)=>(b.c.lapses||0)-(a.c.lapses||0)||a.c.ease-b.c.ease).slice(0,5);
  return {score,label,topics,slipping};
}
function logReady(score){
  const k=iso(new Date()); S.readyLog=S.readyLog||{};
  if(S.readyLog[k]===score)return;
  S.readyLog[k]=score;
  const keys=Object.keys(S.readyLog).sort(); keys.slice(0,Math.max(0,keys.length-60)).forEach(x=>delete S.readyLog[x]);
  save();
}
function nextAction(r){
  const dueAll=Object.values(S.cards).filter(c=>c.due<=Date.now()).length;
  const lastSim=(S.simHist||[])[0];
  const seenPct=r.topics.reduce((a,x)=>a+x.seen,0)/Math.max(1,r.topics.reduce((a,x)=>a+x.n,0));
  const weak=[...r.topics].sort((a,b)=>a.R-b.R)[0];
  if(!Object.keys(S.cards).length)return {text:"Start with today's drill questions below. Every card you learn raises your score."};
  if(dueAll>=15)return {text:`Clear your ${dueAll} due reviews. They're the fastest points you can win back.`};
  if(seenPct>=.3&&(!lastSim||Date.now()-lastSim.at>7*DAY))return {text:"Run a superday simulation. Interview practice makes up 40% of each topic's score, and you haven't done one this week.",btn:"Start a simulation",act:"sim"};
  if(weak.R<.6)return {text:`Focus on ${weak.t}. It's your weakest area at ${Math.round(weak.R*100)}%.`,btn:`Drill ${weak.t}`,act:"topic:"+weak.t};
  return {text:"You're in good shape. Keep up with today's goal and run a simulation every few days."};
}
function sparkline(){
  const e=Object.entries(S.readyLog||{}).sort(([a],[b])=>a.localeCompare(b)).slice(-14);
  if(e.length<2)return `<span class="hint">Your trend appears after your second day of practice.</span>`;
  const vals=e.map(x=>x[1]), n=vals.length, w=132, h=36;
  const lo=Math.max(0,Math.min(...vals)-5), hi=Math.min(100,Math.max(...vals)+5), span=Math.max(1,hi-lo);
  const pts=vals.map((v,i)=>[4+i*(w-8)/(n-1),h-4-(v-lo)/span*(h-8)].map(x=>x.toFixed(1)));
  const weekAgo=iso(new Date(today().getTime()-7*DAY));
  const refs=e.filter(([d])=>d<=weekAgo), ref=refs.length?refs[refs.length-1]:e[0];
  const d=vals[n-1]-ref[1];
  const when=refs.length?"this week":"since "+fmtDay(parseIso(ref[0]));
  return `<svg width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" aria-hidden="true"><polyline points="${pts.map(p=>p.join(",")).join(" ")}" fill="none" style="stroke:var(--accent)" stroke-width="2" stroke-linejoin="round" stroke-linecap="round"/><circle cx="${pts[n-1][0]}" cy="${pts[n-1][1]}" r="3" style="fill:var(--accent)"/></svg>
    <span class="hint"><b style="color:${d>=0?"var(--accent)":"var(--red)"}">${d>=0?"+":""}${d} pts</b> ${when}</span>`;
}
function renderReadiness(){
  const r=readiness(); logReady(r.score);
  const col=r.score>=80?"var(--blue)":r.score>=65?"var(--accent)":r.score>=40?"var(--amber)":"var(--red)";
  const a=nextAction(r);
  $("#hdrReady").textContent=`Readiness ${r.score}%`;
  const rows=[...r.topics].sort((x,y)=>x.R-y.R).map(x=>{const p=Math.round(x.R*100),c=p>=70?"var(--accent)":p>=50?"var(--amber)":"var(--red)";
    return `<div class="trow"><span>${esc(x.t)}</span><div class="bar"><i style="width:${p}%;background:${c}"></i></div><b>${p}%</b><small>Knowledge ${Math.round(x.K*100)}% · ${x.P==null?"no interview practice yet":"interviews "+(x.P*10).toFixed(1)+"/10"} · ${x.seen}/${x.n} seen</small></div>`;}).join("");
  const slip=r.slipping.length?`<ul class="slip">${r.slipping.map(s=>`<li><span class="eyebrow">${esc(s.b.t)}${s.c.lapses?` · missed ${s.c.lapses}×`:""}</span>${esc(s.b.q)}</li>`).join("")}</ul><button class="btn" data-ract="focus">Drill these ${r.slipping.length} now</button>`
    :`<p class="hint" style="margin:0">Nothing yet. Questions you mark "Again" or score low on in interviews show up here.</p>`;
  $("#readiness").innerHTML=`<div class="ready">
    <div class="ring" style="--p:${r.score};--rc:${col}" role="img" aria-label="Readiness ${r.score} percent"><span>${r.score}<small>%</small></span></div>
    <div class="ready-mid"><span class="eyebrow">Superday readiness${isFull()?"":" · core set"}</span><h2>${r.label}</h2><p>${a.text}</p>${a.btn?`<button class="btn primary" data-ract="${esc(a.act)}">${esc(a.btn)}</button>`:""}</div>
    <div class="ready-trend">${sparkline()}<button class="linkbtn" data-ract="toggle" aria-expanded="${showBreakdown}">${showBreakdown?"Hide breakdown":"See breakdown"}</button></div>
  </div>
  ${showBreakdown?`<div class="rb card"><div><h3>By topic</h3><p class="hint" style="margin:2px 0 12px">Weakest first. Each topic blends what you know from the drill (60%) with how you score in mock interviews and simulations (40%).</p><div class="trows">${rows}</div></div><div><h3>Keeps slipping</h3><p class="hint" style="margin:2px 0 12px">Questions you've missed in the drill or scored low on.</p>${slip}</div></div>`:""}`;
}
$("#readiness").addEventListener("click",e=>{const b=e.target.closest("[data-ract]");if(!b)return;const a=b.dataset.ract;
  if(a==="toggle"){showBreakdown=!showBreakdown;try{localStorage.setItem("superday-rb",showBreakdown?"1":"0");}catch(err){}renderDrill();return;}
  if(a==="sim"){location.hash="#superday";return;}
  if(a.startsWith("topic:"))drillFilter=new Set([a.slice(6)]),focusIds=null;
  if(a==="focus")focusIds=readiness().slipping.map(s=>s.b.id);
  current=null;revealed=false;renderDrill();$("#drillCard").scrollIntoView({behavior:"smooth",block:"start"});
});

function renderDrill(){
  const q=queue(); renderCountdown(q); renderReadiness(); const SB=setBank(), learned=SB.filter(b=>S.cards[b.id]&&S.cards[b.id].reps>=2).length;
  $("#drillStats").innerHTML=`<div><b>${q.due.length}</b><span>Due for review</span></div><div><b>${q.fresh.length}</b><span>${q.p&&!q.p.past?"New left today · "+q.allFresh.length+" unseen":"New questions"}</span></div><div><b>${S.reviewLog[iso(new Date())]||0}</b><span>Reviewed today · ${streak()}-day streak</span></div><div><b>${learned}/${SB.length}</b><span>${isFull()?"Questions":"Core questions"} learned</span></div>`;
  $("#setBar").innerHTML=`<span class="eyebrow">Study set</span><div class="seg" role="group" aria-label="Study set"><button data-set="core" aria-pressed="${!isFull()}">Core<small>${CORE.size}</small></button><button data-set="full" aria-pressed="${isFull()}">Full<small>${BANK.length}</small>${isPro()?"":'<span class="pro">PRO</span>'}</button></div><span class="hint">${isFull()?"Every question in the bank.":"The most-asked questions in each topic. Switch to Full once you've covered them."}</span>`;
  $("#drillChips").innerHTML=TOPICS.map(t=>`<button class="chip" data-topic="${t}" aria-pressed="${drillFilter.has(t)}">${t}<small>${SB.filter(b=>b.t===t).length}</small></button>`).join("");
  if(!current||!q.list.find(x=>x.id===current.id)){current=q.list[0]||null;revealed=false;}
  const box=$("#drillCard");
  if(!current&&q.allFresh.length){
    box.innerHTML=`<div class="card empty"><h2>Today's goal is done</h2><p>You've covered today's new questions and every review that's due. Tomorrow's set is ready when you are. If you have time now, you can get ahead.</p><div class="row"><button class="btn primary" id="moreNew">Do 5 more new questions</button><a class="btn" href="#mock" style="text-decoration:none">Practice a mock interview</a></div></div>`;
    $("#moreNew").onclick=()=>{extraNew+=5;renderDrill();};
    return;
  }
  if(!current){
    const next=Object.entries(S.cards).filter(([id])=>drillFilter.has(BANK.find(b=>b.id===id)?.t)).map(([,c])=>c.due).sort((a,b)=>a-b)[0];
    box.innerHTML=`<div class="card empty"><h2>You're caught up</h2><p>Nothing is due in the topics you picked.${next?` Next review is ${new Date(next).toLocaleDateString(undefined,{weekday:"long",month:"short",day:"numeric"})}.`:""} Run a mock interview to practice saying answers out loud, or add more topics above.</p><div class="row"><a class="btn primary" href="#mock" style="text-decoration:none">Start a mock interview</a></div></div>`;
    return;
  }
  const c=cs(current.id), isNew=!S.cards[current.id];
  const labels=[["Again","g-again"],["Hard","g-hard"],["Good","g-good"],["Easy","g-easy"]];
  box.innerHTML=`<div class="card">
    <div class="qmeta">${q.focus?`<span class="eyebrow" style="color:var(--amber)">Focus session · ${q.list.length} left</span><button class="linkbtn" id="exitFocus">Exit</button>`:""}<span class="eyebrow">${esc(current.t)}</span><span class="eyebrow">${esc(current.l)}</span><span class="eyebrow">${isNew?"New":"Review "+(c.reps+1)}</span></div>
    <p class="q">${esc(current.q)}</p>
    ${revealed?`<div class="ans">${current.a}</div>
      <p class="hint" style="margin:14px 0 0">How close was your answer?</p>
      <div class="grades">${labels.map(([n,cl],i)=>{const s=capped(schedule(c,i));return `<button class="btn ${cl}" data-g="${i}"><span>${n} <kbd>${i+1}</kbd></span><small>${i===0?"<10m":fmtInt(Math.max(0,Math.round((s.due-today().getTime())/DAY))||1)}</small></button>`}).join("")}</div>`
    :`<div class="row"><button class="btn primary" id="reveal">Show answer</button><span class="hint">Say your answer out loud first. <kbd>Space</kbd></span></div>`}
  </div>`;
}
$("#setBar").addEventListener("click",e=>{const b=e.target.closest("[data-set]");if(!b)return;const v=b.dataset.set;
  if(v==="full"&&!isPro()){window.openPaywall&&window.openPaywall("full");return;}if((v==="full")===isFull())return;
  S.settings.studySet=v;extraNew=0;current=null;save();renderDrill();toast(v==="full"?"Switched to the full set":"Switched to the core set");});
$("#drillChips").addEventListener("click",e=>{const b=e.target.closest("[data-topic]");if(!b)return;const t=b.dataset.topic;
  if(drillFilter.has(t)&&drillFilter.size>1)drillFilter.delete(t);else drillFilter.add(t);current=null;renderDrill();});
$("#drillCard").addEventListener("click",e=>{if(e.target.closest("#exitFocus")){focusIds=null;current=null;revealed=false;renderDrill();return;}if(e.target.closest("#reveal")){revealed=true;renderDrill();}const g=e.target.closest("[data-g]");if(g)grade(current.id,+g.dataset.g);});
addEventListener("keydown",e=>{
  if($("#v-drill").hidden||e.target.matches("input,textarea,select")||!current)return;
  if(e.code==="Space"&&!revealed){e.preventDefault();revealed=true;renderDrill();}
  else if(revealed&&["1","2","3","4"].includes(e.key))grade(current.id,+e.key-1);
});

/* ---------- Mock interview ---------- */
let mockQ=null, sampleFn=null, mockBusy=false;
let sampleReadyResolve; const sampleReady=new Promise(r=>sampleReadyResolve=r);
(async()=>{if(window.claude?.use){try{sampleFn=await claude.use("sample");}catch(e){}}if(!sampleFn){$("#mockHint").textContent="AI grading isn't available in this view. You can still compare your answer to the model answer.";$("#mockGrade").textContent="Show model answer";}sampleReadyResolve();})();
$("#mockTopic").innerHTML=`<option value="">All topics</option>`+TOPICS.map(t=>`<option>${t}</option>`).join("");
function pickMock(){
  const t=$("#mockTopic").value; const pool=setBank().filter(b=>!t||b.t===t);
  let q; do{q=pool[Math.floor(Math.random()*pool.length)];}while(pool.length>1&&mockQ&&q.id===mockQ.id);
  setMock(q);
}
function setMock(q){mockQ=q;$("#mockMeta").textContent=q.followUp?"Follow-up question":`${q.t} · ${q.l}`;$("#mockQ").textContent=q.q;$("#mockAnswer").value="";$("#mockResult").innerHTML="";}
$("#mockNext").onclick=pickMock; $("#mockTopic").onchange=pickMock;
function renderHist(){
  const h=S.mockHist; $("#mockCount").textContent=h.length;
  $("#mockAvg").textContent=h.length?(h.reduce((a,b)=>a+b.score,0)/h.length).toFixed(1)+"/10":"–";
  $("#mockHist").innerHTML=h.length?h.slice(0,12).map(x=>`<li><b>${x.score}</b><span>${esc(x.q)}</span></li>`).join(""):`<li><b>–</b><span class="hint">Graded answers show up here.</span></li>`;
}
$("#mockGrade").onclick=async()=>{
  if(mockBusy)return;
  const ans=$("#mockAnswer").value.trim(); const out=$("#mockResult");
  if(!sampleFn){out.innerHTML=`<div class="card"><h3>Model answer</h3><div class="ans" style="border:0;padding-top:8px">${mockQ.a||"No reference answer for this follow-up."}</div></div>`;return;}
  if(ans.length<15){toast("Write out your answer first");return;}
  mockBusy=true;$("#mockGrade").disabled=true;
  out.innerHTML=`<div class="card thinking"><span class="dot"></span>Your interviewer is reading your answer...</div>`;
  const key=mockQ.a?mockQ.a.replace(/<[^>]+>/g," ").replace(/\s+/g," ").trim():"None provided. Use your own expertise as an investment banker.";
  const prompt=`You are a senior investment banking associate running a ${mockQ.t==="Fit"?"fit (behavioral) interview":mockQ.t==="Brain Teasers"?"brain teaser and mental math round":"technical interview"} with an undergraduate candidate for a summer analyst role. Grade the candidate's answer the way a real interviewer would.

Question: ${mockQ.q}
${mockQ.context?"Context from the earlier question: "+mockQ.context+"\n":""}Reference answer (points the interviewer expects): ${key}
${mockQ.notes?(mockQ.notesLabel||"The candidate's own notes from networking with people at this firm (use them to judge whether the answer is specific and genuine)")+": "+mockQ.notes+"\n":""}
Candidate's answer:
"""${ans}"""

Grading rules: be strict but fair. ${mockQ.t==="Brain Teasers"?"Judge both the final answer and the reasoning shown. A correct answer with no reasoning should score no higher than 6. For estimates, reward a clear structure and reasonable stated assumptions; do not require an exact number. Penalize arithmetic mistakes.":mockQ.t==="Fit"?"Judge it as a real fit answer: specific, structured, believable, and tied to why banking. Penalize generic or rambling answers. The reference describes a good structure, not exact words.":"Penalize wrong numbers, wrong signs or directions (for example cash going the wrong way), and missing key steps."} Reward clear structure: headline first, then steps. Do not penalize a short answer that is correct and complete. Ignore spelling.

Reply with JSON only, in this shape:
{"score": integer 0-10, "verdict": "Strong" | "Pass" | "Borderline" | "Fail", "strengths": [up to 3 short strings], "gaps": [up to 3 short strings, each naming what was wrong or missing], "model_answer": "a 60-120 word answer the candidate could say out loud", "follow_up": "one follow-up question this interviewer would ask next"}`;
  try{
    const r=await sampleFn.json(prompt,{modelTier:"default"});
    const score=Math.max(0,Math.min(10,Math.round(+r.score||0)));
    const verdict=["Strong","Pass","Borderline","Fail"].includes(r.verdict)?r.verdict:(score>=8?"Pass":score>=5?"Borderline":"Fail");
    const li=a=>(Array.isArray(a)&&a.length?a:["–"]).map(x=>`<li>${esc(x)}</li>`).join("");
    out.innerHTML=`<div class="card stack">
      <div class="score"><b>${score}<small>/10</small></b><span class="verdict v-${verdict}">${verdict}</span>${mockQ.id?`<span class="hint">Logged to your drill deck as "${score>=8?"Good":score>=5?"Hard":"Again"}"</span>`:""}</div>
      <div class="grid2 fb"><div><h3>What landed</h3><ul>${li(r.strengths)}</ul></div><div><h3>What to fix</h3><ul>${li(r.gaps)}</ul></div></div>
      <div><h3 style="margin-bottom:6px">Say it like this</h3><div class="model">${esc(r.model_answer||"")}</div></div>
      ${r.follow_up?`<div><span class="eyebrow">Interviewer follows up</span><p style="margin:4px 0 10px;font-weight:500">${esc(r.follow_up)}</p><button class="btn" id="takeFollow">Answer the follow-up</button></div>`:""}
    </div>`;
    if(r.follow_up)$("#takeFollow").onclick=()=>{setMock({q:r.follow_up,followUp:true,context:mockQ.q,t:mockQ.t});$("#mockAnswer").focus();};
    S.mockHist.unshift({q:mockQ.q,t:mockQ.t,score,at:Date.now()}); S.mockHist=S.mockHist.slice(0,40);
    if(mockQ.id) grade(mockQ.id,score>=8?2:score>=5?1:0,"mock"); else save();
    renderHist();
  }catch(e){
    const msg=e?.code==="quota_exhausted"?"You're out of AI credits for now. Compare with the model answer below, or upgrade to Pro for more practice.":e?.code==="rate_limited"?"Too many requests at once. Wait a minute and try again.":"Grading didn't go through. Try again in a moment.";
    out.innerHTML=`<div class="card stack"><p style="margin:0">${msg}</p>${mockQ.a?`<div class="ans" style="border:0;padding:0">${mockQ.a}</div>`:""}</div>`;
  }
  mockBusy=false;$("#mockGrade").disabled=false;
};

/* ---------- Networking ---------- */
let stageFilter=null, editing=null;
const EXAMPLES=[
  {name:"Jordan Ellis",firm:"Stifel",role:"Analyst, Industrials",tie:"Mizzou '24, Finance",email:"",stage:"Emailed",last:addDays(-9),next:addDays(-2),notes:"Found on LinkedIn via Trulaske alumni filter.",example:true},
  {name:"Priya Raman",firm:"Houlihan Lokey",role:"Associate, Restructuring",tie:"Mizzou '20; Finance Club",email:"",stage:"Called",last:addDays(0),next:addDays(0),notes:"Said the Chicago office hires from the Midwest. Recommended reading Restructuring 101 posts. Offered to pass resume to recruiting.",example:true},
  {name:"Marcus Webb",firm:"William Blair",role:"VP, Healthcare",tie:"KC native, Rockhurst HS",email:"",stage:"Identified",last:"",next:addDays(1),notes:"Priya's suggestion.",example:true},
];
function nextDefault(stage){return {Emailed:addDays(7),Replied:addDays(2),Called:addDays(0),Thanked:addDays(30),Referred:addDays(14)}[stage];}
function renderNetwork(){
  const C=S.contacts;
  $("#pipe").innerHTML=STAGES.map(s=>`<button data-stage="${s}" aria-pressed="${stageFilter===s}"><b>${C.filter(c=>c.stage===s).length}</b><span>${s}</span></button>`).join("");
  const t0=today().getTime();
  const due=C.filter(c=>c.next&&parseIso(c.next).getTime()<=t0+DAY).sort((a,b)=>a.next.localeCompare(b.next));
  $("#dueBox").innerHTML=due.length?`<div class="due"><span class="eyebrow">Follow-ups due</span><ul>${due.map(c=>{const d=Math.round((parseIso(c.next).getTime()-t0)/DAY);return `<li><b>${esc(c.name)}</b><span class="hint">${esc(c.firm)} · ${esc(c.stage)}</span><span class="${d<0?"late":"soon"}">${d<0?-d+"d overdue":d===0?"today":"tomorrow"}</span><button class="btn" data-draft="${C.indexOf(c)}" style="padding:3px 10px;font-size:.8rem">Draft email</button></li>`}).join("")}</ul></div>`:"";
  const list=C.map((c,i)=>({c,i})).filter(x=>!stageFilter||x.c.stage===stageFilter);
  $("#listTitle").textContent=stageFilter?stageFilter+" ("+list.length+")":"All contacts ("+C.length+")";
  const hot=["Replied","Call set","Called"];
  $("#contactList").innerHTML=C.length?(list.length?`<div class="clist">${list.map(({c,i})=>`<div class="contact">
      <div class="who"><b>${esc(c.name)}${c.example?'<span class="ex">EXAMPLE</span>':""}</b><span>${esc(c.role?c.role+", ":"")}${esc(c.firm)}${c.tie?" · "+esc(c.tie):""}</span></div>
      <div class="dates">${c.last?"Last "+esc(c.last):"Not contacted"}${c.next?"<br>Next "+esc(c.next):""}</div>
      <div class="row"><span class="stage ${hot.includes(c.stage)?"hot":""}">${esc(c.stage)}</span><button class="btn sm" data-prepc="${i}">Prep</button><button class="btn sm" data-edit="${i}">Edit</button></div>
    </div>`).join("")}</div>`:`<div class="card empty"><p>No contacts at this stage.</p></div>`)
    :`<div class="card empty"><h3>Start your outreach list</h3><p>Add alumni you want to reach: name, firm, and how you're connected (same school, hometown, club). Superday Prep reminds you when to follow up and drafts the emails.</p><div class="row"><button class="btn primary" data-act="add">Add your first contact</button><button class="btn" data-act="examples">Load 3 example contacts</button></div></div>`;
  const sel=$("#emContact"), prev=sel.value;
  sel.innerHTML=C.length?C.map((c,i)=>`<option value="${i}">${esc(c.name)} · ${esc(c.firm)}</option>`).join(""):`<option value="">Sample contact</option>`;
  if(prev&&C[prev])sel.value=prev;
  renderEmail();
  renderFirms();
}
function me(){const s=S.settings;return{name:s.name||"[Your name]",school:s.school||"the University of Missouri",short:s.short||s.school||"Mizzou",year:s.year||"[year]",major:s.major||"[major]",target:s.target||"an investment banking summer analyst role"};}
function renderEmail(){
  const c=S.contacts[$("#emContact").value]||{name:"Jordan Ellis",firm:"Stifel",role:"Analyst, Industrials",tie:"Mizzou '24",notes:""};
  const m=me(), first=(c.name||"").split(" ")[0]||"there";
  const sameSchool=c.tie&&m.short&&c.tie.toLowerCase().includes(m.short.toLowerCase().slice(0,4));
  const role=c.role?` as ${/^[aeiou]/i.test(c.role)?"an":"a"} ${c.role}`:"";
  const lastNote=((c.notes||"").split("\n").map(s=>s.trim()).filter(Boolean).pop()||"").replace(/^Call \d{4}-\d{2}-\d{2}:\s*/,"").split(/[.;]/).map(s=>s.trim()).filter(Boolean)[0];
  const T={
    cold:`Subject: ${m.short} student interested in ${c.firm}

Hi ${first},

My name is ${m.name}, and I'm a ${m.year} at ${m.school} studying ${m.major}. ${sameSchool?`I saw that you're also a ${m.short} grad and are now at ${c.firm}${role}.`:`I came across your background${c.tie?` (${c.tie})`:""} and your work at ${c.firm}${role}.`}

I'm working toward ${m.target}, and since ${m.short} doesn't have a big on-campus banking pipeline, I'm reaching out to people who have made the move. I'd really value hearing how you got to ${c.firm} and what you'd do differently.

Would you have 15 minutes for a quick call over the next couple of weeks? I'm flexible around your schedule.

Thank you for your time,
${m.name}`,
    bump:`Subject: Re: ${m.short} student interested in ${c.firm}

Hi ${first},

I wanted to follow up on my note below in case it got buried. I know things are busy at ${c.firm}, so even 10 minutes would be a big help as I prepare for recruiting.

Thanks again,
${m.name}`,
    thanks:`Subject: Thank you

Hi ${first},

Thank you for taking the time to speak with me today. ${lastNote?`I especially appreciated your point that ${lastNote.charAt(0).toLowerCase()+lastNote.slice(1)}.`:"Your advice on how to approach recruiting was really helpful."}

I'm going to put that into practice as I keep preparing. If there's anyone else at ${c.firm} you think I should speak with, I'd be grateful for an introduction.

Best,
${m.name}`,
    checkin:`Subject: Quick update

Hi ${first},

I hope things are going well at ${c.firm}. I wanted to share a quick update since we spoke: [one concrete thing you did with their advice, e.g. finished a DCF model, joined the investment club, landed a first-round].

Thanks again for your help. I'll keep you posted as recruiting picks up.

Best,
${m.name}`};
  $("#emOut").textContent=T[$("#emType").value];
}
$("#pipe").addEventListener("click",e=>{const b=e.target.closest("[data-stage]");if(!b)return;stageFilter=stageFilter===b.dataset.stage?null:b.dataset.stage;renderNetwork();});
$("#emContact").onchange=renderEmail; $("#emType").onchange=renderEmail;
$("#emCopy").onclick=()=>copy($("#emOut").textContent);
$("#emLog").onclick=()=>{
  const i=$("#emContact").value, c=S.contacts[i]; if(!c){toast("Add a contact first");return;}
  const t=$("#emType").value; c.last=iso(new Date());
  if(t==="cold"||t==="bump"){if(["Identified","Emailed"].includes(c.stage))c.stage="Emailed";c.next=addDays(7);}
  else if(t==="thanks"){c.stage="Thanked";c.next=addDays(30);}
  else c.next=addDays(30);
  save();renderNetwork();toast(`Logged. Next follow-up ${c.next}`);
};
$("#v-network").addEventListener("click",e=>{
  const pc=e.target.closest("[data-prepc]"); if(pc){const i=+pc.dataset.prepc;selFirm=S.contacts[i].firm;prepOpen=i;justLogged=null;location.hash="#firms";if(!S.contacts[i].prep)generatePrep(i);else renderFirms();return;}
  const ed=e.target.closest("[data-edit]"); if(ed)openContact(+ed.dataset.edit);
  const dr=e.target.closest("[data-draft]"); if(dr){const c=S.contacts[dr.dataset.draft];$("#emContact").value=dr.dataset.draft;$("#emType").value=c.stage==="Called"?"thanks":c.stage==="Emailed"?"bump":c.stage==="Thanked"||c.stage==="Referred"?"checkin":"cold";renderEmail();$("#emOut").scrollIntoView({behavior:"smooth",block:"center"});}
  const a=e.target.closest("[data-act]");
  if(a?.dataset.act==="add")openContact(null);
  if(a?.dataset.act==="examples"){S.contacts=EXAMPLES.map(x=>({...x}));save();renderNetwork();}
});
$("#cStage").innerHTML=STAGES.map(s=>`<option>${s}</option>`).join("");
$("#cStage").onchange=()=>{const d=nextDefault($("#cStage").value);if(d)$("#cNext").value=d;};
function openContact(i){
  editing=i; const c=i==null?{stage:"Identified",next:addDays(1)}:S.contacts[i];
  $("#dlgTitle").textContent=i==null?"Add contact":"Edit contact";
  $("#cName").value=c.name||"";$("#cFirm").value=c.firm||"";$("#cRole").value=c.role||"";$("#cTie").value=c.tie||"";
  $("#cEmail").value=c.email||"";$("#cStage").value=c.stage;$("#cLast").value=c.last||"";$("#cNext").value=c.next||"";$("#cNotes").value=c.notes||"";
  $("#cDelete").hidden=i==null; $("#cDelete").textContent="Delete"; $("#cDelete").dataset.armed="";
  $("#contactDlg").showModal();
}
$("#contactForm").addEventListener("submit",e=>{
  e.preventDefault();
  const c={name:$("#cName").value.trim(),firm:$("#cFirm").value.trim(),role:$("#cRole").value.trim(),tie:$("#cTie").value.trim(),email:$("#cEmail").value.trim(),stage:$("#cStage").value,last:$("#cLast").value,next:$("#cNext").value,notes:$("#cNotes").value.trim()};
  if(editing==null)S.contacts.push(c);else S.contacts[editing]=c;
  save();$("#contactDlg").close();renderNetwork();toast("Contact saved");
});
$("#cCancel").onclick=()=>$("#contactDlg").close();
$("#cDelete").onclick=()=>{const b=$("#cDelete");if(!b.dataset.armed){b.dataset.armed="1";b.textContent="Click again to delete";return;}
  S.contacts.splice(editing,1);save();$("#contactDlg").close();renderNetwork();toast("Contact deleted");};
$("#addBtn").onclick=()=>openContact(null);
$("#settingsBtn").onclick=()=>{const s=S.settings;$("#sName").value=s.name||"";$("#sSchool").value=s.school||"";$("#sShort").value=s.short||"";$("#sYear").value=s.year||"";$("#sMajor").value=s.major||"";$("#sTarget").value=s.target||"";$("#settingsDlg").showModal();};
$("#settingsForm").addEventListener("submit",e=>{e.preventDefault();S.settings={...S.settings,name:$("#sName").value.trim(),school:$("#sSchool").value.trim(),short:$("#sShort").value.trim(),year:$("#sYear").value.trim(),major:$("#sMajor").value.trim(),target:$("#sTarget").value.trim()};save();$("#settingsDlg").close();renderEmail();toast("Details saved");});
$("#sCancel").onclick=()=>$("#settingsDlg").close();

/* ---------- Superday simulation ---------- */
const SIM_LS="superday-sim-live";
let sim=null, simTick=null, quitArmed=false;
const byId=id=>BANK.find(b=>b.id===id);
const stripTags=h=>String(h||"").replace(/<[^>]+>/g," ").replace(/\s+/g," ").trim();
const BEHAV="f5 f14 f15 f16 f17 f18 f19 f20 f35 f40 f41 f42 f43 f44 f55".split(" ");
const MARKET="f7 f12 f13 f46".split(" ");
const ROLES={
  associate:{title:"Associate",blurb:"A second-year associate in the group. Mostly technicals, and they'll push on anything vague."},
  vp:{title:"Vice President",blurb:"The VP who runs deals day to day. A mix of fit and harder technicals."},
  md:{title:"Managing Director",blurb:"The MD who decides whether you'd be good in front of clients. Fit, judgment and a brain teaser."}
};
const sectionOf=t=>t==="Fit"?"fit":t==="Brain Teasers"?"teaser":"tech";
const SECTION_NAME={fit:"Fit & behavioral",tech:"Technicals",teaser:"Brain teaser"};
const TARGET={fit:90,tech:120,teaser:120};
const fmtT=s=>Math.floor(s/60)+":"+String(Math.floor(s%60)).padStart(2,"0");
function persistLive(){try{if(sim)localStorage.setItem(SIM_LS,JSON.stringify(sim));else localStorage.removeItem(SIM_LS);}catch(e){}}

function simPlan(len,group){
  const A={role:"associate",slots:[["resume"],["Accounting",true],["Enterprise Value"],[len==="full"?"Valuation":"DCF",true]]};
  if(len==="short") return [A,{role:"md",slots:[["whyfirm"],["behav"],["Brain Teasers"],["closing"]]}];
  const vp={role:"vp",slots:[["whyfirm"],["DCF"],["LBO|M&A",true],["behav"]]};
  if(group) vp.slots.splice(1,0,["whygroup"]);
  return [A,vp,{role:"md",slots:[["whyib"],["Brain Teasers"],["market"],["closing"]]}];
}
function pickQ(kind,used,o){
  const lv=o.bank==="bb"?["Intermediate","Advanced"]:["Basic","Intermediate"];
  const recent=new Set((S.simHist||[]).slice(0,2).flatMap(h=>h.ids||[]));
  if(kind==="resume")return byId("f1");
  if(kind==="whyib")return byId("f2");
  if(kind==="closing")return byId("f34");
  if(kind==="whyfirm"){const f=byId("f3");return o.firm?{...f,q:`Why ${o.firm}?`}:f;}
  if(kind==="whygroup"){const f=byId("f32");return {...f,q:`Why do you want to work in ${o.group}?`};}
  let pool;
  if(kind==="behav")pool=BEHAV.map(byId);
  else if(kind==="market")pool=MARKET.map(byId);
  else{const ts=kind.split("|");pool=BANK.filter(b=>ts.includes(b.t)&&lv.includes(b.l));}
  pool=pool.filter(b=>b&&!used.has(b.id));
  const fresh=pool.filter(b=>!recent.has(b.id)), from=fresh.length?fresh:pool;
  return from[Math.floor(Math.random()*from.length)];
}
function startSim(o){
  const used=new Set();
  sim={...o,stage:"meet",r:0,i:0,started:Date.now(),qStart:0,draft:""};
  sim.rounds=simPlan(o.len,o.group).map(R=>({role:R.role,items:R.slots.map(([kind,fu])=>{
    const b=pickQ(kind,used,o); used.add(b.id);
    return {id:b.id,q:b.q,t:b.t,l:b.l,ref:b.a,kind,fu:!!fu,role:R.role,answer:"",secs:0};
  })}));
  quitArmed=false; persistLive(); renderSim(); scrollTo({top:0});
}
const simCount=()=>sim.rounds.reduce((n,R)=>n+R.items.length,0);

/* grading */
const gq=[]; let gActive=0;
function firmNotes(firm){
  const f=firm.toLowerCase();
  return S.contacts.filter(c=>c.firm&&(c.firm.toLowerCase().includes(f)||f.includes(c.firm.toLowerCase()))&&c.notes)
    .map(c=>`${c.name}${c.role?" ("+c.role+")":""}: ${c.notes}`).join(" | ").slice(0,700);
}
function gradePrompt(it){
  const role=ROLES[it.role].title, sec=sectionOf(it.t);
  const kind=sec==="fit"?"fit (behavioral)":sec==="teaser"?"brain teaser":"technical";
  const key=it.ref?stripTags(it.ref):"None provided. Use your own expertise as an investment banker.";
  const notes=it.kind==="whyfirm"&&sim.firm?firmNotes(sim.firm):"";
  const rules=sec==="teaser"?"Judge both the final answer and the reasoning shown. A correct answer with no reasoning should score no higher than 6. For estimates, reward a clear structure and reasonable stated assumptions; do not require an exact number. Penalize arithmetic mistakes."
    :sec==="fit"?"Judge it as a real fit answer: specific, structured, believable, and tied to why banking. Penalize generic or rambling answers. The reference describes a good structure, not exact words."
    :"Be strict but fair. Penalize wrong numbers, wrong signs or directions (for example cash going the wrong way), and missing key steps. Reward clear structure: headline first, then steps. Do not penalize a short answer that is correct and complete. Ignore spelling.";
  return `You are a ${role} at ${sim.bank==="bb"?"a bulge bracket investment bank":"a middle-market investment bank"}${sim.firm?" ("+sim.firm+")":""}, interviewing an undergraduate at a superday for a summer analyst role. This is a ${kind} question. Grade the answer the way a real interviewer would.

Question: ${it.q}
${it.followOf?`This was your follow-up to the earlier question: "${it.followOf}". The candidate's earlier answer: """${it.prevAnswer||""}"""\n`:""}Reference answer (points the interviewer expects): ${key}
${notes?`The candidate's own notes from networking with people at this firm (use them to judge whether the answer is specific and genuine): ${notes}\n`:""}
${it.kind==="resume"&&S.story&&S.story.resume?`The candidate's resume (judge whether the answer is a clear, specific story consistent with it): ${S.story.resume.slice(0,2500)}\n\n`:""}Candidate's answer (typed the way they would say it):
"""${it.answer}"""

Grading rules: ${rules}

Reply with JSON only, in this shape:
{"score": integer 0-10, "verdict": "Strong" | "Pass" | "Borderline" | "Fail", "strengths": [up to 2 short strings], "gaps": [up to 3 short strings, each naming what was wrong or missing], "model_answer": "a 60-120 word answer the candidate could say out loud"}`;
}
function normResult(r){
  const score=Math.max(0,Math.min(10,Math.round(+r?.score||0)));
  const arr=a=>Array.isArray(a)?a.filter(x=>typeof x==="string").slice(0,3):[];
  return {score,strengths:arr(r?.strengths),gaps:arr(r?.gaps),model_answer:typeof r?.model_answer==="string"?r.model_answer:""};
}
function enqueueGrade(it){it.status="pending";gq.push(it);pump();}
function pump(){
  while(gActive<2&&gq.length){
    const it=gq.shift(); gActive++;
    gradeItem(it).finally(()=>{gActive--;persistLive();pump();if(sim&&sim.stage==="scoring"){renderSim();checkScored();}});
  }
}
async function gradeItem(it){
  if(!it.answer.trim()){it.result={score:0,strengths:[],gaps:["No answer given."],model_answer:""};it.status="done";return;}
  await sampleReady;
  if(!sampleFn){it.status="nograde";return;}
  try{it.result=normResult(await sampleFn.json(gradePrompt(it),{modelTier:"default"}));it.status="done";}
  catch(e){
    if(e?.code==="rate_limited"&&!it.retried){it.retried=true;await new Promise(r=>setTimeout(r,6000));return gradeItem(it);}
    it.status="error";
  }
}
async function getFollowUp(it){
  await sampleReady;
  if(!sampleFn||!it.answer.trim())return null;
  const ctrl=new AbortController(), t=setTimeout(()=>ctrl.abort(),25000);
  try{
    const r=await sampleFn(`You are a ${ROLES[it.role].title} interviewing an undergraduate for an investment banking summer analyst role. You asked: "${it.q}". The candidate answered: """${it.answer}"""

Ask ONE short follow-up question that probes the weakest or most interesting part of their answer, the way a real interviewer would: ask them to go one step further, correct an error without saying what it is, or apply the idea to new numbers. Reply with the question only.`,{modelTier:"quick",signal:ctrl.signal,cache:false});
    const q=String(r.text||"").trim().replace(/^["'“]+|["'”]+$/g,"");
    return q.length>8&&q.length<400?q:null;
  }catch(e){return null;}finally{clearTimeout(t);}
}

/* flow */
async function submitAnswer(skip){
  const R=sim.rounds[sim.r], it=R.items[sim.i];
  it.answer=skip?"":($("#simAns")?.value||"").trim(); it.secs=Math.round((Date.now()-sim.qStart)/1000); it.done=true; sim.draft="";
  enqueueGrade(it);
  if(it.fu&&it.answer&&!it.fuDone){
    it.fuDone=true; sim.stage="thinking"; persistLive(); renderSim();
    const fq=await getFollowUp(it);
    if(!sim)return;
    if(fq)R.items.splice(sim.i+1,0,{q:fq,t:it.t,l:it.l,ref:"",kind:"followup",role:it.role,followOf:it.q,prevAnswer:it.answer.slice(0,1500),answer:"",secs:0,isFollow:true});
  }
  advance();
}
function advance(){
  const R=sim.rounds[sim.r];
  if(sim.i+1<R.items.length){sim.i++;sim.stage="q";sim.qStart=Date.now();}
  else if(sim.r+1<sim.rounds.length){sim.r++;sim.i=0;sim.stage="meet";}
  else{sim.stage="scoring";sim.endedAt=Date.now();}
  persistLive(); renderSim(); scrollTo({top:0});
  if(sim.stage==="scoring")checkScored();
}
function endEarly(){
  sim.rounds.forEach(R=>R.items=R.items.filter(it=>it.done));
  sim.rounds=sim.rounds.filter(R=>R.items.length);
  if(!sim.rounds.length){sim=null;persistLive();renderSim();return;}
  sim.stage="scoring"; sim.endedAt=Date.now(); sim.early=true; persistLive(); renderSim(); checkScored();
}
const allItems=()=>sim.rounds.flatMap(R=>R.items);
const avg=a=>a.length?a.reduce((x,y)=>x+y,0)/a.length:null;
let finishing=false;
async function checkScored(){
  if(!sim||sim.stage!=="scoring"||finishing)return;
  if(allItems().some(it=>it.status==="pending"))return;
  finishing=true;
  const items=allItems(), scored=items.filter(it=>it.result);
  const sec={}; ["fit","tech","teaser"].forEach(k=>{sec[k]=avg(scored.filter(it=>sectionOf(it.t)===k).map(it=>it.result.score));});
  const overall=avg(scored.map(it=>it.result.score));
  const verdict=overall==null?"Self-review":overall>=7.5&&(sec.tech==null||sec.tech>=7)?"Would advance":overall>=6?"Borderline":"Not yet";
  let summary=null;
  if(sampleFn&&scored.length){
    const lines=items.map((it,n)=>`${n+1}. [${SECTION_NAME[sectionOf(it.t)]}${it.isFollow?", follow-up":""}] "${it.q}" scored ${it.result?it.result.score+"/10":"not scored"}.${it.result?.gaps?.length?" Gaps: "+it.result.gaps.join("; "):""}`).join("\n");
    try{
      const r=await sampleFn.json(`You are the managing director writing a short superday debrief for an undergraduate candidate interviewing for an investment banking summer analyst role${sim.firm?" at "+sim.firm:""}. Here is every question, its score and the gaps the interviewers noted:
${lines}

Average score: ${overall.toFixed(1)}/10. Verdict: ${verdict}.

Write candid, specific feedback the candidate can act on this week. Reply with JSON only, in this shape:
{"headline": "one sentence the hiring committee would say about this candidate", "strengths": [2-3 short strings], "fixes": [3 short strings, most important first, each specific], "plan": [3 short, concrete study actions for the next week]}`,{modelTier:"default"});
      const arr=a=>Array.isArray(a)?a.filter(x=>typeof x==="string").slice(0,3):[];
      summary={headline:typeof r.headline==="string"?r.headline:"",strengths:arr(r.strengths),fixes:arr(r.fixes),plan:arr(r.plan)};
    }catch(e){}
  }
  const prev=(S.simHist||[])[0];
  sim.final={overall,verdict,sec,summary,prevOverall:prev?.overall??null};
  sim.stage="done";
  if(overall!=null){
    S.simHist=[{topics:Object.fromEntries([...new Set(scored.map(it=>it.t))].map(t=>[t,avg(scored.filter(it=>it.t===t).map(it=>it.result.score))])),at:Date.now(),bank:sim.bank,len:sim.len,firm:sim.firm||"",overall,verdict,sec,mins:Math.round((sim.endedAt-sim.started)/6e4),ids:items.filter(it=>it.id).map(it=>it.id)},...(S.simHist||[])].slice(0,20);
    items.forEach(it=>{if(it.id&&it.result)grade(it.id,it.result.score>=8?2:it.result.score>=5?1:0,"mock");});
    save();
  }
  finishing=false; persistLive(); renderSim();
}

/* rendering */
function simHead(){
  const R=sim.rounds[sim.r];
  const dots=R.items.map((it,k)=>`<i class="${k<sim.i||it.done?"done":k===sim.i?"now":""}"></i>`).join("");
  return `<div class="sim-head">
    <div class="stack" style="gap:6px"><span class="eyebrow">Interview ${sim.r+1} of ${sim.rounds.length} · ${ROLES[R.role].title}</span><div class="dots" aria-label="Question ${sim.i+1} of ${R.items.length}">${dots}</div></div>
    <div class="row"><span class="timer">Total <b id="simTotal">${fmtT((Date.now()-sim.started)/1000)}</b></span><button class="btn" id="simQuit">${quitArmed?"Click again to end and score":"End early"}</button></div>
  </div>`;
}
function renderSetup(root){
  const firms=[...new Set(S.contacts.map(c=>c.firm).filter(Boolean))];
  const hist=S.simHist||[];
  root.innerHTML=`<div class="split">
    <form class="card stack" id="simForm">
      <div><span class="eyebrow">Superday simulation</span><h2 style="margin-top:4px">Run a mock superday</h2>
      <p class="hint" style="margin:6px 0 0;max-width:60ch">Back-to-back interviews with an associate, a VP and an MD. Interviewers ask follow-ups based on what you say, and you get no feedback until the end, like the real thing. Then you get a full scorecard.</p></div>
      <fieldset class="choice"><legend>Bank type</legend>
        <label><input type="radio" name="simBank" value="mm" checked><b>Middle market or boutique</b><span>Core technicals, more weight on fit</span></label>
        <label><input type="radio" name="simBank" value="bb"><b>Bulge bracket or elite boutique</b><span>Harder technicals and brain teasers</span></label>
      </fieldset>
      <fieldset class="choice"><legend>Length</legend>
        <label><input type="radio" name="simLen" value="short"><b>Short · about 20 min</b><span>2 interviews, about 9 questions</span></label>
        <label><input type="radio" name="simLen" value="full" checked><b>Full · about 45 min</b><span>3 interviews, about 14 questions</span></label>
      </fieldset>
      <div class="grid2">
        <div><label for="simFirm">Firm (optional)</label><input id="simFirm" list="simFirms" placeholder="Stifel"><datalist id="simFirms">${firms.map(f=>`<option value="${esc(f)}">`).join("")}</datalist></div>
        <div><label for="simGroup">Group (optional, full only)</label><input id="simGroup" placeholder="Industrials"></div>
      </div>
      <p class="hint" style="margin:0">${firms.length?"If you pick a firm from your networking list, your call notes are used to judge your \"Why us?\" answer.":"Add the firm to make the \"Why us?\" question specific."} Type answers the way you'd say them out loud.</p>
      ${sampleFn===null&&sampleChecked?`<p class="hint" style="margin:0;color:var(--amber)">AI scoring isn't available in this view. You can still run the simulation and compare your answers with the model answers.</p>`:""}
      <div class="row"><button class="btn primary" type="submit">Start superday</button>${isPro()?"":'<span class="pro">PRO</span>'}</div>
    </form>
    <aside class="card">
      <h3>Past simulations</h3>
      ${hist.length?`<ul class="hist">${hist.slice(0,8).map(h=>`<li><b>${h.overall.toFixed(1)}</b><span>${esc(h.verdict)} · ${h.len==="full"?"Full":"Short"}, ${h.bank==="bb"?"bulge bracket":"middle market"}${h.firm?" · "+esc(h.firm):""}<br><span class="hint">${new Date(h.at).toLocaleDateString(undefined,{month:"short",day:"numeric"})} · ${h.mins} min</span></span></li>`).join("")}</ul>`
      :`<p class="hint" style="margin:6px 0 0">Your scores show up here so you can see your progress run to run. Most people do one a week, then two in the final week before their superday.</p>`}
    </aside>
  </div>`;
  if(simPrefill){$("#simFirm").value=simPrefill.firm;if(simPrefill.group)$("#simGroup").value=simPrefill.group;simPrefill=null;}
  $("#simForm").onsubmit=e=>{e.preventDefault();if(!isPro()){window.openPaywall&&window.openPaywall("sim");return;}const f=e.target;
    startSim({bank:f.simBank.value,len:f.simLen.value,firm:$("#simFirm").value.trim(),group:f.simLen.value==="full"?$("#simGroup").value.trim():""});};
}
function renderSim(){
  const root=$("#simRoot"); if(!root)return;
  clearInterval(simTick);
  if(!sim){renderSetup(root);return;}
  if(sim.stage==="meet"){
    const R=sim.rounds[sim.r], role=ROLES[R.role];
    root.innerHTML=`${simHead()}<div class="card meet stack">
      <span class="eyebrow">Interview ${sim.r+1} of ${sim.rounds.length}</span>
      <h2>You're meeting the ${role.title.toLowerCase()}</h2>
      <p style="margin:0;max-width:60ch">${role.blurb} About ${R.items.length} questions${R.items.some(it=>it.fu)?", plus follow-ups":""}.</p>
      <div class="row"><button class="btn primary" id="simGo">Start interview</button>${sim.r===0?`<span class="hint">The clock starts now. Take a breath.</span>`:`<span class="hint">Reset. Each interviewer forms their own view.</span>`}</div>
    </div>`;
    $("#simGo").onclick=()=>{sim.stage="q";sim.qStart=Date.now();persistLive();renderSim();};
  }else if(sim.stage==="q"){
    const it=sim.rounds[sim.r].items[sim.i], sec=sectionOf(it.t);
    root.innerHTML=`${simHead()}<div class="card stack">
      <div class="qmeta"><span class="eyebrow">${it.isFollow?"Follow-up":"Question "+(sim.i+1)}</span><span class="eyebrow">${SECTION_NAME[sec]}${sec==="tech"&&!it.isFollow?" · "+esc(it.t):""}</span><span class="eyebrow qtimer" id="simQ">0:00</span><span class="hint">aim for about ${TARGET[sec]/60>=2?"2 min":"90 sec"}</span></div>
      ${it.isFollow?`<p class="hint" style="margin:0">Following up on: ${esc(it.followOf)}</p>`:""}
      <p class="q" style="margin:0">${esc(it.q)}</p>
      <label for="simAns" class="sr">Your answer</label>
      <textarea id="simAns" placeholder="Answer the way you'd say it out loud. Headline first, then the steps.">${esc(sim.draft||"")}</textarea>
      <div class="row"><button class="btn primary" id="simSubmit">Submit answer</button><button class="btn" id="simSkip">Skip</button><span class="hint"><kbd>Ctrl</kbd>/<kbd>⌘</kbd> + <kbd>Enter</kbd> to submit · no feedback until the end</span></div>
    </div>`;
    const ta=$("#simAns"); ta.focus();
    let dt; ta.oninput=()=>{sim.draft=ta.value;clearTimeout(dt);dt=setTimeout(persistLive,800);};
    ta.onkeydown=e=>{if(e.key==="Enter"&&(e.metaKey||e.ctrlKey)){e.preventDefault();submitAnswer(false);}};
    $("#simSubmit").onclick=()=>{if(!ta.value.trim()){toast("Type an answer, or press Skip");return;}submitAnswer(false);};
    $("#simSkip").onclick=()=>submitAnswer(true);
    simTick=setInterval(()=>{const q=$("#simQ"),t=$("#simTotal");if(!q)return clearInterval(simTick);
      const s=(Date.now()-sim.qStart)/1000;q.textContent=fmtT(s);q.classList.toggle("over",s>TARGET[sec]*1.5);if(t)t.textContent=fmtT((Date.now()-sim.started)/1000);},1000);
  }else if(sim.stage==="thinking"){
    root.innerHTML=`${simHead()}<div class="card thinking"><span class="dot"></span>The ${ROLES[sim.rounds[sim.r].role].title.toLowerCase()} is thinking about your answer...</div>`;
  }else if(sim.stage==="scoring"){
    const items=allItems(), done=items.filter(it=>it.status&&it.status!=="pending").length;
    root.innerHTML=`<div class="card stack"><div class="thinking"><span class="dot"></span>The interviewers are comparing notes...</div>
      <p class="hint" style="margin:0">${done} of ${items.length} answers scored${done===items.length?". Writing your debrief.":". This usually takes under a minute."}</p>
      <div class="bar" style="max-width:none"><i style="width:${Math.round(done/items.length*100)}%"></i></div></div>`;
  }else if(sim.stage==="done") renderScorecard(root);
  if(sim&&sim.stage!=="done"){const qb=$("#simQuit");if(qb)qb.onclick=()=>{if(!quitArmed){quitArmed=true;qb.textContent="Click again to end and score";return;}quitArmed=false;endEarly();};}
}
function scorecardText(){
  const F=sim.final, lines=[`Superday simulation · ${sim.len==="full"?"Full":"Short"} · ${sim.bank==="bb"?"Bulge bracket":"Middle market"}${sim.firm?" · "+sim.firm:""}`,
    `Result: ${F.verdict}${F.overall!=null?` · ${F.overall.toFixed(1)}/10`:""}`];
  ["fit","tech","teaser"].forEach(k=>{if(F.sec[k]!=null)lines.push(`${SECTION_NAME[k]}: ${F.sec[k].toFixed(1)}/10`);});
  if(F.summary?.headline)lines.push("",F.summary.headline);
  if(F.summary?.fixes?.length)lines.push("","Fix first:",...F.summary.fixes.map(x=>"- "+x));
  lines.push("","Practiced with Superday Prep");
  return lines.join("\n");
}
function renderScorecard(root){
  const F=sim.final, items=allItems(), mins=Math.round((sim.endedAt-sim.started)/6e4);
  const vcls={"Would advance":"v-Strong","Borderline":"v-Borderline","Not yet":"v-Fail","Self-review":"v-Pass"}[F.verdict];
  const delta=F.overall!=null&&F.prevOverall!=null?F.overall-F.prevOverall:null;
  const bar=k=>F.sec[k]==null?"":`<div class="secrow"><span>${SECTION_NAME[k]}</span><div class="bar" style="max-width:none;margin:0"><i style="width:${F.sec[k]*10}%"></i></div><b>${F.sec[k].toFixed(1)}</b></div>`;
  const li=a=>(a||[]).map(x=>`<li>${esc(x)}</li>`).join("");
  const S2=F.summary;
  root.innerHTML=`<div class="stack">
    <div class="card stack">
      <div class="sc-top">
        <div class="score"><b>${F.overall!=null?F.overall.toFixed(1):"–"}<small>/10</small></b><span class="verdict ${vcls}">${F.verdict}</span></div>
        <p class="hint" style="margin:0">${sim.len==="full"?"Full":"Short"} superday · ${sim.bank==="bb"?"bulge bracket":"middle market"}${sim.firm?" · "+esc(sim.firm):""} · ${items.length} questions in ${mins<1?"under 1":mins} min${sim.early?" (ended early)":""}${delta!=null?` · <b style="color:${delta>=0?"var(--accent)":"var(--red)"}">${delta>=0?"+":""}${delta.toFixed(1)}</b> vs. your last run`:""}</p>
      </div>
      ${S2?.headline?`<p style="margin:0;font-size:1.1rem;font-weight:500;max-width:65ch">${esc(S2.headline)}</p>`:""}
      ${F.overall!=null?`<div class="secbars">${bar("fit")}${bar("tech")}${bar("teaser")}</div>`:`<p class="hint" style="margin:0">AI scoring wasn't available, so compare each answer with the model answer below.</p>`}
      ${S2?`<div class="grid3 fb"><div><h3>What landed</h3><ul>${li(S2.strengths)}</ul></div><div><h3>Fix first</h3><ul>${li(S2.fixes)}</ul></div><div><h3>Your plan this week</h3><ul>${li(S2.plan)}</ul></div></div>`:""}
      <div class="row"><button class="btn primary" id="simAgain">Run another superday</button><button class="btn" id="simCopy">Copy scorecard</button><a class="btn" href="#drill" style="text-decoration:none">Go to drill</a></div>
      <textarea id="simCopyBox" readonly hidden style="min-height:150px"></textarea>
      ${F.overall!=null?`<p class="hint" style="margin:0">Each graded question also updated your drill deck, so the ones you missed come back sooner.</p>`:""}
    </div>
    ${sim.rounds.map((R,ri)=>`<div class="card stack" style="gap:8px"><h3>Interview ${ri+1} · ${ROLES[R.role].title}</h3>
      ${R.items.map(it=>{const r=it.result;return `<details class="qa"><summary><span class="qs ${r?(r.score>=8?"hi":r.score>=5?"mid":"lo"):""}">${r?r.score:"–"}</span><span>${it.isFollow?"<i>Follow-up:</i> ":""}${esc(it.q)}</span><span class="hint">${fmtT(it.secs)}</span></summary>
        <div class="qa-body">
          <div><span class="eyebrow">Your answer</span><p class="mine">${it.answer?esc(it.answer):"<i>Skipped</i>"}</p></div>
          ${r?.gaps?.length&&it.answer?`<div><span class="eyebrow">What to fix</span><ul>${li(r.gaps)}</ul></div>`:""}
          ${r?.model_answer?`<div><span class="eyebrow">Say it like this</span><div class="model">${esc(r.model_answer)}</div></div>`:it.ref?`<div><span class="eyebrow">Model answer</span><div class="model">${it.ref}</div></div>`:""}
          ${it.status==="error"?`<p class="hint" style="margin:0">This answer couldn't be scored.</p>`:""}
        </div></details>`;}).join("")}
    </div>`).join("")}
  </div>`;
  $("#simAgain").onclick=()=>{sim=null;persistLive();renderSim();scrollTo({top:0});};
  $("#simCopy").onclick=async()=>{const txt=scorecardText();try{await navigator.clipboard.writeText(txt);toast("Scorecard copied");}catch(e){const b=$("#simCopyBox");b.hidden=false;b.value=txt;b.select();toast("Select the text and copy it");}};
}
let sampleChecked=false;
sampleReady.then(()=>{sampleChecked=true;if(!sim)renderSim();});
(function restoreSim(){
  try{const raw=localStorage.getItem(SIM_LS);if(!raw)return;const s=JSON.parse(raw);
    if(!s||!s.rounds||Date.now()-s.started>8*36e5){localStorage.removeItem(SIM_LS);return;}
    sim=s;
    if(sim.stage==="thinking"){advance();}
    if(sim.stage==="q")sim.qStart=Date.now()-0;
    allItems().forEach(it=>{if(it.done&&(!it.status||it.status==="pending"))enqueueGrade(it);});
    if(sim.stage==="scoring")checkScored();
  }catch(e){}
})();

/* ---------- Firm prep: networking to interview ---------- */
const FIRM_STAGES=["Networking","Applied","First round","Superday","Offer"];
let selFirm=null, prepOpen=null, prepBusy=null, whyBusy=false, justLogged=null, logIdx=null, simPrefill=null;
const fkey=f=>String(f||"").trim().toLowerCase();
const lowerFirst=s=>s?s.charAt(0).toLowerCase()+s.slice(1):s;
const lastNoteLine=c=>((c.notes||"").split("\n").map(s=>s.trim()).filter(Boolean).pop()||"").replace(/^Call \d{4}-\d{2}-\d{2}:\s*/,"");
function firmList(){
  const m=new Map();
  S.contacts.forEach(c=>{if(!c.firm)return;const k=fkey(c.firm);if(!m.has(k))m.set(k,{name:c.firm.trim(),people:[]});m.get(k).people.push(c);});
  Object.entries(S.firms||{}).forEach(([k,v])=>{if(!m.has(k))m.set(k,{name:v.name||k,people:[]});});
  return [...m.values()].map(f=>({...f,info:(S.firms||{})[fkey(f.name)]||{}}))
    .sort((a,b)=>(a.info.date||"9999").localeCompare(b.info.date||"9999")||b.people.length-a.people.length||a.name.localeCompare(b.name));
}
function finfo(name){S.firms=S.firms||{};const k=fkey(name);return S.firms[k]||(S.firms[k]={name});}
let fpSaveT; function fpSave(){clearTimeout(fpSaveT);fpSaveT=setTimeout(save,700);}

/* call prep */
function seniority(role){const r=(role||"").toLowerCase();return /\b(md|managing director|director|vp|vice president|partner|head)\b/.test(r)?"senior":/associate/.test(r)?"associate":"analyst";}
function fallbackPrep(c){
  const m=me(), first=(c.name||"").split(" ")[0]||"there", lvl=seniority(c.role);
  const Q={
    analyst:["What does a typical week look like in your group right now?","What surprised you most about your first year?",`How did you approach recruiting${c.tie?" coming from "+c.tie.split(/[',;]/)[0].trim():""}, and what would you do differently?`,"What separates the analysts who do best in the group?","Is there anyone else at the firm you'd suggest I speak with?"],
    associate:["What's a recent deal you enjoyed working on, and why?","When you interview analyst candidates, what makes someone stand out?","How has the group's deal flow changed over the past year?","What do the strongest first-year analysts do differently?","Would you be open to me staying in touch as recruiting picks up?"],
    senior:["Which sectors or deal types is the group most focused on going forward?","What do you look for in an analyst in their first year?","What do you wish more candidates understood about the firm?","How did your own path shape the way you think about recruiting?","Is there someone on the team you'd suggest I connect with next?"]
  }[lvl];
  return {opener:`Thanks so much for making the time, ${first}. I'm a ${m.year} at ${m.school} studying ${m.major}, working toward ${m.target}. ${c.tie?"Since we share a connection through "+c.tie+", ":""}I'd love to hear how you got to ${c.firm} and what your work looks like day to day.`,
    questions:Q,avoid:["Don't ask about pay, bonuses or hours.","Don't ask for a referral or a job outright. Earn it by being prepared, and let them offer."],
    close:`"This has been really helpful. Would it be all right if I followed up as recruiting gets closer, and is there anyone else you'd suggest I speak with?"`,ai:false};
}
async function generatePrep(i){
  const c=S.contacts[i]; if(!c)return;
  prepBusy=i; renderFirms();
  await sampleReady;
  let prep=null;
  if(sampleFn){
    const m=me(), others=S.contacts.filter(x=>x!==c&&fkey(x.firm)===fkey(c.firm)&&x.notes).map(x=>`${x.name}${x.role?" ("+x.role+")":""}: ${x.notes}`).join(" | ").slice(0,800);
    try{
      const r=await sampleFn.json(`An undergraduate is preparing for a 15-20 minute networking call. Student: ${m.name}, a ${m.year} at ${m.school} studying ${m.major}, working toward ${m.target}. They come from a school without a big banking pipeline.
The person: ${c.name}, ${c.role||"role unknown"} at ${c.firm}. Connection: ${c.tie||"none noted"}. Stage so far: ${c.stage}. Notes so far: ${c.notes||"none"}.
Notes from the student's earlier calls with others at ${c.firm}: ${others||"none"}.

Write a call prep sheet. Pitch the questions at this person's seniority, build on the earlier notes where useful, and do not invent facts about the person, their deals or the firm.
Reply with JSON only, in this shape:
{"opener": "a 20-30 second intro the student can say", "questions": [5 specific, thoughtful questions], "avoid": [2 short things not to do on this call], "close": "one or two sentences to end the call and ask for a next step"}`,{modelTier:"default"});
      const arr=(a,n)=>Array.isArray(a)?a.filter(x=>typeof x==="string").slice(0,n):[];
      if(r&&typeof r.opener==="string"&&arr(r.questions,5).length)prep={opener:r.opener,questions:arr(r.questions,6),avoid:arr(r.avoid,3),close:typeof r.close==="string"?r.close:"",ai:true};
    }catch(e){}
  }
  if(S.contacts[i]===c){c.prep={...(prep||fallbackPrep(c)),at:Date.now()};save();}
  prepBusy=null; renderFirms();
}
function prepText(c){const p=c.prep;return [`Call prep: ${c.name}, ${c.role?c.role+", ":""}${c.firm}`,"","Opener:",p.opener,"","Questions:",...p.questions.map((q,k)=>`${k+1}. ${q}`),"","Avoid:",...p.avoid.map(x=>"- "+x),"","Close:",p.close].join("\n");}

/* why us */
function templateWhy(firm,info,people){
  const m=me();
  const mention=people.filter(c=>c.notes).slice(0,2).map(c=>{
    const s=lastNoteLine(c).split(/[.;]/)[0].trim().replace(/^(said|says|mentioned|told me|explained)\s+(that\s+)?/i,"");
    return `${(c.name||"").split(" ")[0]} told me ${lowerFirst(s)}`;});
  return `A few things draw me to ${firm}. First, the people. ${mention.length?"In my conversations here, "+mention.join(", and ")+". ":"[Name someone you've spoken with and what they told you.] "}Second, ${info.draw?lowerFirst(info.draw.trim().replace(/\.$/,"")):"[what draws you: the group's focus, the size of deals, the office]"}. ${info.deals?"I've also been following "+lowerFirst(info.deals.trim().replace(/\.$/,""))+". ":""}And as a ${m.short} student who built my own path into finance, I want a place where analysts get real responsibility early, which is what I've heard consistently about ${firm}.`;
}
async function draftWhy(f){
  const info=finfo(f.name); whyBusy=true; renderFirms();
  await sampleReady;
  let done=false;
  if(sampleFn){
    const m=me();
    const ppl=f.people.map(c=>`- ${c.name}${c.role?", "+c.role:""}${c.tie?" ("+c.tie+")":""}. Stage: ${c.stage}. Notes: ${c.notes||"none"}`).join("\n");
    try{
      const r=await sampleFn.json(`Help an undergraduate prepare their answer to "Why ${f.name}?" for an investment banking ${info.group?info.group+" ":""}interview. Student: ${m.name}, a ${m.year} at ${m.school} studying ${m.major}, from a school without a big banking pipeline.

Use ONLY the facts below. Do not invent deals, people, offices or facts about the firm. Where something is missing, say so in "gaps".

People they've spoken with at ${f.name}:
${ppl||"none yet"}

What draws them to the firm, in their words: ${info.draw||"not given"}
Deals or facts they know about the firm, in their words: ${info.deals||"not given"}

Write an answer they can say out loud in 45-75 seconds: specific, warm and not generic. Mention one or two people by first name and what they said, and connect it to the student's own story.
Reply with JSON only, in this shape:
{"answer": "the spoken answer", "talking_points": [3 short strings], "ask_interviewer": [3 thoughtful questions to ask an interviewer at this firm, based on the notes], "gaps": [0-3 short strings on what would make the answer stronger]}`,{modelTier:"default"});
      const arr=a=>Array.isArray(a)?a.filter(x=>typeof x==="string").slice(0,3):[];
      if(r&&typeof r.answer==="string"&&r.answer.length>40){Object.assign(info,{whyUs:r.answer,talking:arr(r.talking_points),ask:arr(r.ask_interviewer),gaps:arr(r.gaps),ai:true});done=true;}
    }catch(e){}
  }
  if(!done){Object.assign(info,{whyUs:templateWhy(f.name,info,f.people),talking:[],ask:[],gaps:f.people.some(c=>c.notes)?[]:["Talk to at least one person at the firm, then log the call."],ai:false});toast(sampleFn?"Couldn't reach the AI, so here's a template to edit":"Here's a template built from your notes");}
  info.updated=Date.now(); save(); whyBusy=false; renderFirms();
}
function cheatSheet(f){
  const info=(S.firms||{})[fkey(f.name)]||{};
  const L=[`${f.name}: interview cheat sheet`,[info.stage,info.date&&fmtDay(parseIso(info.date)),info.group].filter(Boolean).join(" · "),"",`WHY ${f.name.toUpperCase()}?`,info.whyUs||"(not written yet)",""];
  if(f.people.length){L.push("PEOPLE TO MENTION");f.people.forEach(c=>L.push(`- ${c.name}${c.role?" ("+c.role+")":""}${c.notes?": "+lastNoteLine(c):""}`));L.push("");}
  if(info.deals)L.push("DEALS AND FACTS",info.deals,"");
  if(info.ask?.length){L.push("QUESTIONS TO ASK");info.ask.forEach(q=>L.push("- "+q));}
  return L.join("\n").trim();
}

/* rendering */
function renderFirms(){
  const root=$("#firmRoot"); if(!root)return;
  const list=firmList();
  if(selFirm&&!list.some(f=>fkey(f.name)===fkey(selFirm)))selFirm=null;
  if(!selFirm&&list.length)selFirm=list[0].name;
  const f=list.find(x=>fkey(x.name)===fkey(selFirm));
  const side=`<aside class="card stack" style="gap:8px"><h3>Your firms</h3>
    ${list.length?`<ul class="flist">${list.map(x=>`<li><button data-firm="${esc(x.name)}" aria-current="${f&&x===f}"><b>${esc(x.name)}</b><span>${x.people.length} ${x.people.length===1?"person":"people"}${x.info.stage?" · "+esc(x.info.stage):""}${x.info.date?" · "+fmtDay(parseIso(x.info.date)):""}</span></button></li>`).join("")}</ul>`:`<p class="hint" style="margin:0">Firms appear here from your networking contacts, or add one below.</p>`}
    <form id="addFirm" class="row" style="flex-wrap:nowrap"><label for="newFirm" class="sr">Firm name</label><input id="newFirm" placeholder="Add a firm" style="min-width:0"><button class="btn sm" type="submit">Add</button></form>
  </aside>`;
  if(!f){root.innerHTML=`<div class="firmgrid">${side}<div class="card empty"><h2>Turn your networking into interview answers</h2><p>Each firm gets a prep page: call prep for every person you talk to, a place to log what they told you, and a "Why us?" answer built from those conversations. Start by adding contacts in Networking, or add a firm on the left.</p><div class="row"><a class="btn primary" href="#network">Go to Networking</a></div></div></div>`;bindFirmSide();return;}
  const info=(S.firms||{})[fkey(f.name)]||{};
  const people=f.people.map(c=>({c,i:S.contacts.indexOf(c)}));
  const hot=["Replied","Call set","Called","Thanked","Referred"];
  const li=a=>(a||[]).map(x=>`<li>${esc(x)}</li>`).join("");
  const personHtml=({c,i})=>`<div class="person">
    <div class="row" style="justify-content:space-between"><div><b>${esc(c.name)}</b>${c.example?'<span class="ex">EXAMPLE</span>':""}<span class="hint"> ${esc(c.role||"")}${c.tie?" · "+esc(c.tie):""}</span></div><span class="stage ${hot.includes(c.stage)?"hot":""}">${esc(c.stage)}</span></div>
    <p class="pnotes">${c.notes?esc(c.notes):'<i class="hint">No notes yet. After your call, log what they told you.</i>'}</p>
    ${justLogged===i?`<div class="logged"><span>Call logged. Send your thank-you today.</span><button class="btn sm primary" data-fp="thanks:${i}">Draft thank-you</button></div>`:""}
    <div class="row"><button class="btn sm" data-fp="prep:${i}" aria-expanded="${prepOpen===i}">${prepOpen===i?"Hide call prep":"Prep for call"}</button><button class="btn sm" data-fp="log:${i}">Log a call</button><button class="linkbtn" data-fp="edit:${i}">Edit</button></div>
    ${prepOpen===i?(prepBusy===i?`<div class="prep thinking"><span class="dot"></span>Writing your call prep...</div>`:c.prep?`<div class="prep">
      <div><span class="eyebrow">Open with</span><p style="margin:4px 0 0">${esc(c.prep.opener)}</p></div>
      <div><span class="eyebrow">Questions to ask</span><ol>${li(c.prep.questions)}</ol></div>
      <div class="grid2"><div><span class="eyebrow">Avoid</span><ul>${li(c.prep.avoid)}</ul></div><div><span class="eyebrow">Close</span><p style="margin:4px 0 0">${esc(c.prep.close)}</p></div></div>
      <div class="row"><button class="btn sm" data-fp="copyprep:${i}">Copy</button><button class="linkbtn" data-fp="regen:${i}">${sampleFn?"Regenerate":"Refresh"}</button>${c.prep.ai?"":`<span class="hint">Template prep${sampleFn?"":". AI prep isn't available in this view"}.</span>`}</div>
    </div>`:""):""}
  </div>`;
  const withNotes=f.people.filter(c=>c.notes).length;
  root.innerHTML=`<div class="firmgrid">${side}<div class="stack">
    <div class="card stack">
      <div class="row" style="justify-content:space-between"><h2>${esc(f.name)}</h2>${info.date?`<span class="hdr-count">${(()=>{const d=Math.round((parseIso(info.date)-today())/DAY);return d<0?"Interview passed":d===0?"Interview today":d+(d===1?" day":" days")+" to interview";})()}</span>`:""}</div>
      <div class="grid3">
        <div><label for="fpStage">Where you are</label><select id="fpStage"><option value="">Not set</option>${FIRM_STAGES.map(s=>`<option ${info.stage===s?"selected":""}>${s}</option>`).join("")}</select></div>
        <div><label for="fpDate">Interview date</label><input id="fpDate" type="date" value="${esc(info.date||"")}"></div>
        <div><label for="fpGroup">Group</label><input id="fpGroup" value="${esc(info.group||"")}" placeholder="Industrials"></div>
      </div>
    </div>
    <div class="card stack">
      <div class="row" style="justify-content:space-between"><h3>People you've spoken with</h3><button class="btn sm" data-fp="addperson">Add person</button></div>
      ${people.length?people.map(personHtml).join(""):`<p class="hint" style="margin:0">No one at ${esc(f.name)} yet. Add the people you plan to reach out to, then prep for each call here.</p>`}
    </div>
    <div class="card stack">
      <div><h3>Why ${esc(f.name)}?</h3><p class="hint" style="margin:2px 0 0">Built from your own call notes, so it names real conversations. ${sampleFn?"The AI only uses what's on this page and won't invent facts about the firm.":"Fill in the boxes and build a draft from your notes."}</p></div>
      <div class="grid2">
        <div><label for="fpDraw">What draws you to ${esc(f.name)}?</label><textarea id="fpDraw" style="min-height:80px" placeholder="Lean deal teams, the Chicago office, the group's healthcare focus...">${esc(info.draw||"")}</textarea></div>
        <div><label for="fpDeals">Deals or facts you know</label><textarea id="fpDeals" style="min-height:80px" placeholder="From the firm's website or recent news. Only what you've actually read.">${esc(info.deals||"")}</textarea></div>
      </div>
      <div class="row"><button class="btn primary" data-fp="draft" ${whyBusy?"disabled":""}>${info.whyUs?"Redraft my answer":"Draft my answer"}</button><span class="hint">${withNotes} conversation${withNotes===1?"":"s"} with notes will be used</span></div>
      ${whyBusy?`<div class="thinking"><span class="dot"></span>Drafting from your notes...</div>`:""}
      <div><label for="fpWhy">Your answer (edit it until it sounds like you)</label><textarea id="fpWhy" placeholder="Draft your answer above, or write it here.">${esc(info.whyUs||"")}</textarea></div>
      ${(info.talking?.length||info.gaps?.length||info.ask?.length)?`<div class="grid3 fb">
        <div><h3>Talking points</h3><ul>${li(info.talking)||"<li>–</li>"}</ul></div>
        <div><h3>Make it stronger</h3><ul>${li(info.gaps)||"<li>Looks solid. Practice it out loud.</li>"}</ul></div>
        <div><h3>Ask your interviewer</h3><ul>${li(info.ask)||"<li>–</li>"}</ul></div></div>`:""}
      <div class="row"><button class="btn" data-fp="mock">Practice in a mock interview</button><button class="btn" data-fp="sim">Run a superday for ${esc(f.name)}</button><button class="btn" data-fp="sheet">Copy cheat sheet</button></div>
      <textarea id="fpCopyBox" readonly hidden style="min-height:160px"></textarea>
    </div>
  </div></div>`;
  bindFirmSide();
  const upd=(k,v)=>{finfo(f.name)[k]=v;fpSave();};
  $("#fpStage").onchange=e=>{upd("stage",e.target.value);save();renderFirms();};
  $("#fpDate").onchange=e=>{upd("date",e.target.value);save();renderFirms();};
  $("#fpGroup").oninput=e=>upd("group",e.target.value.trim());
  $("#fpDraw").oninput=e=>upd("draw",e.target.value);
  $("#fpDeals").oninput=e=>upd("deals",e.target.value);
  $("#fpWhy").oninput=e=>upd("whyUs",e.target.value);
}
function bindFirmSide(){
  $("#addFirm").onsubmit=e=>{e.preventDefault();const v=$("#newFirm").value.trim();if(!v)return;finfo(v).name=v;selFirm=v;prepOpen=null;save();renderFirms();};
}
$("#firmRoot").addEventListener("click",async e=>{
  const fb=e.target.closest("[data-firm]"); if(fb){selFirm=fb.dataset.firm;prepOpen=null;justLogged=null;renderFirms();return;}
  const b=e.target.closest("[data-fp]"); if(!b)return;
  const [act,arg]=b.dataset.fp.split(":"), i=arg!=null?+arg:null, f=firmList().find(x=>fkey(x.name)===fkey(selFirm));
  if(act==="prep"){if(prepOpen===i){prepOpen=null;renderFirms();return;}prepOpen=i;if(!S.contacts[i].prep)generatePrep(i);else renderFirms();}
  else if(act==="regen")generatePrep(i);
  else if(act==="copyprep"){const t=prepText(S.contacts[i]);try{await navigator.clipboard.writeText(t);toast("Call prep copied");}catch(err){const box=$("#fpCopyBox");box.hidden=false;box.value=t;box.select();toast("Select the text and copy it");}}
  else if(act==="log")openLog(i);
  else if(act==="edit")openContact(i);
  else if(act==="addperson"){openContact(null);$("#cFirm").value=f.name;}
  else if(act==="thanks"){justLogged=null;location.hash="#network";renderNetwork();$("#emContact").value=String(i);$("#emType").value="thanks";renderEmail();setTimeout(()=>$("#emOut").scrollIntoView({behavior:"smooth",block:"center"}),50);}
  else if(act==="draft")draftWhy(f);
  else if(act==="mock"){
    const ref=byId("f3"), info=(S.firms||{})[fkey(f.name)]||{};
    setMock({q:`Why ${f.name}?`,t:"Fit",l:"Basic",a:ref.a,notes:[firmNotes(f.name),info.deals?"Deals they know: "+info.deals:""].filter(Boolean).join(" | ")});
    setMockMode("ai"); location.hash="#mock"; setTimeout(()=>$("#mockAnswer").focus(),50);
  }
  else if(act==="sim"){
    if(sim&&sim.stage!=="done"){toast("Finish or end your current simulation first");location.hash="#superday";return;}
    sim=null;persistLive();simPrefill={firm:f.name,group:((S.firms||{})[fkey(f.name)]||{}).group||""};location.hash="#superday";renderSim();
  }
  else if(act==="sheet"){const t=cheatSheet(f);try{await navigator.clipboard.writeText(t);toast("Cheat sheet copied");}catch(err){const box=$("#fpCopyBox");box.hidden=false;box.value=t;box.select();toast("Select the text and copy it");}}
});

/* log a call */
function openLog(i){
  logIdx=i; const c=S.contacts[i];
  $("#logTitle").textContent=`Log your call with ${c.name}`;
  ["lgLearned","lgAdvice","lgNext"].forEach(id=>$("#"+id).value="");$("#lgRef").checked=false;$("#lgDate").value=iso(new Date());
  $("#logDlg").showModal();
}
$("#logForm").addEventListener("submit",e=>{
  e.preventDefault(); const c=S.contacts[logIdx]; if(!c)return;
  const d=$("#lgDate").value||iso(new Date()), learned=$("#lgLearned").value.trim(), advice=$("#lgAdvice").value.trim(), nxt=$("#lgNext").value.trim();
  const parts=[learned,advice&&"Advice: "+advice,nxt&&"Suggested I talk to: "+nxt].filter(Boolean);
  if(parts.length)c.notes=(c.notes?c.notes.trim()+"\n":"")+`Call ${d}: `+parts.map(x=>/[.!?]$/.test(x)?x:x+".").join(" ");
  c.stage=$("#lgRef").checked?"Referred":"Called"; c.last=d; c.next=iso(new Date());
  delete c.example;
  justLogged=logIdx; save(); $("#logDlg").close(); renderNetwork(); renderFirms(); toast("Call logged");
});
$("#lgCancel").onclick=()=>$("#logDlg").close();

/* ---------- Recruiting timeline ---------- */
// Phases are relative to graduation year G. Months are 0-based. The target is the internship the summer after junior year.
const PHASES=[
 {id:"fr",title:"Freshman year",tag:"Build the foundation",from:[-4,7],to:[-3,6],calls:"2–4",
  hiring:["Early insight programs"],
  goal:"Get on banks' radar and build a resume that survives a screen.",
  items:[
   {t:"Join your finance or investment club, and aim for a role by spring."},
   {t:"Take financial accounting (or learn it on your own) and keep your GPA at 3.5 or higher. Many banks screen on it."},
   {t:"Write a one-page resume in the standard banking format."},
   {t:"Apply to freshman and sophomore early insight or diversity programs. Deadlines are often in the winter."},
   {t:"Have 5–10 conversations with alumni in finance to learn how they got in.",go:"network",label:"Open networking"},
   {t:"Get a summer job. Work-ethic stories help with fit questions later."}]},
 {id:"sf",title:"Sophomore fall",tag:"Learn technicals, start networking for real",from:[-3,7],to:[-3,11],calls:"8–12",
  hiring:["Insight programs","A few early applications"],
  goal:"Be interview-ready by January.",
  warn:"At many large banks, applications for the internship the summer after junior year open in the winter of sophomore year. If you wait until spring to network, you'll miss them.",
  items:[
   {t:"Learn accounting, enterprise value and valuation. Drill the core set every day.",go:"drill",label:"Open drill"},
   {t:"Build a target list of 30–50 firms across bulge bracket, middle market and boutiques.",go:"firms",label:"Open firm prep"},
   {t:"Do 2–3 networking calls a week and log every one.",go:"network",label:"Open networking"},
   {t:"Finalize your resume and ask an alum in banking to review it."},
   {t:"Apply to sophomore insight and diversity programs. Some lead to fast-track interviews."},
   {t:"Start searching for a sophomore summer internship: a boutique, PE or VC firm, corporate finance or wealth management."}]},
 {id:"ss",title:"Sophomore spring",tag:"Bulge bracket and elite boutique recruiting",from:[-2,0],to:[-2,4],calls:"8–12",
  hiring:["Bulge bracket","Elite boutique","Some middle market"],
  goal:"Turn networking into interviews.",
  items:[
   {t:"Apply as soon as applications open. Many are reviewed on a rolling basis."},
   {t:"Expect online assessments and recorded video interviews before any live rounds."},
   {t:"Run a superday simulation every week once interviews start.",go:"superday",label:"Open superday sim"},
   {t:"Prepare a \"Why us?\" answer for every firm from your call notes.",go:"firms",label:"Open firm prep"},
   {t:"Keep networking. Ask contacts for a referral once you've built a relationship."},
   {t:"Lock in a sophomore summer internship. For non-target students it often decides junior fall."}]},
 {id:"su",title:"Sophomore summer",tag:"Get relevant experience",from:[-2,5],to:[-2,7],calls:"4–8",
  hiring:["Middle market opening","Regional banks opening"],
  goal:"Come out with real analytical work to talk about.",
  items:[
   {t:"Do your internship well, and ask for analytical work: models, comps, research."},
   {t:"Keep 1–2 networking calls a week, especially with middle-market and regional banks.",go:"network",label:"Open networking"},
   {t:"Keep technicals fresh with drill reviews a few times a week.",go:"drill",label:"Open drill"},
   {t:"Update your resume with concrete results before fall."}]},
 {id:"jf",title:"Junior fall",tag:"Middle-market and regional recruiting",from:[-2,8],to:[-2,11],calls:"6–10",
  hiring:["Middle market","Regional banks","Boutiques","Remaining bulge bracket spots"],
  goal:"Land the junior summer offer.",
  items:[
   {t:"Apply broadly to middle-market and regional banks. Many Midwest offices hire in this window."},
   {t:"Set your superday date in the drill to get a daily study plan.",go:"drill",label:"Open drill"},
   {t:"Run a superday simulation before every real one.",go:"superday",label:"Open superday sim"},
   {t:"Send a thank-you note within 24 hours of every interview.",go:"network",label:"Open email drafter"},
   {t:"If you already have an offer, decide by the deadline. Never renege on an accepted offer."}]},
 {id:"js",title:"Junior spring",tag:"Late recruiting and backup plans",from:[-1,0],to:[-1,4],calls:"6–10",
  hiring:["Boutiques","Late and unfilled spots"],
  goal:"Secure a finance internship either way.",
  items:[
   {t:"Keep applying to boutiques and late openings. Spots open up as other candidates decline."},
   {t:"If you still need an offer, look at related roles: valuation, Big Four transaction services, corporate development, commercial banking, equity research."},
   {t:"Ask your network who's still hiring. This is when referrals matter most.",go:"network",label:"Open networking"},
   {t:"If you have an offer, prepare: Excel shortcuts, basic modeling, and your group's sector."}]},
 {id:"js2",title:"Junior summer",tag:"Earn the return offer",from:[-1,5],to:[-1,7],calls:"",
  hiring:["Return offers"],
  goal:"Turn the internship into a full-time offer.",
  items:[
   {t:"Be reliable and careful. Small mistakes count more than you'd think."},
   {t:"Ask for feedback halfway through the summer, and act on it."},
   {t:"Build relationships across your intern class and the group."},
   {t:"Keep notes on the deals you worked on. You'll talk about them for years."}]},
 {id:"sr",title:"Senior year",tag:"Full-time recruiting if needed",from:[-1,8],to:[0,4],calls:"",
  hiring:["Full-time analyst roles","Off-cycle hiring"],
  goal:"Start as a full-time analyst.",
  items:[
   {t:"If you have a return offer, decide and accept by the deadline."},
   {t:"If not, recruit for full-time roles in the fall using your internship experience.",go:"firms",label:"Open firm prep"},
   {t:"Consider a path in: start in a related role and move into banking after 1–2 years, or do a master's in finance."}]}
];
const MON=["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
let tlOpen=null;
function guessGrad(){
  const n=new Date(), acad=n.getMonth()>=7?n.getFullYear():n.getFullYear()-1, y=(S.settings.year||"").toLowerCase();
  const off={freshman:4,"first":4,sophomore:3,"second":3,junior:2,"third":2,senior:1,"fourth":1};
  for(const k in off)if(y.includes(k))return acad+off[k];
  return null;
}
function phaseDates(p,G){
  const s=new Date(G+p.from[0],p.from[1],1), e=new Date(G+p.to[0],p.to[1]+1,0,23,59);
  return {s,e,label:`${MON[s.getMonth()]} ${s.getFullYear()} – ${MON[e.getMonth()]} ${e.getFullYear()}`};
}
function monthCounts(){
  const ym=iso(new Date()).slice(0,7); let calls=0, touches=0;
  S.contacts.forEach(c=>{calls+=((c.notes||"").match(new RegExp("Call "+ym+"-\\d{2}:","g"))||[]).length;if((c.last||"").startsWith(ym))touches++;});
  return {calls,touches};
}
function renderTimeline(){
  const root=$("#tlRoot"); if(!root)return;
  const G=+S.settings.gradYear||guessGrad();
  const nowY=new Date().getFullYear();
  const opts=[];for(let y=nowY;y<=nowY+5;y++)opts.push(y);
  const picker=`<div class="row"><label for="tlGrad" style="margin:0">Graduation year</label><select id="tlGrad" style="width:auto"><option value="">Choose</option>${opts.map(y=>`<option ${y===G?"selected":""}>${y}</option>`).join("")}</select></div>`;
  const caveat=`<p class="hint" style="margin:0">Timelines shift every year and differ by bank. This is the typical pattern for the internship the summer after junior year, not exact dates. Check each firm's careers page, and ask your contacts what they're seeing.</p>`;
  if(!G){root.innerHTML=`<div class="card stack"><span class="eyebrow">Recruiting timeline</span><h2>When does recruiting happen for you?</h2><p style="margin:0;max-width:62ch">Banks hire for the internship the summer after junior year much earlier than most students expect, often more than a year ahead. Pick your graduation year to see your own timeline and what to do right now.</p>${picker}${caveat}</div>`;bindTl();return;}
  const now=new Date(), ph=PHASES.map(p=>({...p,...phaseDates(p,G)}));
  let cur=ph.findIndex(p=>now>=p.s&&now<=p.e);
  if(cur<0)cur=now<ph[0].s?-1:ph.length;
  // overlaps (sophomore summer ends in Aug, junior fall starts in Sep): pick the first match
  if(tlOpen==null)tlOpen=Math.max(0,Math.min(cur,ph.length-1));
  const checks=S.tlChecks||{};
  const nextBig=ph.find(p=>p.id==="ss"&&now<p.s);
  const monthsTo=d=>Math.max(0,(d.getFullYear()-now.getFullYear())*12+d.getMonth()-now.getMonth());
  const C=monthCounts(), r=readiness();
  const P=ph[cur];
  const summary=cur<0?`<p style="margin:0">Recruiting hasn't started for you yet. Use freshman year to build the foundation below.</p>`
    :cur>=ph.length?`<p style="margin:0">Your recruiting timeline for this internship has passed. If you're still looking, focus on full-time and related roles.</p>`
    :`<div class="tl-now"><div><span class="eyebrow">You are here</span><h2>${P.title}</h2><p style="margin:2px 0 0;color:var(--muted)">${P.tag} · ${P.label}</p></div>
      <div class="tl-stats">
        <div><b>${C.calls}</b><span>Calls logged this month${P.calls?` · aim for ${P.calls}`:""}</span></div>
        <div><b>${C.touches}</b><span>Contacts reached this month</span></div>
        <div><b>${r.score}%</b><span>Superday readiness</span></div>
      </div></div>
      ${nextBig?`<p class="tl-alert">Bulge bracket recruiting for your internship typically opens around <b>${MON[nextBig.s.getMonth()]} ${nextBig.s.getFullYear()}</b>, in about ${monthsTo(nextBig.s)} month${monthsTo(nextBig.s)===1?"":"s"}. Be interview-ready before then.</p>`:""}`;
  root.innerHTML=`<div class="stack">
    <div class="card stack">
      <div class="row" style="justify-content:space-between"><div><span class="eyebrow">Recruiting timeline</span><h3 style="margin-top:2px">Class of ${G} · targeting the summer ${G-1} internship</h3></div>${picker}</div>
      ${summary}
      ${caveat}
    </div>
    <ol class="tl">${ph.map((p,k)=>{
      const st=k<cur?"done":k===cur?"now":"later", done=p.items.filter((_,j)=>checks[p.id+":"+j]).length, open=tlOpen===k;
      return `<li class="tl-item ${st}">
        <span class="tl-dot" aria-hidden="true">${st==="done"?"✓":""}</span>
        <div class="tl-body">
          <button class="tl-head" data-tl="${k}" aria-expanded="${open}">
            <span><b>${p.title}</b> <span class="hint">· ${p.tag}</span></span>
            <span class="tl-meta">${st==="now"?'<span class="stage hot">Now</span>':""}<span class="dates">${p.label}</span><span class="dates">${done}/${p.items.length}</span></span>
          </button>
          ${open?`<div class="tl-detail">
            <div class="chips" style="margin:0">${p.hiring.map(h=>`<span class="chip static">${esc(h)}</span>`).join("")}</div>
            <p style="margin:0"><b>Goal:</b> ${p.goal}</p>
            ${p.warn?`<p class="tl-alert" style="margin:0">${p.warn}</p>`:""}
            <ul class="tl-check">${p.items.map((it,j)=>{const id=p.id+":"+j;return `<li><input type="checkbox" id="tl-${id}" data-chk="${id}" ${checks[id]?"checked":""}><label for="tl-${id}">${it.t}</label>${it.go?`<a class="linkbtn" href="#${it.go}">${it.label}</a>`:""}</li>`;}).join("")}</ul>
          </div>`:""}
        </div></li>`;}).join("")}</ol>
  </div>`;
  bindTl();
}
function bindTl(){
  const g=$("#tlGrad"); if(g)g.onchange=e=>{S.settings.gradYear=e.target.value?+e.target.value:"";tlOpen=null;save();renderTimeline();};
}
$("#tlRoot").addEventListener("click",e=>{const h=e.target.closest("[data-tl]");if(!h)return;const k=+h.dataset.tl;tlOpen=tlOpen===k?-1:k;renderTimeline();});
$("#tlRoot").addEventListener("change",e=>{const c=e.target.closest("[data-chk]");if(!c)return;S.tlChecks=S.tlChecks||{};if(c.checked)S.tlChecks[c.dataset.chk]=true;else delete S.tlChecks[c.dataset.chk];save();
  const li=c.closest(".tl-item"), k=[...li.parentNode.children].indexOf(li), p=PHASES[k];
  li.querySelectorAll(".dates")[1].textContent=`${p.items.filter((_,j)=>S.tlChecks[p.id+":"+j]).length}/${p.items.length}`;});

/* ---------- Your story: "Walk me through your resume" ---------- */
let storyBusy=false, rehearse=null, rehTick=null, pdfBusy=false, rehFeedback="";
const ST=()=>S.story||(S.story={});
const wordsOf=t=>(t||"").trim().split(/\s+/).filter(Boolean).length;
const speakSecs=t=>Math.round(wordsOf(t)/150*60);
const timeClass=(secs,tgt)=>Math.abs(secs-tgt)<=Math.max(10,tgt*.15)?"ok":secs>tgt?"long":"short";
function templateStory(tgt){
  const m=me();
  return {story:`I grew up in [hometown], and I chose ${m.school} because [one honest reason: a scholarship, family, a strong program]. I got interested in finance when [the moment: a class, a family business, investing your own money]. Since then I've tried to build real experience. At [your most relevant experience], I [what you did], which taught me [what you learned]. Then at [your second experience], I [what you did], and that's where I realized I wanted to work on transactions. ${m.short} doesn't have a big banking pipeline, so I've built my own path: [your networking, technical prep and clubs]. That's why I'm here. I want the steep learning curve of investment banking, and [why this firm].`,
    beats:[{label:"Background",cue:"Hometown, why my school",seconds:12},{label:"The spark",cue:"When finance clicked",seconds:14},{label:"Experience 1",cue:"Role, task, lesson",seconds:20},{label:"Experience 2",cue:"Role, task, why deals",seconds:20},{label:"Building my path",cue:"Non-target hustle",seconds:10},{label:"Why banking, why here",cue:"Learning curve, this firm",seconds:14}].map(b=>({...b,seconds:Math.round(b.seconds*tgt/90)})),
    follow_ups:["What did you actually do day to day in your most recent role?","What's the most analytical project on your resume, and what did you find?","Why did you choose your major?","What's one thing on your resume you're most proud of?","Tell me about something on your resume that didn't go to plan.","What would your last manager say you need to work on?"],
    flags:[],ai:false};
}
async function buildStory(){
  const s=ST();
  s.resume=$("#stResume").value.trim(); s.bg=$("#stBg").value.trim(); s.why=$("#stWhy").value.trim(); s.target=+$("#stLen").value||90;
  if(s.resume.length<60){toast("Paste your resume first, or upload the PDF");return;}
  storyBusy=true; save(); renderStory();
  await sampleReady;
  let out=null; const tgt=s.target, words=Math.round(tgt/60*150);
  if(sampleFn){
    const m=me();
    try{
      const r=await sampleFn.json(`You are an investment banking recruiter coaching an undergraduate on the interview question "Walk me through your resume." The student is a ${m.year} at ${m.school}, a school without a big banking pipeline, working toward ${m.target}.

Their resume (pasted text, may be messy):
"""${s.resume.slice(0,6000)}"""

Extra context from the student. Where they're from and why they chose their school: ${s.bg||"not given"}. How they got interested in finance: ${s.why||"not given"}.

Write a ${tgt}-second spoken answer (about ${words} words) in the first person. Tell it as a story, not a list: 1) brief background, 2) what sparked their interest in finance, 3) two or three experiences from the resume and what each taught them, 4) why investment banking, now. Use ONLY facts from the resume and context. Never invent employers, numbers, titles or achievements. Where a part needs a fact you don't have, write a short placeholder in square brackets, like [one sentence on why you chose your school].

Reply with JSON only, in this shape:
{"story": "the full spoken answer", "beats": [{"label": "short name for this part", "cue": "a 3-6 word memory cue", "seconds": number}], "follow_ups": [6 specific questions an interviewer is likely to ask about items on this resume], "flags": [{"issue": "something on the resume an interviewer may probe, such as a gap, a short job, a low GPA, an unrelated major or a vague bullet", "framing": "one sentence on how to address it"}]}`,{modelTier:"default"});
      const strs=(a,n)=>Array.isArray(a)?a.filter(x=>typeof x==="string").slice(0,n):[];
      if(r&&typeof r.story==="string"&&r.story.length>150){
        const beats=(Array.isArray(r.beats)?r.beats:[]).filter(b=>b&&b.label).slice(0,7).map(b=>({label:String(b.label),cue:String(b.cue||""),seconds:Math.max(3,Math.round(+b.seconds||10))}));
        const flags=(Array.isArray(r.flags)?r.flags:[]).filter(f=>f&&f.issue).slice(0,4).map(f=>({issue:String(f.issue),framing:String(f.framing||"")}));
        out={story:r.story,beats:beats.length?beats:templateStory(tgt).beats,follow_ups:strs(r.follow_ups,8),flags,ai:true};
      }
    }catch(e){}
  }
  if(!out){out=templateStory(tgt);toast(sampleFn?"Couldn't reach the AI, so here's a template to fill in":"Here's a template to fill in from your resume");}
  Object.assign(s,out,{built:Date.now()}); storyBusy=false; save(); renderStory();
}
function loadScript(src){return new Promise((res,rej)=>{const el=document.createElement("script");el.src=src;el.onload=res;el.onerror=rej;document.head.appendChild(el);});}
async function readPdf(file){
  const base="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/";
  if(!window.pdfjsLib){await loadScript(base+"pdf.worker.min.js");await loadScript(base+"pdf.min.js");} // worker in the page itself: no separate worker file needed
  const pdf=await pdfjsLib.getDocument({data:new Uint8Array(await file.arrayBuffer())}).promise;
  const lines=[];
  for(let p=1;p<=Math.min(pdf.numPages,4);p++){
    const tc=await (await pdf.getPage(p)).getTextContent(); let lastY=null, line="";
    tc.items.forEach(it=>{const y=Math.round(it.transform[5]);if(lastY!==null&&Math.abs(y-lastY)>2){lines.push(line);line="";}line+=it.str+" ";lastY=y;});
    lines.push(line);
  }
  return lines.map(l=>l.replace(/\s+/g," ").trim()).filter(Boolean).join("\n");
}
function practiceInMock(q,full){
  const s=ST();
  const ctx=`Resume: ${(s.resume||"").slice(0,2500)}${full&&s.story?" | The story they prepared: "+s.story.slice(0,1500):""}`;
  setMock({q,t:"Fit",l:full?"Basic":"Intermediate",a:full?byId("f1").a:"",notes:ctx,
    notesLabel:full?"The candidate's resume and the story they prepared (judge whether the answer is a clear, specific story consistent with the resume; it does not need to match the prepared text word for word)":"The candidate's resume (judge whether the answer is specific and consistent with it)"});
  setMockMode("ai"); location.hash="#mock"; setTimeout(()=>$("#mockAnswer").focus(),50);
}
function renderStory(){
  const root=$("#storyRoot"); if(!root)return;
  clearInterval(rehTick);
  const s=ST(), tgt=s.target||90, secs=speakSecs(s.story), blanks=((s.story||"").match(/\[[^\]]+\]/g)||[]).length;
  const tc=s.story?timeClass(secs,tgt):"";
  const att=(s.rehearsals||[]).slice(0,8);
  const beatsHtml=(s.beats||[]).map(b=>`<div class="beat" style="flex-grow:${b.seconds}"><span class="eyebrow">${esc(b.label)} · ${b.seconds}s</span><b>${esc(b.cue)}</b></div>`).join("");
  let reh;
  if(rehearse){
    reh=`<div class="reh"><span class="reh-timer" id="rehT">0:00</span><span class="hint">Target ${fmtT(tgt)} · say it out loud, start to finish</span>
      <ol class="cues">${(s.beats||[]).map(b=>`<li><small>${esc(b.label)}</small>${esc(b.cue)}</li>`).join("")}</ol>
      <div class="row"><button class="btn primary" data-st="rehdone">Done</button><button class="btn" data-st="rehcancel">Cancel</button></div></div>`;
  }else{
    reh=`<div class="row"><button class="btn primary" data-st="reh" ${s.story?"":"disabled"}>Start a timed run-through</button>${rehFeedback?`<span class="hint" style="color:var(--ink)">${esc(rehFeedback)}</span>`:""}</div>
      ${att.length?`<div><span class="eyebrow">Recent run-throughs</span><div class="attempts">${att.map(a=>`<span class="${timeClass(a.secs,a.tgt||tgt)==="ok"?"ok":"off"}">${fmtT(a.secs)}</span>`).join("")}</div></div>`:""}`;
  }
  root.innerHTML=`<div class="stack">
    <div class="card stack">
      <div><span class="eyebrow">Your story</span><h2 style="margin-top:4px">"Walk me through your resume"</h2>
      <p class="hint" style="margin:6px 0 0;max-width:64ch">Almost every interview opens with this, and it sets the tone for everything after. Paste your resume, add two things a resume can't show, and get a story you can rehearse. Your resume is saved only to your account.</p></div>
      <div><div class="row" style="justify-content:space-between;margin-bottom:4px"><label for="stResume" style="margin:0">Resume text</label><span class="row"><button class="btn sm" data-st="pdf" ${pdfBusy?"disabled":""}>${pdfBusy?"Reading PDF...":"Upload PDF"}</button><input type="file" id="stPdf" accept="application/pdf,.pdf" hidden></span></div>
        <textarea id="stResume" style="min-height:170px" placeholder="Paste your resume here, or upload the PDF.">${esc(s.resume||"")}</textarea></div>
      <div class="grid2">
        <div><label for="stBg">Where you're from, and why you chose your school</label><input id="stBg" value="${esc(s.bg||"")}" placeholder="Grew up outside Kansas City; in-state scholarship"></div>
        <div><label for="stWhy">How you got interested in finance</label><input id="stWhy" value="${esc(s.why||"")}" placeholder="Helped with my parents' small business books in high school"></div>
      </div>
      <div class="row"><label for="stLen" class="sr">Length</label><select id="stLen" style="width:auto">${[[60,"60 seconds"],[90,"90 seconds"],[120,"2 minutes"]].map(([v,l])=>`<option value="${v}" ${v===tgt?"selected":""}>${l}</option>`).join("")}</select>
        <button class="btn primary" data-st="build" ${storyBusy?"disabled":""}>${s.story?"Rebuild my story":"Build my story"}</button>${s.story?`<span class="hint">Rebuilding replaces your edits.</span>`:""}</div>
      ${storyBusy?`<div class="thinking"><span class="dot"></span>Turning your resume into a story...</div>`:""}
    </div>
    ${s.story?`<div class="card stack">
      <div class="row" style="justify-content:space-between"><h3>Your ${tgt===120?"2-minute":tgt+"-second"} story</h3><span class="stime ${tc}" id="stTime">${wordsOf(s.story)} words · about ${fmtT(secs)} spoken</span></div>
      <div class="beats">${beatsHtml}</div>
      <label for="stStory" class="sr">Your story</label><textarea id="stStory" style="min-height:230px">${esc(s.story)}</textarea>
      ${blanks?`<p class="tl-alert" style="background:var(--bg)">Fill in the ${blanks} [bracketed] part${blanks>1?"s":""} with your own details before you rehearse.</p>`:""}
      <div class="row"><button class="btn" data-st="copy">Copy</button><span class="hint">Edit until it sounds like you talking, not like your resume.${s.ai?"":" This is a template; fill it in from your resume."}</span></div>
    </div>
    <div class="card stack"><div><h3>Rehearse out loud</h3><p class="hint" style="margin:2px 0 0">Say it out loud using only the cues, and stop the clock when you finish. Aim for ${fmtT(tgt)}, give or take ${Math.max(10,Math.round(tgt*.15))} seconds.</p></div>${reh}</div>
    <div class="card stack">
      <div class="row" style="justify-content:space-between"><h3>Questions they'll ask about your resume</h3><button class="btn primary sm" data-st="mockfull">Practice the full walk-through</button></div>
      ${(s.follow_ups||[]).length?`<ul class="hooks">${s.follow_ups.map((q,i)=>`<li><span>${esc(q)}</span><button class="btn sm" data-st="mock:${i}">Practice</button></li>`).join("")}</ul>`:""}
      ${(s.flags||[]).length?`<div><h3 style="margin-bottom:6px">Be ready to explain</h3><ul class="flags">${s.flags.map(f=>`<li><b>${esc(f.issue)}</b><span>${esc(f.framing)}</span></li>`).join("")}</ul></div>`:""}
      <p class="hint" style="margin:0">Practice opens the mock interviewer with your resume attached, so the grade reflects your real experience. The superday simulation uses your resume for its opening question too.</p>
    </div>`:""}
  </div>`;
  const s2=ST();
  $("#stResume").oninput=e=>{s2.resume=e.target.value;fpSave();};
  $("#stBg").oninput=e=>{s2.bg=e.target.value;fpSave();};
  $("#stWhy").oninput=e=>{s2.why=e.target.value;fpSave();};
  $("#stPdf").onchange=async e=>{const f=e.target.files[0];if(!f)return;pdfBusy=true;renderStory();
    try{const t=await readPdf(f);if(t.length<40)throw new Error("empty");s2.resume=t;save();toast("Resume loaded. Check the text, then build your story");}
    catch(err){toast("Couldn't read that PDF. Paste the text instead");}
    pdfBusy=false;renderStory();};
  const ta=$("#stStory");
  if(ta)ta.oninput=e=>{s2.story=e.target.value;fpSave();const sec=speakSecs(s2.story),el=$("#stTime");el.textContent=`${wordsOf(s2.story)} words · about ${fmtT(sec)} spoken`;el.className="stime "+timeClass(sec,s2.target||90);};
  if(rehearse)rehTick=setInterval(()=>{const t=$("#rehT");if(!t)return clearInterval(rehTick);t.textContent=fmtT((Date.now()-rehearse.start)/1000);},250);
}
$("#storyRoot").addEventListener("click",async e=>{
  const b=e.target.closest("[data-st]"); if(!b)return;
  const [act,arg]=b.dataset.st.split(":"), s=ST();
  if(act==="build")buildStory();
  else if(act==="pdf")$("#stPdf").click();
  else if(act==="copy"){try{await navigator.clipboard.writeText(s.story);toast("Story copied");}catch(err){$("#stStory").select();toast("Select the text and copy it");}}
  else if(act==="reh"){rehearse={start:Date.now()};rehFeedback="";renderStory();}
  else if(act==="rehcancel"){rehearse=null;renderStory();}
  else if(act==="rehdone"){
    const secs=Math.round((Date.now()-rehearse.start)/1000), tgt=s.target||90; rehearse=null;
    if(secs>=10){s.rehearsals=[{at:Date.now(),secs,tgt},...(s.rehearsals||[])].slice(0,20);save();}
    const d=secs-tgt, c=timeClass(secs,tgt);
    rehFeedback=secs<10?"That was under 10 seconds, so it wasn't saved.":c==="ok"?`${fmtT(secs)}. Right on time.`:c==="long"?`${fmtT(secs)}, about ${d} seconds long. Cut the weakest beat or shorten the experiences.`:`${fmtT(secs)}, about ${-d} seconds short. Add one concrete detail to an experience.`;
    renderStory();
  }
  else if(act==="mockfull")practiceInMock("Walk me through your resume.",true);
  else if(act==="mock")practiceInMock(s.follow_ups[+arg],false);
});

/* ---------- Peer mock: practice with a friend ---------- */
const PEER_LS="superday-peer-live";
let mockMode="ai", P=null, peerTick=null, peerQuit=false;
try{mockMode=localStorage.getItem("superday-mockmode")==="peer"?"peer":"ai";}catch(e){}
try{const raw=localStorage.getItem(PEER_LS);if(raw){const x=JSON.parse(raw);if(x&&Date.now()-x.started<12*36e5)P=x;}}catch(e){}
function peerPersist(){try{if(P)localStorage.setItem(PEER_LS,JSON.stringify(P));else localStorage.removeItem(PEER_LS);}catch(e){}}
const RUBRIC=[
  {k:"acc",name:"Accuracy",fitName:"Substance",tip:"Right answer, right direction, no errors",fitTip:"Specific, believable, a real example"},
  {k:"str",name:"Structure",tip:"Headline first, then logical steps"},
  {k:"del",name:"Delivery",tip:"Confident and concise, no rambling"}];
const FOLLOWUPS={
  "Accounting":["Now do it again at a 40% tax rate.","What if it were funded with debt instead of cash?","What happens in year two?","Where does that show up on the balance sheet exactly?"],
  "Enterprise Value":["What if the company also had $50 of preferred stock?","How would your answer change if the cash were trapped overseas?","What happens to equity value in that case?"],
  "Valuation":["Which method would you weight most here, and why?","What would make that multiple too high?","How would you value it if it were private?"],
  "DCF":["What happens to the value if WACC rises by 1%?","How would you sanity-check the terminal value?","Why unlevered free cash flow and not levered?"],
  "LBO":["What if the exit multiple were 2 turns lower?","Roughly what IRR is that?","Which return driver matters most in your example?"],
  "M&A":["What if the deal were funded with debt at 7% instead?","Why might an accretive deal still be a bad idea?","How many synergies would make it break even?"],
  "Brain Teasers":["Walk me through how you got there.","How would you check that answer?","What assumption matters most?"],
  "Fit":["Can you give me a specific example?","What would you do differently now?","What did that teach you about yourself?","Why does that matter for banking?"]};
function keyPoints(html){
  const lis=[...String(html||"").matchAll(/<li>([\s\S]*?)<\/li>/g)].map(m=>stripTags(m[1]));
  if(lis.length)return lis.slice(0,5);
  return stripTags(html).split(/(?<=[.!?])\s+(?=[A-Z])/).filter(x=>x.length>12).slice(0,4);
}
function peerPick(o){
  const used=new Set(), out=[];
  const base=o.diff==="hard"?BANK.filter(b=>b.l!=="Basic"||b.t==="Fit"):BANK.filter(b=>CORE.has(b.id));
  const TECH=["Accounting","Enterprise Value","Valuation","DCF","LBO","M&A"];
  const seqs={tech:["tech","tech","tech","teaser","tech","tech","tech","tech","teaser","tech"],
    fit:["resume","fit","fit","fit","teaser","fit","fit","fit","fit","fit"],
    mixed:["resume","tech","fit","tech","tech","teaser","fit","tech","tech","fit"]};
  const techOrder=shuffleArr(TECH); let ti=0;
  seqs[o.mix].slice(0,o.n).forEach(kind=>{
    let pool;
    if(kind==="resume")pool=[byId("f1")];
    else if(kind==="fit")pool=base.filter(b=>b.t==="Fit"&&b.id!=="f1"&&b.id!=="f34");
    else if(kind==="teaser")pool=base.filter(b=>b.t==="Brain Teasers");
    else{const t=techOrder[ti++%techOrder.length];pool=base.filter(b=>b.t===t);}
    pool=pool.filter(b=>b&&!used.has(b.id)); if(!pool.length)pool=BANK.filter(b=>!used.has(b.id)&&(kind==="tech"?TECH.includes(b.t):true));
    const b=pool[Math.floor(Math.random()*pool.length)]; used.add(b.id);
    const fu=FOLLOWUPS[b.t]||FOLLOWUPS.Fit;
    out.push({id:b.id,q:b.q,t:b.t,l:b.l,a:b.a,points:keyPoints(b.a),hit:[],scores:{},notes:"",secs:0,fu:fu[Math.floor(Math.random()*fu.length)]});
  });
  return out;
}
function shuffleArr(a){a=[...a];for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;}
const itemScore=it=>{const v=RUBRIC.map(r=>it.scores[r.k]).filter(x=>x);return v.length===3?v.reduce((a,b)=>a+b,0)/3*2:null;};
function startPeer(o){
  P={...o,stage:"q",i:0,started:Date.now(),qStart:Date.now(),items:peerPick(o),strength:"",fix:""};
  peerQuit=false; peerPersist(); renderPeer(); scrollTo({top:0});
}
function peerNext(skip){
  const it=P.items[P.i]; it.secs=Math.round((Date.now()-P.qStart)/1000); if(skip)it.skipped=true;
  if(P.i+1<P.items.length){P.i++;P.qStart=Date.now();}else finishPeer();
  peerPersist(); renderPeer(); scrollTo({top:0});
}
function finishPeer(){
  P.items=P.items.filter((it,k)=>k<=P.i);
  P.stage="done"; P.ended=Date.now();
  const sc=P.items.map(itemScore).filter(x=>x!=null);
  P.overall=sc.length?sc.reduce((a,b)=>a+b,0)/sc.length:null;
  if(P.overall!=null){S.peerHist=[{at:Date.now(),cand:P.cand||"",me:P.me||"",overall:P.overall,n:sc.length,mix:P.mix},...(S.peerHist||[])].slice(0,20);save();}
}
const peerVerdict=o=>o==null?"Not scored":o>=7.5?"Would advance":o>=6?"Borderline":"Not yet";
function peerScorecardText(){
  const L=[`Peer mock interview${P.cand?" for "+P.cand:""}${P.me?" (interviewer: "+P.me+")":""}`,`Result: ${peerVerdict(P.overall)}${P.overall!=null?" · "+P.overall.toFixed(1)+"/10":""}`];
  RUBRIC.forEach(r=>{const v=P.items.map(it=>it.scores[r.k]).filter(Boolean);if(v.length)L.push(`${r.name}: ${(v.reduce((a,b)=>a+b,0)/v.length).toFixed(1)}/5`);});
  if(P.strength)L.push("","Biggest strength: "+P.strength);
  if(P.fix)L.push("Fix first: "+P.fix);
  L.push("","Question by question:");
  P.items.forEach((it,k)=>{const s=itemScore(it);L.push(`${k+1}. ${it.q} ${it.skipped?"(skipped)":s!=null?"· "+s.toFixed(1)+"/10":""}`);if(it.notes)L.push("   Note: "+it.notes);});
  L.push("","Practiced with Superday Prep");
  return L.join("\n");
}
function renderPeer(){
  const root=$("#peerRoot"); if(!root)return;
  clearInterval(peerTick);
  if(!P){
    const hist=S.peerHist||[];
    root.innerHTML=`<div class="split">
      <form class="card stack" id="peerForm">
        <div><span class="eyebrow">Practice with a friend</span><h2 style="margin-top:4px">Run a peer mock interview</h2>
        <p class="hint" style="margin:6px 0 0;max-width:62ch">Only the interviewer needs this screen, in person or on a video call. You get each question to read aloud, what a strong answer includes, a follow-up to ask and a simple rubric. At the end there's a scorecard to send. Then swap roles.</p></div>
        <div class="grid2">
          <div><label for="pMe">Interviewer (you)</label><input id="pMe" value="${esc(S.settings.name||"")}" placeholder="Your name"></div>
          <div><label for="pCand">Candidate</label><input id="pCand" placeholder="Your friend's name"></div>
        </div>
        <fieldset class="choice c3"><legend>Questions</legend>
          <label><input type="radio" name="pMix" value="mixed" checked><b>Mixed</b><span>Like a real interview</span></label>
          <label><input type="radio" name="pMix" value="tech"><b>Technical</b><span>Plus a brain teaser</span></label>
          <label><input type="radio" name="pMix" value="fit"><b>Fit</b><span>Stories and judgment</span></label>
        </fieldset>
        <div class="grid2">
          <fieldset class="choice"><legend>Difficulty</legend>
            <label><input type="radio" name="pDiff" value="core" checked><b>Core</b><span>Most-asked questions</span></label>
            <label><input type="radio" name="pDiff" value="hard"><b>Harder</b><span>Bulge bracket level</span></label>
          </fieldset>
          <div><label for="pN">Length</label><select id="pN"><option value="5">5 questions · about 15 min</option><option value="8" selected>8 questions · about 25 min</option><option value="10">10 questions · about 30 min</option></select></div>
        </div>
        <div class="row"><button class="btn primary" type="submit">Start interviewing</button></div>
      </form>
      <aside class="card stack" style="gap:10px">
        <h3>How to be a good mock interviewer</h3>
        <ul class="tips">
          <li><b>Don't help.</b> Let silence sit for 5 seconds before moving on.</li>
          <li><b>Always ask the follow-up</b>, even after a good answer. That's where real interviews separate people.</li>
          <li><b>Score honestly.</b> A generous 9 now is a surprise at the superday.</li>
          <li><b>Write one specific note</b> per question: what to keep and what to fix.</li>
        </ul>
        ${hist.length?`<div><span class="eyebrow">Past peer sessions</span><ul class="hist" style="margin-top:6px">${hist.slice(0,6).map(h=>`<li><b>${h.overall.toFixed(1)}</b><span>${esc(h.cand||"Candidate")}${h.me?" · interviewed by "+esc(h.me):""}<br><span class="hint">${new Date(h.at).toLocaleDateString(undefined,{month:"short",day:"numeric"})} · ${h.n} questions</span></span></li>`).join("")}</ul></div>`:""}
      </aside>
    </div>`;
    $("#peerForm").onsubmit=e=>{e.preventDefault();const f=e.target;startPeer({me:$("#pMe").value.trim(),cand:$("#pCand").value.trim(),mix:f.pMix.value,diff:f.pDiff.value,n:+$("#pN").value});};
    return;
  }
  if(P.stage==="q"){
    const it=P.items[P.i], sec=sectionOf(it.t), fitQ=it.t==="Fit";
    const target=TARGET[sec];
    const allScored=RUBRIC.every(r=>it.scores[r.k]);
    root.innerHTML=`<div class="sim-head">
        <div class="stack" style="gap:6px"><span class="eyebrow">${esc(P.cand||"Candidate")} · question ${P.i+1} of ${P.items.length}</span><div class="dots">${P.items.map((x,k)=>`<i class="${k<P.i?"done":k===P.i?"now":""}"></i>`).join("")}</div></div>
        <div class="row"><span class="timer">This question <b id="pQ">0:00</b></span><button class="btn" id="pQuit">${peerQuit?"Click again to end":"End early"}</button></div>
      </div>
      <div class="peer-grid">
        <div class="stack">
          <div class="card stack">
            <div class="qmeta"><span class="eyebrow">Read aloud</span><span class="eyebrow">${SECTION_NAME[sec]}${sec==="tech"?" · "+esc(it.t):""}</span><span class="hint">aim for about ${target>=120?"2 min":"90 sec"}</span></div>
            <p class="q" style="margin:0;font-size:1.45rem">${esc(it.q)}</p>
          </div>
          <div class="card stack">
            <h3>What a strong answer includes</h3><p class="hint" style="margin:-6px 0 0">Tick each point as they say it.</p>
            <ul class="tl-check">${it.points.map((p,j)=>`<li><input type="checkbox" id="pp${j}" data-pt="${j}" ${it.hit.includes(j)?"checked":""}><label for="pp${j}">${esc(p)}</label></li>`).join("")}</ul>
            <details class="qa" style="border:0;padding:0"><summary><span></span><span class="linkbtn">Show the full model answer</span><span></span></summary><div class="model" style="margin-top:8px">${it.a}</div></details>
          </div>
          <div class="card stack" style="gap:6px">
            <span class="eyebrow">Then ask the follow-up</span>
            <p style="margin:0;font-weight:500;font-size:1.05rem">${esc(it.fu)}</p>
            <button class="linkbtn" id="pFu" style="align-self:flex-start">Different follow-up</button>
          </div>
        </div>
        <div class="card stack">
          <h3>Score this answer</h3>
          ${RUBRIC.map(r=>`<div class="rub"><div><b>${fitQ&&r.fitName?r.fitName:r.name}</b><span class="hint">${fitQ&&r.fitTip?r.fitTip:r.tip}</span></div>
            <div class="r5" role="group" aria-label="${r.name} score">${[1,2,3,4,5].map(v=>`<button data-rk="${r.k}" data-rv="${v}" aria-pressed="${it.scores[r.k]===v}">${v}</button>`).join("")}</div></div>`).join("")}
          <p class="hint" style="margin:0">1 = missed it · 3 = acceptable · 5 = would impress a VP</p>
          <div><label for="pNotes">One note for ${esc(P.cand||"the candidate")}</label><textarea id="pNotes" style="min-height:90px" placeholder="Keep the headline-first start. You forgot the tax effect on cash.">${esc(it.notes)}</textarea></div>
          <div class="row"><button class="btn primary" id="pNext" ${allScored?"":"disabled"}>${P.i+1<P.items.length?"Next question":"Finish and see scorecard"}</button><button class="btn" id="pSkip">Skip</button></div>
          ${allScored?"":`<p class="hint" style="margin:0">Score all three to continue.</p>`}
        </div>
      </div>`;
    root.querySelectorAll("[data-pt]").forEach(c=>c.onchange=()=>{const j=+c.dataset.pt;it.hit=c.checked?[...new Set([...it.hit,j])]:it.hit.filter(x=>x!==j);peerPersist();});
    root.querySelectorAll("[data-rk]").forEach(b=>b.onclick=()=>{it.scores[b.dataset.rk]=+b.dataset.rv;it.notes=$("#pNotes").value;peerPersist();renderPeer();});
    $("#pNotes").oninput=e=>{it.notes=e.target.value;peerPersist();};
    $("#pFu").onclick=()=>{const l=(FOLLOWUPS[it.t]||FOLLOWUPS.Fit).filter(x=>x!==it.fu);it.fu=l[Math.floor(Math.random()*l.length)];peerPersist();renderPeer();};
    $("#pNext").onclick=()=>{it.notes=$("#pNotes").value;peerNext(false);};
    $("#pSkip").onclick=()=>{it.notes=$("#pNotes").value;it.scores={};peerNext(true);};
    $("#pQuit").onclick=()=>{if(!peerQuit){peerQuit=true;$("#pQuit").textContent="Click again to end";return;}peerQuit=false;it.notes=$("#pNotes").value;it.secs=Math.round((Date.now()-P.qStart)/1000);
      if(!RUBRIC.every(r=>it.scores[r.k])){P.i--;}finishPeer();peerPersist();renderPeer();};
    peerTick=setInterval(()=>{const q=$("#pQ");if(!q)return clearInterval(peerTick);const s=(Date.now()-P.qStart)/1000;q.textContent=fmtT(s);q.classList.toggle("over",s>target*1.5);},1000);
    return;
  }
  // scorecard
  const o=P.overall, v=peerVerdict(o), vcls={"Would advance":"v-Strong","Borderline":"v-Borderline","Not yet":"v-Fail","Not scored":"v-Pass"}[v];
  const dim=r=>{const vals=P.items.map(it=>it.scores[r.k]).filter(Boolean);return vals.length?vals.reduce((a,b)=>a+b,0)/vals.length:null;};
  const mins=Math.max(1,Math.round((P.ended-P.started)/6e4));
  root.innerHTML=`<div class="stack">
    <div class="card stack">
      <span class="eyebrow">Peer mock scorecard${P.cand?" · "+esc(P.cand):""}</span>
      <div class="sc-top"><div class="score"><b>${o!=null?o.toFixed(1):"–"}<small>/10</small></b><span class="verdict ${vcls}">${v}</span></div>
        <p class="hint" style="margin:0">${P.items.length} questions in ${mins} min${P.me?" · interviewed by "+esc(P.me):""}</p></div>
      <div class="secbars">${RUBRIC.map(r=>{const d=dim(r);return d==null?"":`<div class="secrow"><span>${r.name}</span><div class="bar" style="max-width:none;margin:0"><i style="width:${d*20}%"></i></div><b>${d.toFixed(1)}</b></div>`;}).join("")}</div>
      <p class="hint" style="margin:-4px 0 0">Rubric averages out of 5.</p>
      <div class="grid2">
        <div><label for="pStrength">Biggest strength</label><textarea id="pStrength" style="min-height:70px" placeholder="Clear structure on technicals; confident resume story.">${esc(P.strength)}</textarea></div>
        <div><label for="pFix">Fix first</label><textarea id="pFix" style="min-height:70px" placeholder="Cash flow effects in the accounting walk-throughs.">${esc(P.fix)}</textarea></div>
      </div>
      <div class="row"><button class="btn primary" id="pCopy">Copy scorecard to send</button><button class="btn" id="pSwap">Swap roles</button><button class="btn" id="pNew">New session</button></div>
      <textarea id="pCopyBox" readonly hidden style="min-height:180px"></textarea>
      ${o!=null&&!P.counted?`<label style="display:flex;gap:8px;align-items:center;font-weight:500;color:var(--ink);font-size:.9rem;margin:0"><input type="checkbox" id="pMine" style="width:auto"> I was the candidate. Count these scores toward my readiness.</label>`:P.counted?`<p class="hint" style="margin:0">Counted toward your readiness score.</p>`:""}
    </div>
    <div class="card stack" style="gap:8px"><h3>Question by question</h3>
      ${P.items.map((it,k)=>{const s=itemScore(it);return `<details class="qa"><summary><span class="qs ${s==null?"":s>=8?"hi":s>=5?"mid":"lo"}">${s==null?"–":s.toFixed(0)}</span><span>${esc(it.q)}</span><span class="hint">${fmtT(it.secs)}</span></summary>
        <div class="qa-body">
          ${it.skipped?`<p class="hint" style="margin:0">Skipped</p>`:`<div class="hint">${RUBRIC.map(r=>`${r.name} ${it.scores[r.k]||"–"}/5`).join(" · ")} · hit ${it.hit.length} of ${it.points.length} key points</div>`}
          ${it.notes?`<div><span class="eyebrow">Interviewer's note</span><p class="mine">${esc(it.notes)}</p></div>`:""}
          <div><span class="eyebrow">Model answer</span><div class="model">${it.a}</div></div>
        </div></details>`;}).join("")}
    </div>
  </div>`;
  $("#pStrength").oninput=e=>{P.strength=e.target.value;peerPersist();};
  $("#pFix").oninput=e=>{P.fix=e.target.value;peerPersist();};
  $("#pCopy").onclick=async()=>{const t=peerScorecardText();try{await navigator.clipboard.writeText(t);toast("Scorecard copied");}catch(err){const b=$("#pCopyBox");b.hidden=false;b.value=t;b.select();toast("Select the text and copy it");}};
  $("#pSwap").onclick=()=>startPeer({me:P.cand,cand:P.me,mix:P.mix,diff:P.diff,n:P.items.length||8});
  $("#pNew").onclick=()=>{P=null;peerPersist();renderPeer();};
  const mine=$("#pMine");
  if(mine)mine.onchange=()=>{if(!mine.checked)return;
    P.items.forEach(it=>{const s=itemScore(it);if(s!=null){S.mockHist.unshift({q:it.q,t:it.t,score:Math.round(s),at:Date.now(),peer:true});if(it.id)grade(it.id,s>=8?2:s>=5?1:0,"mock");}});
    S.mockHist=S.mockHist.slice(0,40);P.counted=true;save();peerPersist();renderHist();renderPeer();toast("Added to your readiness");};
}
function setMockMode(m){
  mockMode=m; try{localStorage.setItem("superday-mockmode",m);}catch(e){}
  $("#mockAI").hidden=m!=="ai"; $("#peerRoot").hidden=m!=="peer";
  document.querySelectorAll("[data-mm]").forEach(b=>b.setAttribute("aria-pressed",String(b.dataset.mm===m)));
  if(m==="peer")renderPeer();
}
document.querySelectorAll("[data-mm]").forEach(b=>b.onclick=()=>setMockMode(b.dataset.mm));

/* ---------- Finance club leaderboard ---------- */
const APP_URL=location.origin;
const POINTS={review:1,sim:25,peer:15,call:10};
const BOARD_SORTS=[["points","Points this week"],["readiness","Readiness"],["streak","Streak"],["learned","Cards learned"],["bestSim","Best superday"]];
let boardDb=null, boardUser=null, myId=null, isOwnerView=false, canWrite=null, boardUnsub=null, subscribedCode=null;
let boardRows=[], boardState="loading", boardSort="points", lastPush="", pushT=null, profilesCache={}, profilesKey="", leaveArmed=false;
function weekStart(d=new Date()){const x=new Date(d);x.setHours(0,0,0,0);x.setDate(x.getDate()-(x.getDay()+6)%7);return x;}
const weekKey=()=>iso(weekStart());
function myStats(){
  const ws=weekStart().getTime();
  const reviews=Object.entries(S.reviewLog||{}).filter(([d])=>parseIso(d).getTime()>=ws).reduce((a,[,n])=>a+n,0);
  const sims=(S.simHist||[]).filter(h=>h.at>=ws).length, peers=(S.peerHist||[]).filter(h=>h.at>=ws).length;
  let calls=0; S.contacts.forEach(c=>{for(const m of (c.notes||"").matchAll(/Call (\d{4}-\d{2}-\d{2}):/g))if(parseIso(m[1]).getTime()>=ws)calls++;});
  const best=Math.max(0,...(S.simHist||[]).map(h=>h.overall||0));
  return {week:weekKey(),reviews,sims,peers,calls,points:reviews*POINTS.review+sims*POINTS.sim+peers*POINTS.peer+calls*POINTS.call,
    readiness:readiness().score,learned:Object.values(S.cards).filter(c=>c.reps>=2).length,streak:streak(),bestSim:Math.round(best*10)/10};
}
async function initBoard(){
  try{
    if(!window.claude?.use)throw 0;
    const [db,user]=await Promise.all([claude.use("db"),claude.use("user")]);
    if(!db||!user)throw 0;
    myId=await user.id(); if(!myId)throw 0;
    boardDb=db; boardUser=user;
    canWrite=await user.can("data.write"); isOwnerView=await user.isOwner();
    boardState=S.settings.club?"loading":"none";
  }catch(e){boardState="unavailable";}
  renderBoard();
}
function subscribeBoard(code){
  if(subscribedCode===code)return;
  if(boardUnsub)boardUnsub();
  subscribedCode=code; boardState="loading"; boardRows=[];
  const t=setTimeout(()=>{if(boardState==="loading"){boardState="error";renderBoard();}},10000);
  boardUnsub=boardDb.collection("board").where("club","==",code).onSnapshot(snap=>{
    clearTimeout(t); boardRows=snap.docs.map(d=>({id:d.id,...d.data()})); boardState="joined";
    const club=S.settings.club; if(club&&!club.name){const n=boardRows.find(r=>r.clubName)?.clubName;if(n){club.name=n;save();}}
    renderBoard(); pushStats();
  },()=>{clearTimeout(t);boardState="error";renderBoard();});
}
function pushStats(force){
  try{
    if(!boardDb||!myId||!S.settings.club||!canWrite||boardState!=="joined"&&!force)return;
    const body={club:S.settings.club.code,clubName:S.settings.club.name||"",...myStats()}, sig=JSON.stringify(body);
    if(!force&&sig===lastPush)return;
    clearTimeout(pushT);
    pushT=setTimeout(async()=>{try{await boardDb.collection("board").doc(myId).set({...body,updated:Date.now()});lastPush=sig;}catch(e){toast("Couldn't update the leaderboard");}},force?0:3000);
  }catch(e){}
}
function makeCode(name){return (name.toUpperCase().replace(/[^A-Z0-9]+/g,"").slice(0,8)||"CLUB")+"-"+Math.random().toString(36).slice(2,6).toUpperCase();}
function rowVal(r,k){const cur=r.week===weekKey();return k==="points"?(cur?r.points||0:0):+r[k]||0;}
function resolveNames(){
  const ids=boardRows.map(r=>r.id).sort(), key=ids.join(",");
  if(!boardUser||key===profilesKey)return; profilesKey=key;
  boardUser.profiles(ids).then(ps=>{profilesCache=ps||{};renderBoard();}).catch(()=>{});
}
function renderBoard(){
  const root=$("#clubRoot"); if(!root)return;
  const club=S.settings.club;
  if(boardDb&&club&&subscribedCode!==club.code)subscribeBoard(club.code);
  const privacy=`<p class="hint" style="margin:0">Shared with your club: your name, this week's activity counts (reviews, simulations, peer mocks, logged calls), readiness, streak, cards learned and best simulation score. Never shared: your answers, resume, contacts or notes.</p>`;
  const how=`<p class="hint" style="margin:0">Points this week: ${POINTS.review} per drill review · ${POINTS.sim} per superday simulation · ${POINTS.peer} per peer mock · ${POINTS.call} per logged networking call. Resets every Monday.</p>`;
  if(boardState==="unavailable"){
    root.innerHTML=`<div class="card stack"><span class="eyebrow">Finance club leaderboard</span><h2>Compete with your club</h2>
      <p style="margin:0;max-width:62ch">The leaderboard couldn't load. Check your connection and reload the page.</p>
      ${exampleBoard()}${how}</div>`;return;
  }
  if(boardState==="loading"&&!club){root.innerHTML=`<div class="card thinking"><span class="dot"></span>Loading the leaderboard...</div>`;return;}
  if(!club){
    root.innerHTML=`<div class="split">
      <div class="card stack"><span class="eyebrow">Finance club leaderboard</span><h2>Compete with your club</h2>
        <p style="margin:0;max-width:62ch">A weekly leaderboard for your finance or investment club. Everyone's drill reviews, simulations, peer mocks and networking calls earn points, so the people putting in the work show up at the top.</p>
        ${canWrite===false?`<p class="tl-alert" style="background:var(--bg)">You can view a club's board, but to appear on it you need edit access to this page. Ask whoever shared it with you to invite you as an Editor.</p>`:""}
        <form id="clubCreate" class="stack" style="gap:8px"><label for="clubName">Start a club board</label><div class="row" style="flex-wrap:nowrap"><input id="clubName" placeholder="Mizzou Investment Club" style="min-width:0"><button class="btn primary" type="submit" ${canWrite?"":"disabled"}>Create</button></div></form>
        <form id="clubJoin" class="stack" style="gap:8px"><label for="clubCode">Or join with a code</label><div class="row" style="flex-wrap:nowrap"><input id="clubCode" placeholder="MIZZOUIN-7KQ2" style="min-width:0;text-transform:uppercase"><button class="btn" type="submit">${canWrite?"Join":"View"}</button></div></form>
        ${privacy}
      </div>
      <aside class="card stack"><h3>What it looks like</h3>${exampleBoard()}${how}</aside>
    </div>`;
    $("#clubCreate").onsubmit=e=>{e.preventDefault();const n=$("#clubName").value.trim();if(!n){toast("Name your club first");return;}
      S.settings.club={code:makeCode(n),name:n};save();subscribeBoard(S.settings.club.code);pushStats(true);renderBoard();toast("Club created. Share the code with members");};
    $("#clubJoin").onsubmit=e=>{e.preventDefault();const c=$("#clubCode").value.trim().toUpperCase();if(c.length<4){toast("Enter the code from your club leader");return;}
      S.settings.club={code:c,name:""};save();subscribeBoard(c);pushStats(true);renderBoard();};
    return;
  }
  if(boardState==="error"){root.innerHTML=`<div class="card stack"><h2>Couldn't load the leaderboard</h2><p style="margin:0">Check your connection and reload the page.</p><div class="row"><button class="btn" id="clubLeave2">Leave this club</button></div></div>`;$("#clubLeave2").onclick=leaveClub;return;}
  if(boardState!=="joined"){root.innerHTML=`<div class="card thinking"><span class="dot"></span>Loading ${esc(club.name||club.code)}...</div>`;return;}
  resolveNames();
  const rows=[...boardRows].sort((a,b)=>rowVal(b,boardSort)-rowVal(a,boardSort)||rowVal(b,"points")-rowVal(a,"points"));
  const nameOf=r=>(profilesCache[r.id]&&profilesCache[r.id].name)||(r.id===myId?"You":"Club member");
  const myIdx=rows.findIndex(r=>r.id===myId), me=rows[myIdx];
  const lbl=Object.fromEntries(BOARD_SORTS)[boardSort];
  const fmtV=(r,k)=>k==="bestSim"?(r.bestSim?(+r.bestSim).toFixed(1):"–"):k==="readiness"?rowVal(r,k)+"%":k==="streak"?rowVal(r,k)+"d":rowVal(r,k);
  let rankLine="";
  if(me){const above=rows[myIdx-1];rankLine=`You're <b>#${myIdx+1}</b> of ${rows.length} on ${lbl.toLowerCase()}${above?` · ${(rowVal(above,boardSort)-rowVal(me,boardSort)).toFixed(boardSort==="bestSim"?1:0)} behind #${myIdx}`:" · in the lead"}`;}
  else rankLine=canWrite?"Syncing your stats...":"You're viewing this board. You need edit access to appear on it.";
  const invite=`Join the ${club.name||"club"} leaderboard on Superday Prep: open ${APP_URL}, go to the Club tab and join with code ${club.code}`;
  root.innerHTML=`<div class="stack">
    <div class="card stack">
      <div class="row" style="justify-content:space-between;align-items:flex-start"><div><span class="eyebrow">Finance club leaderboard</span><h2 style="margin-top:2px">${esc(club.name||"Your club")}</h2><p class="hint" style="margin:2px 0 0">Code <b class="mono">${esc(club.code)}</b> · ${rows.length} member${rows.length===1?"":"s"} · week of ${fmtDay(weekStart())}</p></div>
        <div class="row"><button class="btn primary sm" id="clubInvite">Copy invite</button><button class="btn sm" id="clubLeave">${leaveArmed?"Click again to leave":"Leave"}</button></div></div>
      <p style="margin:0">${rankLine}</p>
      <textarea id="clubInviteBox" readonly hidden style="min-height:70px"></textarea>
    </div>
    <div class="card stack">
      <div class="setbar" style="margin:0"><span class="eyebrow">Rank by</span><div class="seg" role="group" aria-label="Rank by">${BOARD_SORTS.map(([k,l])=>`<button data-bs="${k}" aria-pressed="${boardSort===k}">${l}</button>`).join("")}</div></div>
      <div class="tablewrap"><table class="board"><thead><tr><th>#</th><th>Member</th><th class="num">Points</th><th class="num">Readiness</th><th class="num">Streak</th><th class="num">Learned</th><th class="num">Best sim</th>${isOwnerView?"<th></th>":""}</tr></thead>
        <tbody>${rows.map((r,k)=>`<tr class="${r.id===myId?"me":""}"><td class="rank">${k+1}</td><td>${esc(nameOf(r))}${r.id===myId?' <span class="stage hot">You</span>':""}${r.week===weekKey()?"":' <span class="hint">· inactive this week</span>'}</td>
          ${["points","readiness","streak","learned","bestSim"].map(c=>`<td class="num ${c===boardSort?"sorted":""}">${fmtV(r,c)}</td>`).join("")}
          ${isOwnerView?`<td>${r.id!==myId?`<button class="linkbtn" data-rm="${esc(r.id)}">Remove</button>`:""}</td>`:""}</tr>`).join("")}</tbody></table></div>
      ${rows.length<2?`<p class="hint" style="margin:0">It's just you so far. Copy the invite and send it to your club's group chat.</p>`:""}
      ${how}${privacy}
    </div>
  </div>`;
  root.querySelectorAll("[data-bs]").forEach(b=>b.onclick=()=>{boardSort=b.dataset.bs;renderBoard();});
  $("#clubInvite").onclick=async()=>{try{await navigator.clipboard.writeText(invite);toast("Invite copied");}catch(e){const b=$("#clubInviteBox");b.hidden=false;b.value=invite;b.select();toast("Select the text and copy it");}};
  $("#clubLeave").onclick=()=>{if(!leaveArmed){leaveArmed=true;renderBoard();return;}leaveArmed=false;leaveClub();};
  root.querySelectorAll("[data-rm]").forEach(b=>b.onclick=async()=>{if(b.dataset.armed){try{await boardDb.collection("board").doc(b.dataset.rm).delete();toast("Removed");}catch(e){toast("Couldn't remove that member");}}else{b.dataset.armed="1";b.textContent="Confirm remove";}});
}
async function leaveClub(){
  try{if(boardDb&&myId&&canWrite)await boardDb.collection("board").doc(myId).delete();}catch(e){}
  if(boardUnsub)boardUnsub(); boardUnsub=null; subscribedCode=null; boardRows=[]; lastPush="";
  S.settings.club=null; boardState=boardDb?"none":"unavailable"; save(); renderBoard(); toast("You left the club");
}
function exampleBoard(){
  const ex=[["Example member A",182,64,9,71,"7.8"],["Example member B",140,58,6,60,"7.1"],["Example member C",96,41,3,38,"6.2"]];
  return `<div class="tablewrap"><table class="board"><thead><tr><th>#</th><th>Member</th><th class="num">Points</th><th class="num">Readiness</th><th class="num">Streak</th><th class="num">Learned</th><th class="num">Best sim</th></tr></thead>
    <tbody>${ex.map((r,k)=>`<tr><td class="rank">${k+1}</td><td>${r[0]} <span class="ex">EXAMPLE</span></td><td class="num sorted">${r[1]}</td><td class="num">${r[2]}%</td><td class="num">${r[3]}d</td><td class="num">${r[4]}</td><td class="num">${r[5]}</td></tr>`).join("")}</tbody></table></div>`;
}
initBoard();

function renderAll(){renderDrill();renderHist();renderNetwork();renderSim();renderFirms();renderTimeline();renderStory();setMockMode(mockMode);renderBoard();}
route(); pickMock(); renderAll();

// ==UserScript==
// @name         sa-detect-details
// @namespace    stackadapt
// @version      2024-08-09
// @description  try to take over the world!
// @author       Dacheng
// @match        *://*/*
// @icon         none
// @grant        none
// ==/UserScript==

(function () {
    'use strict';
    function listCategories() {
        const categories = `id	name	category_id	iab_category_id	parent_id
1	Arts & Entertainment	c01	NULL	NULL
2	Autos & Vehicles	c02	NULL	NULL
3	B2B Goods & Services	c03	NULL	NULL
4	Careers & Employment	c04	NULL	NULL
5	Consumer Goods & Services	c05	NULL	NULL
6	Education	c06	NULL	NULL
7	Financial Services	c07	NULL	NULL
8	Food & Drink	c08	NULL	NULL
9	Healthcare	c09	NULL	NULL
10	Healthy Living	c10	NULL	NULL
11	Hobbies & Leisure	c11	NULL	NULL
12	Home & Garden	c12	NULL	NULL
13	Law & Government	c13	NULL	NULL
14	News	c14	NULL	NULL
15	Parenting	c15	NULL	NULL
16	People & Society	c16	NULL	NULL
17	Pets	c17	NULL	NULL
18	Real Estate	c18	NULL	NULL
19	Sensitive	c19	NULL	NULL
20	Travel & Tourism	c20	NULL	NULL
21	Events & Attractions	c0101	1	1
22	Pop Culture	c0102	1	1
23	Games	c0103	149	1
24	TV & Movies	c0104	1	1
25	Music	c0105	1	1
26	Gaming	c0106	149	1
27	Automotive Dealerships	c0201	9	2
28	Automotive Parts & Services	c0202	9	2
29	Auto Brand	c0203	9	2
30	Advertising, Marketing & Sales	c0301	33	3
31	Software/Hardware	c0302	33	3
32	Industry & Manufacturing	c0303	33	3
33	Careers & Employment	c0401	46	4
34	Books & Reference	c0501	1	5
35	Computers & Consumer Electronics	c0502	363	5
36	Beauty & Personal Hygiene	c0503	363	5
37	Sports & Fitness Goods	c0504	363	5
38	Clothing & accessories (style & fashion)	c0505	363	5
39	Miscellaneous	c0506	363	5
40	Baby & Children's Products	c0507	363	5
41	Gifts & Occasions	c0508	363	5
42	Telecom Carriers/Cable/Internet	c0509	201	5
43	Utilities	c0510	201	5
44	Food & Grocery	c0511	363	5
45	Shopping	c0512	363	5
46	Online Colleges & Universities	c0601	58	6
47	Foreign Language Study	c0602	58	6
48	Post-secondary education	c0603	58	6
49	Primary and secondary schools	c0604	58	6
50	Retail Banks/Credit Unions	c0701	201	7
51	Mortgage & Loans	c0702	201	7
52	Financial Planning & Investing	c0703	201	7
53	Insurance	c0704	201	7
54	Tax Services	c0705	201	7
55	Restaurants & Bars	c0801	130	8
56	Beverages	c0802	130	8
57	Healthcare Providers	c0901	84	9
58	Pharmaceuticals	c0902	84	9
59	Biotechnology	c0903	84	9
60	Fitness	c1001	84	10
61	Wellness	c1002	84	10
62	Weight loss	c1003	84	10
63	Hobbies & Leisure	c1101	149	11
64	Home & Garden	c1201	181	12
65	PSA & Lobbying	c1301	197	13
66	Legal Services	c1302	33	13
67	Politics	c1303	191	13
68	News	c1401	197	14
69	Parenting	c1501	74	15
70	Dating	c1601	74	16
71	Eldercare	c1602	74	16
72	Charities & Causes	c1603	33	16
73	Communities	c1604	149	16
74	Pets	c1701	234	17
75	Real Estate	c1801	359	18
76	Viral/funny/sensationalism	c1901	1	19
77	Cryptocurrency	c1902	201	19
78	Cannabis	c1903	149	19
79	Adult	c1904	149	19
80	Casino/Gambling	c1905	1	19
81	Cosmetic Surgery	c1906	84	19
82	Firearms and Accessories	c1907	149	19
83	Alcohol	c1908	130	19
84	Healthcare & Medicine	c1909	84	19
85	Financial Services & Products	c1910	201	19
86	Affiliate Marketing	c1911	33	19
87	Politics	c1912	191	19
88	Miscellaneous	c1913	84	19
89	CBD	c1914	84	19
90	Nicotine and Tobacco	c1915	84	19
91	Online Casinos	c1916	1	19
92	Sports Betting	c1917	1	19
93	Psychedelics and Plant Medicines	c1918	84	19
94	Hotels and Accomodations	c2001	331	20
95	Cruises	c2002	331	20
96	Airlines	c2003	331	20
97	Tourist Destinations	c2004	331	20
98	Travel & Excursion Bookings	c2005	331	20
99	Car Rental & Sharing Services	c2006	331	20
100	Bus & Rail Travel	c2007	331	20`.split('\n').map(l => {
            const val = l.split('\t');
            return { id: val[0], name: val[1], category_id: val[2], iab_category_id: val[3], parent_id: val[4] }
        });

        const list = categories.filter(c => {
            return c.parent_id !== "NULL"
        }).map((c) => {
            const parent = categories.find(p => p.id === c.parent_id);
            if (!parent) {
                return ''
            }
            return parent.name + ", " + c.name
        });

        return list;
    }


    function getPrompt(details) {
        return `
You are an expert advertiser here to evaluate the suitability of a website for different types of ads. Using the metadata available for a website, determine the best suited category amongst the following: ${listCategories().join('\n')}.

Site metadata:

${JSON.stringify(details, null, 2)}

            `
    }


    setTimeout(() => {
        function getMetaTags() {
            const tags = document.getElementsByTagName("meta")
            const tagDetails = new Map();

            const interestingKeys = ['og:title', 'og:description', 'twitter:site', 'twitter:title', 'twitter:description', 'twitter:domain'];

            if (tags.length > 0) {
                for (let i = 0; i < tags.length; i++) {
                    const tag = tags.item(i);
                    const key = tag.getAttribute("property") || tag.getAttribute("name")
                    if (key && interestingKeys.includes(key)) {
                        tagDetails.set(key, tag.getAttribute("content"))
                    }
                }
            }

            return tagDetails;
        }

        function getHeadings() {
            const headings = [];
            ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'].forEach((heading) => {
                document.querySelectorAll(heading).forEach((e) => {
                    headings.push(e.textContent);
                });
            });
            return headings;
        }

        function getParagraphs() {
            const paragraphs = [];
            document.querySelectorAll('p').forEach((e) => {
                paragraphs.push(e.textContent);
            });
            return paragraphs;
        }


        const details = {
            hasSaq: !!performance.getEntries().find((e) => e.name.includes('saq')),
            tags: getMetaTags(),
            headings: getHeadings(),
            paragraphs: getParagraphs()
        }

        if (details.hasSaq) {
            const box = document.createElement("div");

            document.body.prepend(box);
            console.log(details);

            box.innerHTML = `
            <div style="display: flex; font-family: 'roboto', 'calibri', sans-serif, helvetica; justify-content: flex-start; align-items: center; padding: 8px; gap: 4px; background: #0476ff; color: white; position:fixed; z-index: 9999; box-shadow: 0 4px 4px #888; width: calc(100% - 16px)">
                <div>Origin: ${location.origin}</div>
                <button id="sa-prompt-copy">Copy Prompt</button>
                <div style="display: block; flex: 1 1;"></div>
                <button id="sa-detect-cls">Close</button>
            </div>
        `

            document.getElementById("sa-detect-cls").addEventListener('click', () => {
                box.style.display = "none";
            });
            document.getElementById("sa-prompt-copy").addEventListener('click', () => {
                navigator.clipboard.writeText(getPrompt(details))
            });
        }
    }, 1000);
})();
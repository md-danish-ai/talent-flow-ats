# ruff: noqa
# Auto-generated seed file from database on 2026-08-13 16:24:01
import sys
import os

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

os.environ.setdefault("DB_HOST", "localhost")
os.environ.setdefault("DB_PORT", "9600")
os.environ.setdefault("DB_NAME", "talent_flow_ats")
os.environ.setdefault("DB_USER", "postgres")
os.environ.setdefault("DB_PASSWORD", "Pass2020NothingSpecial")

from app.users.models import User
from app.answer.models import QuestionAnswer
from app.questions.models import Question
from app.classifications.models import Classification
from app.departments.models import Department
from app.database.db import SessionLocal

CONTACTS = [
    {
        "id": 100,
        "question_text": "http://celanese.com",
        "marks": 20,
        "city": "Irving",
        "state": "TX",
        "zipCode": 75039,
        "websiteUrl": "http://celanese.com",
        "companyName": "Celanese Corporation",
        "facebookPage": "https://www.facebook.com/Celanese/",
        "generalEmail": "questions@celanese.com",
        "streetAddress": "222 W. Las Colinas Blvd.",
        "companyPhoneNumber": "#ERROR!",
    },
    {
        "id": 101,
        "question_text": "http://calgoncarbon.com",
        "marks": 20,
        "city": "Moon Township",
        "state": "PA",
        "zipCode": 15108,
        "websiteUrl": "http://calgoncarbon.com",
        "companyName": "Calgon Carbon Corporation",
        "facebookPage": "https://www.facebook.com/calgoncarbon/",
        "generalEmail": "info@calgoncarbon.com",
        "streetAddress": "3000 GSK Drive",
        "companyPhoneNumber": "412-787-6700",
    },
    {
        "id": 102,
        "question_text": "http://beltpower.com",
        "marks": 20,
        "city": "Atlanta",
        "state": "GA",
        "zipCode": 30339,
        "websiteUrl": "http://beltpower.com",
        "companyName": "Belt Power, LLC",
        "facebookPage": "https://www.facebook.com/BeltPower/",
        "generalEmail": "sales@beltpower.com",
        "streetAddress": "2355 Church Road SE",
        "companyPhoneNumber": "800-886-2358",
    },
    {
        "id": 103,
        "question_text": "http://ceda.com/",
        "marks": 20,
        "city": "Calgary",
        "state": "AB",
        "zipCode": "T2J 6A5",
        "websiteUrl": "http://ceda.com/",
        "companyName": "CEDA International",
        "facebookPage": "https://www.facebook.com/CEDA.International",
        "generalEmail": "info@cedagroup.com",
        "streetAddress": "Suite 625, 11012 Macleod Trail SE",
        "companyPhoneNumber": "1-403-253-3233",
    },
    {
        "id": 104,
        "question_text": "http://cclind.com",
        "marks": 20,
        "city": "Toronto",
        "state": "ON",
        "zipCode": "M2H 3R1",
        "websiteUrl": "http://cclind.com",
        "companyName": "CCL Industries Inc",
        "facebookPage": "https://www.facebook.com/pages/CCL-Industries-Inc/215880722133999",
        "generalEmail": "ccl@cclind.com",
        "streetAddress": "105 Gordon Baker Road Suite 801",
        "companyPhoneNumber": 4167568500,
    },
    {
        "id": 105,
        "question_text": "http://calnetix.com",
        "marks": 20,
        "city": "Cerritos",
        "state": "CA",
        "zipCode": 90703,
        "websiteUrl": "http://calnetix.com",
        "companyName": "Calnetix Technologies, LLC",
        "facebookPage": "https://www.facebook.com/calnetix/",
        "generalEmail": "info@calnetix.com",
        "streetAddress": "16323 Shoemaker Ave.",
        "companyPhoneNumber": "1-562-293-1660",
    },
    {
        "id": 106,
        "question_text": "http://calmac.com",
        "marks": 20,
        "city": "Fair Lawn",
        "state": "NJ",
        "zipCode": 7410,
        "websiteUrl": "http://calmac.com",
        "companyName": "Calmac Corp.",
        "facebookPage": "https://www.facebook.com/CalmacEnergyStorage",
        "generalEmail": "info@calmac.com",
        "streetAddress": "3-00 Banta Place",
        "companyPhoneNumber": "201-797-1511",
    },
    {
        "id": 107,
        "question_text": "http://cmcorporation.com",
        "marks": 20,
        "city": "Dayville",
        "state": "CT",
        "zipCode": 6241,
        "websiteUrl": "http://cmcorporation.com",
        "companyName": "C & M Corporation",
        "facebookPage": "https://www.facebook.com/CMCorporation/",
        "generalEmail": "SalesAM@cmcorporation.com",
        "streetAddress": "349 Lake Road",
        "companyPhoneNumber": "(1) 860 774 4812",
    },
    {
        "id": 108,
        "question_text": "http://bwen.com/",
        "marks": 20,
        "city": "Cicero",
        "state": "IL",
        "zipCode": 60804,
        "websiteUrl": "http://bwen.com/",
        "companyName": "Broadwind Energy, Inc.",
        "facebookPage": "https://www.facebook.com/Broadwind/",
        "generalEmail": "info@bwen.com",
        "streetAddress": "3240 S. Central Ave.",
        "companyPhoneNumber": "708­.780.4800",
    },
    {
        "id": 109,
        "question_text": "http://bridgewellresources.com",
        "marks": 20,
        "city": "TIGARD",
        "state": "OR",
        "zipCode": 97223,
        "websiteUrl": "http://bridgewellresources.com",
        "companyName": "Bridgewell Resources LLC",
        "facebookPage": "https://www.facebook.com/BridgewellResources",
        "generalEmail": "info@bridgewellres.com",
        "streetAddress": "10200 SW Greenburg Rd Suite# 400",
        "companyPhoneNumber": "503.872.3557",
    },
    {
        "id": 110,
        "question_text": "http://boydcorp.com",
        "marks": 20,
        "city": "Pleasanton",
        "state": "CA",
        "zipCode": 94588,
        "websiteUrl": "http://boydcorp.com",
        "companyName": "Boyd Corporation",
        "facebookPage": "https://www.facebook.com/Boyd-Corporation-745405212139622/?ref=hl",
        "generalEmail": "customerservice@boydcorp.com",
        "streetAddress": "5960 Inglewood Dr. Suite 115",
        "companyPhoneNumber": "1(888)244-6931",
    },
    {
        "id": 111,
        "question_text": "http://bucorp.com",
        "marks": 20,
        "city": "Elgin",
        "state": "IL",
        "zipCode": 60124,
        "websiteUrl": "http://bucorp.com",
        "companyName": "Bohler-Uddeholm Corporation",
        "facebookPage": "https://www.facebook.com/4buna/",
        "generalEmail": "info@bucorp.com",
        "streetAddress": "2505 Milennium Drive",
        "companyPhoneNumber": "1-800-638-2520",
    },
    {
        "id": 112,
        "question_text": "http://bluecatnetworks.com",
        "marks": 20,
        "city": "Toronto",
        "state": "ON",
        "zipCode": "ON M2P 2B5",
        "websiteUrl": "http://bluecatnetworks.com",
        "companyName": "Bluecat Networks Inc",
        "facebookPage": "https://www.facebook.com/BlueCatNetworks/",
        "generalEmail": "support@bluecatnetworks.com",
        "streetAddress": "4101 Yonge St 3rd Floor",
        "companyPhoneNumber": "1.416.646.8400",
    },
    {
        "id": 113,
        "question_text": "http://blockandcompany.com",
        "marks": 20,
        "city": "Wheeling",
        "state": "IL",
        "zipCode": "60090-5795",
        "websiteUrl": "http://blockandcompany.com",
        "companyName": "Block and Company, Inc.",
        "facebookPage": "https://www.facebook.com/blockandcompany",
        "generalEmail": "info@blockinc.com",
        "streetAddress": "1111 Wheeling Road",
        "companyPhoneNumber": "800.323.7556",
    },
    {
        "id": 114,
        "question_text": "http://bliley.com",
        "marks": 20,
        "city": "Erie",
        "state": "PA",
        "zipCode": 16506,
        "websiteUrl": "http://bliley.com",
        "companyName": "Bliley Technologies, Inc.",
        "facebookPage": "https://www.facebook.com/BlileyTech/",
        "generalEmail": "sales@bliley.com",
        "streetAddress": "2545 W. Grandview",
        "companyPhoneNumber": "(814) 838-3571",
    },
    {
        "id": 115,
        "question_text": "http://blakejarrett.ca/portfolio/",
        "marks": 20,
        "city": "Toronto",
        "state": "ON",
        "zipCode": "M3B 2T5",
        "websiteUrl": "http://blakejarrett.ca/portfolio/",
        "companyName": "Blake Jarrett & Company Inc.",
        "facebookPage": "https://www.facebook.com/BlakeJarrettCo/",
        "generalEmail": "info@blakejarrett.ca",
        "streetAddress": "66 Lesmill Road",
        "companyPhoneNumber": "416.385.1660",
    },
    {
        "id": 116,
        "question_text": "http://bitordertech.com",
        "marks": 20,
        "city": "Frisco",
        "state": "TX",
        "zipCode": 75034,
        "websiteUrl": "http://bitordertech.com",
        "companyName": "Bit Order Technologies Inc.",
        "facebookPage": "https://www.facebook.com/BitOrder/",
        "generalEmail": "info@bitordertech.com",
        "streetAddress": "8765, Stockard Drive, Unit 101",
        "companyPhoneNumber": "1 (415) 230 0592",
    },
    {
        "id": 117,
        "question_text": "http://www.beumergroup.com/",
        "marks": 20,
        "city": "Somerset",
        "state": "NJ",
        "zipCode": 8873,
        "websiteUrl": "http://www.beumergroup.com/",
        "companyName": "BEUMER Corporation",
        "facebookPage": "https://www.facebook.com/BeumerGroup/",
        "generalEmail": "usa@beumergroup.com",
        "streetAddress": "800 Apgar Drive",
        "companyPhoneNumber": "1 732 893 - 2800",
    },
    {
        "id": 118,
        "question_text": "http://beracahhomes.com",
        "marks": 20,
        "city": "Greenwood",
        "state": "DE",
        "zipCode": 19950,
        "websiteUrl": "http://beracahhomes.com",
        "companyName": "Beracah Homes, Inc.",
        "facebookPage": "https://www.facebook.com/beracahhomes/",
        "generalEmail": "sales@beracahhomes.com",
        "streetAddress": "9590 Nanticoke Business Park Dr.",
        "companyPhoneNumber": "1 302-349-4561",
    },
    {
        "id": 119,
        "question_text": "http://bepex.com/",
        "marks": 20,
        "city": "Minneapolis",
        "state": "MN",
        "zipCode": 55413,
        "websiteUrl": "http://bepex.com/",
        "companyName": "Bepex International LLC",
        "facebookPage": "https://www.facebook.com/BepexInternational/",
        "generalEmail": "info@bepex.com",
        "streetAddress": "333 NE Taft Street",
        "companyPhoneNumber": "1 612-260-7462",
    },
    {
        "id": 120,
        "question_text": "http://www.apache-inc.com",
        "marks": 20,
        "city": "Cedar Rapids",
        "state": "IA",
        "zipCode": 52404,
        "websiteUrl": "http://www.apache-inc.com",
        "companyName": "Apache Inc.",
        "facebookPage": "https://www.facebook.com/Apache.Inc/",
        "generalEmail": "info@apache-inc.com",
        "streetAddress": "4805 Bowling Street SW",
        "companyPhoneNumber": "(866) 757-7816",
    },
    {
        "id": 121,
        "question_text": "http://americanexcelsior.com",
        "marks": 20,
        "city": "Arlington",
        "state": "TX",
        "zipCode": 76011,
        "websiteUrl": "http://americanexcelsior.com",
        "companyName": "American Excelsior Company",
        "facebookPage": "https://www.facebook.com/AmericanExcelsior/",
        "generalEmail": "sales@americanexcelsior.com",
        "streetAddress": "850 Ave H E",
        "companyPhoneNumber": "(800) 777-7645",
    },
    {
        "id": 122,
        "question_text": "http://alignproductionsystems.com/",
        "marks": 20,
        "city": "Maryland Heights",
        "state": "MO",
        "zipCode": 63043,
        "websiteUrl": "http://alignproductionsystems.com/",
        "companyName": "Align Production Systems",
        "facebookPage": "https://www.facebook.com/AlignProductionSystems/?fref=nf",
        "generalEmail": "sales@alignprod.com",
        "streetAddress": "2055 Craidshire Road, Suite 407",
        "companyPhoneNumber": "(800) 888-0018",
    },
    {
        "id": 123,
        "question_text": "http://afltele.com",
        "marks": 20,
        "city": "Duncan",
        "state": "SC",
        "zipCode": 29334,
        "websiteUrl": "http://afltele.com",
        "companyName": "AFL Telecommunications LLC",
        "facebookPage": "https://www.facebook.com/AFLcorp/",
        "generalEmail": "sales@aflglobal.com",
        "streetAddress": "170 Ridgeview Center Drive",
        "companyPhoneNumber": "(800) 235-3423",
    },
    {
        "id": 124,
        "question_text": "http://texaskingindopakrestaurant.com",
        "marks": 20,
        "city": "Plano",
        "state": "TX",
        "zipCode": 75023,
        "websiteUrl": "http://texaskingindopakrestaurant.com",
        "companyName": "Texas King Indo Pak Restaurant",
        "facebookPage": "https://www.facebook.com/texaskingrestaurantplano",
        "generalEmail": "contact@texaskingindopakrestaurant.com",
        "streetAddress": "6900 Alma Dr., #100",
        "companyPhoneNumber": "972-517-5151",
    },
    {
        "id": 125,
        "question_text": "http://bentleymills.com",
        "marks": 20,
        "city": "City of Industry",
        "state": "CA",
        "zipCode": 91746,
        "websiteUrl": "http://bentleymills.com",
        "companyName": "Bentley Mills",
        "facebookPage": "https://www.facebook.com/BentleyMillsLA/",
        "generalEmail": "marketing@bentleymills.com",
        "streetAddress": "14641 E. Don Julian Road",
        "companyPhoneNumber": "1 800-423-4709",
    },
    {
        "id": 126,
        "question_text": "http://behlenmfg.com",
        "marks": 20,
        "city": "Columbus",
        "state": "NE",
        "zipCode": 68601,
        "websiteUrl": "http://behlenmfg.com",
        "companyName": "Behlen Mfg. Co.",
        "facebookPage": "https://www.facebook.com/behlenmfgco/",
        "generalEmail": "behlen@behlenmfg.com",
        "streetAddress": "4025 E. 23rd Street",
        "companyPhoneNumber": "(402) 564-3111",
    },
    {
        "id": 127,
        "question_text": "http://ballard.com/",
        "marks": 20,
        "city": "Burnaby",
        "state": "BC",
        "zipCode": "V5J 5J8",
        "websiteUrl": "http://ballard.com/",
        "companyName": "Ballard Power Systems Inc",
        "facebookPage": "https://www.facebook.com/Ballard-Power-Systems-205546066131866/",
        "generalEmail": "marketing@ballard.com",
        "streetAddress": "9000 Glenlyon Parkway",
        "companyPhoneNumber": "1-604-454-900",
    },
    {
        "id": 128,
        "question_text": "http://avure.com",
        "marks": 20,
        "city": "Middletown",
        "state": "OH",
        "zipCode": 45044,
        "websiteUrl": "http://avure.com",
        "companyName": "Avure Technologies Inc",
        "facebookPage": "https://www.facebook.com/AvureHPP/",
        "generalEmail": "info@avure.com",
        "streetAddress": "2601 South Verity Parkway Building 13",
        "companyPhoneNumber": "1-513-433-2500",
    },
    {
        "id": 129,
        "question_text": "http://tebos.net",
        "marks": 20,
        "city": "Gladstone",
        "state": "OR",
        "zipCode": 97027,
        "websiteUrl": "http://tebos.net",
        "companyName": "JC Tebo’s Restaurant",
        "facebookPage": "https://www.facebook.com/TebosRestaurant",
        "generalEmail": "jctebos@tebos.net",
        "streetAddress": "19120 S.E. McLoughlin Blvd.",
        "companyPhoneNumber": "503-655-6333",
    },
    {
        "id": 130,
        "question_text": "http://acmepizzaria.com",
        "marks": 20,
        "city": "Cottonwood",
        "state": "AZ",
        "zipCode": 86326,
        "websiteUrl": "http://acmepizzaria.com",
        "companyName": "Acme Pizzaria",
        "facebookPage": "https://www.facebook.com/Acme-Pizzaria-116123298409928/",
        "generalEmail": "acme@acmepizzaria.com",
        "streetAddress": "280 S. Main Street",
        "companyPhoneNumber": "(928) 634-ACME (2263)",
    },
    {
        "id": 131,
        "question_text": "http://antonsgreekrestaurant.com",
        "marks": 20,
        "city": "Albany",
        "state": "NY",
        "zipCode": 12208,
        "websiteUrl": "http://antonsgreekrestaurant.com",
        "companyName": "Anton's Greek American Eatery",
        "facebookPage": "https://www.facebook.com/AntonsGreekRestaurant",
        "generalEmail": "ncschultzllc@yahoo.com",
        "streetAddress": "577 New Scotland",
        "companyPhoneNumber": "518-453-9191",
    },
    {
        "id": 132,
        "question_text": "http://barryspizza.com",
        "marks": 20,
        "city": "Houston",
        "state": "TX",
        "zipCode": 77057,
        "websiteUrl": "http://barryspizza.com",
        "companyName": "Barry’s Pizza And Italian Diner",
        "facebookPage": "https://www.facebook.com/BarrysPizza/about",
        "generalEmail": "barryspizza@sbcglobal.net",
        "streetAddress": "6003 Richmond",
        "companyPhoneNumber": "713-266-8692",
    },
    {
        "id": 133,
        "question_text": "http://bettermypos.com/",
        "marks": 20,
        "city": "Las Vegas",
        "state": "NV",
        "zipCode": 89120,
        "websiteUrl": "http://bettermypos.com/",
        "companyName": "Better My POS",
        "facebookPage": "https://www.facebook.com/Bettermypos/",
        "generalEmail": "wendy@bettermypos.com",
        "streetAddress": "6165 Harrison Dr Suite#4",
        "companyPhoneNumber": "(702) 449-9384",
    },
    {
        "id": 134,
        "question_text": "http://bhr-sullivan.com/",
        "marks": 20,
        "city": "Rock Hill",
        "state": "NY",
        "zipCode": 12775,
        "websiteUrl": "http://bhr-sullivan.com/",
        "companyName": "Bernies Holiday Restaurant",
        "facebookPage": "https://www.facebook.com/BerniesHolidayRestaurant/",
        "generalEmail": "info@bhr-sullivan.com",
        "streetAddress": "277 Rock Hill Dr",
        "companyPhoneNumber": "(845) 796-3333",
    },
    {
        "id": 135,
        "question_text": "http://brettscasualamerican.com/",
        "marks": 20,
        "city": "Athens",
        "state": "GA",
        "zipCode": 30606,
        "websiteUrl": "http://brettscasualamerican.com/",
        "companyName": "Brett's Casual American",
        "facebookPage": "https://www.facebook.com/diannacatersbretts/",
        "generalEmail": "brettsrestaurant@gmail.com",
        "streetAddress": "3190 Atlanta Hwy #11",
        "companyPhoneNumber": "706-850-1395",
    },
    {
        "id": 136,
        "question_text": "http://brianashville.com/",
        "marks": 20,
        "city": "Nashville",
        "state": "TN",
        "zipCode": 37221,
        "websiteUrl": "http://brianashville.com/",
        "companyName": "Bria Bistro Italiano",
        "facebookPage": "https://www.facebook.com/BriaBistro/",
        "generalEmail": "bria@infinityhospitality.net",
        "streetAddress": "8128 Highway 100",
        "companyPhoneNumber": "615-646-8274",
    },
    {
        "id": 137,
        "question_text": "http://brix.com/",
        "marks": 20,
        "city": "Napa",
        "state": "CA",
        "zipCode": 94558,
        "websiteUrl": "http://brix.com/",
        "companyName": "Brix",
        "facebookPage": "https://www.facebook.com/BrixRestaurant/",
        "generalEmail": "info@brix.com",
        "streetAddress": "7377 St. Helena Highway",
        "companyPhoneNumber": "707.944.2749",
    },
    {
        "id": 138,
        "question_text": "http://discoveradams.com/",
        "marks": 20,
        "city": "North Port",
        "state": "FL",
        "zipCode": 34289,
        "websiteUrl": "http://discoveradams.com/",
        "companyName": "Adams Group",
        "facebookPage": "https://www.facebook.com/adamsgroup/",
        "generalEmail": "info@discoveradams.com",
        "streetAddress": "2221 Murphy Court",
        "companyPhoneNumber": "941.639.7188",
    },
    {
        "id": 139,
        "question_text": "http://adcomfg.com",
        "marks": 20,
        "city": "Sanger",
        "state": "CA",
        "zipCode": 93657,
        "websiteUrl": "http://adcomfg.com",
        "companyName": "ADCO Manufacturing",
        "facebookPage": "https://www.facebook.com/adcomfg/",
        "generalEmail": "info@adcomfg.com",
        "streetAddress": "2170 Academy Avenue",
        "companyPhoneNumber": "(559) 875-5563",
    },
    {
        "id": 140,
        "question_text": "http://afcosystems.com",
        "marks": 20,
        "city": "Farmingdale",
        "state": "NY",
        "zipCode": 11735,
        "websiteUrl": "http://afcosystems.com",
        "companyName": "Afco Systems, Inc.",
        "facebookPage": "https://www.facebook.com/AFCO-Systems-Inc-299204250817/",
        "generalEmail": "sales@afcosystems.com",
        "streetAddress": "200 Finn Court",
        "companyPhoneNumber": "(631) 249-9441",
    },
    {
        "id": 141,
        "question_text": "https://www.reliasmedia.com",
        "marks": 20,
        "city": "Morrisville",
        "state": "NC",
        "zipCode": "27560-5468",
        "websiteUrl": "https://www.reliasmedia.com",
        "companyName": "Relias Media",
        "facebookPage": "https://www.facebook.com/ReliasMedia/",
        "generalEmail": "customerservice@reliasmedia.com",
        "streetAddress": "1010 Sync St, Suite 100",
        "companyPhoneNumber": "1-800-688-2421",
    },
    {
        "id": 142,
        "question_text": "http://almo.com",
        "marks": 20,
        "city": "Philadelphia",
        "state": "PA",
        "zipCode": 19154,
        "websiteUrl": "http://almo.com",
        "companyName": "Almo Corporation",
        "facebookPage": "https://www.facebook.com/almocorp/",
        "generalEmail": "support@almo.com",
        "streetAddress": "2709 Commerce Way",
        "companyPhoneNumber": "(215) 698-4000",
    },
    {
        "id": 143,
        "question_text": "http://atfco.com/",
        "marks": 20,
        "city": "Cleveland",
        "state": "OH",
        "zipCode": 44111,
        "websiteUrl": "http://atfco.com/",
        "companyName": "American Tank & Fabricating Company",
        "facebookPage": "https://www.facebook.com/ATF-American-Tank-Fabricating-111290472269064/",
        "generalEmail": "info@atfco.com",
        "streetAddress": "12314 Elmwood Avenue",
        "companyPhoneNumber": "(216) 252-1500",
    },
    {
        "id": 144,
        "question_text": "http://amuneal.com/",
        "marks": 20,
        "city": "Philadelphia",
        "state": "PA",
        "zipCode": 19124,
        "websiteUrl": "http://amuneal.com/",
        "companyName": "Amuneal Manufacturing Corp.",
        "facebookPage": "https://www.facebook.com/amuneal/",
        "generalEmail": "info@amuneal.com",
        "streetAddress": "4737 Darrah Street",
        "companyPhoneNumber": "(215) 535-3000",
    },
    {
        "id": 145,
        "question_text": "http://www.redyetijeff.com/",
        "marks": 20,
        "city": "Jeffersonville",
        "state": "Indiana",
        "zipCode": "47130-3340",
        "websiteUrl": "http://www.redyetijeff.com/",
        "companyName": "The Red Yeti",
        "facebookPage": "https://www.facebook.com/RedYetiJeff/",
        "generalEmail": "big_red@redyetibrewing.com",
        "streetAddress": "256 Spring St",
        "companyPhoneNumber": "(812) 288-5788",
    },
    {
        "id": 146,
        "question_text": "http://simplerootsbrewing.com/",
        "marks": 20,
        "city": "Burlington",
        "state": "Vermont",
        "zipCode": "05408-2756",
        "websiteUrl": "http://simplerootsbrewing.com/",
        "companyName": "Simple Roots Brewing Co",
        "facebookPage": "https://www.facebook.com/Simplerootsbrewing/",
        "generalEmail": "simplerootsbrewing@gmail.com",
        "streetAddress": "1127 North Ave Ste 8",
        "companyPhoneNumber": "(802) 399-2658",
    },
]

LEADS = [
    {
        "id": 75,
        "question_text": "Blake Jarrett & Co",
        "marks": 10,
        "email": "blake@blakejarrett.ca",
        "website": "blakejarrett.ca",
        "designation": "CEO",
        "company_name": "Blake Jarrett & Co",
        "contact_name": "Blake Jarrett",
    },
    {
        "id": 76,
        "question_text": "Beracah Homes, Inc.",
        "marks": 10,
        "email": "trent@beracahhomes.com",
        "website": "beracahhomes.com",
        "designation": "Contractor Sales",
        "company_name": "Beracah Homes, Inc.",
        "contact_name": "Trent Collins",
    },
    {
        "id": 77,
        "question_text": "American Excelsior Company",
        "marks": 10,
        "email": "tsadowski@americanexcelsior.com",
        "website": "americanexcelsior.com",
        "designation": "President",
        "company_name": "American Excelsior Company",
        "contact_name": "Terry Sadowski",
    },
    {
        "id": 78,
        "question_text": "Calgon Carbon Corporation",
        "marks": 10,
        "email": "dconley@calgoncarbon.com",
        "website": "calgoncarbon.com",
        "designation": "Marketing Manager- Municipal",
        "company_name": "Calgon Carbon Corporation",
        "contact_name": "Doug Conley",
    },
    {
        "id": 79,
        "question_text": "American Tank & Fabricating Company",
        "marks": 10,
        "email": "tedt@atfco.com",
        "website": "atfco.com",
        "designation": "General Manager",
        "company_name": "American Tank & Fabricating Company",
        "contact_name": "Ted Thorbjornsen",
    },
    {
        "id": 80,
        "question_text": "Paul Evans",
        "marks": 10,
        "email": "evan@paulevansny.com",
        "website": "paulevansny.com",
        "designation": "CEO",
        "company_name": "Paul Evans",
        "contact_name": "Evan Fript",
    },
    {
        "id": 81,
        "question_text": "DanceFIT Studio, LLC",
        "marks": 10,
        "email": "gina@dancefitstudio.com",
        "website": "dancefitstudio.com",
        "designation": "Founder",
        "company_name": "DanceFIT Studio, LLC",
        "contact_name": "Gina Fay",
    },
    {
        "id": 82,
        "question_text": "Portland Pedal Power LLC",
        "marks": 10,
        "email": "Jenn@portlandpedalpower.com",
        "website": "portlandpedalpower.com",
        "designation": "Founder",
        "company_name": "Portland Pedal Power LLC",
        "contact_name": "Jenn Dederich",
    },
    {
        "id": 83,
        "question_text": "Milan Media Group",
        "marks": 10,
        "email": "reva@milanmediagroup.com",
        "website": "milanmediagroup.com",
        "designation": "Chief Executive Officer",
        "company_name": "Milan Media Group",
        "contact_name": "Reva Caldwell-Johnson",
    },
    {
        "id": 84,
        "question_text": "Anitox Corp.",
        "marks": 10,
        "email": "rphillips@anitox.com",
        "website": "anitox.com",
        "designation": "CEO",
        "company_name": "Anitox Corp.",
        "contact_name": "Rick Phillips",
    },
    {
        "id": 85,
        "question_text": "American Products, L.L.C.",
        "marks": 10,
        "email": "ssmith@amprod.us",
        "website": "amprod.us",
        "designation": "President",
        "company_name": "American Products, L.L.C.",
        "contact_name": "Steven Smith",
    },
    {
        "id": 86,
        "question_text": "Rent frock Repeat",
        "marks": 10,
        "email": "lisa@rentfrockrepeat.com",
        "website": "rentfrockrepeat.com",
        "designation": "Founder",
        "company_name": "Rent frock Repeat",
        "contact_name": "Lisa Delorme",
    },
    {
        "id": 87,
        "question_text": "Black Box Social Media, LLC",
        "marks": 10,
        "email": "tom@blackboxsocialmedia.com",
        "website": "blackboxsocialmedia.com",
        "designation": "CEO",
        "company_name": "Black Box Social Media, LLC",
        "contact_name": "Tom Bukacek",
    },
    {
        "id": 88,
        "question_text": "Bombardier Recreational Products Inc.",
        "marks": 10,
        "email": "johanne.denault@brp.com",
        "website": "brp.com",
        "designation": "Manager, Corporate Communications",
        "company_name": "Bombardier Recreational Products Inc.",
        "contact_name": "Johanne Denault",
    },
    {
        "id": 89,
        "question_text": "Broadwind Energy, Inc.",
        "marks": 10,
        "email": "brett.hartman@bwen.com",
        "website": "bwen.com",
        "designation": "Sales Engineer",
        "company_name": "Broadwind Energy, Inc.",
        "contact_name": "Brett Hartman",
    },
    {
        "id": 90,
        "question_text": "Bluecat Networks Inc",
        "marks": 10,
        "email": "mharris@bluecatnetworks.com",
        "website": "bluecatnetworks.com",
        "designation": "CEO",
        "company_name": "Bluecat Networks Inc",
        "contact_name": "Michael Harris",
    },
    {
        "id": 91,
        "question_text": "Block and Company, Inc.",
        "marks": 10,
        "email": "cbrugioni@blockinc.com",
        "website": "blockandcompany.com",
        "designation": "Creative Services & Marketing Communications",
        "company_name": "Block and Company, Inc.",
        "contact_name": "Cindy Brugioni",
    },
    {
        "id": 92,
        "question_text": "Belt Power, LLC",
        "marks": 10,
        "email": "jshelton@beltpower.com",
        "website": "beltpower.com",
        "designation": "President",
        "company_name": "Belt Power, LLC",
        "contact_name": "John Shelton",
    },
    {
        "id": 93,
        "question_text": "Amuneal Manufacturing Corp.",
        "marks": 10,
        "email": "adamk@amuneal.com",
        "website": "amuneal.com",
        "designation": "CEO",
        "company_name": "Amuneal Manufacturing Corp.",
        "contact_name": "Adam Kamens",
    },
    {
        "id": 94,
        "question_text": "Almo Corporation",
        "marks": 10,
        "email": "wchaiken@almo.com",
        "website": "almo.com",
        "designation": "Chief Operating Officer",
        "company_name": "Almo Corporation",
        "contact_name": "Warren Chaiken",
    },
    {
        "id": 95,
        "question_text": "Align Production Systems",
        "marks": 10,
        "email": "jstoecker@alignprod.com",
        "website": "alignproductionsystems.com",
        "designation": "CEO",
        "company_name": "Align Production Systems",
        "contact_name": "Jason Stoecker",
    },
    {
        "id": 96,
        "question_text": "Active Power, Inc.",
        "marks": 10,
        "email": "johnpenver@activepower.com",
        "website": "https://www.activepower.com/en-GB",
        "designation": "Chief Financial Officer",
        "company_name": "Active Power, Inc.",
        "contact_name": "John K. Penver",
    },
    {
        "id": 97,
        "question_text": "Engineering for Kids",
        "marks": 10,
        "email": "droberts@engineeringforkids.net",
        "website": "engineeringforkids.com",
        "designation": "CEO",
        "company_name": "Engineering for Kids",
        "contact_name": "Dori Roberts",
    },
    {
        "id": 98,
        "question_text": "BTI Consulting, Inc.",
        "marks": 10,
        "email": "bruno@bti-consulting.net",
        "website": "bticonsulting.com",
        "designation": "Chief Executive Officer",
        "company_name": "BTI Consulting, Inc.",
        "contact_name": "Bruno Tateossian",
    },
    {
        "id": 99,
        "question_text": "Photonova Studios",
        "marks": 10,
        "email": "Rick@photonovastudios.com",
        "website": "photonovastudios.com",
        "designation": "President",
        "company_name": "Photonova Studios",
        "contact_name": "Rick Portanova",
    },
]

TYPING_TESTS = [
    {
        "id": 74,
        "title": "Quality Policy",
        "paragraph": "ArcGate Quality Policy.ArcGate is committed to a global quality system focused on customer satisfaction. We achieve this through superior services, rapid customer support, technical expertise and industry leadership.Our quality and business objectives are designed to challenge the organisation through continual improvement, innovation and passion for results.Assisted 75+ world-class startups in rapidly bringing cost-effective solutions to market.",
        "marks": 20,
    },
]


def seed_special_questions():
    db = SessionLocal()
    total_seeded = 0
    total_updated = 0
    processed_lead_ids = set()
    processed_contact_ids = set()
    processed_typing_ids = set()

    try:
        user = db.query(User).filter(User.id == 2).first()
        user_id = user.id if user else 1

        # ─── 1. Lead Generation ───────────────────────────────────────────
        print("\n🚀 Seeding Lead Generation questions...")
        for lead in LEADS:
            q_text = lead["question_text"]
            marks = lead.get("marks", 10)
            lead_opts = {k: v for k, v in lead.items() if k not in ("id", "question_text", "marks")}

            existing = None
            if lead.get("id"):
                existing = db.query(Question).filter(Question.id == lead["id"]).first()

            if existing:
                processed_lead_ids.add(existing.id)
                existing.question_text = q_text
                existing.marks = marks
                existing.options = lead_opts
                ans = db.query(QuestionAnswer).filter(QuestionAnswer.question_id == existing.id).first()
                if not ans:
                    db.add(QuestionAnswer(question_id=existing.id, answer_text="", explanation="", created_by=user_id))
                print(f"  🔄 Updated lead: {q_text}")
                total_updated += 1
            else:
                new_q = Question(
                    id=lead["id"],
                    question_type="LEAD_GENERATION",
                    subject_type="LEAD_GENERATION",
                    exam_level="FRESHER",
                    question_text=q_text,
                    marks=marks,
                    is_active=True,
                    options=lead_opts,
                    created_by=user_id,
                )
                db.add(new_q)
                db.flush()
                processed_lead_ids.add(new_q.id)
                db.add(QuestionAnswer(question_id=new_q.id, answer_text="", explanation="", created_by=user_id))
                total_seeded += 1
                print(f"  ✅ Added lead: {q_text}")

        db.commit()

        # ─── 2. Contact Details ────────────────────────────────────────────
        print("\n🚀 Seeding Contact Details questions...")
        for contact in CONTACTS:
            q_text = contact["question_text"]
            marks = contact.get("marks", 20)
            contact_opts = {k: v for k, v in contact.items() if k not in ("id", "question_text", "marks")}

            existing = None
            if contact.get("id"):
                existing = db.query(Question).filter(Question.id == contact["id"]).first()

            if existing:
                processed_contact_ids.add(existing.id)
                existing.question_text = q_text
                existing.marks = marks
                existing.options = contact_opts
                ans = db.query(QuestionAnswer).filter(QuestionAnswer.question_id == existing.id).first()
                if not ans:
                    db.add(QuestionAnswer(question_id=existing.id, answer_text="", explanation="", created_by=user_id))
                print(f"  🔄 Updated contact: {q_text}")
                total_updated += 1
            else:
                new_q = Question(
                    id=contact["id"],
                    question_type="CONTACT_DETAILS",
                    subject_type="COMPANY_CONTACT_DETAILS",
                    exam_level="FRESHER",
                    question_text=q_text,
                    marks=marks,
                    is_active=True,
                    options=contact_opts,
                    created_by=user_id,
                )
                db.add(new_q)
                db.flush()
                processed_contact_ids.add(new_q.id)
                db.add(QuestionAnswer(question_id=new_q.id, answer_text="", explanation="", created_by=user_id))
                total_seeded += 1
                print(f"  ✅ Added contact: {q_text}")

        db.commit()

        # ─── 3. Typing Test ────────────────────────────────────────────────
        print("\n🚀 Seeding Typing Test questions...")
        for typing in TYPING_TESTS:
            q_text = typing["title"]
            marks = typing.get("marks", 10)

            existing = None
            if typing.get("id"):
                existing = db.query(Question).filter(Question.id == typing["id"]).first()

            if existing:
                processed_typing_ids.add(existing.id)
                existing.passage = typing["paragraph"]
                existing.marks = marks
                print(f"  🔄 Updated typing test: {q_text}")
                total_updated += 1
            else:
                new_q = Question(
                    id=typing["id"],
                    question_type="TYPING_TEST",
                    subject_type="TYPING_TEST",
                    exam_level="FRESHER",
                    question_text=q_text,
                    passage=typing["paragraph"],
                    marks=marks,
                    is_active=True,
                    options=[],
                    created_by=user_id,
                )
                db.add(new_q)
                db.flush()
                processed_typing_ids.add(new_q.id)
                db.add(QuestionAnswer(question_id=new_q.id, answer_text="", explanation="", created_by=user_id))
                total_seeded += 1
                print(f"  ✅ Added typing test: {q_text}")

        db.commit()

        # ─── Reset sequence so future inserts don't conflict ──────────────
        db.execute(
            __import__('sqlalchemy').text(
                "SELECT setval('questions_id_seq', (SELECT MAX(id) FROM questions))"
            )
        )
        db.commit()
        print("\n🔧 Sequence reset to max(id)")

        print(f"\n✨ Special questions seeding complete!")
        print(f"   Questions added  : {total_seeded}")
        print(f"   Questions updated: {total_updated}")

    except Exception as e:
        db.rollback()
        print(f"❌ Error seeding special questions: {str(e)}")
    finally:
        db.close()


if __name__ == "__main__":
    seed_special_questions()

# ruff: noqa
import sys
import os

# Add the backend directory to sys.path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

# Set default env vars for DB
os.environ.setdefault("DB_HOST", "localhost")
os.environ.setdefault("DB_PORT", "5435")
os.environ.setdefault("DB_NAME", "talent_flow_ats")
os.environ.setdefault("DB_USER", "postgres")
os.environ.setdefault("DB_PASSWORD", "Pass2020NothingSpecial")

from app.users.models import User
from app.answer.models import QuestionAnswer
from app.questions.models import Question
from app.classifications.models import Classification
from app.departments.models import Department
from app.database.db import SessionLocal

LEADS = [
    {
        "company_name": "Blake Jarrett & Co",
        "contact_name": "Blake Jarrett",
        "designation": "CEO",
        "email": "blake@blakejarrett.ca",
        "website": "blakejarrett.ca",
        "phone": "",
        "address": "",
        "linkedin_url": "",
        "marks": 10,
    },
    {
        "company_name": "Beracah Homes, Inc.",
        "contact_name": "Trent Collins",
        "designation": "Contractor Sales",
        "email": "trent@beracahhomes.com",
        "website": "beracahhomes.com",
        "phone": "",
        "address": "",
        "linkedin_url": "",
        "marks": 10,
    },
    {
        "company_name": "American Excelsior Company",
        "contact_name": "Terry Sadowski",
        "designation": "President",
        "email": "tsadowski@americanexcelsior.com",
        "website": "americanexcelsior.com",
        "phone": "",
        "address": "",
        "linkedin_url": "",
        "marks": 5,
    },
    {
        "company_name": "Calgon Carbon Corporation",
        "contact_name": "Doug Conley",
        "designation": "Marketing Manager- Municipal",
        "email": "dconley@calgoncarbon.com",
        "website": "calgoncarbon.com",
        "phone": "",
        "address": "",
        "linkedin_url": "",
        "marks": 5,
    },
    {
        "company_name": "American Tank & Fabricating Company",
        "contact_name": "Ted Thorbjornsen",
        "designation": "General Manager",
        "email": "tedt@atfco.com",
        "website": "atfco.com",
        "phone": "",
        "address": "",
        "linkedin_url": "",
        "marks": 5,
    },
    {
        "company_name": "Blake Jarrett & Co",
        "contact_name": "Blake Jarrett",
        "designation": "CEO",
        "email": "blake@blakejarrett.ca",
        "website": "blakejarrett.ca",
        "phone": None,
        "address": None,
        "linkedin_url": None,
        "marks": 5,
    },
    {
        "company_name": "Beracah Homes, Inc.",
        "contact_name": "Trent Collins",
        "designation": "Contractor Sales",
        "email": "trent@beracahhomes.com",
        "website": "beracahhomes.com",
        "phone": None,
        "address": None,
        "linkedin_url": None,
        "marks": 5,
    },
    {
        "company_name": "American Excelsior Company",
        "contact_name": "Terry Sadowski",
        "designation": "President",
        "email": "tsadowski@americanexcelsior.com",
        "website": "americanexcelsior.com",
        "phone": None,
        "address": None,
        "linkedin_url": None,
        "marks": 5,
    },
    {
        "company_name": "Calgon Carbon Corporation",
        "contact_name": "Doug Conley",
        "designation": "Marketing Manager- Municipal",
        "email": "dconley@calgoncarbon.com",
        "website": "calgoncarbon.com",
        "phone": None,
        "address": None,
        "linkedin_url": None,
        "marks": 5,
    },
    {
        "company_name": "American Tank & Fabricating Company",
        "contact_name": "Ted Thorbjornsen",
        "designation": "General Manager",
        "email": "tedt@atfco.com",
        "website": "atfco.com",
        "phone": None,
        "address": None,
        "linkedin_url": None,
        "marks": 5,
    },
    {
        "company_name": "Paul Evans",
        "contact_name": "Evan Fript",
        "designation": "CEO",
        "email": "evan@paulevansny.com",
        "website": "paulevansny.com",
        "phone": None,
        "address": None,
        "linkedin_url": None,
        "marks": 5,
    },
    {
        "company_name": "DanceFIT Studio, LLC",
        "contact_name": "Gina Fay",
        "designation": "Founder",
        "email": "gina@dancefitstudio.com",
        "website": "dancefitstudio.com",
        "phone": None,
        "address": None,
        "linkedin_url": None,
        "marks": 5,
    },
    {
        "company_name": "Portland Pedal Power LLC",
        "contact_name": "Jenn Dederich",
        "designation": "Founder",
        "email": "Jenn@portlandpedalpower.com",
        "website": "portlandpedalpower.com",
        "phone": None,
        "address": None,
        "linkedin_url": None,
        "marks": 5,
    },
    {
        "company_name": "Milan Media Group",
        "contact_name": "Reva Caldwell-Johnson",
        "designation": "Chief Executive Officer",
        "email": "reva@milanmediagroup.com",
        "website": "milanmediagroup.com",
        "phone": None,
        "address": None,
        "linkedin_url": None,
        "marks": 5,
    },
    {
        "company_name": "Anitox Corp.",
        "contact_name": "Rick Phillips",
        "designation": "CEO",
        "email": "rphillips@anitox.com",
        "website": "anitox.com",
        "phone": None,
        "address": None,
        "linkedin_url": None,
        "marks": 5,
    },
    {
        "company_name": "American Products, L.L.C.",
        "contact_name": "Steven Smith",
        "designation": "President",
        "email": "ssmith@amprod.us",
        "website": "amprod.us",
        "phone": None,
        "address": None,
        "linkedin_url": None,
        "marks": 5,
    },
    {
        "company_name": "Rent frock Repeat",
        "contact_name": "Lisa Delorme",
        "designation": "Founder",
        "email": "lisa@rentfrockrepeat.com",
        "website": "rentfrockrepeat.com",
        "phone": None,
        "address": None,
        "linkedin_url": None,
        "marks": 5,
    },
    {
        "company_name": "Black Box Social Media, LLC",
        "contact_name": "Tom Bukacek",
        "designation": "CEO",
        "email": "tom@blackboxsocialmedia.com",
        "website": "blackboxsocialmedia.com",
        "phone": None,
        "address": None,
        "linkedin_url": None,
        "marks": 5,
    },
    {
        "company_name": "Bombardier Recreational Products Inc.",
        "contact_name": "Johanne Denault",
        "designation": "Manager, Corporate Communications",
        "email": "johanne.denault@brp.com",
        "website": "brp.com",
        "phone": None,
        "address": None,
        "linkedin_url": None,
        "marks": 5,
    },
    {
        "company_name": "Broadwind Energy, Inc.",
        "contact_name": "Brett Hartman",
        "designation": "Sales Engineer",
        "email": "brett.hartman@bwen.com",
        "website": "bwen.com",
        "phone": None,
        "address": None,
        "linkedin_url": None,
        "marks": 5,
    },
    {
        "company_name": "Bluecat Networks Inc",
        "contact_name": "Michael Harris",
        "designation": "CEO",
        "email": "mharris@bluecatnetworks.com",
        "website": "bluecatnetworks.com",
        "phone": None,
        "address": None,
        "linkedin_url": None,
        "marks": 5,
    },
    {
        "company_name": "Block and Company, Inc.",
        "contact_name": "Cindy Brugioni",
        "designation": "Creative Services & Marketing Communications",
        "email": "cbrugioni@blockinc.com",
        "website": "blockandcompany.com",
        "phone": None,
        "address": None,
        "linkedin_url": None,
        "marks": 5,
    },
    {
        "company_name": "Belt Power, LLC",
        "contact_name": "John Shelton",
        "designation": "President",
        "email": "jshelton@beltpower.com",
        "website": "beltpower.com",
        "phone": None,
        "address": None,
        "linkedin_url": None,
        "marks": 5,
    },
    {
        "company_name": "Amuneal Manufacturing Corp.",
        "contact_name": "Adam Kamens",
        "designation": "CEO",
        "email": "adamk@amuneal.com",
        "website": "amuneal.com",
        "phone": None,
        "address": None,
        "linkedin_url": None,
        "marks": 5,
    },
    {
        "company_name": "Almo Corporation",
        "contact_name": "Warren Chaiken",
        "designation": "Chief Operating Officer",
        "email": "wchaiken@almo.com",
        "website": "almo.com",
        "phone": None,
        "address": None,
        "linkedin_url": None,
        "marks": 5,
    },
    {
        "company_name": "Align Production Systems",
        "contact_name": "Jason Stoecker",
        "designation": "CEO",
        "email": "jstoecker@alignprod.com",
        "website": "alignproductionsystems.com",
        "phone": None,
        "address": None,
        "linkedin_url": None,
        "marks": 5,
    },
    {
        "company_name": "Active Power, Inc.",
        "contact_name": "John K. Penver",
        "designation": "Chief Financial Officer",
        "email": "johnpenver@activepower.com",
        "website": "https://www.activepower.com/en-GB",
        "phone": None,
        "address": None,
        "linkedin_url": None,
        "marks": 5,
    },
    {
        "company_name": "Engineering for Kids",
        "contact_name": "Dori Roberts",
        "designation": "CEO",
        "email": "droberts@engineeringforkids.net",
        "website": "engineeringforkids.com",
        "phone": None,
        "address": None,
        "linkedin_url": None,
        "marks": 5,
    },
    {
        "company_name": "BTI Consulting, Inc.",
        "contact_name": "Bruno Tateossian",
        "designation": "Chief Executive Officer",
        "email": "bruno@bti-consulting.net",
        "website": "bticonsulting.com",
        "phone": None,
        "address": None,
        "linkedin_url": None,
        "marks": 5,
    },
    {
        "company_name": "Photonova Studios",
        "contact_name": "Rick Portanova",
        "designation": "President",
        "email": "Rick@photonovastudios.com",
        "website": "photonovastudios.com",
        "phone": None,
        "address": None,
        "linkedin_url": None,
        "marks": 5,
    },
]

CONTACTS = [
    {
        "companyName": "Celanese Corporation",
        "websiteUrl": "http://celanese.com",
        "streetAddress": "222 W. Las Colinas Blvd.",
        "city": "Irving",
        "state": "TX",
        "zipCode": "75039",
        "companyPhoneNumber": "+1 972-443-4000",
        "generalEmail": "questions@celanese.com",
        "facebookPage": "https://www.facebook.com/Celanese/",
        "marks": 20,
    },
    {
        "companyName": "Calgon Carbon Corporation",
        "websiteUrl": "http://calgoncarbon.com",
        "streetAddress": "3000 GSK Drive",
        "city": "Moon Township",
        "state": "PA",
        "zipCode": 15108,
        "companyPhoneNumber": "412-787-6700",
        "generalEmail": "info@calgoncarbon.com",
        "facebookPage": "https://www.facebook.com/calgoncarbon/",
        "marks": 5,
    },
    {
        "companyName": "Belt Power, LLC",
        "websiteUrl": "http://beltpower.com",
        "streetAddress": "2355 Church Road SE",
        "city": "Atlanta",
        "state": "GA",
        "zipCode": "30339",
        "companyPhoneNumber": "800-886-2358",
        "generalEmail": "sales@beltpower.com",
        "facebookPage": "https://www.facebook.com/BeltPower/",
        "marks": 20,
    },
    {
        "companyName": "CEDA International",
        "websiteUrl": "http://ceda.com/",
        "streetAddress": "Suite 625, 11012 Macleod Trail SE",
        "city": "Calgary",
        "state": "AB",
        "zipCode": "T2J 6A5",
        "companyPhoneNumber": "1-403-253-3233",
        "generalEmail": "info@cedagroup.com",
        "facebookPage": "https://www.facebook.com/CEDA.International",
        "marks": 20,
    },
    {
        "companyName": "CCL Industries Inc",
        "websiteUrl": "http://cclind.com",
        "streetAddress": "105 Gordon Baker Road Suite 801",
        "city": "Toronto",
        "state": "ON",
        "zipCode": "M2H 3R1",
        "companyPhoneNumber": 4167568500,
        "generalEmail": "ccl@cclind.com",
        "facebookPage": "https://www.facebook.com/pages/CCL-Industries-Inc/215880722133999",
        "marks": 5,
    },
    {
        "companyName": "Calnetix Technologies, LLC",
        "websiteUrl": "http://calnetix.com",
        "streetAddress": "16323 Shoemaker Ave.",
        "city": "Cerritos",
        "state": "CA",
        "zipCode": 90703,
        "companyPhoneNumber": "1-562-293-1660",
        "generalEmail": "info@calnetix.com",
        "facebookPage": "https://www.facebook.com/calnetix/",
        "marks": 5,
    },
    {
        "companyName": "Celanese Corporation",
        "websiteUrl": "http://celanese.com",
        "streetAddress": "222 W. Las Colinas Blvd.",
        "city": "Irving",
        "state": "TX",
        "zipCode": 75039,
        "companyPhoneNumber": "+1 972-443-4000",
        "generalEmail": "questions@celanese.com",
        "facebookPage": "https://www.facebook.com/Celanese/",
        "marks": 5,
    },
    {
        "companyName": "Calgon Carbon Corporation",
        "websiteUrl": "http://calgoncarbon.com",
        "streetAddress": "3000 GSK Drive",
        "city": "Moon Township",
        "state": "PA",
        "zipCode": 15108,
        "companyPhoneNumber": "412-787-6700",
        "generalEmail": "info@calgoncarbon.com",
        "facebookPage": "https://www.facebook.com/calgoncarbon/",
        "marks": 5,
    },
    {
        "companyName": "Belt Power, LLC",
        "websiteUrl": "http://beltpower.com",
        "streetAddress": "2355 Church Road SE",
        "city": "Atlanta",
        "state": "GA",
        "zipCode": 30339,
        "companyPhoneNumber": "800-886-2358",
        "generalEmail": "sales@beltpower.com",
        "facebookPage": "https://www.facebook.com/BeltPower/",
        "marks": 5,
    },
    {
        "companyName": "CEDA International",
        "websiteUrl": "http://ceda.com/",
        "streetAddress": "Suite 625, 11012 Macleod Trail SE",
        "city": "Calgary",
        "state": "AB",
        "zipCode": "T2J 6A5",
        "companyPhoneNumber": "1-403-253-3233",
        "generalEmail": "info@cedagroup.com",
        "facebookPage": "https://www.facebook.com/CEDA.International",
        "marks": 5,
    },
    {
        "companyName": "CCL Industries Inc",
        "websiteUrl": "http://cclind.com",
        "streetAddress": "105 Gordon Baker Road Suite 801",
        "city": "Toronto",
        "state": "ON",
        "zipCode": "M2H 3R1",
        "companyPhoneNumber": 4167568500,
        "generalEmail": "ccl@cclind.com",
        "facebookPage": "https://www.facebook.com/pages/CCL-Industries-Inc/215880722133999",
        "marks": 5,
    },
    {
        "companyName": "Calnetix Technologies, LLC",
        "websiteUrl": "http://calnetix.com",
        "streetAddress": "16323 Shoemaker Ave.",
        "city": "Cerritos",
        "state": "CA",
        "zipCode": 90703,
        "companyPhoneNumber": "1-562-293-1660",
        "generalEmail": "info@calnetix.com",
        "facebookPage": "https://www.facebook.com/calnetix/",
        "marks": 5,
    },
    {
        "companyName": "Calmac Corp.",
        "websiteUrl": "http://calmac.com",
        "streetAddress": "3-00 Banta Place",
        "city": "Fair Lawn",
        "state": "NJ",
        "zipCode": 7410,
        "companyPhoneNumber": "201-797-1511",
        "generalEmail": "info@calmac.com",
        "facebookPage": "https://www.facebook.com/CalmacEnergyStorage",
        "marks": 5,
    },
    {
        "companyName": "C & M Corporation",
        "websiteUrl": "http://cmcorporation.com",
        "streetAddress": "349 Lake Road",
        "city": "Dayville",
        "state": "CT",
        "zipCode": 6241,
        "companyPhoneNumber": "(1) 860 774 4812",
        "generalEmail": "SalesAM@cmcorporation.com",
        "facebookPage": "https://www.facebook.com/CMCorporation/",
        "marks": 5,
    },
    {
        "companyName": "Broadwind Energy, Inc.",
        "websiteUrl": "http://bwen.com/",
        "streetAddress": "3240 S. Central Ave.",
        "city": "Cicero",
        "state": "IL",
        "zipCode": 60804,
        "companyPhoneNumber": "708\xad.780.4800",
        "generalEmail": "info@bwen.com",
        "facebookPage": "https://www.facebook.com/Broadwind/",
        "marks": 5,
    },
    {
        "companyName": "Bridgewell Resources LLC",
        "websiteUrl": "http://bridgewellresources.com",
        "streetAddress": "10200 SW Greenburg Rd Suite# 400",
        "city": "TIGARD",
        "state": "OR",
        "zipCode": 97223,
        "companyPhoneNumber": "503.872.3557",
        "generalEmail": "info@bridgewellres.com",
        "facebookPage": "https://www.facebook.com/BridgewellResources",
        "marks": 5,
    },
    {
        "companyName": "Boyd Corporation",
        "websiteUrl": "http://boydcorp.com",
        "streetAddress": "5960 Inglewood Dr. Suite 115",
        "city": "Pleasanton",
        "state": "CA",
        "zipCode": 94588,
        "companyPhoneNumber": "1(888)244-6931",
        "generalEmail": "customerservice@boydcorp.com",
        "facebookPage": "https://www.facebook.com/Boyd-Corporation-745405212139622/?ref=hl",
        "marks": 5,
    },
    {
        "companyName": "Bohler-Uddeholm Corporation",
        "websiteUrl": "http://bucorp.com",
        "streetAddress": "2505 Milennium Drive",
        "city": "Elgin",
        "state": "IL",
        "zipCode": 60124,
        "companyPhoneNumber": "1-800-638-2520",
        "generalEmail": "info@bucorp.com",
        "facebookPage": "https://www.facebook.com/4buna/",
        "marks": 5,
    },
    {
        "companyName": "Bluecat Networks Inc",
        "websiteUrl": "http://bluecatnetworks.com",
        "streetAddress": "4101 Yonge St 3rd Floor",
        "city": "Toronto",
        "state": "ON",
        "zipCode": "ON M2P 2B5",
        "companyPhoneNumber": "1.416.646.8400",
        "generalEmail": "support@bluecatnetworks.com",
        "facebookPage": "https://www.facebook.com/BlueCatNetworks/",
        "marks": 5,
    },
    {
        "companyName": "Block and Company, Inc.",
        "websiteUrl": "http://blockandcompany.com",
        "streetAddress": "1111 Wheeling Road",
        "city": "Wheeling",
        "state": "IL",
        "zipCode": "60090-5795",
        "companyPhoneNumber": "800.323.7556",
        "generalEmail": "info@blockinc.com",
        "facebookPage": "https://www.facebook.com/blockandcompany",
        "marks": 5,
    },
    {
        "companyName": "Bliley Technologies, Inc.",
        "websiteUrl": "http://bliley.com",
        "streetAddress": "2545 W. Grandview",
        "city": "Erie",
        "state": "PA",
        "zipCode": 16506,
        "companyPhoneNumber": "(814) 838-3571",
        "generalEmail": "sales@bliley.com",
        "facebookPage": "https://www.facebook.com/BlileyTech/",
        "marks": 5,
    },
    {
        "companyName": "Blake Jarrett & Company Inc.",
        "websiteUrl": "http://blakejarrett.ca/portfolio/",
        "streetAddress": "66 Lesmill Road",
        "city": "Toronto",
        "state": "ON",
        "zipCode": "M3B 2T5",
        "companyPhoneNumber": "416.385.1660",
        "generalEmail": "info@blakejarrett.ca",
        "facebookPage": "https://www.facebook.com/BlakeJarrettCo/",
        "marks": 5,
    },
    {
        "companyName": "Bit Order Technologies Inc.",
        "websiteUrl": "http://bitordertech.com",
        "streetAddress": "8765, Stockard Drive, Unit 101",
        "city": "Frisco",
        "state": "TX",
        "zipCode": 75034,
        "companyPhoneNumber": "1 (415) 230 0592",
        "generalEmail": "info@bitordertech.com",
        "facebookPage": "https://www.facebook.com/BitOrder/",
        "marks": 5,
    },
    {
        "companyName": "BEUMER Corporation",
        "websiteUrl": "http://www.beumergroup.com/",
        "streetAddress": "800 Apgar Drive",
        "city": "Somerset",
        "state": "NJ",
        "zipCode": 8873,
        "companyPhoneNumber": "1 732 893 - 2800",
        "generalEmail": "usa@beumergroup.com",
        "facebookPage": "https://www.facebook.com/BeumerGroup/",
        "marks": 5,
    },
    {
        "companyName": "Beracah Homes, Inc.",
        "websiteUrl": "http://beracahhomes.com",
        "streetAddress": "9590 Nanticoke Business Park Dr.",
        "city": "Greenwood",
        "state": "DE",
        "zipCode": 19950,
        "companyPhoneNumber": "1 302-349-4561",
        "generalEmail": "sales@beracahhomes.com",
        "facebookPage": "https://www.facebook.com/beracahhomes/",
        "marks": 5,
    },
    {
        "companyName": "Bepex International LLC",
        "websiteUrl": "http://bepex.com/",
        "streetAddress": "333 NE Taft Street",
        "city": "Minneapolis",
        "state": "MN",
        "zipCode": 55413,
        "companyPhoneNumber": "1 612-260-7462",
        "generalEmail": "info@bepex.com",
        "facebookPage": "https://www.facebook.com/BepexInternational/",
        "marks": 5,
    },
    {
        "companyName": "Apache Inc.",
        "websiteUrl": "http://www.apache-inc.com",
        "streetAddress": "4805 Bowling Street SW",
        "city": "Cedar Rapids",
        "state": "IA",
        "zipCode": 52404,
        "companyPhoneNumber": "(866) 757-7816",
        "generalEmail": "info@apache-inc.com",
        "facebookPage": "https://www.facebook.com/Apache.Inc/",
        "marks": 5,
    },
    {
        "companyName": "American Excelsior Company",
        "websiteUrl": "http://americanexcelsior.com",
        "streetAddress": "850 Ave H E",
        "city": "Arlington",
        "state": "TX",
        "zipCode": 76011,
        "companyPhoneNumber": "(800) 777-7645",
        "generalEmail": "sales@americanexcelsior.com",
        "facebookPage": "https://www.facebook.com/AmericanExcelsior/",
        "marks": 5,
    },
    {
        "companyName": "Align Production Systems",
        "websiteUrl": "http://alignproductionsystems.com/",
        "streetAddress": "2055 Craidshire Road, Suite 407",
        "city": "Maryland Heights",
        "state": "MO",
        "zipCode": 63043,
        "companyPhoneNumber": "(800) 888-0018",
        "generalEmail": "sales@alignprod.com",
        "facebookPage": "https://www.facebook.com/AlignProductionSystems/?fref=nf",
        "marks": 5,
    },
    {
        "companyName": "AFL Telecommunications LLC",
        "websiteUrl": "http://afltele.com",
        "streetAddress": "170 Ridgeview Center Drive",
        "city": "Duncan",
        "state": "SC",
        "zipCode": 29334,
        "companyPhoneNumber": "(800) 235-3423",
        "generalEmail": "sales@aflglobal.com",
        "facebookPage": "https://www.facebook.com/AFLcorp/",
        "marks": 5,
    },
    {
        "companyName": "Texas King Indo Pak Restaurant",
        "websiteUrl": "http://texaskingindopakrestaurant.com",
        "streetAddress": "6900 Alma Dr., #100",
        "city": "Plano",
        "state": "TX",
        "zipCode": 75023,
        "companyPhoneNumber": "972-517-5151",
        "generalEmail": "contact@texaskingindopakrestaurant.com",
        "facebookPage": "https://www.facebook.com/texaskingrestaurantplano",
        "marks": 5,
    },
    {
        "companyName": "Bentley Mills",
        "websiteUrl": "http://bentleymills.com",
        "streetAddress": "14641 E. Don Julian Road",
        "city": "City of Industry",
        "state": "CA",
        "zipCode": 91746,
        "companyPhoneNumber": "1 800-423-4709",
        "generalEmail": "marketing@bentleymills.com",
        "facebookPage": "https://www.facebook.com/BentleyMillsLA/",
        "marks": 5,
    },
    {
        "companyName": "Behlen Mfg. Co.",
        "websiteUrl": "http://behlenmfg.com",
        "streetAddress": "4025 E. 23rd Street",
        "city": "Columbus",
        "state": "NE",
        "zipCode": 68601,
        "companyPhoneNumber": "(402) 564-3111",
        "generalEmail": "behlen@behlenmfg.com",
        "facebookPage": "https://www.facebook.com/behlenmfgco/",
        "marks": 5,
    },
    {
        "companyName": "Ballard Power Systems Inc",
        "websiteUrl": "http://ballard.com/",
        "streetAddress": "9000 Glenlyon Parkway",
        "city": "Burnaby",
        "state": "BC",
        "zipCode": "V5J 5J8",
        "companyPhoneNumber": "1-604-454-900",
        "generalEmail": "marketing@ballard.com",
        "facebookPage": "https://www.facebook.com/Ballard-Power-Systems-205546066131866/",
        "marks": 5,
    },
    {
        "companyName": "Avure Technologies Inc",
        "websiteUrl": "http://avure.com",
        "streetAddress": "2601 South Verity Parkway Building 13",
        "city": "Middletown",
        "state": "OH",
        "zipCode": 45044,
        "companyPhoneNumber": "1-513-433-2500",
        "generalEmail": "info@avure.com",
        "facebookPage": "https://www.facebook.com/AvureHPP/",
        "marks": 5,
    },
    {
        "companyName": "JC Tebo’s Restaurant",
        "websiteUrl": "http://tebos.net",
        "streetAddress": "19120 S.E. McLoughlin Blvd.",
        "city": "Gladstone",
        "state": "OR",
        "zipCode": 97027,
        "companyPhoneNumber": "503-655-6333",
        "generalEmail": "jctebos@tebos.net",
        "facebookPage": "https://www.facebook.com/TebosRestaurant",
        "marks": 5,
    },
    {
        "companyName": "Acme Pizzaria",
        "websiteUrl": "http://acmepizzaria.com",
        "streetAddress": "280 S. Main Street",
        "city": "Cottonwood",
        "state": "AZ",
        "zipCode": 86326,
        "companyPhoneNumber": "(928) 634-ACME (2263)",
        "generalEmail": "acme@acmepizzaria.com",
        "facebookPage": "https://www.facebook.com/Acme-Pizzaria-116123298409928/",
        "marks": 5,
    },
    {
        "companyName": "Anton's Greek American Eatery",
        "websiteUrl": "http://antonsgreekrestaurant.com",
        "streetAddress": "577 New Scotland",
        "city": "Albany",
        "state": "NY",
        "zipCode": 12208,
        "companyPhoneNumber": "518-453-9191",
        "generalEmail": "ncschultzllc@yahoo.com",
        "facebookPage": "https://www.facebook.com/AntonsGreekRestaurant",
        "marks": 5,
    },
    {
        "companyName": "Barry’s Pizza And Italian Diner",
        "websiteUrl": "http://barryspizza.com",
        "streetAddress": "6003 Richmond",
        "city": "Houston",
        "state": "TX",
        "zipCode": 77057,
        "companyPhoneNumber": "713-266-8692",
        "generalEmail": "barryspizza@sbcglobal.net",
        "facebookPage": "https://www.facebook.com/BarrysPizza/about",
        "marks": 5,
    },
    {
        "companyName": "Better My POS",
        "websiteUrl": "http://bettermypos.com/",
        "streetAddress": "6165 Harrison Dr Suite#4",
        "city": "Las Vegas",
        "state": "NV",
        "zipCode": 89120,
        "companyPhoneNumber": "(702) 449-9384",
        "generalEmail": "wendy@bettermypos.com",
        "facebookPage": "https://www.facebook.com/Bettermypos/",
        "marks": 5,
    },
    {
        "companyName": "Bernies Holiday Restaurant",
        "websiteUrl": "http://bhr-sullivan.com/",
        "streetAddress": "277 Rock Hill Dr",
        "city": "Rock Hill",
        "state": "NY",
        "zipCode": 12775,
        "companyPhoneNumber": "(845) 796-3333",
        "generalEmail": "info@bhr-sullivan.com",
        "facebookPage": "https://www.facebook.com/BerniesHolidayRestaurant/",
        "marks": 5,
    },
    {
        "companyName": "Brett's Casual American",
        "websiteUrl": "http://brettscasualamerican.com/",
        "streetAddress": "3190 Atlanta Hwy #11",
        "city": "Athens",
        "state": "GA",
        "zipCode": 30606,
        "companyPhoneNumber": "706-850-1395",
        "generalEmail": "brettsrestaurant@gmail.com",
        "facebookPage": "https://www.facebook.com/diannacatersbretts/",
        "marks": 5,
    },
    {
        "companyName": "Bria Bistro Italiano",
        "websiteUrl": "http://brianashville.com/",
        "streetAddress": "8128 Highway 100",
        "city": "Nashville",
        "state": "TN",
        "zipCode": 37221,
        "companyPhoneNumber": "615-646-8274",
        "generalEmail": "bria@infinityhospitality.net",
        "facebookPage": "https://www.facebook.com/BriaBistro/",
        "marks": 5,
    },
    {
        "companyName": "Brix",
        "websiteUrl": "http://brix.com/",
        "streetAddress": "7377 St. Helena Highway",
        "city": "Napa",
        "state": "CA",
        "zipCode": 94558,
        "companyPhoneNumber": "707.944.2749",
        "generalEmail": "info@brix.com",
        "facebookPage": "https://www.facebook.com/BrixRestaurant/",
        "marks": 5,
    },
    {
        "companyName": "Adams Group",
        "websiteUrl": "http://discoveradams.com/",
        "streetAddress": "2221 Murphy Court",
        "city": "North Port",
        "state": "FL",
        "zipCode": 34289,
        "companyPhoneNumber": "941.639.7188",
        "generalEmail": "info@discoveradams.com",
        "facebookPage": "https://www.facebook.com/adamsgroup/",
        "marks": 5,
    },
    {
        "companyName": "ADCO Manufacturing",
        "websiteUrl": "http://adcomfg.com",
        "streetAddress": "2170 Academy Avenue",
        "city": "Sanger",
        "state": "CA",
        "zipCode": 93657,
        "companyPhoneNumber": "(559) 875-5563",
        "generalEmail": "info@adcomfg.com",
        "facebookPage": "https://www.facebook.com/adcomfg/",
        "marks": 5,
    },
    {
        "companyName": "Afco Systems, Inc.",
        "websiteUrl": "http://afcosystems.com",
        "streetAddress": "200 Finn Court",
        "city": "Farmingdale",
        "state": "NY",
        "zipCode": 11735,
        "companyPhoneNumber": "(631) 249-9441",
        "generalEmail": "sales@afcosystems.com",
        "facebookPage": "https://www.facebook.com/AFCO-Systems-Inc-299204250817/",
        "marks": 5,
    },
    {
        "companyName": "Relias Media",
        "websiteUrl": "https://www.reliasmedia.com",
        "streetAddress": "1010 Sync St, Suite 100",
        "city": "Morrisville",
        "state": "NC",
        "zipCode": "27560-5468",
        "companyPhoneNumber": "1-800-688-2421",
        "generalEmail": "customerservice@reliasmedia.com",
        "facebookPage": "https://www.facebook.com/ReliasMedia/",
        "marks": 5,
    },
    {
        "companyName": "Almo Corporation",
        "websiteUrl": "http://almo.com",
        "streetAddress": "2709 Commerce Way",
        "city": "Philadelphia",
        "state": "PA",
        "zipCode": 19154,
        "companyPhoneNumber": "(215) 698-4000",
        "generalEmail": "support@almo.com",
        "facebookPage": "https://www.facebook.com/almocorp/",
        "marks": 5,
    },
    {
        "companyName": "American Tank & Fabricating Company",
        "websiteUrl": "http://atfco.com/",
        "streetAddress": "12314 Elmwood Avenue",
        "city": "Cleveland",
        "state": "OH",
        "zipCode": 44111,
        "companyPhoneNumber": "(216) 252-1500",
        "generalEmail": "info@atfco.com",
        "facebookPage": "https://www.facebook.com/ATF-American-Tank-Fabricating-111290472269064/",
        "marks": 5,
    },
    {
        "companyName": "Amuneal Manufacturing Corp.",
        "websiteUrl": "http://amuneal.com/",
        "streetAddress": "4737 Darrah Street",
        "city": "Philadelphia",
        "state": "PA",
        "zipCode": 19124,
        "companyPhoneNumber": "(215) 535-3000",
        "generalEmail": "info@amuneal.com",
        "facebookPage": "https://www.facebook.com/amuneal/",
        "marks": 5,
    },
    {
        "companyName": "The Red Yeti",
        "websiteUrl": "http://www.redyetijeff.com/",
        "streetAddress": "256 Spring St",
        "city": "Jeffersonville",
        "state": "Indiana",
        "zipCode": "47130-3340",
        "companyPhoneNumber": "(812) 288-5788",
        "generalEmail": "big_red@redyetibrewing.com",
        "facebookPage": "https://www.facebook.com/RedYetiJeff/",
        "marks": 5,
    },
    {
        "companyName": "Simple Roots Brewing Co",
        "websiteUrl": "http://simplerootsbrewing.com/",
        "streetAddress": "1127 North Ave Ste 8",
        "city": "Burlington",
        "state": "Vermont",
        "zipCode": "05408-2756",
        "companyPhoneNumber": "(802) 399-2658",
        "generalEmail": "simplerootsbrewing@gmail.com",
        "facebookPage": "https://www.facebook.com/Simplerootsbrewing/",
        "marks": 5,
    },
]

TYPING_TESTS = [
    {
        "title": "Quality Policy",
        "paragraph": "ArcGate Quality Policy.ArcGate is committed to a global quality system focused on customer satisfaction. We achieve this through superior services, rapid customer support, technical expertise and industry leadership.Our quality and business objectives are designed to challenge the organisation through continual improvement, innovation and passion for results.Assisted 75+ world-class startups in rapidly bringing cost-effective solutions to market.",
        "marks": 10,
    }
]


def seed_special_questions():
    db = SessionLocal()
    try:
        admin_user = db.query(User).first()
        user_id = admin_user.id if admin_user else 1
        print(f"Using User ID: {user_id} for 'created_by'")

        total_seeded = 0
        total_updated = 0
        processed_lead_ids = set()
        processed_contact_ids = set()
        processed_typing_ids = set()

        # ─── 1. Lead Generation ──────────────────────────────────────────
        print("\n🚀 Seeding Lead Generation questions...")
        for lead in LEADS:
            c_name = lead.get("company_name", "")
            marks = lead.get("marks", 5)
            lead_opts = {
                k: v for k, v in lead.items() if k not in ["marks", "company_name"]
            }

            existing = (
                db.query(Question)
                .filter(
                    Question.question_type == "LEAD_GENERATION",
                    Question.subject_type == "LEAD_GENERATION",
                    Question.question_text == c_name,
                )
                .filter(Question.id.notin_(processed_lead_ids))
                .first()
            )

            if existing:
                processed_lead_ids.add(existing.id)
                existing.question_text = c_name
                existing.options = lead_opts
                existing.marks = marks
                print(f"  🔄 Updated lead: {c_name}")
                total_updated += 1
            else:
                new_q = Question(
                    question_type="LEAD_GENERATION",
                    subject_type="LEAD_GENERATION",
                    exam_level="FRESHER",
                    question_text=c_name,
                    marks=marks,
                    is_active=True,
                    options=lead_opts,
                    created_by=user_id,
                )
                db.add(new_q)
                db.flush()
                processed_lead_ids.add(new_q.id)
                db.add(
                    QuestionAnswer(
                        question_id=new_q.id,
                        answer_text="",
                        explanation="",
                        created_by=user_id,
                    )
                )
                total_seeded += 1
                print(f"  ✅ Added lead: {c_name}")

        db.commit()

        # ─── 2. Company Contact Details ───────────────────────────────────
        print("\n🚀 Seeding Company Contact Details questions...")
        for contact in CONTACTS:
            q_text = contact["websiteUrl"]
            marks = contact.get("marks", 5)
            contact_opts = {k: v for k, v in contact.items() if k != "marks"}

            existing = (
                db.query(Question)
                .filter(
                    Question.question_type == "CONTACT_DETAILS",
                    Question.subject_type == "COMPANY_CONTACT_DETAILS",
                    Question.question_text == q_text,
                )
                .filter(Question.id.notin_(processed_contact_ids))
                .first()
            )

            if existing:
                processed_contact_ids.add(existing.id)
                existing.options = contact_opts
                existing.marks = marks
                print(f"  🔄 Updated contact: {contact.get('companyName', q_text)}")
                total_updated += 1
            else:
                new_q = Question(
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
                db.add(
                    QuestionAnswer(
                        question_id=new_q.id,
                        answer_text="",
                        explanation="",
                        created_by=user_id,
                    )
                )
                total_seeded += 1
                print(f"  ✅ Added contact: {contact.get('companyName', q_text)}")

        db.commit()

        # ─── 3. Typing Test ───────────────────────────────────────────────
        print("\n🚀 Seeding Typing Test questions...")
        for typing in TYPING_TESTS:
            q_text = typing["title"]
            marks = typing.get("marks", 10)
            existing = (
                db.query(Question)
                .filter(
                    Question.question_type == "TYPING_TEST",
                    Question.subject_type == "TYPING_TEST",
                    Question.question_text == q_text,
                )
                .filter(Question.id.notin_(processed_typing_ids))
                .first()
            )

            if existing:
                processed_typing_ids.add(existing.id)
                existing.passage = typing["paragraph"]
                existing.marks = marks
                print(f"  🔄 Updated typing test: {q_text}")
                total_updated += 1
            else:
                new_q = Question(
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
                db.add(
                    QuestionAnswer(
                        question_id=new_q.id,
                        answer_text="",
                        explanation="",
                        created_by=user_id,
                    )
                )
                total_seeded += 1
                print(f"  ✅ Added typing test: {q_text}")

        db.commit()

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

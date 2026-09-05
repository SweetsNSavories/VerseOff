import os
import sys

# Run inside out/
base_dir = os.path.join(os.path.dirname(__file__), "out")
sys.path.insert(0, base_dir)

from db import LocalDatabase

def seed():
    db = LocalDatabase()
    db.secure_wipe()
    print(f"Seeding rich sample CRM data into {db.db_path}...")

    # 1. Accounts
    accounts = [
        {
            "accountid": "acc-101",
            "name": "Contoso Ltd",
            "accountnumber": "ACT-100234",
            "telephone1": "(425) 555-0100",
            "fax": "(425) 555-0101",
            "websiteurl": "https://www.contoso.com",
            "address1_line1": "One Microsoft Way",
            "address1_city": "Redmond",
            "address1_stateorprovince": "WA",
            "address1_postalcode": "98052",
            "address1_country": "USA",
            "industrycode": 1,
            "numberofemployees": 12500,
            "revenue": 45000000.0,
            "tickersymbol": "MSFT",
            "creditlimit": 500000.0,
            "preferredcontactmethodcode": 1,
            "description": "Global enterprise client specializing in technology solutions and cloud services.",
            "primarycontactid": "cnt-201",
            "primarycontactid@OData.Community.Display.V1.FormattedValue": "Yvonne McKay",
            "createdon": "2026-01-15T09:30:00Z",
            "createdon@OData.Community.Display.V1.FormattedValue": "2026-01-15 09:30",
            "_ownerid_value@OData.Community.Display.V1.FormattedValue": "Praveen Thonda"
        },
        {
            "accountid": "acc-102",
            "name": "Fabrikam, Inc.",
            "accountnumber": "ACT-100235",
            "telephone1": "(212) 555-0199",
            "fax": "(212) 555-0198",
            "websiteurl": "https://www.fabrikam.com",
            "address1_line1": "456 Lexington Ave, Suite 1800",
            "address1_city": "New York",
            "address1_stateorprovince": "NY",
            "address1_postalcode": "10017",
            "address1_country": "USA",
            "industrycode": 2,
            "numberofemployees": 4200,
            "revenue": 18500000.0,
            "tickersymbol": "FBKM",
            "creditlimit": 250000.0,
            "preferredcontactmethodcode": 1,
            "description": "Leading industrial manufacturing and robotics engineering partner.",
            "primarycontactid": "cnt-202",
            "primarycontactid@OData.Community.Display.V1.FormattedValue": "Jim Glynn",
            "createdon": "2026-02-10T14:15:00Z",
            "createdon@OData.Community.Display.V1.FormattedValue": "2026-02-10 14:15",
            "_ownerid_value@OData.Community.Display.V1.FormattedValue": "Praveen Thonda"
        },
        {
            "accountid": "acc-103",
            "name": "Adventure Works Cycles",
            "accountnumber": "ACT-100236",
            "telephone1": "(312) 555-0144",
            "websiteurl": "https://www.adventure-works.com",
            "address1_line1": "192 North Michigan Avenue",
            "address1_city": "Chicago",
            "address1_stateorprovince": "IL",
            "address1_postalcode": "60601",
            "address1_country": "USA",
            "industrycode": 3,
            "numberofemployees": 850,
            "revenue": 9200000.0,
            "tickersymbol": "ADVW",
            "creditlimit": 100000.0,
            "description": "High performance bicycle and outdoor sports equipment distributor.",
            "primarycontactid": "cnt-203",
            "primarycontactid@OData.Community.Display.V1.FormattedValue": "Nancy Anderson",
            "createdon": "2026-03-01T11:00:00Z",
            "createdon@OData.Community.Display.V1.FormattedValue": "2026-03-01 11:00",
            "_ownerid_value@OData.Community.Display.V1.FormattedValue": "Praveen Thonda"
        }
    ]

    for acc in accounts:
        db.upsert_remote_record("account", acc["accountid"], acc)

    # 2. Contacts
    contacts = [
        {
            "contactid": "cnt-201",
            "fullname": "Yvonne McKay",
            "jobtitle": "Chief Information Officer",
            "parentcustomerid": "acc-101",
            "parentcustomerid@OData.Community.Display.V1.FormattedValue": "Contoso Ltd",
            "emailaddress1": "yvonne.mckay@contoso.com",
            "mobilephone": "(425) 555-8901",
            "address1_line1": "One Microsoft Way",
            "address1_city": "Redmond",
            "address1_stateorprovince": "WA",
            "address1_postalcode": "98052",
            "gendercode": 2,
            "createdon": "2026-01-16T10:00:00Z",
            "createdon@OData.Community.Display.V1.FormattedValue": "2026-01-16 10:00",
            "_ownerid_value@OData.Community.Display.V1.FormattedValue": "Praveen Thonda"
        },
        {
            "contactid": "cnt-202",
            "fullname": "Jim Glynn",
            "jobtitle": "VP of Engineering",
            "parentcustomerid": "acc-102",
            "parentcustomerid@OData.Community.Display.V1.FormattedValue": "Fabrikam, Inc.",
            "emailaddress1": "jim.glynn@fabrikam.com",
            "mobilephone": "(212) 555-4567",
            "address1_line1": "456 Lexington Ave",
            "address1_city": "New York",
            "address1_stateorprovince": "NY",
            "address1_postalcode": "10017",
            "gendercode": 1,
            "createdon": "2026-02-11T16:20:00Z",
            "createdon@OData.Community.Display.V1.FormattedValue": "2026-02-11 16:20",
            "_ownerid_value@OData.Community.Display.V1.FormattedValue": "Praveen Thonda"
        },
        {
            "contactid": "cnt-203",
            "fullname": "Nancy Anderson",
            "jobtitle": "Director of Supply Chain",
            "parentcustomerid": "acc-103",
            "parentcustomerid@OData.Community.Display.V1.FormattedValue": "Adventure Works Cycles",
            "emailaddress1": "n.anderson@adventure-works.com",
            "mobilephone": "(312) 555-6712",
            "address1_line1": "192 North Michigan Avenue",
            "address1_city": "Chicago",
            "address1_stateorprovince": "IL",
            "address1_postalcode": "60601",
            "gendercode": 2,
            "createdon": "2026-03-02T13:45:00Z",
            "createdon@OData.Community.Display.V1.FormattedValue": "2026-03-02 13:45",
            "_ownerid_value@OData.Community.Display.V1.FormattedValue": "Praveen Thonda"
        }
    ]

    for c in contacts:
        db.upsert_remote_record("contact", c["contactid"], c)

    # 3. Cases (incidents)
    cases = [
        {
            "incidentid": "cas-301",
            "title": "API Gateway Authentication Latency",
            "ticketnumber": "CAS-01048-V3R5",
            "customerid": "acc-101",
            "customerid@OData.Community.Display.V1.FormattedValue": "Contoso Ltd",
            "prioritycode": 1,
            "prioritycode@OData.Community.Display.V1.FormattedValue": "High",
            "caseorigincode": 2,
            "caseorigincode@OData.Community.Display.V1.FormattedValue": "Web",
            "productname": "VerseOff Cloud Connector",
            "description": "Sporadic 504 timeouts observed during token refresh handshakes on peak hours.",
            "createdon": "2026-04-05T08:12:00Z",
            "createdon@OData.Community.Display.V1.FormattedValue": "2026-04-05 08:12",
            "_ownerid_value@OData.Community.Display.V1.FormattedValue": "Praveen Thonda"
        },
        {
            "incidentid": "cas-302",
            "title": "Warehouse Robotics Sensor Sync Delay",
            "ticketnumber": "CAS-01049-M2W9",
            "customerid": "acc-102",
            "customerid@OData.Community.Display.V1.FormattedValue": "Fabrikam, Inc.",
            "prioritycode": 2,
            "prioritycode@OData.Community.Display.V1.FormattedValue": "Normal",
            "caseorigincode": 1,
            "caseorigincode@OData.Community.Display.V1.FormattedValue": "Phone",
            "productname": "Industrial IoT Hub",
            "description": "Floor telemetry batch uploads delayed by ~45 seconds after overnight firmware update.",
            "createdon": "2026-04-06T11:40:00Z",
            "createdon@OData.Community.Display.V1.FormattedValue": "2026-04-06 11:40",
            "_ownerid_value@OData.Community.Display.V1.FormattedValue": "Praveen Thonda"
        }
    ]

    for cas in cases:
        db.upsert_remote_record("incident", cas["incidentid"], cas)

    # 4. Opportunities
    opportunities = [
        {
            "opportunityid": "opp-401",
            "name": "Global Hybrid Cloud Infrastructure Upgrade",
            "parentaccountid": "acc-101",
            "parentaccountid@OData.Community.Display.V1.FormattedValue": "Contoso Ltd",
            "parentcontactid": "cnt-201",
            "parentcontactid@OData.Community.Display.V1.FormattedValue": "Yvonne McKay",
            "estimatedvalue": 320000.0,
            "estimatedclosedate": "2026-11-30T00:00:00Z",
            "closeprobability": 75,
            "purchasetimeframe": 1,
            "budgetamount": 350000.0,
            "need": "Modernize existing multi-region server cluster with low-latency edge nodes.",
            "proposedsolution": "VerseOff Dedicated Enterprise Appliance with automated SQLite edge replication.",
            "createdon": "2026-03-15T15:00:00Z",
            "createdon@OData.Community.Display.V1.FormattedValue": "2026-03-15 15:00",
            "_ownerid_value@OData.Community.Display.V1.FormattedValue": "Praveen Thonda"
        },
        {
            "opportunityid": "opp-402",
            "name": "Automated Assembly Telemetry Fleet License",
            "parentaccountid": "acc-102",
            "parentaccountid@OData.Community.Display.V1.FormattedValue": "Fabrikam, Inc.",
            "parentcontactid": "cnt-202",
            "parentcontactid@OData.Community.Display.V1.FormattedValue": "Jim Glynn",
            "estimatedvalue": 185000.0,
            "estimatedclosedate": "2026-10-15T00:00:00Z",
            "closeprobability": 60,
            "purchasetimeframe": 2,
            "budgetamount": 200000.0,
            "need": "Real-time edge metrics capture without dependency on constant WAN connectivity.",
            "proposedsolution": "VerseOff Edge Core 50-node license.",
            "createdon": "2026-03-20T09:30:00Z",
            "createdon@OData.Community.Display.V1.FormattedValue": "2026-03-20 09:30",
            "_ownerid_value@OData.Community.Display.V1.FormattedValue": "Praveen Thonda"
        }
    ]

    for opp in opportunities:
        db.upsert_remote_record("opportunity", opp["opportunityid"], opp)

    # 5. Leads
    leads = [
        {
            "leadid": "lead-501",
            "subject": "Evaluation of Offline PowerApps Alternative",
            "fullname": "David Ortiz",
            "companyname": "Northwind Traders",
            "emailaddress1": "d.ortiz@northwindtraders.com",
            "telephone1": "(206) 555-0321",
            "budgetamount": 75000.0,
            "purchasetimeframe": 1,
            "leadsourcecode": 1,
            "createdon": "2026-04-01T14:10:00Z",
            "createdon@OData.Community.Display.V1.FormattedValue": "2026-04-01 14:10",
            "_ownerid_value@OData.Community.Display.V1.FormattedValue": "Praveen Thonda"
        },
        {
            "leadid": "lead-502",
            "subject": "Field Service Offline Mobility Pilot",
            "fullname": "Samantha Miller",
            "companyname": "Woodgrove Bank",
            "emailaddress1": "smiller@woodgrove.com",
            "telephone1": "(415) 555-0789",
            "budgetamount": 120000.0,
            "purchasetimeframe": 2,
            "leadsourcecode": 3,
            "createdon": "2026-04-02T10:25:00Z",
            "createdon@OData.Community.Display.V1.FormattedValue": "2026-04-02 10:25",
            "_ownerid_value@OData.Community.Display.V1.FormattedValue": "Praveen Thonda"
        }
    ]

    for ld in leads:
        db.upsert_remote_record("lead", ld["leadid"], ld)

    print("Successfully seeded all 5 entities with sample records!")

if __name__ == "__main__":
    seed()

import json

def build_manifest():
    manifest = {
        "manifest_version": 1,
        "generator": "VerseOff Maker Studio",
        "app_name": "VerseOff Enterprise Sales & Service",
        "source_app": {
            "appmoduleid": "00000000-0000-0000-0000-000000000001",
            "appmoduleidunique": "00000000-0000-0000-0000-000000000002",
            "name": "VerseOff Enterprise Sales & Service",
            "uniquename": "verseoff_enterprise_crm",
            "description": "Full-featured offline enterprise CRM with Accounts, Contacts, Cases, Leads, and Opportunities."
        },
        "org_url": "https://verseoff-prod.crm.dynamics.com",
        "client_id": "51f81489-12ee-4a9e-aaae-a2591f45987d",
        "tenant_id": "common",
        "sync_interval": 300,
        "auto_sync_on_start": False,
        "sitemap": {
            "areas": [
                {
                    "id": "Area_Sales",
                    "title": "Sales",
                    "groups": [
                        {
                            "id": "Group_Customers",
                            "title": "Customers",
                            "subareas": [
                                {"id": "SubArea_Accounts", "entity": "account", "title": "Accounts"},
                                {"id": "SubArea_Contacts", "entity": "contact", "title": "Contacts"}
                            ]
                        },
                        {
                            "id": "Group_SalesPipeline",
                            "title": "Sales Pipeline",
                            "subareas": [
                                {"id": "SubArea_Leads", "entity": "lead", "title": "Leads"},
                                {"id": "SubArea_Opportunities", "entity": "opportunity", "title": "Opportunities"}
                            ]
                        }
                    ]
                },
                {
                    "id": "Area_Service",
                    "title": "Customer Service",
                    "groups": [
                        {
                            "id": "Group_ServiceManagement",
                            "title": "Cases & Tickets",
                            "subareas": [
                                {"id": "SubArea_Incidents", "entity": "incident", "title": "Cases"}
                            ]
                        }
                    ]
                },
                {
                    "id": "Area_Analytics",
                    "title": "Analytics",
                    "groups": [
                        {
                            "id": "Group_Reports",
                            "title": "Reports & Dashboards",
                            "subareas": [
                                {
                                    "id": "SubArea_Dashboard",
                                    "entity": "",
                                    "title": "Executive Sales Dashboard",
                                    "destination_type": "dashboard",
                                    "default_dashboard": "00000000-0000-0000-0000-000000000010",
                                    "available_offline": False
                                }
                            ]
                        }
                    ]
                }
            ]
        },
        "entities": []
    }

    # BPF for Lead to Opportunity
    lead_to_opp_bpf = {
        "processid": "bpf-001",
        "name": "Lead to Opportunity Sales Process",
        "primary_entity": "opportunity",
        "stages": [
            {
                "stageid": "s_qualify",
                "stagename": "Qualify",
                "category": "Identify",
                "steps": [
                    {"stepid": "step_qual_1", "name": "Existing Contact?", "attribute": "parentcontactid", "required": True},
                    {"stepid": "step_qual_2", "name": "Existing Account?", "attribute": "parentaccountid", "required": True},
                    {"stepid": "step_qual_3", "name": "Purchase Timeframe", "attribute": "purchasetimeframe", "required": False},
                    {"stepid": "step_qual_4", "name": "Estimated Budget", "attribute": "budgetamount", "required": False}
                ]
            },
            {
                "stageid": "s_develop",
                "stagename": "Develop",
                "category": "Research",
                "steps": [
                    {"stepid": "step_dev_1", "name": "Customer Need", "attribute": "need", "required": True},
                    {"stepid": "step_dev_2", "name": "Proposed Solution", "attribute": "proposedsolution", "required": False},
                    {"stepid": "step_dev_3", "name": "Identify Competitors", "attribute": "currentsituation", "required": False}
                ]
            },
            {
                "stageid": "s_propose",
                "stagename": "Propose",
                "category": "Proposal",
                "steps": [
                    {"stepid": "step_prop_1", "name": "Present Proposal", "attribute": "description", "required": True},
                    {"stepid": "step_prop_2", "name": "Confirm Price / Quote", "attribute": "estimatedvalue", "required": True}
                ]
            },
            {
                "stageid": "s_close",
                "stagename": "Close",
                "category": "Finalize",
                "steps": [
                    {"stepid": "step_close_1", "name": "Final Decision Date", "attribute": "estimatedclosedate", "required": True},
                    {"stepid": "step_close_2", "name": "File De-brief Notes", "attribute": "description", "required": False}
                ]
            }
        ]
    }

    # BPF for Case Resolution
    case_bpf = {
        "processid": "bpf-002",
        "name": "Phone to Case Resolution Process",
        "primary_entity": "incident",
        "stages": [
            {
                "stageid": "s_identify",
                "stagename": "Identify",
                "category": "Intake",
                "steps": [
                    {"stepid": "c_step_1", "name": "Verify Customer", "attribute": "customerid", "required": True},
                    {"stepid": "c_step_2", "name": "Case Title", "attribute": "title", "required": True},
                    {"stepid": "c_step_3", "name": "Case Origin", "attribute": "caseorigincode", "required": False}
                ]
            },
            {
                "stageid": "s_research",
                "stagename": "Research",
                "category": "Investigation",
                "steps": [
                    {"stepid": "c_step_4", "name": "Description / Symptoms", "attribute": "description", "required": True},
                    {"stepid": "c_step_5", "name": "Priority Assessment", "attribute": "prioritycode", "required": False}
                ]
            },
            {
                "stageid": "s_resolve",
                "stagename": "Resolve",
                "category": "Resolution",
                "steps": [
                    {"stepid": "c_step_6", "name": "Resolution Summary", "attribute": "resolution", "required": True},
                    {"stepid": "c_step_7", "name": "Customer Satisfaction", "attribute": "cstatus", "required": False}
                ]
            }
        ]
    }

    # BPF for Account Onboarding
    account_bpf = {
        "processid": "bpf-003",
        "name": "Account Onboarding & Growth Process",
        "primary_entity": "account",
        "stages": [
            {
                "stageid": "acc_s_onboard",
                "stagename": "Onboard",
                "category": "Intake",
                "steps": [
                    {"stepid": "acc_st_1", "name": "Primary Contact", "attribute": "primarycontactid", "required": True},
                    {"stepid": "acc_st_2", "name": "Main Phone", "attribute": "telephone1", "required": True},
                    {"stepid": "acc_st_3", "name": "Credit Limit", "attribute": "creditlimit", "required": False}
                ]
            },
            {
                "stageid": "acc_s_kyc",
                "stagename": "Compliance",
                "category": "Verification",
                "steps": [
                    {"stepid": "acc_st_4", "name": "Industry", "attribute": "industrycode", "required": True},
                    {"stepid": "acc_st_5", "name": "Annual Revenue", "attribute": "revenue", "required": False}
                ]
            },
            {
                "stageid": "acc_s_growth",
                "stagename": "Expansion",
                "category": "Growth",
                "steps": [
                    {"stepid": "acc_st_6", "name": "Account Owner", "attribute": "ownerid", "required": True}
                ]
            }
        ]
    }

    # 1. ACCOUNT ENTITY
    account_form_xml = """<form>
        <tabs>
            <tab name='SUMMARY_TAB' id='{tab_acc_summary}'>
                <labels><label description='Summary' languagecode='1033'/></labels>
                <columns>
                    <column width='34%'>
                        <sections>
                            <section name='ACCOUNT_INFORMATION' id='{sec_acc_info}'>
                                <labels><label description='Account Information' languagecode='1033'/></labels>
                                <rows>
                                    <row><cell id='{c_name}'><labels><label description='Account Name' languagecode='1033'/></labels><control id='name' classid='{4273EDBD-AC1D-40d3-9FB2-095C621B552D}' datafieldname='name'/></cell></row>
                                    <row><cell id='{c_phone}'><labels><label description='Phone' languagecode='1033'/></labels><control id='telephone1' classid='{4273EDBD-AC1D-40d3-9FB2-095C621B552D}' datafieldname='telephone1'/></cell></row>
                                    <row><cell id='{c_fax}'><labels><label description='Fax' languagecode='1033'/></labels><control id='fax' classid='{4273EDBD-AC1D-40d3-9FB2-095C621B552D}' datafieldname='fax'/></cell></row>
                                    <row><cell id='{c_web}'><labels><label description='Website' languagecode='1033'/></labels><control id='websiteurl' classid='{4273EDBD-AC1D-40d3-9FB2-095C621B552D}' datafieldname='websiteurl'/></cell></row>
                                    <row><cell id='{c_contact}'><labels><label description='Primary Contact' languagecode='1033'/></labels><control id='primarycontactid' classid='{270BD3DB-D9AF-4782-9025-509E298DEC0A}' datafieldname='primarycontactid'/></cell></row>
                                </rows>
                            </section>
                        </sections>
                    </column>
                    <column width='33%'>
                        <sections>
                            <section name='ADDRESS_SECTION' id='{sec_acc_addr}'>
                                <labels><label description='Address &amp; Location' languagecode='1033'/></labels>
                                <rows>
                                    <row><cell id='{c_addr1}'><labels><label description='Street Address' languagecode='1033'/></labels><control id='address1_line1' classid='{4273EDBD-AC1D-40d3-9FB2-095C621B552D}' datafieldname='address1_line1'/></cell></row>
                                    <row><cell id='{c_city}'><labels><label description='City' languagecode='1033'/></labels><control id='address1_city' classid='{4273EDBD-AC1D-40d3-9FB2-095C621B552D}' datafieldname='address1_city'/></cell></row>
                                    <row><cell id='{c_state}'><labels><label description='State/Province' languagecode='1033'/></labels><control id='address1_stateorprovince' classid='{4273EDBD-AC1D-40d3-9FB2-095C621B552D}' datafieldname='address1_stateorprovince'/></cell></row>
                                    <row><cell id='{c_zip}'><labels><label description='Postal Code' languagecode='1033'/></labels><control id='address1_postalcode' classid='{4273EDBD-AC1D-40d3-9FB2-095C621B552D}' datafieldname='address1_postalcode'/></cell></row>
                                    <row><cell id='{c_country}'><labels><label description='Country/Region' languagecode='1033'/></labels><control id='address1_country' classid='{4273EDBD-AC1D-40d3-9FB2-095C621B552D}' datafieldname='address1_country'/></cell></row>
                                </rows>
                            </section>
                        </sections>
                    </column>
                    <column width='33%'>
                        <sections>
                            <section name='TIMELINE_SECTION' id='{sec_acc_timeline}'>
                                <labels><label description='Timeline &amp; Activities' languagecode='1033'/></labels>
                                <rows>
                                    <row><cell id='{c_timeline}'><labels><label description='Activities' languagecode='1033'/></labels><control id='notescontrol' classid='{06375649-C143-495E-A496-C962E5B4488E}' datafieldname='notescontrol'/></cell></row>
                                </rows>
                            </section>
                        </sections>
                    </column>
                </columns>
            </tab>
            <tab name='DETAILS_TAB' id='{tab_acc_details}'>
                <labels><label description='Details' languagecode='1033'/></labels>
                <columns>
                    <column width='50%'>
                        <sections>
                            <section name='COMPANY_PROFILE' id='{sec_acc_prof}'>
                                <labels><label description='Company Profile' languagecode='1033'/></labels>
                                <rows>
                                    <row><cell id='{c_ind}'><labels><label description='Industry' languagecode='1033'/></labels><control id='industrycode' classid='{3EF39988-22BB-4f0b-BBBE-64B5A3748AEE}' datafieldname='industrycode'/></cell></row>
                                    <row><cell id='{c_emp}'><labels><label description='Number of Employees' languagecode='1033'/></labels><control id='numberofemployees' classid='{C6D124CA-7EDD-4813-A4D4-976E90702F9E}' datafieldname='numberofemployees'/></cell></row>
                                    <row><cell id='{c_rev}'><labels><label description='Annual Revenue' languagecode='1033'/></labels><control id='revenue' classid='{533B9E00-756B-4312-95A0-DC888637AC78}' datafieldname='revenue'/></cell></row>
                                    <row><cell id='{c_ticker}'><labels><label description='Ticker Symbol' languagecode='1033'/></labels><control id='tickersymbol' classid='{4273EDBD-AC1D-40d3-9FB2-095C621B552D}' datafieldname='tickersymbol'/></cell></row>
                                </rows>
                            </section>
                        </sections>
                    </column>
                    <column width='50%'>
                        <sections>
                            <section name='BILLING_PREF' id='{sec_acc_bill}'>
                                <labels><label description='Billing &amp; Preferences' languagecode='1033'/></labels>
                                <rows>
                                    <row><cell id='{c_pref}'><labels><label description='Preferred Contact Method' languagecode='1033'/></labels><control id='preferredcontactmethodcode' classid='{3EF39988-22BB-4f0b-BBBE-64B5A3748AEE}' datafieldname='preferredcontactmethodcode'/></cell></row>
                                    <row><cell id='{c_cred}'><labels><label description='Credit Limit' languagecode='1033'/></labels><control id='creditlimit' classid='{533B9E00-756B-4312-95A0-DC888637AC78}' datafieldname='creditlimit'/></cell></row>
                                    <row><cell id='{c_desc}'><labels><label description='Description' languagecode='1033'/></labels><control id='description' classid='{E0DECE4B-6FC8-4a8f-A065-082708572369}' datafieldname='description'/></cell></row>
                                </rows>
                            </section>
                        </sections>
                    </column>
                </columns>
            </tab>
            <tab name='ADMIN_TAB' id='{tab_acc_admin}'>
                <labels><label description='Administration' languagecode='1033'/></labels>
                <columns>
                    <column width='50%'>
                        <sections>
                            <section name='INTERNAL_DETAILS' id='{sec_acc_admin_1}'>
                                <labels><label description='Record Details' languagecode='1033'/></labels>
                                <rows>
                                    <row><cell id='{c_owner}'><labels><label description='Owner' languagecode='1033'/></labels><control id='ownerid' classid='{270BD3DB-D9AF-4782-9025-509E298DEC0A}' datafieldname='ownerid'/></cell></row>
                                    <row><cell id='{c_acc_num}'><labels><label description='Account Number' languagecode='1033'/></labels><control id='accountnumber' classid='{4273EDBD-AC1D-40d3-9FB2-095C621B552D}' datafieldname='accountnumber'/></cell></row>
                                </rows>
                            </section>
                        </sections>
                    </column>
                    <column width='50%'>
                        <sections>
                            <section name='AUDIT_INFO' id='{sec_acc_audit}'>
                                <labels><label description='Audit Information' languagecode='1033'/></labels>
                                <rows>
                                    <row><cell id='{c_created}'><labels><label description='Created On' languagecode='1033'/></labels><control id='createdon' classid='{5B773807-9FB2-42db-97C3-7A91EFF8ADFF}' datafieldname='createdon'/></cell></row>
                                    <row><cell id='{c_modified}'><labels><label description='Modified On' languagecode='1033'/></labels><control id='modifiedon' classid='{5B773807-9FB2-42db-97C3-7A91EFF8ADFF}' datafieldname='modifiedon'/></cell></row>
                                </rows>
                            </section>
                        </sections>
                    </column>
                </columns>
            </tab>
        </tabs>
    </form>"""

    account_entity = {
        "LogicalName": "account",
        "DisplayName": {"UserLocalizedLabel": {"Label": "Account"}},
        "EntitySetName": "accounts",
        "PrimaryIdAttribute": "accountid",
        "PrimaryNameAttribute": "name",
        "ChangeTrackingEnabled": True,
        "attributes": [
            {"LogicalName": "accountid", "AttributeType": "Uniqueidentifier", "IsValidForRead": True, "IsValidForCreate": True, "IsValidForUpdate": False},
            {"LogicalName": "name", "AttributeType": "String", "DisplayName": {"UserLocalizedLabel": {"Label": "Account Name"}}, "IsValidForRead": True, "IsValidForCreate": True, "IsValidForUpdate": True},
            {"LogicalName": "accountnumber", "AttributeType": "String", "DisplayName": {"UserLocalizedLabel": {"Label": "Account Number"}}, "IsValidForRead": True, "IsValidForCreate": True, "IsValidForUpdate": True},
            {"LogicalName": "telephone1", "AttributeType": "String", "DisplayName": {"UserLocalizedLabel": {"Label": "Main Phone"}}, "IsValidForRead": True, "IsValidForCreate": True, "IsValidForUpdate": True},
            {"LogicalName": "fax", "AttributeType": "String", "DisplayName": {"UserLocalizedLabel": {"Label": "Fax"}}, "IsValidForRead": True, "IsValidForCreate": True, "IsValidForUpdate": True},
            {"LogicalName": "websiteurl", "AttributeType": "String", "DisplayName": {"UserLocalizedLabel": {"Label": "Website"}}, "IsValidForRead": True, "IsValidForCreate": True, "IsValidForUpdate": True},
            {"LogicalName": "primarycontactid", "AttributeType": "Lookup", "DisplayName": {"UserLocalizedLabel": {"Label": "Primary Contact"}}, "IsValidForRead": True, "IsValidForCreate": True, "IsValidForUpdate": True},
            {"LogicalName": "address1_line1", "AttributeType": "String", "DisplayName": {"UserLocalizedLabel": {"Label": "Street 1"}}, "IsValidForRead": True, "IsValidForCreate": True, "IsValidForUpdate": True},
            {"LogicalName": "address1_city", "AttributeType": "String", "DisplayName": {"UserLocalizedLabel": {"Label": "City"}}, "IsValidForRead": True, "IsValidForCreate": True, "IsValidForUpdate": True},
            {"LogicalName": "address1_stateorprovince", "AttributeType": "String", "DisplayName": {"UserLocalizedLabel": {"Label": "State/Province"}}, "IsValidForRead": True, "IsValidForCreate": True, "IsValidForUpdate": True},
            {"LogicalName": "address1_postalcode", "AttributeType": "String", "DisplayName": {"UserLocalizedLabel": {"Label": "ZIP/Postal Code"}}, "IsValidForRead": True, "IsValidForCreate": True, "IsValidForUpdate": True},
            {"LogicalName": "address1_country", "AttributeType": "String", "DisplayName": {"UserLocalizedLabel": {"Label": "Country"}}, "IsValidForRead": True, "IsValidForCreate": True, "IsValidForUpdate": True},
            {"LogicalName": "industrycode", "AttributeType": "Picklist", "DisplayName": {"UserLocalizedLabel": {"Label": "Industry"}}, "IsValidForRead": True, "IsValidForCreate": True, "IsValidForUpdate": True},
            {"LogicalName": "numberofemployees", "AttributeType": "Integer", "DisplayName": {"UserLocalizedLabel": {"Label": "Employees"}}, "IsValidForRead": True, "IsValidForCreate": True, "IsValidForUpdate": True},
            {"LogicalName": "revenue", "AttributeType": "Money", "DisplayName": {"UserLocalizedLabel": {"Label": "Annual Revenue"}}, "IsValidForRead": True, "IsValidForCreate": True, "IsValidForUpdate": True},
            {"LogicalName": "tickersymbol", "AttributeType": "String", "DisplayName": {"UserLocalizedLabel": {"Label": "Ticker Symbol"}}, "IsValidForRead": True, "IsValidForCreate": True, "IsValidForUpdate": True},
            {"LogicalName": "creditlimit", "AttributeType": "Money", "DisplayName": {"UserLocalizedLabel": {"Label": "Credit Limit"}}, "IsValidForRead": True, "IsValidForCreate": True, "IsValidForUpdate": True},
            {"LogicalName": "preferredcontactmethodcode", "AttributeType": "Picklist", "DisplayName": {"UserLocalizedLabel": {"Label": "Preferred Contact"}}, "IsValidForRead": True, "IsValidForCreate": True, "IsValidForUpdate": True},
            {"LogicalName": "description", "AttributeType": "Memo", "DisplayName": {"UserLocalizedLabel": {"Label": "Description"}}, "IsValidForRead": True, "IsValidForCreate": True, "IsValidForUpdate": True},
            {"LogicalName": "ownerid", "AttributeType": "Lookup", "DisplayName": {"UserLocalizedLabel": {"Label": "Owner"}}, "IsValidForRead": True, "IsValidForCreate": True, "IsValidForUpdate": True},
            {"LogicalName": "createdon", "AttributeType": "DateTime", "DisplayName": {"UserLocalizedLabel": {"Label": "Created On"}}, "IsValidForRead": True, "IsValidForCreate": False, "IsValidForUpdate": False},
            {"LogicalName": "modifiedon", "AttributeType": "DateTime", "DisplayName": {"UserLocalizedLabel": {"Label": "Modified On"}}, "IsValidForRead": True, "IsValidForCreate": False, "IsValidForUpdate": False}
        ],
        "lookup_targets": {
            "primarycontactid": ["contact"],
            "ownerid": ["systemuser"]
        },
        "lookup_bindings": {
            "primarycontactid": {"contact": {"navigation_property": "primarycontactid", "entity_set_name": "contacts"}},
            "ownerid": {"systemuser": {"navigation_property": "ownerid", "entity_set_name": "systemusers"}}
        },
        "saved_queries": [
            {
                "savedqueryid": "1111",
                "name": "Active Accounts",
                "returnedtypecode": "account",
                "querytype": 0,
                "isdefault": True,
                "fetchxml": "<fetch><entity name='account'><attribute name='name'/><attribute name='telephone1'/><attribute name='address1_city'/><attribute name='primarycontactid'/></entity></fetch>",
                "layoutxml": "<grid name='resultset' object='1' jump='name' select='1' icon='1' preview='1'><row name='result' id='accountid'><cell name='name' width='200'/><cell name='telephone1' width='140'/><cell name='address1_city' width='120'/><cell name='primarycontactid' width='160'/></row></grid>"
            }
        ],
        "forms": [
            {
                "formid": "3333",
                "name": "Account Main Form",
                "type": 2,
                "formxml": account_form_xml
            }
        ],
        "bpfs": {
            "Account Onboarding & Growth Process": account_bpf
        }
    }

    # 2. CONTACT ENTITY
    contact_form_xml = """<form>
        <tabs>
            <tab name='SUMMARY_TAB' id='{tab_cnt_summary}'>
                <labels><label description='Summary' languagecode='1033'/></labels>
                <columns>
                    <column width='34%'>
                        <sections>
                            <section name='CONTACT_INFO' id='{sec_cnt_info}'>
                                <labels><label description='Contact Information' languagecode='1033'/></labels>
                                <rows>
                                    <row><cell id='{c_fn}'><labels><label description='Full Name' languagecode='1033'/></labels><control id='fullname' classid='{4273EDBD-AC1D-40d3-9FB2-095C621B552D}' datafieldname='fullname'/></cell></row>
                                    <row><cell id='{c_job}'><labels><label description='Job Title' languagecode='1033'/></labels><control id='jobtitle' classid='{4273EDBD-AC1D-40d3-9FB2-095C621B552D}' datafieldname='jobtitle'/></cell></row>
                                    <row><cell id='{c_acc}'><labels><label description='Account' languagecode='1033'/></labels><control id='parentcustomerid' classid='{270BD3DB-D9AF-4782-9025-509E298DEC0A}' datafieldname='parentcustomerid'/></cell></row>
                                    <row><cell id='{c_email}'><labels><label description='Email' languagecode='1033'/></labels><control id='emailaddress1' classid='{ADA2203E-B4CD-49BE-9DDF-234642B44B52}' datafieldname='emailaddress1'/></cell></row>
                                    <row><cell id='{c_mob}'><labels><label description='Mobile Phone' languagecode='1033'/></labels><control id='mobilephone' classid='{4273EDBD-AC1D-40d3-9FB2-095C621B552D}' datafieldname='mobilephone'/></cell></row>
                                </rows>
                            </section>
                        </sections>
                    </column>
                    <column width='33%'>
                        <sections>
                            <section name='ADDRESS_INFO' id='{sec_cnt_addr}'>
                                <labels><label description='Address Details' languagecode='1033'/></labels>
                                <rows>
                                    <row><cell id='{c_caddr}'><labels><label description='Street' languagecode='1033'/></labels><control id='address1_line1' classid='{4273EDBD-AC1D-40d3-9FB2-095C621B552D}' datafieldname='address1_line1'/></cell></row>
                                    <row><cell id='{c_ccity}'><labels><label description='City' languagecode='1033'/></labels><control id='address1_city' classid='{4273EDBD-AC1D-40d3-9FB2-095C621B552D}' datafieldname='address1_city'/></cell></row>
                                    <row><cell id='{c_cstate}'><labels><label description='State' languagecode='1033'/></labels><control id='address1_stateorprovince' classid='{4273EDBD-AC1D-40d3-9FB2-095C621B552D}' datafieldname='address1_stateorprovince'/></cell></row>
                                    <row><cell id='{c_czip}'><labels><label description='Postal Code' languagecode='1033'/></labels><control id='address1_postalcode' classid='{4273EDBD-AC1D-40d3-9FB2-095C621B552D}' datafieldname='address1_postalcode'/></cell></row>
                                </rows>
                            </section>
                        </sections>
                    </column>
                    <column width='33%'>
                        <sections>
                            <section name='TIMELINE_INFO' id='{sec_cnt_timeline}'>
                                <labels><label description='Timeline &amp; Notes' languagecode='1033'/></labels>
                                <rows>
                                    <row><cell id='{c_ctimeline}'><labels><label description='Notes' languagecode='1033'/></labels><control id='notescontrol' classid='{06375649-C143-495E-A496-C962E5B4488E}' datafieldname='notescontrol'/></cell></row>
                                </rows>
                            </section>
                        </sections>
                    </column>
                </columns>
            </tab>
            <tab name='DETAILS_TAB' id='{tab_cnt_details}'>
                <labels><label description='Personal &amp; Marketing' languagecode='1033'/></labels>
                <columns>
                    <column width='50%'>
                        <sections>
                            <section name='PERSONAL_INFO' id='{sec_cnt_pers}'>
                                <labels><label description='Personal Information' languagecode='1033'/></labels>
                                <rows>
                                    <row><cell id='{c_gender}'><labels><label description='Gender' languagecode='1033'/></labels><control id='gendercode' classid='{3EF39988-22BB-4f0b-BBBE-64B5A3748AEE}' datafieldname='gendercode'/></cell></row>
                                    <row><cell id='{c_bday}'><labels><label description='Birthday' languagecode='1033'/></labels><control id='birthdate' classid='{5B773807-9FB2-42db-97C3-7A91EFF8ADFF}' datafieldname='birthdate'/></cell></row>
                                    <row><cell id='{c_spouse}'><labels><label description='Spouse/Partner' languagecode='1033'/></labels><control id='spousesname' classid='{4273EDBD-AC1D-40d3-9FB2-095C621B552D}' datafieldname='spousesname'/></cell></row>
                                </rows>
                            </section>
                        </sections>
                    </column>
                    <column width='50%'>
                        <sections>
                            <section name='MARKETING_PREF' id='{sec_cnt_mkt}'>
                                <labels><label description='Contact Preferences' languagecode='1033'/></labels>
                                <rows>
                                    <row><cell id='{c_noemail}'><labels><label description='Do Not Allow Email' languagecode='1033'/></labels><control id='donotemail' classid='{67037D90-A9A8-4390-84E3-8E5536582EB5}' datafieldname='donotemail'/></cell></row>
                                    <row><cell id='{c_nophone}'><labels><label description='Do Not Allow Phone' languagecode='1033'/></labels><control id='donotphone' classid='{67037D90-A9A8-4390-84E3-8E5536582EB5}' datafieldname='donotphone'/></cell></row>
                                </rows>
                            </section>
                        </sections>
                    </column>
                </columns>
            </tab>
        </tabs>
    </form>"""

    contact_entity = {
        "LogicalName": "contact",
        "DisplayName": {"UserLocalizedLabel": {"Label": "Contact"}},
        "EntitySetName": "contacts",
        "PrimaryIdAttribute": "contactid",
        "PrimaryNameAttribute": "fullname",
        "ChangeTrackingEnabled": True,
        "attributes": [
            {"LogicalName": "contactid", "AttributeType": "Uniqueidentifier", "IsValidForRead": True, "IsValidForCreate": True, "IsValidForUpdate": False},
            {"LogicalName": "fullname", "AttributeType": "String", "DisplayName": {"UserLocalizedLabel": {"Label": "Full Name"}}, "IsValidForRead": True, "IsValidForCreate": True, "IsValidForUpdate": True},
            {"LogicalName": "jobtitle", "AttributeType": "String", "DisplayName": {"UserLocalizedLabel": {"Label": "Job Title"}}, "IsValidForRead": True, "IsValidForCreate": True, "IsValidForUpdate": True},
            {"LogicalName": "parentcustomerid", "AttributeType": "Lookup", "DisplayName": {"UserLocalizedLabel": {"Label": "Parent Account"}}, "IsValidForRead": True, "IsValidForCreate": True, "IsValidForUpdate": True},
            {"LogicalName": "emailaddress1", "AttributeType": "String", "DisplayName": {"UserLocalizedLabel": {"Label": "Email"}}, "IsValidForRead": True, "IsValidForCreate": True, "IsValidForUpdate": True},
            {"LogicalName": "mobilephone", "AttributeType": "String", "DisplayName": {"UserLocalizedLabel": {"Label": "Mobile Phone"}}, "IsValidForRead": True, "IsValidForCreate": True, "IsValidForUpdate": True},
            {"LogicalName": "address1_line1", "AttributeType": "String", "DisplayName": {"UserLocalizedLabel": {"Label": "Street"}}, "IsValidForRead": True, "IsValidForCreate": True, "IsValidForUpdate": True},
            {"LogicalName": "address1_city", "AttributeType": "String", "DisplayName": {"UserLocalizedLabel": {"Label": "City"}}, "IsValidForRead": True, "IsValidForCreate": True, "IsValidForUpdate": True},
            {"LogicalName": "address1_stateorprovince", "AttributeType": "String", "DisplayName": {"UserLocalizedLabel": {"Label": "State"}}, "IsValidForRead": True, "IsValidForCreate": True, "IsValidForUpdate": True},
            {"LogicalName": "address1_postalcode", "AttributeType": "String", "DisplayName": {"UserLocalizedLabel": {"Label": "Postal Code"}}, "IsValidForRead": True, "IsValidForCreate": True, "IsValidForUpdate": True},
            {"LogicalName": "gendercode", "AttributeType": "Picklist", "DisplayName": {"UserLocalizedLabel": {"Label": "Gender"}}, "IsValidForRead": True, "IsValidForCreate": True, "IsValidForUpdate": True},
            {"LogicalName": "birthdate", "AttributeType": "DateTime", "DisplayName": {"UserLocalizedLabel": {"Label": "Birthdate"}}, "IsValidForRead": True, "IsValidForCreate": True, "IsValidForUpdate": True},
            {"LogicalName": "spousesname", "AttributeType": "String", "DisplayName": {"UserLocalizedLabel": {"Label": "Spouse/Partner"}}, "IsValidForRead": True, "IsValidForCreate": True, "IsValidForUpdate": True},
            {"LogicalName": "donotemail", "AttributeType": "Boolean", "DisplayName": {"UserLocalizedLabel": {"Label": "Do Not Email"}}, "IsValidForRead": True, "IsValidForCreate": True, "IsValidForUpdate": True},
            {"LogicalName": "donotphone", "AttributeType": "Boolean", "DisplayName": {"UserLocalizedLabel": {"Label": "Do Not Phone"}}, "IsValidForRead": True, "IsValidForCreate": True, "IsValidForUpdate": True}
        ],
        "lookup_targets": {"parentcustomerid": ["account"]},
        "lookup_bindings": {"parentcustomerid": {"account": {"navigation_property": "parentcustomerid_account", "entity_set_name": "accounts"}}},
        "saved_queries": [
            {
                "savedqueryid": "4444",
                "name": "Active Contacts",
                "returnedtypecode": "contact",
                "querytype": 0,
                "isdefault": True,
                "fetchxml": "<fetch><entity name='contact'><attribute name='fullname'/><attribute name='jobtitle'/><attribute name='parentcustomerid'/><attribute name='emailaddress1'/></entity></fetch>",
                "layoutxml": "<grid name='resultset' object='2' jump='fullname' select='1' icon='1' preview='1'><row name='result' id='contactid'><cell name='fullname' width='180'/><cell name='jobtitle' width='140'/><cell name='parentcustomerid' width='180'/><cell name='emailaddress1' width='200'/></row></grid>"
            }
        ],
        "forms": [
            {
                "formid": "6666",
                "name": "Contact Main Form",
                "type": 2,
                "formxml": contact_form_xml
            }
        ],
        "bpfs": {}
    }

    # 3. INCIDENT (CASE) ENTITY
    case_form_xml = """<form>
        <tabs>
            <tab name='SUMMARY_TAB' id='{tab_inc_summary}'>
                <labels><label description='Summary' languagecode='1033'/></labels>
                <columns>
                    <column width='34%'>
                        <sections>
                            <section name='CASE_INFO' id='{sec_inc_info}'>
                                <labels><label description='Case Details' languagecode='1033'/></labels>
                                <rows>
                                    <row><cell id='{c_title}'><labels><label description='Case Title' languagecode='1033'/></labels><control id='title' classid='{4273EDBD-AC1D-40d3-9FB2-095C621B552D}' datafieldname='title'/></cell></row>
                                    <row><cell id='{c_ticket}'><labels><label description='Ticket Number' languagecode='1033'/></labels><control id='ticketnumber' classid='{4273EDBD-AC1D-40d3-9FB2-095C621B552D}' datafieldname='ticketnumber'/></cell></row>
                                    <row><cell id='{c_cust}'><labels><label description='Customer' languagecode='1033'/></labels><control id='customerid' classid='{270BD3DB-D9AF-4782-9025-509E298DEC0A}' datafieldname='customerid'/></cell></row>
                                    <row><cell id='{c_pri}'><labels><label description='Priority' languagecode='1033'/></labels><control id='prioritycode' classid='{3EF39988-22BB-4f0b-BBBE-64B5A3748AEE}' datafieldname='prioritycode'/></cell></row>
                                    <row><cell id='{c_orig}'><labels><label description='Origin' languagecode='1033'/></labels><control id='caseorigincode' classid='{3EF39988-22BB-4f0b-BBBE-64B5A3748AEE}' datafieldname='caseorigincode'/></cell></row>
                                </rows>
                            </section>
                        </sections>
                    </column>
                    <column width='33%'>
                        <sections>
                            <section name='ISSUE_DETAILS' id='{sec_inc_issue}'>
                                <labels><label description='Description &amp; Context' languagecode='1033'/></labels>
                                <rows>
                                    <row><cell id='{c_desc}'><labels><label description='Description' languagecode='1033'/></labels><control id='description' classid='{E0DECE4B-6FC8-4a8f-A065-082708572369}' datafieldname='description'/></cell></row>
                                    <row><cell id='{c_prod}'><labels><label description='Product' languagecode='1033'/></labels><control id='productname' classid='{4273EDBD-AC1D-40d3-9FB2-095C621B552D}' datafieldname='productname'/></cell></row>
                                </rows>
                            </section>
                        </sections>
                    </column>
                    <column width='33%'>
                        <sections>
                            <section name='TIMELINE_SECTION' id='{sec_inc_timeline}'>
                                <labels><label description='Case Activities' languagecode='1033'/></labels>
                                <rows>
                                    <row><cell id='{c_notes}'><labels><label description='Notes &amp; Resolution' languagecode='1033'/></labels><control id='notescontrol' classid='{06375649-C143-495E-A496-C962E5B4488E}' datafieldname='notescontrol'/></cell></row>
                                </rows>
                            </section>
                        </sections>
                    </column>
                </columns>
            </tab>
            <tab name='RESOLUTION_TAB' id='{tab_inc_res}'>
                <labels><label description='Resolution' languagecode='1033'/></labels>
                <columns>
                    <column width='100%'>
                        <sections>
                            <section name='RES_INFO' id='{sec_inc_res}'>
                                <labels><label description='Resolution Summary' languagecode='1033'/></labels>
                                <rows>
                                    <row><cell id='{c_res}'><labels><label description='Resolution' languagecode='1033'/></labels><control id='resolution' classid='{E0DECE4B-6FC8-4a8f-A065-082708572369}' datafieldname='resolution'/></cell></row>
                                </rows>
                            </section>
                        </sections>
                    </column>
                </columns>
            </tab>
        </tabs>
    </form>"""

    case_entity = {
        "LogicalName": "incident",
        "DisplayName": {"UserLocalizedLabel": {"Label": "Case"}},
        "EntitySetName": "incidents",
        "PrimaryIdAttribute": "incidentid",
        "PrimaryNameAttribute": "title",
        "ChangeTrackingEnabled": True,
        "attributes": [
            {"LogicalName": "incidentid", "AttributeType": "Uniqueidentifier", "IsValidForRead": True, "IsValidForCreate": True, "IsValidForUpdate": False},
            {"LogicalName": "title", "AttributeType": "String", "DisplayName": {"UserLocalizedLabel": {"Label": "Case Title"}}, "IsValidForRead": True, "IsValidForCreate": True, "IsValidForUpdate": True},
            {"LogicalName": "ticketnumber", "AttributeType": "String", "DisplayName": {"UserLocalizedLabel": {"Label": "Case Number"}}, "IsValidForRead": True, "IsValidForCreate": True, "IsValidForUpdate": True},
            {"LogicalName": "customerid", "AttributeType": "Lookup", "DisplayName": {"UserLocalizedLabel": {"Label": "Customer"}}, "IsValidForRead": True, "IsValidForCreate": True, "IsValidForUpdate": True},
            {"LogicalName": "prioritycode", "AttributeType": "Picklist", "DisplayName": {"UserLocalizedLabel": {"Label": "Priority"}}, "IsValidForRead": True, "IsValidForCreate": True, "IsValidForUpdate": True},
            {"LogicalName": "caseorigincode", "AttributeType": "Picklist", "DisplayName": {"UserLocalizedLabel": {"Label": "Origin"}}, "IsValidForRead": True, "IsValidForCreate": True, "IsValidForUpdate": True},
            {"LogicalName": "description", "AttributeType": "Memo", "DisplayName": {"UserLocalizedLabel": {"Label": "Description"}}, "IsValidForRead": True, "IsValidForCreate": True, "IsValidForUpdate": True},
            {"LogicalName": "productname", "AttributeType": "String", "DisplayName": {"UserLocalizedLabel": {"Label": "Product"}}, "IsValidForRead": True, "IsValidForCreate": True, "IsValidForUpdate": True},
            {"LogicalName": "resolution", "AttributeType": "Memo", "DisplayName": {"UserLocalizedLabel": {"Label": "Resolution"}}, "IsValidForRead": True, "IsValidForCreate": True, "IsValidForUpdate": True}
        ],
        "lookup_targets": {"customerid": ["account", "contact"]},
        "lookup_bindings": {"customerid": {"account": {"navigation_property": "customerid_account", "entity_set_name": "accounts"}}},
        "saved_queries": [
            {
                "savedqueryid": "case_query_1",
                "name": "Active Cases",
                "returnedtypecode": "incident",
                "querytype": 0,
                "isdefault": True,
                "fetchxml": "<fetch><entity name='incident'><attribute name='title'/><attribute name='ticketnumber'/><attribute name='prioritycode'/><attribute name='caseorigincode'/></entity></fetch>",
                "layoutxml": "<grid name='resultset' object='112' jump='title' select='1' icon='1' preview='1'><row name='result' id='incidentid'><cell name='title' width='220'/><cell name='ticketnumber' width='130'/><cell name='prioritycode' width='100'/><cell name='caseorigincode' width='100'/></row></grid>"
            }
        ],
        "forms": [
            {
                "formid": "case_form_1",
                "name": "Case Main Form",
                "type": 2,
                "formxml": case_form_xml
            }
        ],
        "bpfs": {
            "Phone to Case Resolution Process": case_bpf
        }
    }

    # 4. OPPORTUNITY ENTITY
    opp_form_xml = """<form>
        <tabs>
            <tab name='SUMMARY_TAB' id='{tab_opp_summary}'>
                <labels><label description='Summary' languagecode='1033'/></labels>
                <columns>
                    <column width='34%'>
                        <sections>
                            <section name='OPP_INFO' id='{sec_opp_info}'>
                                <labels><label description='Opportunity Information' languagecode='1033'/></labels>
                                <rows>
                                    <row><cell id='{c_name}'><labels><label description='Topic' languagecode='1033'/></labels><control id='name' classid='{4273EDBD-AC1D-40d3-9FB2-095C621B552D}' datafieldname='name'/></cell></row>
                                    <row><cell id='{c_cust}'><labels><label description='Account' languagecode='1033'/></labels><control id='parentaccountid' classid='{270BD3DB-D9AF-4782-9025-509E298DEC0A}' datafieldname='parentaccountid'/></cell></row>
                                    <row><cell id='{c_contact}'><labels><label description='Contact' languagecode='1033'/></labels><control id='parentcontactid' classid='{270BD3DB-D9AF-4782-9025-509E298DEC0A}' datafieldname='parentcontactid'/></cell></row>
                                    <row><cell id='{c_time}'><labels><label description='Purchase Timeframe' languagecode='1033'/></labels><control id='purchasetimeframe' classid='{3EF39988-22BB-4f0b-BBBE-64B5A3748AEE}' datafieldname='purchasetimeframe'/></cell></row>
                                    <row><cell id='{c_budget}'><labels><label description='Budget Amount' languagecode='1033'/></labels><control id='budgetamount' classid='{533B9E00-756B-4312-95A0-DC888637AC78}' datafieldname='budgetamount'/></cell></row>
                                </rows>
                            </section>
                        </sections>
                    </column>
                    <column width='33%'>
                        <sections>
                            <section name='FORECAST' id='{sec_opp_fc}'>
                                <labels><label description='Estimates &amp; Forecast' languagecode='1033'/></labels>
                                <rows>
                                    <row><cell id='{c_est_val}'><labels><label description='Estimated Revenue' languagecode='1033'/></labels><control id='estimatedvalue' classid='{533B9E00-756B-4312-95A0-DC888637AC78}' datafieldname='estimatedvalue'/></cell></row>
                                    <row><cell id='{c_est_date}'><labels><label description='Est. Close Date' languagecode='1033'/></labels><control id='estimatedclosedate' classid='{5B773807-9FB2-42db-97C3-7A91EFF8ADFF}' datafieldname='estimatedclosedate'/></cell></row>
                                    <row><cell id='{c_prob}'><labels><label description='Probability (%)' languagecode='1033'/></labels><control id='closeprobability' classid='{C6D124CA-7EDD-4813-A4D4-976E90702F9E}' datafieldname='closeprobability'/></cell></row>
                                    <row><cell id='{c_need}'><labels><label description='Customer Need' languagecode='1033'/></labels><control id='need' classid='{E0DECE4B-6FC8-4a8f-A065-082708572369}' datafieldname='need'/></cell></row>
                                </rows>
                            </section>
                        </sections>
                    </column>
                    <column width='33%'>
                        <sections>
                            <section name='TIMELINE_SECTION' id='{sec_opp_timeline}'>
                                <labels><label description='Timeline &amp; Notes' languagecode='1033'/></labels>
                                <rows>
                                    <row><cell id='{c_notes}'><labels><label description='Activities' languagecode='1033'/></labels><control id='notescontrol' classid='{06375649-C143-495E-A496-C962E5B4488E}' datafieldname='notescontrol'/></cell></row>
                                </rows>
                            </section>
                        </sections>
                    </column>
                </columns>
            </tab>
            <tab name='PROPOSAL_TAB' id='{tab_opp_prop}'>
                <labels><label description='Proposal &amp; Solution' languagecode='1033'/></labels>
                <columns>
                    <column width='100%'>
                        <sections>
                            <section name='SOLUTION_SECTION' id='{sec_opp_sol}'>
                                <labels><label description='Proposed Solution &amp; Competitors' languagecode='1033'/></labels>
                                <rows>
                                    <row><cell id='{c_sol}'><labels><label description='Proposed Solution' languagecode='1033'/></labels><control id='proposedsolution' classid='{E0DECE4B-6FC8-4a8f-A065-082708572369}' datafieldname='proposedsolution'/></cell></row>
                                    <row><cell id='{c_comp}'><labels><label description='Current Situation' languagecode='1033'/></labels><control id='currentsituation' classid='{E0DECE4B-6FC8-4a8f-A065-082708572369}' datafieldname='currentsituation'/></cell></row>
                                </rows>
                            </section>
                        </sections>
                    </column>
                </columns>
            </tab>
        </tabs>
    </form>"""

    opp_entity = {
        "LogicalName": "opportunity",
        "DisplayName": {"UserLocalizedLabel": {"Label": "Opportunity"}},
        "EntitySetName": "opportunities",
        "PrimaryIdAttribute": "opportunityid",
        "PrimaryNameAttribute": "name",
        "ChangeTrackingEnabled": True,
        "attributes": [
            {"LogicalName": "opportunityid", "AttributeType": "Uniqueidentifier", "IsValidForRead": True, "IsValidForCreate": True, "IsValidForUpdate": False},
            {"LogicalName": "name", "AttributeType": "String", "DisplayName": {"UserLocalizedLabel": {"Label": "Topic"}}, "IsValidForRead": True, "IsValidForCreate": True, "IsValidForUpdate": True},
            {"LogicalName": "parentaccountid", "AttributeType": "Lookup", "DisplayName": {"UserLocalizedLabel": {"Label": "Account"}}, "IsValidForRead": True, "IsValidForCreate": True, "IsValidForUpdate": True},
            {"LogicalName": "parentcontactid", "AttributeType": "Lookup", "DisplayName": {"UserLocalizedLabel": {"Label": "Contact"}}, "IsValidForRead": True, "IsValidForCreate": True, "IsValidForUpdate": True},
            {"LogicalName": "estimatedvalue", "AttributeType": "Money", "DisplayName": {"UserLocalizedLabel": {"Label": "Est. Revenue"}}, "IsValidForRead": True, "IsValidForCreate": True, "IsValidForUpdate": True},
            {"LogicalName": "estimatedclosedate", "AttributeType": "DateTime", "DisplayName": {"UserLocalizedLabel": {"Label": "Est. Close Date"}}, "IsValidForRead": True, "IsValidForCreate": True, "IsValidForUpdate": True},
            {"LogicalName": "closeprobability", "AttributeType": "Integer", "DisplayName": {"UserLocalizedLabel": {"Label": "Probability"}}, "IsValidForRead": True, "IsValidForCreate": True, "IsValidForUpdate": True},
            {"LogicalName": "purchasetimeframe", "AttributeType": "Picklist", "DisplayName": {"UserLocalizedLabel": {"Label": "Purchase Timeframe"}}, "IsValidForRead": True, "IsValidForCreate": True, "IsValidForUpdate": True},
            {"LogicalName": "budgetamount", "AttributeType": "Money", "DisplayName": {"UserLocalizedLabel": {"Label": "Budget Amount"}}, "IsValidForRead": True, "IsValidForCreate": True, "IsValidForUpdate": True},
            {"LogicalName": "need", "AttributeType": "Memo", "DisplayName": {"UserLocalizedLabel": {"Label": "Need"}}, "IsValidForRead": True, "IsValidForCreate": True, "IsValidForUpdate": True},
            {"LogicalName": "proposedsolution", "AttributeType": "Memo", "DisplayName": {"UserLocalizedLabel": {"Label": "Proposed Solution"}}, "IsValidForRead": True, "IsValidForCreate": True, "IsValidForUpdate": True},
            {"LogicalName": "currentsituation", "AttributeType": "Memo", "DisplayName": {"UserLocalizedLabel": {"Label": "Current Situation"}}, "IsValidForRead": True, "IsValidForCreate": True, "IsValidForUpdate": True},
            {"LogicalName": "description", "AttributeType": "Memo", "DisplayName": {"UserLocalizedLabel": {"Label": "Description"}}, "IsValidForRead": True, "IsValidForCreate": True, "IsValidForUpdate": True}
        ],
        "lookup_targets": {"parentaccountid": ["account"], "parentcontactid": ["contact"]},
        "lookup_bindings": {
            "parentaccountid": {"account": {"navigation_property": "parentaccountid", "entity_set_name": "accounts"}},
            "parentcontactid": {"contact": {"navigation_property": "parentcontactid", "entity_set_name": "contacts"}}
        },
        "saved_queries": [
            {
                "savedqueryid": "opp_query_1",
                "name": "Open Opportunities",
                "returnedtypecode": "opportunity",
                "querytype": 0,
                "isdefault": True,
                "fetchxml": "<fetch><entity name='opportunity'><attribute name='name'/><attribute name='parentaccountid'/><attribute name='estimatedvalue'/><attribute name='estimatedclosedate'/></entity></fetch>",
                "layoutxml": "<grid name='resultset' object='3' jump='name' select='1' icon='1' preview='1'><row name='result' id='opportunityid'><cell name='name' width='220'/><cell name='parentaccountid' width='160'/><cell name='estimatedvalue' width='120'/><cell name='estimatedclosedate' width='140'/></row></grid>"
            }
        ],
        "forms": [
            {
                "formid": "opp_form_1",
                "name": "Opportunity Main Form",
                "type": 2,
                "formxml": opp_form_xml
            }
        ],
        "bpfs": {
            "Lead to Opportunity Sales Process": lead_to_opp_bpf
        }
    }

    # 5. LEAD ENTITY
    lead_form_xml = """<form>
        <tabs>
            <tab name='SUMMARY_TAB' id='{tab_lead_summary}'>
                <labels><label description='Summary' languagecode='1033'/></labels>
                <columns>
                    <column width='34%'>
                        <sections>
                            <section name='LEAD_INFO' id='{sec_lead_info}'>
                                <labels><label description='Lead Contact' languagecode='1033'/></labels>
                                <rows>
                                    <row><cell id='{c_topic}'><labels><label description='Topic' languagecode='1033'/></labels><control id='subject' classid='{4273EDBD-AC1D-40d3-9FB2-095C621B552D}' datafieldname='subject'/></cell></row>
                                    <row><cell id='{c_fn}'><labels><label description='Full Name' languagecode='1033'/></labels><control id='fullname' classid='{4273EDBD-AC1D-40d3-9FB2-095C621B552D}' datafieldname='fullname'/></cell></row>
                                    <row><cell id='{c_comp}'><labels><label description='Company' languagecode='1033'/></labels><control id='companyname' classid='{4273EDBD-AC1D-40d3-9FB2-095C621B552D}' datafieldname='companyname'/></cell></row>
                                    <row><cell id='{c_email}'><labels><label description='Email' languagecode='1033'/></labels><control id='emailaddress1' classid='{ADA2203E-B4CD-49BE-9DDF-234642B44B52}' datafieldname='emailaddress1'/></cell></row>
                                    <row><cell id='{c_phone}'><labels><label description='Business Phone' languagecode='1033'/></labels><control id='telephone1' classid='{4273EDBD-AC1D-40d3-9FB2-095C621B552D}' datafieldname='telephone1'/></cell></row>
                                </rows>
                            </section>
                        </sections>
                    </column>
                    <column width='33%'>
                        <sections>
                            <section name='QUALIFICATION' id='{sec_lead_qual}'>
                                <labels><label description='Qualification' languagecode='1033'/></labels>
                                <rows>
                                    <row><cell id='{c_budget}'><labels><label description='Budget Amount' languagecode='1033'/></labels><control id='budgetamount' classid='{533B9E00-756B-4312-95A0-DC888637AC78}' datafieldname='budgetamount'/></cell></row>
                                    <row><cell id='{c_time}'><labels><label description='Purchase Timeframe' languagecode='1033'/></labels><control id='purchasetimeframe' classid='{3EF39988-22BB-4f0b-BBBE-64B5A3748AEE}' datafieldname='purchasetimeframe'/></cell></row>
                                    <row><cell id='{c_source}'><labels><label description='Lead Source' languagecode='1033'/></labels><control id='leadsourcecode' classid='{3EF39988-22BB-4f0b-BBBE-64B5A3748AEE}' datafieldname='leadsourcecode'/></cell></row>
                                </rows>
                            </section>
                        </sections>
                    </column>
                    <column width='33%'>
                        <sections>
                            <section name='TIMELINE_SECTION' id='{sec_lead_timeline}'>
                                <labels><label description='Activities &amp; Notes' languagecode='1033'/></labels>
                                <rows>
                                    <row><cell id='{c_notes}'><labels><label description='Timeline' languagecode='1033'/></labels><control id='notescontrol' classid='{06375649-C143-495E-A496-C962E5B4488E}' datafieldname='notescontrol'/></cell></row>
                                </rows>
                            </section>
                        </sections>
                    </column>
                </columns>
            </tab>
            <tab name='DETAILS_TAB' id='{tab_lead_details}'>
                <labels><label description='Details &amp; Marketing' languagecode='1033'/></labels>
                <columns>
                    <column width='50%'>
                        <sections>
                            <section name='COMPANY_DETAILS' id='{sec_lead_comp}'>
                                <labels><label description='Company Information' languagecode='1033'/></labels>
                                <rows>
                                    <row><cell id='{c_ind}'><labels><label description='Industry' languagecode='1033'/></labels><control id='companyname' classid='{4273EDBD-AC1D-40d3-9FB2-095C621B552D}' datafieldname='companyname'/></cell></row>
                                </rows>
                            </section>
                        </sections>
                    </column>
                    <column width='50%'>
                        <sections>
                            <section name='MARKETING_PREF' id='{sec_lead_mkt}'>
                                <labels><label description='Preferences' languagecode='1033'/></labels>
                                <rows>
                                    <row><cell id='{c_source_2}'><labels><label description='Lead Source' languagecode='1033'/></labels><control id='leadsourcecode' classid='{3EF39988-22BB-4f0b-BBBE-64B5A3748AEE}' datafieldname='leadsourcecode'/></cell></row>
                                </rows>
                            </section>
                        </sections>
                    </column>
                </columns>
            </tab>
        </tabs>
    </form>"""

    lead_entity = {
        "LogicalName": "lead",
        "DisplayName": {"UserLocalizedLabel": {"Label": "Lead"}},
        "EntitySetName": "leads",
        "PrimaryIdAttribute": "leadid",
        "PrimaryNameAttribute": "fullname",
        "ChangeTrackingEnabled": True,
        "attributes": [
            {"LogicalName": "leadid", "AttributeType": "Uniqueidentifier", "IsValidForRead": True, "IsValidForCreate": True, "IsValidForUpdate": False},
            {"LogicalName": "subject", "AttributeType": "String", "DisplayName": {"UserLocalizedLabel": {"Label": "Topic"}}, "IsValidForRead": True, "IsValidForCreate": True, "IsValidForUpdate": True},
            {"LogicalName": "fullname", "AttributeType": "String", "DisplayName": {"UserLocalizedLabel": {"Label": "Full Name"}}, "IsValidForRead": True, "IsValidForCreate": True, "IsValidForUpdate": True},
            {"LogicalName": "companyname", "AttributeType": "String", "DisplayName": {"UserLocalizedLabel": {"Label": "Company"}}, "IsValidForRead": True, "IsValidForCreate": True, "IsValidForUpdate": True},
            {"LogicalName": "emailaddress1", "AttributeType": "String", "DisplayName": {"UserLocalizedLabel": {"Label": "Email"}}, "IsValidForRead": True, "IsValidForCreate": True, "IsValidForUpdate": True},
            {"LogicalName": "telephone1", "AttributeType": "String", "DisplayName": {"UserLocalizedLabel": {"Label": "Phone"}}, "IsValidForRead": True, "IsValidForCreate": True, "IsValidForUpdate": True},
            {"LogicalName": "budgetamount", "AttributeType": "Money", "DisplayName": {"UserLocalizedLabel": {"Label": "Budget Amount"}}, "IsValidForRead": True, "IsValidForCreate": True, "IsValidForUpdate": True},
            {"LogicalName": "purchasetimeframe", "AttributeType": "Picklist", "DisplayName": {"UserLocalizedLabel": {"Label": "Purchase Timeframe"}}, "IsValidForRead": True, "IsValidForCreate": True, "IsValidForUpdate": True},
            {"LogicalName": "leadsourcecode", "AttributeType": "Picklist", "DisplayName": {"UserLocalizedLabel": {"Label": "Lead Source"}}, "IsValidForRead": True, "IsValidForCreate": True, "IsValidForUpdate": True}
        ],
        "lookup_targets": {},
        "lookup_bindings": {},
        "saved_queries": [
            {
                "savedqueryid": "lead_query_1",
                "name": "Open Leads",
                "returnedtypecode": "lead",
                "querytype": 0,
                "isdefault": True,
                "fetchxml": "<fetch><entity name='lead'><attribute name='fullname'/><attribute name='companyname'/><attribute name='emailaddress1'/><attribute name='telephone1'/></entity></fetch>",
                "layoutxml": "<grid name='resultset' object='4' jump='fullname' select='1' icon='1' preview='1'><row name='result' id='leadid'><cell name='fullname' width='180'/><cell name='companyname' width='180'/><cell name='emailaddress1' width='200'/><cell name='telephone1' width='140'/></row></grid>"
            }
        ],
        "forms": [
            {
                "formid": "lead_form_1",
                "name": "Lead Main Form",
                "type": 2,
                "formxml": lead_form_xml
            }
        ],
        "bpfs": {
            "Lead to Opportunity Sales Process": lead_to_opp_bpf
        }
    }

    manifest["entities"] = [
        account_entity,
        contact_entity,
        case_entity,
        opp_entity,
        lead_entity
    ]

    manifest["bpfs"] = {
        "Lead to Opportunity Sales Process": lead_to_opp_bpf,
        "Phone to Case Resolution Process": case_bpf
    }

    return manifest

if __name__ == "__main__":
    manifest = build_manifest()
    with open("mock_manifest.json", "w", encoding="utf-8") as f:
        json.dump(manifest, f, indent=4)
    print("Upgraded mock_manifest.json with 5 entities, rich multi-tab multi-section FormXML, and BPF!")

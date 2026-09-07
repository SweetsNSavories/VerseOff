using VerseOff.Domain;

namespace VerseOff.Metadata;

public static class StandardCdmTables
{
    private static readonly Dictionary<string, TableDefinition> Tables =
        new(StringComparer.OrdinalIgnoreCase)
        {
            ["account"] = CreateAccount(),
            ["contact"] = CreateContact(),
            ["lead"] = CreateLead(),
            ["opportunity"] = CreateOpportunity(),
            ["incident"] = CreateIncident(),
            ["appointment"] = CreateActivity("appointment", "Appointments", "Appointment"),
            ["task"] = CreateActivity("task", "Tasks", "Task"),
            ["phonecall"] = CreateActivity("phonecall", "PhoneCalls", "Phone Call"),
            ["email"] = CreateActivity("email", "Emails", "Email"),
            ["activitypointer"] = CreateActivity("activitypointer", "ActivityPointers", "Activity"),
            ["competitor"] = CreateCompetitor(),
            ["campaign"] = CreateSimpleEntity("campaign", "Campaigns", "Campaign", "campaignid", "name"),
            ["contract"] = CreateSimpleEntity("contract", "Contracts", "Contract", "contractid", "title"),
            ["product"] = CreateSimpleEntity("product", "Products", "Product", "productid", "name"),
            ["quote"] = CreateSimpleEntity("quote", "Quotes", "Quote", "quoteid", "name"),
            ["salesorder"] = CreateSimpleEntity("salesorder", "SalesOrders", "Order", "salesorderid", "name"),
            ["invoice"] = CreateSimpleEntity("invoice", "Invoices", "Invoice", "invoiceid", "name"),
            ["entitlement"] = CreateSimpleEntity("entitlement", "Entitlements", "Entitlement", "entitlementid", "name"),
            ["service"] = CreateSimpleEntity("service", "Services", "Service", "serviceid", "name"),
            ["kbarticle"] = CreateSimpleEntity("kbarticle", "KbArticles", "Knowledge Base Article", "kbarticleid", "title"),
            ["knowledgearticle"] = CreateSimpleEntity("knowledgearticle", "KnowledgeArticles", "Knowledge Article", "knowledgearticleid", "title"),
            ["actioncard"] = CreateSimpleEntity("actioncard", "ActionCards", "Action Card", "actioncardid", "title"),
            ["sharepointdocumentlocation"] = CreateSimpleEntity("sharepointdocumentlocation", "SharePointDocumentLocations", "Document Location", "sharepointdocumentlocationid", "name"),
            ["goal"] = CreateSimpleEntity("goal", "Goals", "Goal", "goalid", "title"),
            ["metric"] = CreateSimpleEntity("metric", "Metrics", "Metric", "metricid", "name"),
        };

    public static bool TryGetTable(string logicalName, out TableDefinition table) =>
        Tables.TryGetValue(logicalName, out table!);

    private static TableDefinition CreateAccount() =>
        new(
            "account",
            "accounts",
            "accountid",
            "name",
            IsActivity: false,
            [
                new("accountid", "Uniqueidentifier", CanRead: true, CanCreate: false, CanUpdate: false, IsSecured: false),
                new("name", "String", CanRead: true, CanCreate: true, CanUpdate: true, IsSecured: false) { RequiredLevel = ColumnRequiredLevel.Required },
                new("telephone1", "String", CanRead: true, CanCreate: true, CanUpdate: true, IsSecured: false),
                new("emailaddress1", "String", CanRead: true, CanCreate: true, CanUpdate: true, IsSecured: false),
                new("websiteurl", "String", CanRead: true, CanCreate: true, CanUpdate: true, IsSecured: false),
                new("revenue", "Currency", CanRead: true, CanCreate: true, CanUpdate: true, IsSecured: false),
                new("address1_line1", "String", CanRead: true, CanCreate: true, CanUpdate: true, IsSecured: false),
                new("address1_line2", "String", CanRead: true, CanCreate: true, CanUpdate: true, IsSecured: false),
                new("address1_city", "String", CanRead: true, CanCreate: true, CanUpdate: true, IsSecured: false),
                new("address1_stateorprovince", "String", CanRead: true, CanCreate: true, CanUpdate: true, IsSecured: false),
                new("address1_postalcode", "String", CanRead: true, CanCreate: true, CanUpdate: true, IsSecured: false),
                new("ownerid", "Lookup", CanRead: true, CanCreate: true, CanUpdate: true, IsSecured: false) { LookupTargets = ["systemuser"] },
                new("statecode", "Integer", CanRead: true, CanCreate: false, CanUpdate: true, IsSecured: false),
                new("statuscode", "Integer", CanRead: true, CanCreate: true, CanUpdate: true, IsSecured: false),
            ])
        {
            DisplayName = "Account",
            DisplayCollectionName = "Accounts",
        };

    private static TableDefinition CreateContact() =>
        new(
            "contact",
            "contacts",
            "contactid",
            "fullname",
            IsActivity: false,
            [
                new("contactid", "Uniqueidentifier", CanRead: true, CanCreate: false, CanUpdate: false, IsSecured: false),
                new("fullname", "String", CanRead: true, CanCreate: false, CanUpdate: false, IsSecured: false),
                new("firstname", "String", CanRead: true, CanCreate: true, CanUpdate: true, IsSecured: false),
                new("lastname", "String", CanRead: true, CanCreate: true, CanUpdate: true, IsSecured: false) { RequiredLevel = ColumnRequiredLevel.Required },
                new("emailaddress1", "String", CanRead: true, CanCreate: true, CanUpdate: true, IsSecured: false),
                new("telephone1", "String", CanRead: true, CanCreate: true, CanUpdate: true, IsSecured: false),
                new("mobilephone", "String", CanRead: true, CanCreate: true, CanUpdate: true, IsSecured: false),
                new("fax", "String", CanRead: true, CanCreate: true, CanUpdate: true, IsSecured: false),
                new("jobtitle", "String", CanRead: true, CanCreate: true, CanUpdate: true, IsSecured: false),
                new("gendercode", "Integer", CanRead: true, CanCreate: true, CanUpdate: true, IsSecured: false),
                new("familystatuscode", "Integer", CanRead: true, CanCreate: true, CanUpdate: true, IsSecured: false),
                new("spousesname", "String", CanRead: true, CanCreate: true, CanUpdate: true, IsSecured: false),
                new("birthdate", "DateTime", CanRead: true, CanCreate: true, CanUpdate: true, IsSecured: false),
                new("anniversary", "DateTime", CanRead: true, CanCreate: true, CanUpdate: true, IsSecured: false),
                new("description", "Memo", CanRead: true, CanCreate: true, CanUpdate: true, IsSecured: false),
                new("preferredcontactmethodcode", "Integer", CanRead: true, CanCreate: true, CanUpdate: true, IsSecured: false),
                new("parentcustomerid", "Lookup", CanRead: true, CanCreate: true, CanUpdate: true, IsSecured: false) { LookupTargets = ["account", "contact"] },
                new("originatingleadid", "Lookup", CanRead: true, CanCreate: true, CanUpdate: true, IsSecured: false) { LookupTargets = ["lead"] },
                new("lastusedincampaign", "DateTime", CanRead: true, CanCreate: true, CanUpdate: true, IsSecured: false),
                new("donotsendmm", "Boolean", CanRead: true, CanCreate: true, CanUpdate: true, IsSecured: false),
                new("donotemail", "Boolean", CanRead: true, CanCreate: true, CanUpdate: true, IsSecured: false),
                new("followemail", "Boolean", CanRead: true, CanCreate: true, CanUpdate: true, IsSecured: false),
                new("donotbulkemail", "Boolean", CanRead: true, CanCreate: true, CanUpdate: true, IsSecured: false),
                new("donotphone", "Boolean", CanRead: true, CanCreate: true, CanUpdate: true, IsSecured: false),
                new("donotfax", "Boolean", CanRead: true, CanCreate: true, CanUpdate: true, IsSecured: false),
                new("donotpostalmail", "Boolean", CanRead: true, CanCreate: true, CanUpdate: true, IsSecured: false),
                new("transactioncurrencyid", "Lookup", CanRead: true, CanCreate: true, CanUpdate: true, IsSecured: false) { LookupTargets = ["transactioncurrency"] },
                new("creditlimit", "Currency", CanRead: true, CanCreate: true, CanUpdate: true, IsSecured: false),
                new("creditonhold", "Boolean", CanRead: true, CanCreate: true, CanUpdate: true, IsSecured: false),
                new("paymenttermscode", "Integer", CanRead: true, CanCreate: true, CanUpdate: true, IsSecured: false),
                new("address1_line1", "String", CanRead: true, CanCreate: true, CanUpdate: true, IsSecured: false),
                new("address1_line2", "String", CanRead: true, CanCreate: true, CanUpdate: true, IsSecured: false),
                new("address1_city", "String", CanRead: true, CanCreate: true, CanUpdate: true, IsSecured: false),
                new("address1_stateorprovince", "String", CanRead: true, CanCreate: true, CanUpdate: true, IsSecured: false),
                new("address1_postalcode", "String", CanRead: true, CanCreate: true, CanUpdate: true, IsSecured: false),
                new("address1_shippingmethodcode", "Integer", CanRead: true, CanCreate: true, CanUpdate: true, IsSecured: false),
                new("address1_freighttermscode", "Integer", CanRead: true, CanCreate: true, CanUpdate: true, IsSecured: false),
                new("ownerid", "Lookup", CanRead: true, CanCreate: true, CanUpdate: true, IsSecured: false) { LookupTargets = ["systemuser"] },
                new("statecode", "Integer", CanRead: true, CanCreate: false, CanUpdate: true, IsSecured: false),
                new("statuscode", "Integer", CanRead: true, CanCreate: true, CanUpdate: true, IsSecured: false),
            ])
        {
            DisplayName = "Contact",
            DisplayCollectionName = "Contacts",
        };

    private static TableDefinition CreateLead() =>
        new(
            "lead",
            "leads",
            "leadid",
            "fullname",
            IsActivity: false,
            [
                new("leadid", "Uniqueidentifier", CanRead: true, CanCreate: false, CanUpdate: false, IsSecured: false),
                new("fullname", "String", CanRead: true, CanCreate: false, CanUpdate: false, IsSecured: false),
                new("firstname", "String", CanRead: true, CanCreate: true, CanUpdate: true, IsSecured: false),
                new("lastname", "String", CanRead: true, CanCreate: true, CanUpdate: true, IsSecured: false) { RequiredLevel = ColumnRequiredLevel.Required },
                new("subject", "String", CanRead: true, CanCreate: true, CanUpdate: true, IsSecured: false),
                new("companyname", "String", CanRead: true, CanCreate: true, CanUpdate: true, IsSecured: false),
                new("emailaddress1", "String", CanRead: true, CanCreate: true, CanUpdate: true, IsSecured: false),
                new("telephone1", "String", CanRead: true, CanCreate: true, CanUpdate: true, IsSecured: false),
                new("mobilephone", "String", CanRead: true, CanCreate: true, CanUpdate: true, IsSecured: false),
                new("address1_city", "String", CanRead: true, CanCreate: true, CanUpdate: true, IsSecured: false),
                new("address1_line1", "String", CanRead: true, CanCreate: true, CanUpdate: true, IsSecured: false),
                new("address1_postalcode", "String", CanRead: true, CanCreate: true, CanUpdate: true, IsSecured: false),
                new("ownerid", "Lookup", CanRead: true, CanCreate: true, CanUpdate: true, IsSecured: false) { LookupTargets = ["systemuser"] },
                new("statecode", "Integer", CanRead: true, CanCreate: false, CanUpdate: true, IsSecured: false),
                new("statuscode", "Integer", CanRead: true, CanCreate: true, CanUpdate: true, IsSecured: false),
            ])
        {
            DisplayName = "Lead",
            DisplayCollectionName = "Leads",
        };

    private static TableDefinition CreateOpportunity() =>
        new(
            "opportunity",
            "opportunities",
            "opportunityid",
            "name",
            IsActivity: false,
            [
                new("opportunityid", "Uniqueidentifier", CanRead: true, CanCreate: false, CanUpdate: false, IsSecured: false),
                new("name", "String", CanRead: true, CanCreate: true, CanUpdate: true, IsSecured: false) { RequiredLevel = ColumnRequiredLevel.Required },
                new("parentaccountid", "Lookup", CanRead: true, CanCreate: true, CanUpdate: true, IsSecured: false) { LookupTargets = ["account"] },
                new("parentcontactid", "Lookup", CanRead: true, CanCreate: true, CanUpdate: true, IsSecured: false) { LookupTargets = ["contact"] },
                new("customerid", "Lookup", CanRead: true, CanCreate: true, CanUpdate: true, IsSecured: false) { LookupTargets = ["account", "contact"] },
                new("estimatedvalue", "Currency", CanRead: true, CanCreate: true, CanUpdate: true, IsSecured: false),
                new("closeprobability", "Integer", CanRead: true, CanCreate: true, CanUpdate: true, IsSecured: false),
                new("estimatedclosedate", "DateTime", CanRead: true, CanCreate: true, CanUpdate: true, IsSecured: false),
                new("actualvalue", "Currency", CanRead: true, CanCreate: true, CanUpdate: true, IsSecured: false),
                new("actualclosedate", "DateTime", CanRead: true, CanCreate: true, CanUpdate: true, IsSecured: false),
                new("description", "Memo", CanRead: true, CanCreate: true, CanUpdate: true, IsSecured: false),
                new("ownerid", "Lookup", CanRead: true, CanCreate: true, CanUpdate: true, IsSecured: false) { LookupTargets = ["systemuser"] },
                new("statecode", "Integer", CanRead: true, CanCreate: false, CanUpdate: true, IsSecured: false),
                new("statuscode", "Integer", CanRead: true, CanCreate: true, CanUpdate: true, IsSecured: false),
            ])
        {
            DisplayName = "Opportunity",
            DisplayCollectionName = "Opportunities",
        };

    private static TableDefinition CreateIncident() =>
        new(
            "incident",
            "incidents",
            "incidentid",
            "title",
            IsActivity: false,
            [
                new("incidentid", "Uniqueidentifier", CanRead: true, CanCreate: false, CanUpdate: false, IsSecured: false),
                new("title", "String", CanRead: true, CanCreate: true, CanUpdate: true, IsSecured: false) { RequiredLevel = ColumnRequiredLevel.Required },
                new("ticketnumber", "String", CanRead: true, CanCreate: false, CanUpdate: false, IsSecured: false),
                new("customerid", "Lookup", CanRead: true, CanCreate: true, CanUpdate: true, IsSecured: false) { LookupTargets = ["account", "contact"] },
                new("caseorigincode", "Integer", CanRead: true, CanCreate: true, CanUpdate: true, IsSecured: false),
                new("casetypecode", "Integer", CanRead: true, CanCreate: true, CanUpdate: true, IsSecured: false),
                new("description", "Memo", CanRead: true, CanCreate: true, CanUpdate: true, IsSecured: false),
                new("ownerid", "Lookup", CanRead: true, CanCreate: true, CanUpdate: true, IsSecured: false) { LookupTargets = ["systemuser"] },
                new("statecode", "Integer", CanRead: true, CanCreate: false, CanUpdate: true, IsSecured: false),
                new("statuscode", "Integer", CanRead: true, CanCreate: true, CanUpdate: true, IsSecured: false),
            ])
        {
            DisplayName = "Case",
            DisplayCollectionName = "Cases",
        };

    private static TableDefinition CreateActivity(
        string logicalName,
        string entitySetName,
        string displayName) =>
        new(
            logicalName,
            entitySetName,
            "activityid",
            "subject",
            IsActivity: true,
            [
                new("activityid", "Uniqueidentifier", CanRead: true, CanCreate: false, CanUpdate: false, IsSecured: false),
                new("subject", "String", CanRead: true, CanCreate: true, CanUpdate: true, IsSecured: false),
                new("description", "Memo", CanRead: true, CanCreate: true, CanUpdate: true, IsSecured: false),
                new("scheduledstart", "DateTime", CanRead: true, CanCreate: true, CanUpdate: true, IsSecured: false),
                new("scheduledend", "DateTime", CanRead: true, CanCreate: true, CanUpdate: true, IsSecured: false),
                new("regardingobjectid", "Lookup", CanRead: true, CanCreate: true, CanUpdate: true, IsSecured: false) { LookupTargets = ["account", "contact", "lead", "opportunity", "incident"] },
                new("ownerid", "Lookup", CanRead: true, CanCreate: true, CanUpdate: true, IsSecured: false) { LookupTargets = ["systemuser"] },
                new("statecode", "Integer", CanRead: true, CanCreate: false, CanUpdate: true, IsSecured: false),
                new("statuscode", "Integer", CanRead: true, CanCreate: true, CanUpdate: true, IsSecured: false),
            ])
        {
            DisplayName = displayName,
            DisplayCollectionName = entitySetName,
        };

    private static TableDefinition CreateCompetitor() =>
        new(
            "competitor",
            "competitors",
            "competitorid",
            "name",
            IsActivity: false,
            [
                new("competitorid", "Uniqueidentifier", CanRead: true, CanCreate: false, CanUpdate: false, IsSecured: false),
                new("name", "String", CanRead: true, CanCreate: true, CanUpdate: true, IsSecured: false),
            ])
        {
            DisplayName = "Competitor",
            DisplayCollectionName = "Competitors",
        };

    private static TableDefinition CreateSimpleEntity(
        string logicalName,
        string entitySetName,
        string displayName,
        string primaryId,
        string primaryName) =>
        new(
            logicalName,
            entitySetName,
            primaryId,
            primaryName,
            IsActivity: false,
            [
                new(primaryId, "Uniqueidentifier", CanRead: true, CanCreate: false, CanUpdate: false, IsSecured: false),
                new(primaryName, "String", CanRead: true, CanCreate: true, CanUpdate: true, IsSecured: false),
                new("statecode", "Integer", CanRead: true, CanCreate: false, CanUpdate: true, IsSecured: false),
                new("statuscode", "Integer", CanRead: true, CanCreate: true, CanUpdate: true, IsSecured: false),
            ])
        {
            DisplayName = displayName,
            DisplayCollectionName = entitySetName,
        };
}

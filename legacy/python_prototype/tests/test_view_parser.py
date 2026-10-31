from VerseOff.out.view_parser import ViewParser


def test_fetchxml_filters_lookup_values_and_orders_local_records():
    query = ViewParser.parse_fetchxml("""
      <fetch>
        <entity name="contact">
          <attribute name="fullname" />
          <order attribute="fullname" descending="false" />
          <filter type="and">
            <condition attribute="statecode" operator="eq" value="0" />
            <filter type="or">
              <condition attribute="fullname"
                         operator="begins-with" value="A" />
              <condition attribute="fullname"
                         operator="begins-with" value="B" />
            </filter>
          </filter>
        </entity>
      </fetch>
    """)
    records = [
        {
            "contactid": "2",
            "fullname": "Beta",
            "statecode": 0,
            "_parentcustomerid_value": "{ACCOUNT-ID}",
        },
        {
            "contactid": "1",
            "fullname": "Alpha",
            "statecode": 0,
            "_parentcustomerid_value": "account-id",
        },
        {
            "contactid": "3",
            "fullname": "Charlie",
            "statecode": 0,
            "_parentcustomerid_value": "account-id",
        },
    ]

    result = ViewParser.apply_to_records(
        query,
        records,
        additional_filters={"parentcustomerid": "account-id"},
    )

    assert [record["fullname"] for record in result] == [
        "Alpha",
        "Beta",
    ]


def test_layoutxml_preserves_column_widths():
    columns = ViewParser.parse_layoutxml("""
      <grid><row id="contactid">
        <cell name="fullname" width="240" />
        <cell name="emailaddress1" width="180" ishidden="1" />
      </row></grid>
    """)

    assert columns == [
        {
            "name": "fullname",
            "width": 240,
            "label": "fullname",
            "ishidden": False,
            "disableSorting": False,
        },
        {
            "name": "emailaddress1",
            "width": 180,
            "label": "emailaddress1",
            "ishidden": True,
            "disableSorting": False,
        },
    ]


def test_unsupported_fetchxml_operator_fails_closed():
    query = ViewParser.parse_fetchxml("""
      <fetch><entity name="account"><filter>
        <condition attribute="name"
                   operator="not-a-real-operator"
                   value="Contoso" />
      </filter></entity></fetch>
    """)

    assert ViewParser.apply_to_records(
        query,
        [{"name": "Contoso"}],
    ) == []


def test_link_entity_fetchxml_fails_closed_locally():
    query = ViewParser.parse_fetchxml("""
      <fetch><entity name="contact">
        <attribute name="fullname" />
        <link-entity name="account" from="accountid"
                     to="parentcustomerid" alias="account" />
      </entity></fetch>
    """)

    assert ViewParser.apply_to_records(
        query,
        [{"fullname": "Ada"}],
    ) == []


def test_multiselect_contain_values_is_token_aware():
    query = ViewParser.parse_fetchxml("""
      <fetch><entity name="account"><filter>
        <condition attribute="sample_tags" operator="contain-values">
          <value>1</value>
          <value>10</value>
        </condition>
      </filter></entity></fetch>
    """)

    result = ViewParser.apply_to_records(
        query,
        [
            {"name": "Exact tokens", "sample_tags": "1,10,20"},
            {"name": "Substring only", "sample_tags": "11,100"},
        ],
    )
    assert [record["name"] for record in result] == ["Exact tokens"]


def test_malformed_fetchxml_fails_closed():
    query = ViewParser.parse_fetchxml("<fetch><entity")

    assert ViewParser.apply_to_records(
        query,
        [{"name": "Must not leak into view"}],
    ) == []

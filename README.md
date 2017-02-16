# azcosts

Azcosts is a CLI tool built with Node.js for generating Azure infrastructure cost reports,
This tool is built on top of the Azure Resource Usage API and the Azure Resource RateCard API.

**Known limitations**:

In Azure there are EA offers that have customized rates per enrollment, we are unable to provide
the EA rates at this time because [the Azure API do not provide them][1]:

> Support for Pay-as-you-go, MSDN, Monetary commitment, and Monetary credit offers (EA
> not supported) - This API provides Azure offer-level rate information, vs. subscription-level.
> The caller of this API must pass in the offer information to get resource details and rates.
> As EA offers have customized rates per enrollment, we are unable to provide the EA rates at
> this time.

## Installation

Just install it via NPM (Node.js is required):

``` bash
npm install -g azcosts
```

## Usage

After installation the `azcosts` CLI tool will be available to you. It is the entrypoint for all
the functionality mentioned above.

You can call `azcosts <command> --help` to find out more about all of the following commands.

### Create a new project

``` bash
azcosts init --config /path/to/azcosts.json
```

This will start a wizard that will create (or override) the configuration file where the credentials 
and the settings for your subscrition are saved.

If you don't use the `--config` option it will create the `azcosts.json` file in the directory where
you are running the command.

This step is not needed if you are going to use environment variables instead of the config file.

### Get costs

``` bash
azcosts get -s 2017-01-01 -e 2017-01-31 --config /path/to/azcosts.json
# This will generate the ./azcosts.csv report file
```

This will generate a cost report using the credentials and the information of the config file. For now,
the only output choice is a CSV file. Further ouput formats are planned for the future.

#### Options

- **`-s` or `--startDate` (required)**: Sets the report start date. Format YYYY-MM-DD
- **`-e` or `--endDate` (required)**: Sets the report end date. Format YYYY-MM-DD
- **`-o` or `--output`**: Sets the report output formats (comma separated list). Default: csv. (Only CSV allowed for now).
- **`-c` or `--config`**: Set config file path. Defaults to ./azcosts.json

### Configuration options

You need to provide your Azure Subscription data in order to allow Azcosts to get the usage.

- Follow [this link][2] to know how to create your credentials.
- The Offer ID can be get from the subscription information in the Azure Portal. The format of the offer ID is MS-AZR-XXXXX, where XXXXX is your offer Number. A list of offer numbers can be found [here][3].
- The Region needs to be a 2 letter code. [Get more info][4]:
- The Locale option should follow the language-culture format. [Get more info][5]:

There are two ways for setting the credentials and the rate information:

#### Configuration file

You can create a configuration file with the `azcosts init` command or by hand. The format should be:

``` json
{
    "AZCOSTS_SUBSCRIPTION_ID": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
    "AZCOSTS_CLIENT_ID": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
    "AZCOSTS_CLIENT_SECRET": "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
    "AZCOSTS_TENANT_ID": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
    "AZCOSTS_OFFER_ID": "MS-AZR-0000X",
    "AZCOSTS_REGION": "GB",
    "AZCOSTS_LOCALE": "en-GB",
    "AZCOSTS_CURRENCY": "GBP"
}

```

#### Environment variables

You can create environments variables instead of a configuration file.

``` bash
export AZCOSTS_SUBSCRIPTION_ID=xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
export AZCOSTS_CLIENT_ID=xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
export AZCOSTS_CLIENT_SECRET=XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
export AZCOSTS_TENANT_ID=xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
export AZCOSTS_OFFER_ID=MS-AZR-0000X
export AZCOSTS_REGION=GB
export AZCOSTS_LOCALE=en-GB
export AZCOSTS_CURRENCY=GBP
```

## Reporting an issue or a feature request and contributing

See the [contributing guide](CONTRIBUTING.md).

## Maintainers

- Alberto Varela [@artberri](https://github.com/artberri)/[berriart.com](http://www.berriart.com)

See also the list of [contributors](https://github.com/artberri/azcosts/graphs/contributors) who participated in this project.

## License

Azcosts. A CLI tool for generating Azure infrastructure cost reports.

Copyright (C) 2017 Alberto Varela <alberto@berriart.com>

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program.  If not, see <http://www.gnu.org/licenses/>.

[1]: https://docs.microsoft.com/en-us/azure/billing/billing-usage-rate-card-overview#introducing-the-azure-resource-usage-and-ratecard-apis
[2]: https://github.com/Azure/azure-sdk-for-node/blob/master/Documentation/Authentication.md#service-principal-authentication
[3]: https://azure.microsoft.com/en-us/support/legal/offer-details/
[4]: https://account.windowsazure.com/Profile
[5]: https://msdn.microsoft.com/en-us/library/ee825488(v=cs.20).aspx

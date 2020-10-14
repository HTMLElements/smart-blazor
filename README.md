Smart.Blazor Component Library
==============================

Smart Blazor Components is a commercial set of 60+ Blazor UI controls. Both server-side and client-side.

Getting Started
---------------

###   

### Create Blazor App

The Blazor framework provides templates to develop apps for each of the Blazor hosting models:

Blazor WebAssembly (blazorwasm)

* dotnet new blazorwasm -o smart-blazor-app

Blazor Server (blazorserver)

* dotnet new blazorserver -o smart-blazor-app

### Installation

Smart.Blazor Components are distributed as the **Smart.Blazor** Nuget package. You can use any of the following options:

*   Install the package from command line by running **dotnet add package Smart.Blazor**.
*   Alternatively, you can add the project from the Visual Nuget Package Manager.
*   Edit the .csproj file and add a project reference

### Import the Smart.Blazor namespace.

Open the \_Imports.razor file of your Blazor application and add `@using Smart.Blazor`

### Set a Theme

Open the \_Host.cshtml file (server-side Blazor) or wwwroot/index.html (client-side WebAssembly Blazor) and include a theme CSS file by adding this snippet <link rel="stylesheet" href="\_content/Smart.Blazor/source/smart.default.css"> You can include 14+ additional CSS themes for the Controls.

### Source files

Open the \_Host.cshtml file (server-side Blazor) or wwwroot/index.html (client-side WebAssembly Blazor) and include this snippet

	<script src="\_content/Smart.Blazor/smart.blazor.js"></script>
	<script src="\_content/Smart.Blazor/smart.elements.js"></script>
			
###   

### Registrations

####   

#### Blazor WebAssembly

This step is mandatory for Blazor WebAssembly(client-side) and also for ASP.NET Core hosted project types. You should place the code into the Program.cs of your client project

	using System;
	using System.Net.Http;
	using System.Collections.Generic;
	using System.Threading.Tasks;
	using System.Text;
	using Microsoft.AspNetCore.Components.WebAssembly.Hosting;
	using Microsoft.Extensions.Configuration;
	using Microsoft.Extensions.DependencyInjection;
	using Microsoft.Extensions.Logging;
	using Smart.Blazor;

	namespace BlazorApp3
	{
	    public class Program
	    {
		public static async Task Main(string[] args)
		{
		    var builder = WebAssemblyHostBuilder.CreateDefault(args);
		    builder.RootComponents.Add<App>("#app");

		    builder.Services.AddSmart();
		    builder.Services.AddScoped(sp => new HttpClient { BaseAddress = new Uri(builder.HostEnvironment.BaseAddress) });

		    await builder.Build().RunAsync();
		}
	    }
	}

			
####   

#### Blazor Server

This step is going only into the Startup.cs of your Blazor Server project.

	using System;
	using System.Collections.Generic;
	using System.Linq;
	using System.Threading.Tasks;
	using Microsoft.AspNetCore.Builder;
	using Microsoft.AspNetCore.Components;
	using Microsoft.AspNetCore.Hosting;
	using Microsoft.AspNetCore.HttpsPolicy;
	using Microsoft.Extensions.Configuration;
	using Microsoft.Extensions.DependencyInjection;
	using Microsoft.Extensions.Hosting;
	using Smart.Blazor;

	namespace Smart.Blazor.Demos
	{
		public class Startup
		{
			public Startup(IConfiguration configuration)
			{
				Configuration = configuration;
			}

			public IConfiguration Configuration { get; }

			// This method gets called by the runtime. Use this method to add services to the container.
			// For more information on how to configure your application, visit https://go.microsoft.com/fwlink/?LinkID=398940
			public void ConfigureServices(IServiceCollection services)
			{
				services.AddRazorPages();
				services.AddServerSideBlazor();
				services.AddSingleton<WeatherForecastService>();
				services.AddSingleton<RandomDataService>();

				services.AddSmart();
			}

			// This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
			public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
			{
				if (env.IsDevelopment())
				{
					app.UseDeveloperExceptionPage();
				}
				else
				{
					app.UseExceptionHandler("/Error");
					// The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
					app.UseHsts();
				}

				app.UseHttpsRedirection();
				app.UseStaticFiles();

				app.UseRouting();

				app.UseEndpoints(endpoints =>
					{
						endpoints.MapBlazorHub();
						endpoints.MapFallbackToPage("/\_Host");
					});
				}
			}
	}
							
###   

### Using Smart.Blazor Components
 
Use any Smart Blazor component by typing its tag name in a Blazor page e.g. <Button>Click Me</Button> If you are using client-side WebAssembly Blazor also add the following code to your .csproj file (after the closing RazorLangVersion element): <BlazorLinkOnBuild>false</BlazorLinkOnBuild>

###   

### Data binding a property

	<Input Value="@text"></Input>
	@code {
		string text = " Hi from Smart!";
	}

		
### Events Handing

	<Calendar id="calendar" OnChange=@OnChange></Calendar>
	<div class="options">
		<div class="caption">Events</div>
		<div class="option" id="log">
		@eventLog
		</div>
	</div>

	@code {
		private string eventLog;

		private void OnChange(Event eventObj)
		{
			CalendarChangeEventDetail detail = eventObj\[" Detail & quot;\];

			eventLog = detail.Value\[0\].ToString();
		}
	}

Alternatively you can do that:

	@page "/calendar"

	<Calendar OnReady="OnReady" id="calendar" ></Calendar>
	<div class="options">
		<div class="caption">Events</div>
		<div class="option" id="log">
		@eventLog
		</div>
	</div>


	@code {
		private string eventLog;

		private void OnReady(Calendar calendar)
		{
			calendar.Changed += delegate (object sender, CalendarChangedEventArgs args)
			{
				string value = args.Value\[0\].ToString();
				eventLog = value;
				StateHasChanged();
			};
		}
	}


`OnReady` callback is called for each Blazor component, after it is initialized and rendered.

### Blazor WebAssembly (blazorwasm) Example

* Create a blazor application:

	dotnet new blazorwasm -o smart-blazor-app

* Navigate to the application:

	cd smart-blazor-app

* Add the Smart.Blazor package:

	dotnet add package Smart.Blazor

* Open _Imports.razor and add the following at the bottom:

@using Smart.Blazor

* Open wwwroot/index.html and add the needed styles and scripts. 
```html
	<!DOCTYPE html>
	<html>

	<head>
	    <meta charset="utf-8" />
	    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
	    <title>Blazor WebAssembly App</title>
	    <base href="/" />
	    <link href="css/bootstrap/bootstrap.min.css" rel="stylesheet" />
	    <link href="css/app.css" rel="stylesheet" />
	    <link href="_framework/scoped.styles.css" rel="stylesheet" />
	    <link href="_content/Smart.Blazor/css/smart.default.css" rel="stylesheet" />
	    <script src="_content/Smart.Blazor/js/smart.blazor.js"></script>
	    <script src="_content/Smart.Blazor/js/smart.elements.js"></script>
	</head>

	<body>
	    <div id="app">Loading...</div>

	    <div id="blazor-error-ui">
		An unhandled error has occurred.
		<a href="" class="reload">Reload</a>
		<a class="dismiss">🗙</a>
	    </div>
	    <script src="_framework/blazor.webassembly.js"></script>
	</body>

	</html>
```
* Open Pages/Index.razor and replace the code as follows:
```html
	@page "/"

	@inject HttpClient Http

	<h1>Weather forecast</h1>

	<p>This component demonstrates fetching data from the server.</p>

	@if (forecasts == null)
	{
		<p><em>Loading...</em></p>
	}
	else
	{
		<Table Selection="true" SortMode="TableSortMode.One" class="table">
			<table>
				<thead>
					<tr>
						<th>Date</th>
						<th>Temp. (C)</th>
						<th>Temp. (F)</th>
						<th>Summary</th>
					</tr>
				</thead>
				<tbody>
					@foreach (var forecast in forecasts)
					{
						<tr>
							<td>@forecast.Date.ToShortDateString()</td>
							<td>@forecast.TemperatureC</td>
							<td>@forecast.TemperatureF</td>
							<td>@forecast.Summary</td>
						</tr>
					}
				</tbody>
			</table>
		</Table>
	}

	@code {
		private WeatherForecast[] forecasts;

		protected override async Task OnInitializedAsync()
		{
			forecasts = await Http.GetFromJsonAsync<WeatherForecast[]>("sample-data/weather.json");
		}

		public class WeatherForecast
		{
			public DateTime Date { get; set; }

			public int TemperatureC { get; set; }

			public string Summary { get; set; }

			public int TemperatureF => 32 + (int)(TemperatureC / 0.5556);
		}
	}
```
* Start the app and check the result
```javascript
	dotnet watch run
```

* Output

![Image of Smart.Blazor table](https://github.com/HTMLElements/smart-blazor/blob/main/images/blazor-webassembly.png)

### Blazor Server (blazorserver)
 Example

